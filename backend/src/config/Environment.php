<?php

namespace App\Config;

class Environment {
    private static $variables = [];

    /**
     * Charge les variables d'environnement depuis le fichier .env
     * @param string $path Chemin vers le fichier .env
     * @throws \Exception si le fichier n'existe pas
     */
    public static function load($path) {
        if (!file_exists($path)) {
            throw new \Exception("Le fichier .env n'existe pas dans : $path");
        }

        // Lecture du fichier .env
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Ignore les commentaires
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            // Parse uniquement les lignes contenant un =
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                self::$variables[trim($key)] = trim($value);
            }
        }
    }

    /**
     * Récupère la valeur d'une variable d'environnement
     * @param string $key Nom de la variable
     * @param mixed $default Valeur par défaut si la variable n'existe pas
     * @return mixed
     */
    public static function get($key, $default = null) {
        return self::$variables[$key] ?? $default;
    }

    /**
     * Vérifie si une variable d'environnement existe
     * @param string $key Nom de la variable
     * @return bool
     */
    public static function has($key) {
        return isset(self::$variables[$key]);
    }

    /**
     * Définit une variable d'environnement
     * @param string $key Nom de la variable
     * @param mixed $value Valeur de la variable
     */
    public static function set($key, $value) {
        self::$variables[$key] = $value;
    }

    /**
     * Récupère toutes les variables d'environnement
     * @return array
     */
    public static function all() {
        return self::$variables;
    }
} 