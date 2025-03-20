<?php

namespace App\Controllers;

use App\Models\User;

class AuthController extends BaseController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register() {
        $data = $this->getRequestBody();
        
        $rules = [
            'username' => 'required',
            'email' => 'required',
            'password' => 'required'
        ];
        
        $errors = $this->validateRequest($data, $rules);
        if (!empty($errors)) {
            return $this->jsonResponse(['errors' => $errors], 400);
        }

        if ($this->userModel->findByUsername($data['username'])) {
            return $this->jsonResponse(['error' => 'Username already exists'], 400);
        }

        if ($this->userModel->findByEmail($data['email'])) {
            return $this->jsonResponse(['error' => 'Email already exists'], 400);
        }

        $userId = $this->userModel->createUser(
            $data['username'],
            $data['email'],
            $data['password']
        );

        return $this->jsonResponse(['message' => 'User registered successfully', 'id' => $userId]);
    }

    public function login() {
        $data = $this->getRequestBody();
        
        $rules = [
            'username' => 'required',
            'password' => 'required'
        ];
        
        $errors = $this->validateRequest($data, $rules);
        if (!empty($errors)) {
            return $this->jsonResponse(['errors' => $errors], 400);
        }

        $user = $this->userModel->findByUsername($data['username']);
        if (!$user || !$this->userModel->verifyPassword($user['password_hash'], $data['password'])) {
            return $this->jsonResponse(['error' => 'Invalid credentials'], 401);
        }

        // Créer une session simple (à améliorer avec JWT dans un vrai projet)
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];

        return $this->jsonResponse([
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email']
            ]
        ]);
    }

    public function logout() {
        session_start();
        session_destroy();
        return $this->jsonResponse(['message' => 'Logout successful']);
    }
}
