<?php

namespace App\Models;

class User extends BaseModel {
    protected $table = 'users';

    public function findByUsername($username) {
        $query = "SELECT * FROM {$this->table} WHERE username = :username";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['username' => $username]);
        return $stmt->fetch();
    }

    public function findByEmail($email) {
        $query = "SELECT * FROM {$this->table} WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    public function createUser($username, $email, $password) {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        return $this->create([
            'username' => $username,
            'email' => $email,
            'password_hash' => $password_hash
        ]);
    }

    public function verifyPassword($password_hash, $password) {
        return password_verify($password, $password_hash);
    }

    public function updateProfile($userId, $username, $email) {
        $query = "UPDATE {$this->table} SET username = :username, email = :email WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            'id' => $userId,
            'username' => $username,
            'email' => $email
        ]);
    }

    public function updatePassword($userId, $newPasswordHash) {
        $query = "UPDATE {$this->table} SET password_hash = :password_hash WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            'id' => $userId,
            'password_hash' => $newPasswordHash
        ]);
    }
}
