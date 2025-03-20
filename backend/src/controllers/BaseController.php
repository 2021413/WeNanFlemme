<?php

namespace App\Controllers;

abstract class BaseController {
    protected function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    protected function getRequestBody() {
        $rawData = file_get_contents('php://input');
        return json_decode($rawData, true) ?? [];
    }

    protected function validateRequest($data, $rules) {
        $errors = [];
        foreach ($rules as $field => $rule) {
            // Vérification si le champ est requis
            if (strpos($rule, 'required') !== false && (!isset($data[$field]) || empty($data[$field]))) {
                $errors[$field] = "Le champ $field est requis";
                continue;
            }

            // Si le champ n'est pas requis et n'est pas présent, on passe à la suite
            if (!isset($data[$field])) {
                continue;
            }

            // Validation du type email
            if (strpos($rule, 'email') !== false && !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) {
                $errors[$field] = "Le champ $field doit être une adresse email valide";
            }

            // Validation de la longueur minimale
            if (preg_match('/min:(\d+)/', $rule, $matches)) {
                $min = (int)$matches[1];
                if (strlen($data[$field]) < $min) {
                    $errors[$field] = "Le champ $field doit contenir au moins $min caractères";
                }
            }

            // Validation de la longueur maximale
            if (preg_match('/max:(\d+)/', $rule, $matches)) {
                $max = (int)$matches[1];
                if (strlen($data[$field]) > $max) {
                    $errors[$field] = "Le champ $field doit contenir au plus $max caractères";
                }
            }
        }
        return $errors;
    }

    protected function getQueryParams() {
        return $_GET;
    }

    protected function getFiles() {
        return $_FILES;
    }

    protected function redirect($url) {
        header("Location: $url");
        exit;
    }

    protected function isAuthenticated() {
        session_start();
        return isset($_SESSION['user_id']);
    }

    protected function getCurrentUserId() {
        session_start();
        return $_SESSION['user_id'] ?? null;
    }

    protected function requireAuth() {
        if (!$this->isAuthenticated()) {
            return $this->jsonResponse(['error' => 'Unauthorized'], 401);
        }
    }

    protected function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map([$this, 'sanitizeInput'], $data);
        }
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
} 