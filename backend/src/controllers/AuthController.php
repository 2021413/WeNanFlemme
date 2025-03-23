<?php

namespace App\Controllers;

use App\Models\User;

class AuthController extends BaseController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register() {
        try {
            $data = $this->getRequestBody();
            
            // Log des données reçues
            error_log("Données reçues pour l'inscription : " . print_r($data, true));
            
            $rules = [
                'username' => 'required',
                'email' => 'required',
                'password' => 'required'
            ];
            
            $errors = $this->validateRequest($data, $rules);
            if (!empty($errors)) {
                error_log("Erreurs de validation : " . print_r($errors, true));
                return $this->jsonResponse(['errors' => $errors], 400);
            }

            if ($this->userModel->findByUsername($data['username'])) {
                error_log("Username déjà existant : " . $data['username']);
                return $this->jsonResponse(['error' => 'Username already exists'], 400);
            }

            if ($this->userModel->findByEmail($data['email'])) {
                error_log("Email déjà existant : " . $data['email']);
                return $this->jsonResponse(['error' => 'Email already exists'], 400);
            }

            $userId = $this->userModel->createUser(
                $data['username'],
                $data['email'],
                $data['password']
            );

            if (!$userId) {
                error_log("Erreur lors de la création de l'utilisateur");
                return $this->jsonResponse(['error' => 'Failed to create user'], 500);
            }

            error_log("Utilisateur créé avec succès, ID : " . $userId);
            return $this->jsonResponse(['message' => 'User registered successfully', 'id' => $userId]);
        } catch (\Exception $e) {
            error_log("Exception dans register : " . $e->getMessage());
            error_log("Stack trace : " . $e->getTraceAsString());
            return $this->jsonResponse(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }

    public function login() {
        try {
            $data = $this->getRequestBody();
            
            $rules = [
                'email' => 'required|email',
                'password' => 'required|min:6'
            ];
            
            $errors = $this->validateRequest($data, $rules);
            if (!empty($errors)) {
                return $this->jsonResponse(['errors' => $errors], 400);
            }
    
            $user = $this->userModel->findByEmail($data['email']);
            if (!$user || !$this->userModel->verifyPassword($user['password_hash'], $data['password'])) {
                return $this->jsonResponse(['error' => 'Invalid credentials'], 401);
            }
    
            // Configuration de la session
            ini_set('session.cookie_httponly', 1);
            ini_set('session.cookie_secure', 1);
            ini_set('session.cookie_samesite', 'None');
            
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['last_activity'] = time();
            
            // Régénérer l'ID de session pour prévenir la fixation de session
            session_regenerate_id(true);
    
            return $this->jsonResponse([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Exception in login: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Internal server error'], 500);
        }
    }

    public function logout() {
        session_start();
        session_unset();
        session_destroy();
        
        // Supprimer le cookie de session
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }
        
        return $this->jsonResponse(['message' => 'Logout successful']);
    }

    public function me() {
        session_start();
        
        if (!isset($_SESSION['user_id'])) {
            return $this->jsonResponse(['error' => 'Not authenticated'], 401);
        }

        $user = $this->userModel->findById($_SESSION['user_id']);
        if (!$user) {
            return $this->jsonResponse(['error' => 'User not found'], 404);
        }

        return $this->jsonResponse([
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]);
    }

    public function updateProfile() {
        try {
            session_start();
            
            if (!isset($_SESSION['user_id'])) {
                return $this->jsonResponse(['error' => 'Non authentifié'], 401);
            }
            
            $data = $this->getRequestBody();
            
            $rules = [
                'username' => 'required',
                'email' => 'required|email',
                'password' => 'required'
            ];
            
            $errors = $this->validateRequest($data, $rules);
            if (!empty($errors)) {
                return $this->jsonResponse(['errors' => $errors], 400);
            }

            $userId = $_SESSION['user_id'];
            $user = $this->userModel->findById($userId);
            
            if (!$user) {
                return $this->jsonResponse(['error' => 'Utilisateur non trouvé'], 404);
            }
            
            // Vérifier le mot de passe
            if (!$this->userModel->verifyPassword($user['password_hash'], $data['password'])) {
                return $this->jsonResponse(['error' => 'Mot de passe incorrect'], 401);
            }
            
            // Vérifier si le nouveau nom d'utilisateur existe déjà (sauf si c'est le même)
            if ($data['username'] !== $user['username']) {
                $existingUser = $this->userModel->findByUsername($data['username']);
                if ($existingUser && $existingUser['id'] != $userId) {
                    return $this->jsonResponse(['error' => 'Ce nom d\'utilisateur est déjà utilisé'], 400);
                }
            }
            
            // Vérifier si le nouvel email existe déjà (sauf si c'est le même)
            if ($data['email'] !== $user['email']) {
                $existingUser = $this->userModel->findByEmail($data['email']);
                if ($existingUser && $existingUser['id'] != $userId) {
                    return $this->jsonResponse(['error' => 'Cet email est déjà utilisé'], 400);
                }
            }
            
            // Mettre à jour le profil
            $result = $this->userModel->updateProfile($userId, $data['username'], $data['email']);
            
            if (!$result) {
                return $this->jsonResponse(['error' => 'Échec de la mise à jour du profil'], 500);
            }
            
            // Mettre à jour les données de session
            $_SESSION['username'] = $data['username'];
            $_SESSION['email'] = $data['email'];
            
            return $this->jsonResponse([
                'message' => 'Profil mis à jour avec succès',
                'user' => [
                    'id' => $userId,
                    'username' => $data['username'],
                    'email' => $data['email']
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Exception dans updateProfile: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Erreur interne du serveur'], 500);
        }
    }

    public function updatePassword() {
        try {
            session_start();
            
            if (!isset($_SESSION['user_id'])) {
                return $this->jsonResponse(['error' => 'Non authentifié'], 401);
            }
            
            $data = $this->getRequestBody();
            
            $rules = [
                'oldPassword' => 'required',
                'newPassword' => 'required|min:6',
                'confirmNewPassword' => 'required|min:6'
            ];
            
            $errors = $this->validateRequest($data, $rules);
            if (!empty($errors)) {
                return $this->jsonResponse(['errors' => $errors], 400);
            }
            
            if ($data['newPassword'] !== $data['confirmNewPassword']) {
                return $this->jsonResponse(['error' => 'Les nouveaux mots de passe ne correspondent pas'], 400);
            }
            
            $userId = $_SESSION['user_id'];
            $user = $this->userModel->findById($userId);
            
            if (!$user) {
                return $this->jsonResponse(['error' => 'Utilisateur non trouvé'], 404);
            }
            
            // Vérifier l'ancien mot de passe
            if (!$this->userModel->verifyPassword($user['password_hash'], $data['oldPassword'])) {
                return $this->jsonResponse(['error' => 'Ancien mot de passe incorrect'], 401);
            }
            
            // Hasher et mettre à jour le nouveau mot de passe
            $newPasswordHash = password_hash($data['newPassword'], PASSWORD_DEFAULT);
            $result = $this->userModel->updatePassword($userId, $newPasswordHash);
            
            if (!$result) {
                return $this->jsonResponse(['error' => 'Échec de la mise à jour du mot de passe'], 500);
            }
            
            return $this->jsonResponse(['message' => 'Mot de passe mis à jour avec succès']);
        } catch (\Exception $e) {
            error_log("Exception dans updatePassword: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Erreur interne du serveur'], 500);
        }
    }
}
