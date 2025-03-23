<?php

// Autoriser l'origine spécifique (remplacer * par l'origine exacte)
header('Access-Control-Allow-Origin: http://localhost:3000');

// Autoriser les credentials (cookies, en-têtes d'autorisation)
header('Access-Control-Allow-Credentials: true');

// Autoriser les méthodes HTTP
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Autoriser certains en-têtes
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Durée de mise en cache des résultats du pre-flight
header('Access-Control-Max-Age: 3600');

// Gérer les requêtes OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
} 