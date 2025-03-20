# 🎯 Cursor Rules - Guidelines pour le projet PHP (MVC)

## ✅ Modèle (`models/`)
Les modèles sont responsables de :
- Définir la structure des données
- Gérer les règles de validation des données
- Définir les relations avec d'autres modèles
- Exécuter les requêtes SQL
- Fournir des méthodes pour manipuler les données

### ❌ Ne doit PAS contenir :
- La logique des formulaires
- Le rendu HTML
- La gestion des sessions
- La gestion des requêtes HTTP
- La logique de redirection

---

## ✅ Contrôleur (`controllers/`)
Les contrôleurs sont responsables de :
- Gérer la réception des requêtes HTTP
- Valider les données reçues
- Appeler les méthodes du modèle approprié
- Préparer les données pour la vue
- Gérer les redirections et sessions

### ❌ Ne doit PAS contenir :
- Des requêtes SQL directes (utiliser les modèles)
- Une logique métier complexe (utiliser un service)
- La manipulation directe des données
- Du code HTML
- Les règles de validation des données métier

---

## ✅ Routes (`routes/api.php`)
Les routes sont responsables de :
- Mapper les URLs vers les contrôleurs appropriés
- Retourner des réponses JSON aux requêtes API
- Gérer les méthodes HTTP (`GET`, `POST`, `PUT`, `DELETE`)

### ❌ Ne doit PAS contenir :
- De la logique métier
- De la gestion de sessions (hors authentification)
- Des accès directs à la base de données

---

## 🎯 Séparation des Responsabilités :
📌 **Modèle = Gère les données (Quoi)**  
📌 **Contrôleur = Gère l'interaction (Comment)**  
📌 **Routes = Gère la communication (Où)**  

💡 **Suivre ces règles garantit un code propre, maintenable et scalable !**
