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
}
