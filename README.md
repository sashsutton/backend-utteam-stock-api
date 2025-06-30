# Backend Stock Management System

## English

### Overview
This is a Node.js backend application for managing stock data for UTTEAM products. It connects to an external API to fetch product stock information and stores it in a Supabase database. The system provides a REST API for querying stock data and includes a frontend interface for visualizing stock levels.

### Features
- **Stock Data Management**: Fetches and stores product stock information from external API
- **Supabase Integration**: Uses Supabase as the primary database
- **REST API**: Provides endpoints for querying stock data
- **Frontend Interface**: HTML-based interface for stock visualization
- **Color-based Filtering**: Filter products by color with visual color palette
- **Real-time Updates**: Automatic stock updates and data synchronization
- **Scheduled Updates**: Automatic database updates every hour

### Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **External API**: Product stock data API
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project
- Access to external product API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-utteam-stock-supa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   EXTERNAL_API_URL=your_external_api_url
   EXTERNAL_API_KEY=your_external_api_key
   PORT=3002
   ```

4. **Database Setup**
   - Create a table named `utteam-stock` in your Supabase project
   - Ensure the table has the following columns:
     - `style` (text)
     - `color` (text)
     - `size` (text)
     - `sku` (text)
     - `uttstock` (integer)
     - `suppstock` (text)
     - `price` (numeric)
     - `currency` (text)

### Usage

1. **Start the server**
   ```bash
   npm start
   ```

2. **Access the frontend**
   Open `ht.html` in your browser or serve it through the backend

3. **API Endpoints**

   **GET /api/product**
   - Query stock data with filters
   - Parameters:
     - `table`: Database table name (default: utteam-stock)
     - `attribute`: Filter attribute (e.g., color, style)
     - `value`: Filter value
   - Example: `GET /api/product?table=utteam-stock&attribute=color&value=Royal%20Blue`

   **POST /api/product**
   - Update stock data
   - Body: JSON object with product data
   - Example:
     ```json
     {
       "style": "AWJH001",
       "color": "Royal Blue",
       "size": "M",
       "sku": "awjh001ro-m",
       "uttstock": 39,
       "suppstock": "350",
       "price": 4.39,
       "currency": "EUR"
     }
     ```

   **GET /api/update-status**
   - Check the status of scheduled updates
   - Returns information about the update schedule
   - Example: `GET /api/update-status`

### Frontend Features
- **Color Palette**: Visual color selection for filtering products
- **Style-specific Display**: Currently configured for AWJH001 products
- **Real-time Updates**: Automatic data refresh when selecting colors
- **Responsive Design**: Works on desktop and mobile devices

### Development

1. **Running in Development Mode**
   ```bash
   npm run dev
   ```

2. **Testing with Postman**
   - Import the provided Postman collection
   - Test GET and POST endpoints
   - Use query parameters for filtering

3. **File Structure**
   ```
   backend-utteam-stock-supa/
   ├── index.js              # Main server file
   ├── package.json          # Dependencies and scripts
   ├── .env                  # Environment variables
   ├── ht.html              # Frontend interface
   └── README.md            # This file
   ```

### Deployment

1. **Environment Variables**
   - Ensure all environment variables are set in production
   - Use production Supabase credentials

2. **Port Configuration**
   - Set PORT environment variable for production
   - Default port is 3002

3. **CORS Configuration**
   - Update CORS settings for production domain
   - Ensure proper security headers

### Troubleshooting

1. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure table exists and has correct schema

2. **API Errors**
   - Check external API credentials
   - Verify API endpoint URLs
   - Monitor rate limits

3. **Frontend Issues**
   - Check browser console for errors
   - Verify API endpoint accessibility
   - Ensure CORS is properly configured

---

## Français

### Aperçu
Ceci est une application backend Node.js pour la gestion des données de stock des produits UTTEAM. Elle se connecte à une API externe pour récupérer les informations de stock des produits et les stocke dans une base de données Supabase. Le système fournit une API REST pour interroger les données de stock et inclut une interface frontend pour visualiser les niveaux de stock.

### Fonctionnalités
- **Gestion des Données de Stock** : Récupère et stocke les informations de stock des produits depuis une API externe
- **Intégration Supabase** : Utilise Supabase comme base de données principale
- **API REST** : Fournit des endpoints pour interroger les données de stock
- **Interface Frontend** : Interface HTML pour la visualisation des stocks
- **Filtrage par Couleur** : Filtre les produits par couleur avec une palette de couleurs visuelle
- **Mises à Jour en Temps Réel** : Mises à jour automatiques des stocks et synchronisation des données
- **Mises à Jour Planifiées** : Mises à jour automatiques de la base de données toutes les heures

### Stack Technique
- **Backend** : Node.js, Express.js
- **Base de Données** : Supabase (PostgreSQL)
- **API Externe** : API de données de stock des produits
- **Frontend** : HTML, CSS, JavaScript (Vanilla)

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn
- Compte Supabase et projet
- Accès à l'API externe des produits

### Installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repository>
   cd backend-utteam-stock-supa
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'Environnement**
   Créer un fichier `.env` dans le répertoire racine :
   ```env
   SUPABASE_URL=votre_url_supabase
   SUPABASE_ANON_KEY=votre_clé_anon_supabase
   SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_supabase
   EXTERNAL_API_URL=votre_url_api_externe
   EXTERNAL_API_KEY=votre_clé_api_externe
   PORT=3002
   ```

4. **Configuration de la Base de Données**
   - Créer une table nommée `utteam-stock` dans votre projet Supabase
   - S'assurer que la table a les colonnes suivantes :
     - `style` (texte)
     - `color` (texte)
     - `size` (texte)
     - `sku` (texte)
     - `uttstock` (entier)
     - `suppstock` (texte)
     - `price` (numérique)
     - `currency` (texte)

### Utilisation

1. **Démarrer le serveur**
   ```bash
   npm start
   ```

2. **Accéder au frontend**
   Ouvrir `ht.html` dans votre navigateur ou le servir via le backend

3. **Endpoints API**

   **GET /api/product**
   - Interroger les données de stock avec des filtres
   - Paramètres :
     - `table` : Nom de la table de base de données (par défaut : utteam-stock)
     - `attribute` : Attribut de filtre (ex : color, style)
     - `value` : Valeur du filtre
   - Exemple : `GET /api/product?table=utteam-stock&attribute=color&value=Royal%20Blue`

   **POST /api/product**
   - Mettre à jour les données de stock
   - Corps : Objet JSON avec les données du produit
   - Exemple :
     ```json
     {
       "style": "AWJH001",
       "color": "Royal Blue",
       "size": "M",
       "sku": "awjh001ro-m",
       "uttstock": 39,
       "suppstock": "350",
       "price": 4.39,
       "currency": "EUR"
     }
     ```

   **GET /api/update-status**
   - Vérifier le statut des mises à jour planifiées
   - Retourner des informations sur le planning des mises à jour
   - Exemple : `GET /api/update-status`

### Fonctionnalités Frontend
- **Palette de Couleurs** : Sélection visuelle des couleurs pour filtrer les produits
- **Affichage Spécifique au Style** : Actuellement configuré pour les produits AWJH001
- **Mises à Jour en Temps Réel** : Actualisation automatique des données lors de la sélection de couleurs
- **Design Responsive** : Fonctionne sur ordinateur et appareils mobiles

### Développement

1. **Exécution en Mode Développement**
   ```bash
   npm run dev
   ```

2. **Tests avec Postman**
   - Importer la collection Postman fournie
   - Tester les endpoints GET et POST
   - Utiliser les paramètres de requête pour le filtrage

3. **Structure des Fichiers**
   ```
   backend-utteam-stock-supa/
   ├── index.js              # Fichier serveur principal
   ├── package.json          # Dépendances et scripts
   ├── .env                  # Variables d'environnement
   ├── ht.html              # Interface frontend
   └── README.md            # Ce fichier
   ```

### Déploiement

1. **Variables d'Environnement**
   - S'assurer que toutes les variables d'environnement sont définies en production
   - Utiliser les identifiants Supabase de production

2. **Configuration du Port**
   - Définir la variable d'environnement PORT pour la production
   - Port par défaut : 3002

3. **Configuration CORS**
   - Mettre à jour les paramètres CORS pour le domaine de production
   - S'assurer que les en-têtes de sécurité sont corrects

### Dépannage

1. **Problèmes de Connexion à la Base de Données**
   - Vérifier les identifiants Supabase
   - Vérifier la connectivité réseau
   - S'assurer que la table existe et a le bon schéma

2. **Erreurs API**
   - Vérifier les identifiants de l'API externe
   - Vérifier les URLs des endpoints API
   - Surveiller les limites de taux

3. **Problèmes Frontend**
   - Vérifier la console du navigateur pour les erreurs
   - Vérifier l'accessibilité des endpoints API
   - S'assurer que CORS est correctement configuré 
