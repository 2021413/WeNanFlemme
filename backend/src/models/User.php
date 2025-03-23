<?php

namespace App\Models;

/**
 * Modèle pour la gestion des utilisateurs
 */
class User extends BaseModel {
    /**
     * Nom de la table dans la base de données
     */
    protected $table = 'users';

    /**
     * Recherche un utilisateur par son nom d'utilisateur
     *
     * @param string $username Nom d'utilisateur à rechercher
     * @return array|bool Les données de l'utilisateur ou false
     */
    public function findByUsername($username) {
        $query = "SELECT * FROM {$this->table} WHERE username = :username";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['username' => $username]);
        return $stmt->fetch();
    }

    /**
     * Recherche un utilisateur par son adresse e-mail
     *
     * @param string $email Adresse e-mail à rechercher
     * @return array|bool Les données de l'utilisateur ou false
     */
    public function findByEmail($email) {
        $query = "SELECT * FROM {$this->table} WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    /**
     * Crée un nouvel utilisateur
     *
     * @param string $username Nom d'utilisateur
     * @param string $email Adresse e-mail
     * @param string $password Mot de passe en clair (sera hashé)
     * @return int ID de l'utilisateur créé
     */
    public function createUser($username, $email, $password) {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        return $this->create([
            'username' => $username,
            'email' => $email,
            'password_hash' => $password_hash
        ]);
    }

    /**
     * Vérifie si un mot de passe correspond au hash stocké
     *
     * @param string $password_hash Hash du mot de passe stocké
     * @param string $password Mot de passe en clair à vérifier
     * @return bool True si le mot de passe est valide
     */
    public function verifyPassword($password_hash, $password) {
        return password_verify($password, $password_hash);
    }

    /**
     * Met à jour le profil d'un utilisateur
     *
     * @param int $userId ID de l'utilisateur
     * @param string $username Nouveau nom d'utilisateur
     * @param string $email Nouvelle adresse e-mail
     * @return bool Succès ou échec de la mise à jour
     */
    public function updateProfile($userId, $username, $email) {
        $query = "UPDATE {$this->table} SET username = :username, email = :email WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            'id' => $userId,
            'username' => $username,
            'email' => $email
        ]);
    }

    /**
     * Met à jour le mot de passe d'un utilisateur
     *
     * @param int $userId ID de l'utilisateur
     * @param string $newPasswordHash Nouveau hash de mot de passe
     * @return bool Succès ou échec de la mise à jour
     */
    public function updatePassword($userId, $newPasswordHash) {
        $query = "UPDATE {$this->table} SET password_hash = :password_hash WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            'id' => $userId,
            'password_hash' => $newPasswordHash
        ]);
    }
}
