<?php

// Inclure la configuration CORS
require_once __DIR__ . '/../src/config/cors.php';

// Afficher les erreurs en développement
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Fonction d'autoload personnalisée
spl_autoload_register(function ($class) {
    // Convertit le namespace en chemin de fichier
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Gestion des erreurs globales
set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    // Charger les variables d'environnement
    App\Config\Environment::load(__DIR__ . '/../.env');

    // Définir le type de contenu par défaut
    header('Content-Type: application/json; charset=UTF-8');

    // Récupérer la méthode et l'URI de la requête
    $method = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Inclure et exécuter le routeur
    require_once __DIR__ . '/../src/routes/api.php';

} catch (ErrorException $e) {
    // Gérer les erreurs PHP
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur serveur',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
} catch (Exception $e) {
    // Gérer les exceptions personnalisées
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur',
        'message' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    // Gérer toutes les autres erreurs
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur fatale',
        'message' => 'Une erreur inattendue est survenue'
    ]);
}
