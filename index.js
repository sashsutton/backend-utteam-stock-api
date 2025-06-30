import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002; 

const SUPABASE_URL = process.env.SUPABASE_URL || "https://gacxgmbjdrmswtvrpelq.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CORS configuration for production
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile('ht.html', { root: '.' });
});

// Function to fetch all UTT data from external API
async function fetchAllUTTData() {
    try {
        // Check if API key is available
        if (!process.env.EXTERNAL_API_KEY) {
            throw new Error('EXTERNAL_API_KEY is not defined in environment variables');
        }

        // fields to request
        const fields = 'style,color,size,sku,uttstock,price';

        // Prepare payload for all products
        const payload = {
            action: 'stock',
            format: 'json',
            fields,
        };

        console.log('Sending payload to external API for all products:', payload);
        console.log('API Key available:', !!process.env.EXTERNAL_API_KEY);
        console.log('API URL:', `https://utteam.com/api/dataexport/${process.env.EXTERNAL_API_KEY}`);

        const response = await axios.post(`https://utteam.com/api/dataexport/${process.env.EXTERNAL_API_KEY}`, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000 // 30 second timeout
        });

        console.log('External API response status:', response.status);
        console.log('Total products received:', response.data.length);
        console.log('External API response data (first 3 items):', response.data.slice(0, 3));
        
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error Response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers
            });
            
            if (error.response.status === 401) {
                throw new Error(`Authentication failed (401). Please check your EXTERNAL_API_KEY. Response: ${JSON.stringify(error.response.data)}`);
            } else if (error.response.status === 403) {
                throw new Error(`Access forbidden (403). Please check your API permissions. Response: ${JSON.stringify(error.response.data)}`);
            } else {
                throw new Error(`API request failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            throw new Error('No response received from external API. Please check the API URL and your internet connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
            throw error;
        }
    }
}

// Function to update Supabase stock
async function updateSupabaseStock(products) {
    try {
        console.log(`Updating ${products.length} products in Supabase...`);
        
        // Process products in batches to avoid rate limits
        const batchSize = 50; // Supabase can handle larger batches
        const batches = [];
        
        for (let i = 0; i < products.length; i += batchSize) {
            batches.push(products.slice(i, i + batchSize));
        }
        
        let updatedCount = 0;
        let createdCount = 0;
        let errorCount = 0;
        
        for (const batch of batches) {
            const records = batch.map(product => ({
                style: product.style,
                color: product.color,
                size: product.size,
                sku: product.sku,
                uttstock: product.uttstock,
                price: product.price,
                currency: 'EUR' // Default currency for UTT Europe
            }));
            
            try {
                // Upsert records (insert or update based on SKU)
                const { data, error } = await supabase
                    .from('utteam-stock')
                    .upsert(records, { 
                        onConflict: 'sku',
                        ignoreDuplicates: false 
                    });
                
                if (error) {
                    console.error('Supabase upsert error:', error);
                    errorCount += batch.length;
                } else {
                    // Count updated vs created (this is approximate since upsert doesn't distinguish)
                    updatedCount += batch.length;
                    console.log(`✅ Processed batch of ${batch.length} records`);
                }
                
            } catch (error) {
                console.error('Error processing batch:', error.message);
                errorCount += batch.length;
            }
            
            // Add small delay between batches
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log(`Stock update completed: ${updatedCount} processed, ${errorCount} errors`);
        return { processed: updatedCount, errors: errorCount };
        
    } catch (error) {
        console.error('Error updating Supabase:', error.message);
        throw error;
    }
}

// Endpoint to trigger the full update process
app.post('/api/update-stock', async (req, res) => {
    try {
        console.log('🔄 Starting stock update process...');
        
        // Fetch data from external API
        const products = await fetchAllUTTData();
        
        // Update Supabase
        const result = await updateSupabaseStock(products);
        
        res.json({
            success: true,
            message: 'Stock update completed successfully',
            summary: {
                totalProducts: products.length,
                processed: result.processed,
                errors: result.errors
            }
        });
        
    } catch (error) {
        console.error('Error in update process:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/product", async (req, res) => {
    const {table, attribute, value} = req.query;
    if (!table || !attribute || !value) {
        return res.status(400).json({error: "Missing required parameters"});
    }

    try{
        let {data, error} = await supabase
        .from(table)
        .select('*')
        .eq(attribute, value)

        if (error) {
            return res.status(500).json({error: "Error fetching data from Supabase"});
        }

        res.json(data);
    } catch (error) {
        console.error('Error in product API:', error);
        res.status(500).json({error: "Error fetching data from Supabase"});
    }

});

// POST endpoint that accepts body parameters
app.post("/api/product", async (req, res) => {
    const {table, attribute, value} = req.body;
    if (!table || !attribute || !value) {
        return res.status(400).json({error: "Missing required parameters in body"});
    }

    try{
        let {data, error} = await supabase
        .from(table)
        .select('*')
        .eq(attribute, value)

        if (error) {
            return res.status(500).json({error: "Error fetching data from Supabase"});
        }

        res.json(data);
    } catch (error) {
        console.error('Error in product API:', error);
        res.status(500).json({error: "Error fetching data from Supabase"});
    }

});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 UTTEAM Stock Backend started on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Available endpoints:`);
    console.log(`   GET  / - Web interface (Frontend)`);
    console.log(`   GET  /health - Health check`);
    console.log(`   GET  /api/product - Product API with filters`);
    console.log(`   POST /api/product - Product API with body parameters`);
    console.log(`   POST /api/update-stock - Update stock from external API`);
    console.log(`🔗 Access the application at: http://localhost:${PORT}`);
});
