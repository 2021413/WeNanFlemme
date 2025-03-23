<?php

namespace App\Routes;

use App\Controllers\AuthController;
use App\Controllers\FileController;
use App\Controllers\DownloadController;

class Router {
    private $routes = [];

    public function addRoute($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function handleRequest($method, $uri) {
        foreach ($this->routes as $route) {
            if ($route['method'] === $method) {
                $params = $this->matchPath($route['path'], $uri);
                if ($params !== false) {
                    return call_user_func_array($route['handler'], $params);
                }
            }
        }
        
        header("HTTP/1.0 404 Not Found");
        return ['error' => 'Route not found'];
    }

    private function matchPath($routePath, $uri) {
        $routePath = preg_replace('/\/{([^\/]+)}/', '/([^/]+)', $routePath);
        $routePath = str_replace('/', '\/', $routePath);
        $matches = [];
        if (preg_match('/^' . $routePath . '$/', $uri, $matches)) {
            array_shift($matches); // Retire la correspondance complète
            return $matches;
        }
        return false;
    }
}

// Initialisation des contrôleurs
$authController = new AuthController();
$fileController = new FileController();
$downloadController = new DownloadController();

// Initialisation du router
$router = new Router();

// Routes d'authentification
$router->addRoute('POST', '/api/auth/register', [$authController, 'register']);
$router->addRoute('POST', '/api/auth/login', [$authController, 'login']);
$router->addRoute('POST', '/api/auth/logout', [$authController, 'logout']);
$router->addRoute('GET', '/api/auth/me', [$authController, 'me']);
$router->addRoute('PUT', '/api/auth/profile', [$authController, 'updateProfile']);
$router->addRoute('PUT', '/api/auth/password', [$authController, 'updatePassword']);

// Routes de gestion des fichiers
$router->addRoute('POST', '/api/files/upload', [$fileController, 'upload']);
$router->addRoute('GET', '/api/files', [$fileController, 'listUserFiles']);
$router->addRoute('DELETE', '/api/files/{id}', [$fileController, 'delete']);
$router->addRoute('POST', '/api/files/share', [$fileController, 'createShareLink']);

// Routes de téléchargement
$router->addRoute('GET', '/api/files/{id}/download', [$downloadController, 'downloadFile']);
$router->addRoute('GET', '/api/files/{id}/stats', [$downloadController, 'getStats']);

// Route de santé
$router->addRoute('GET', '/api/health', function() {
    return ['status' => 'ok'];
});

// Gestion de la requête
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

try {
    $response = $router->handleRequest($method, $uri);
} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    $response = [
        'error' => $e->getMessage(),
        'details' => null
    ];
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); 
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

echo json_encode($response);
