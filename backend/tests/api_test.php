<?php

require_once __DIR__ . '/bootstrap.php';

use App\Config\Environment;

// S'assurer que l'environnement est chargé
if (!Environment::has('DB_HOST')) {
    Environment::load(__DIR__ . '/../.env');
}

class ApiTester {
    private $baseUrl;
    private $cookies = [];

    public function __construct() {
        $this->baseUrl = rtrim(Environment::get('APP_URL'), '/') . '/api';
    }

    private function sendRequest($method, $endpoint, $data = null, $files = null) {
        $url = $this->baseUrl . $endpoint;
        $ch = curl_init($url);

        $headers = ['Accept: application/json'];
        if (!$files) {
            $headers[] = 'Content-Type: application/json';
        }

        $options = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_HEADER => true
        ];

        if ($data && !$files) {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        } elseif ($files) {
            $options[CURLOPT_POSTFIELDS] = $files;
        }

        if ($this->cookies) {
            $options[CURLOPT_COOKIE] = $this->cookies;
        }

        curl_setopt_array($ch, $options);
        
        $response = curl_exec($ch);
        
        if ($response === false) {
            throw new Exception('Erreur cURL : ' . curl_error($ch));
        }

        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        // Extraire les cookies de la réponse
        preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $headers, $matches);
        if (!empty($matches[1])) {
            $this->cookies = implode('; ', $matches[1]);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($body, true);
        if ($httpCode >= 400) {
            echo "Erreur HTTP $httpCode : " . print_r($result, true) . "\n";
        }

        return $result;
    }

    public function testRegister() {
        echo "Test d'inscription...\n";
        $data = [
            'username' => 'test_user_' . time(),
            'email' => 'test_' . time() . '@example.com',
            'password' => 'password123'
        ];
        $response = $this->sendRequest('POST', '/auth/register', $data);
        print_r($response);
        return $data;
    }

    public function testLogin($credentials) {
        echo "\nTest de connexion...\n";
        $data = [
            'username' => $credentials['username'],
            'password' => $credentials['password']
        ];
        $response = $this->sendRequest('POST', '/auth/login', $data);
        print_r($response);
    }

    public function testUploadFile() {
        echo "\nTest d'upload de fichier...\n";
        $testFile = __DIR__ . '/test_file.txt';
        file_put_contents($testFile, 'Contenu de test');
        
        $files = ['file' => new CURLFile($testFile)];
        $response = $this->sendRequest('POST', '/files/upload', null, $files);
        print_r($response);
        
        unlink($testFile);
    }

    public function testListFiles() {
        echo "\nTest de liste des fichiers...\n";
        $response = $this->sendRequest('GET', '/files');
        print_r($response);
    }

    public function runAllTests() {
        try {
            $credentials = $this->testRegister();
            sleep(1); // Petite pause pour éviter les conflits
            $this->testLogin($credentials);
            sleep(1);
            $this->testUploadFile();
            sleep(1);
            $this->testListFiles();
            echo "\nTous les tests sont terminés.\n";
        } catch (Exception $e) {
            echo "Erreur pendant les tests : " . $e->getMessage() . "\n";
        }
    }
}

// Exécuter les tests
$tester = new ApiTester();
$tester->runAllTests(); 