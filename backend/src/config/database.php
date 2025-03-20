<?php

namespace App\Config;

class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
        $host = Environment::get('DB_HOST');
        $dbname = Environment::get('DB_NAME');
        $username = Environment::get('DB_USER');
        $password = Environment::get('DB_PASS');
        
        try {
            $this->connection = new \PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $username,
                $password,
                [
                    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
                ]
            );
        } catch(\PDOException $e) {
            throw new \Exception("Connection failed: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }
}
