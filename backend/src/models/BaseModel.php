<?php

namespace App\Models;

use App\Config\Database;

/**
 * Classe de base pour tous les modèles
 */
abstract class BaseModel {
    /**
     * Instance de connexion PDO
     */
    protected $db;
    
    /**
     * Nom de la table associée au modèle
     */
    protected $table;

    /**
     * Constructeur qui initialise la connexion à la base de données
     */
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Récupère tous les enregistrements de la table
     *
     * @return array Tous les enregistrements
     */
    public function findAll() {
        $query = "SELECT * FROM {$this->table}";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Recherche un enregistrement par son ID
     *
     * @param int $id ID de l'enregistrement
     * @return array|bool Les données de l'enregistrement ou false
     */
    public function findById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Crée un nouvel enregistrement
     *
     * @param array $data Données à insérer
     * @return int ID de l'enregistrement créé
     */
    public function create($data) {
        $fields = array_keys($data);
        $values = array_map(fn($field) => ":$field", $fields);
        
        $query = "INSERT INTO {$this->table} (" . implode(', ', $fields) . ") 
                 VALUES (" . implode(', ', $values) . ")";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($data);
        return $this->db->lastInsertId();
    }

    /**
     * Met à jour un enregistrement existant
     *
     * @param int $id ID de l'enregistrement
     * @param array $data Données à mettre à jour
     * @return bool Succès ou échec de la mise à jour
     */
    public function update($id, $data) {
        $fields = array_map(fn($field) => "$field = :$field", array_keys($data));
        
        $query = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = :id";
        
        $data['id'] = $id;
        $stmt = $this->db->prepare($query);
        return $stmt->execute($data);
    }

    /**
     * Supprime un enregistrement
     *
     * @param int $id ID de l'enregistrement à supprimer
     * @return bool Succès ou échec de la suppression
     */
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute(['id' => $id]);
    }

    /**
     * Démarre une transaction
     *
     * @return bool Succès ou échec
     */
    public function beginTransaction() {
        return $this->db->beginTransaction();
    }

    /**
     * Valide une transaction
     *
     * @return bool Succès ou échec
     */
    public function commit() {
        return $this->db->commit();
    }

    /**
     * Annule une transaction
     *
     * @return bool Succès ou échec
     */
    public function rollback() {
        return $this->db->rollBack();
    }

    /**
     * Exécute une requête SQL avec paramètres
     *
     * @param string $query Requête SQL
     * @param array $params Paramètres pour la requête
     * @return \PDOStatement Résultat de la requête
     */
    protected function executeQuery($query, $params = []) {
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }
} 