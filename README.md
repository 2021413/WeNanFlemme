# 🔐 WeNanFlemme - Gestionnaire de Fichiers Sécurisé

Application web permettant de gérer, uploader, télécharger et sécuriser des fichiers à travers une interface moderne avec authentification.

## 🚀 Fonctionnalités

- Authentification (connexion / inscription)
- Upload & téléchargement de fichiers
- Pages d'accueil avec contenu verrouillé/déverrouillé
- Interface responsive en React
- API REST sécurisée en PHP
- Gestion d'autorisations & rôles utilisateurs
- Architecture MVC côté backend
- Stockage local des fichiers
- **Partage de fichiers entre utilisateurs**
- **Génération de liens de partage publics**
- **Gestion des fichiers partagés avec vous**

## 🛠 Technologies

### Frontend
- React 18
- Vite
- CSS Modules
- Context API
- React Router

### Backend
- PHP 8+
- Architecture MVC
- MySQL / MariaDB
- PDO
- JWT (si utilisé pour l'auth)
- Apache (via `index.php` routeur)

## 📁 Structure du Projet

```bash
├── backend/
│   ├── public/
│   │   └── index.php              # Point d'entrée de l'application
│   ├── src/
│   │   ├── config/                # Fichiers de config (DB, CORS, env)
│   │   ├── controllers/           # Contrôleurs de logique métier
│   │   ├── models/                # Modèles (ORM simple via PDO)
│   │   ├── routes/                # Définition des routes API
│   ├── uploads/                   # Dossier de stockage des fichiers
│   └── README.md
│
├── database/
│   └── schema.sql                 # Script de création de la base de données
│
├── frontend/
│   ├── index.html                 # Fichier HTML principal
│   ├── src/
│   │   ├── App.jsx                # Composant principal React
│   │   ├── main.jsx               # Point d'entrée
│   │   ├── components/            # Composants UI (Header, Footer, etc.)
│   │   ├── pages/                 # Pages (Connexion, Accueil, etc.)
│   │   ├── config/                # Fichiers de config (API, routes privées)
│   │   ├── context/               # AuthContext
│   │   ├── store/                 # État global simplifié
│   │   ├── styles/                # Fichiers CSS par composant/page
│   ├── static/                    # Ressources statiques (fonts, icons)
│   └── vite.config.js
│
└── README.md                      # Ce fichier

## ⚙️ Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/2021413/WeNanFlemme.git
   cd WeNanFlemme
   ```

### Configuration du Backend

Assurez-vous d'avoir un serveur PHP (Apache ou Nginx) et MySQL/MariaDB installés.

Importez le fichier `schema.sql` présent dans `database/` dans votre base de données.

Dans le dossier `backend/src/config/`, créez (ou éditez) un fichier d'environnement (par exemple `Environment.php`) pour y définir vos constantes :

```php
<?php
// Ex. Environment.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nom_de_la_base');
define('DB_USER', 'root');
define('DB_PASS', 'secret');

// Pour la gestion des tokens JWT (si nécessaire)
define('JWT_SECRET', 'votre_cle_secrete_jwt');
```

Vérifiez le fichier `cors.php` si nécessaire pour autoriser votre frontend.

Pointez votre serveur Apache/Nginx vers le dossier `backend/public`.

```bash
php -S localhost:8000
```

Assurez-vous que `mod_rewrite` est activé sur Apache (ou équivalent sur Nginx) pour gérer le routage via `index.php`.

### Installation & Lancement du Frontend

```bash
cd frontend
npm install
npm run dev
```

## ✅ Après Installation

### Connexion & Utilisation

Une fois l'application installée :

1. Rendez-vous sur [http://localhost:3000]
2. Créez un compte via la page `/inscription`
3. Connectez-vous via la page `/connexion`
4. Accédez aux fonctionnalités suivantes :
   - 📤 Upload de fichiers
   - 📥 Téléchargement de fichiers
   - 📁 Visualisation des fichiers
   - 🔒 Accès à des sections verrouillées/déverrouillées selon votre statut
   - 🔗 Partage de fichiers avec d'autres utilisateurs
   - 📨 Création de liens de partage publics
   - 👥 Gestion des fichiers partagés avec vous

---

## 🧪 Scripts Utiles (Frontend)

```bash
# Lancer le serveur de développement
npm run dev

# Construire l'application pour la production
npm run build

# Prévisualiser la version de production (nécessite le package 'serve')
npm run preview
```

## 🧱 Base de Données - Tables Principales

- `users` : Informations des utilisateurs (id, nom, mot de passe, email, etc.)
- `files` : Métadonnées des fichiers (nom, chemin, date, propriétaire, etc.)
- `downloads` (optionnel) : Historique des téléchargements
- `shared_files` : Fichiers partagés entre utilisateurs (fichier, destinataire)
- `share_links` : Liens de partage publics avec expiration

## 🔒 Prérequis

- PHP ≥ 8.0
- MySQL / MariaDB
- Apache ou Nginx (avec `mod_rewrite` activé)
- Node.js ≥ 16
- npm ≥ 8
```

Ce fichier README fournit une vue d'ensemble complète de votre projet, y compris les étapes nécessaires pour l'installation et l'utilisation.