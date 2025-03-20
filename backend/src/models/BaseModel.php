<?php

namespace App\Models;

use App\Config\Database;

abstract class BaseModel {
    protected $db;
    protected $table;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findAll() {
        $query = "SELECT * FROM {$this->table}";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $fields = array_keys($data);
        $values = array_map(fn($field) => ":$field", $fields);
        
        $query = "INSERT INTO {$this->table} (" . implode(', ', $fields) . ") 
                 VALUES (" . implode(', ', $values) . ")";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($data);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $fields = array_map(fn($field) => "$field = :$field", array_keys($data));
        
        $query = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = :id";
        
        $data['id'] = $id;
        $stmt = $this->db->prepare($query);
        return $stmt->execute($data);
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute(['id' => $id]);
    }

    public function beginTransaction() {
        return $this->db->beginTransaction();
    }

    public function commit() {
        return $this->db->commit();
    }

    public function rollback() {
        return $this->db->rollBack();
    }

    protected function executeQuery($query, $params = []) {
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }
} 