<?php

require_once __DIR__ . '/bootstrap.php';

use App\Models\User;
use App\Config\Environment;

class UserTest {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function testCreateUser() {
        echo "Test création utilisateur...\n";
        
        $username = "test_user_" . time();
        $email = "test_" . time() . "@example.com";
        $password = "password123";

        $userId = $this->userModel->createUser($username, $email, $password);
        
        if ($userId) {
            echo "✓ Création utilisateur réussie (ID: $userId)\n";
        } else {
            echo "✗ Échec création utilisateur\n";
        }

        return $userId;
    }

    public function testFindByUsername($username) {
        echo "Test recherche utilisateur...\n";
        
        $user = $this->userModel->findByUsername($username);
        
        if ($user && $user['username'] === $username) {
            echo "✓ Utilisateur trouvé\n";
        } else {
            echo "✗ Utilisateur non trouvé\n";
        }
    }

    public function runAllTests() {
        try {
            $userId = $this->testCreateUser();
            if ($userId) {
                $this->testFindByUsername("test_user_" . time());
            }
            echo "\nTous les tests sont terminés.\n";
        } catch (Exception $e) {
            echo "Erreur pendant les tests : " . $e->getMessage() . "\n";
        }
    }
}

// Exécuter les tests
$test = new UserTest();
$test->runAllTests(); 