<?php

namespace App\Models;

/**
 * Modèle pour la gestion des fichiers
 */
class File extends BaseModel {
    /**
     * Nom de la table dans la base de données
     */
    protected $table = 'files';

    /**
     * Recherche tous les fichiers appartenant à un utilisateur
     *
     * @param int $userId ID de l'utilisateur
     * @return array Tableau des fichiers de l'utilisateur
     */
    public function findByUserId($userId) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    /**
     * Recherche tous les fichiers partagés avec un utilisateur
     *
     * @param int $userId ID de l'utilisateur
     * @return array Tableau des fichiers partagés avec l'utilisateur
     */
    public function findSharedWithUser($userId) {
        $query = "SELECT f.*, u.username as shared_by, 1 as is_shared 
                 FROM {$this->table} f 
                 JOIN shared_files sf ON f.id = sf.file_id 
                 JOIN users u ON f.user_id = u.id
                 WHERE sf.recipient_id = :user_id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    /**
     * Récupère tous les fichiers liés à un utilisateur (personnels et partagés)
     *
     * @param int $userId ID de l'utilisateur
     * @param bool $includeShared Inclure les fichiers partagés
     * @return array Tableau des fichiers
     */
    public function findAllUserFiles($userId, $includeShared = false) {
        // Si on n'inclut pas les fichiers partagés, retourner juste les fichiers de l'utilisateur
        if (!$includeShared) {
            return $this->findByUserId($userId);
        }
        
        // Sinon, récupérer les fichiers personnels et les fichiers partagés
        $personalFiles = $this->findByUserId($userId);
        $sharedFiles = $this->findSharedWithUser($userId);
        
        return array_merge($personalFiles, $sharedFiles);
    }

    /**
     * Crée un nouveau fichier dans la base de données
     *
     * @param int $userId ID de l'utilisateur propriétaire
     * @param string $fileName Nom du fichier affiché à l'utilisateur
     * @param string $originalName Nom original du fichier uploadé
     * @param string $filePath Chemin sur le serveur où le fichier est stocké
     * @param int $fileSize Taille du fichier en octets
     * @return int ID du fichier créé
     */
    public function createFile($userId, $fileName, $originalName, $filePath, $fileSize) {
        return $this->create([
            'user_id' => $userId,
            'file_name' => $fileName,
            'original_name' => $originalName,
            'file_path' => $filePath,
            'file_size' => $fileSize
        ]);
    }

    /**
     * Crée un lien de partage pour un fichier
     *
     * @param int $fileId ID du fichier
     * @param string $expiresAt Date d'expiration du lien
     * @return string Hash unique du lien de partage
     */
    public function createShareLink($fileId, $expiresAt) {
        $linkHash = bin2hex(random_bytes(32));
        $query = "INSERT INTO share_links (file_id, link_hash, expires_at) 
                 VALUES (:file_id, :link_hash, :expires_at)";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            'file_id' => $fileId,
            'link_hash' => $linkHash,
            'expires_at' => $expiresAt
        ]);
        
        return $linkHash;
    }

    /**
     * Recherche un fichier par son lien de partage
     *
     * @param string $linkHash Hash du lien de partage
     * @return array|bool Les données du fichier ou false
     */
    public function findByShareLink($linkHash) {
        $query = "SELECT f.*, sl.expires_at
                 FROM {$this->table} f 
                 JOIN share_links sl ON f.id = sl.file_id 
                 WHERE sl.link_hash = :link_hash AND sl.expires_at > NOW()";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute(['link_hash' => $linkHash]);
        return $stmt->fetch();
    }

    /**
     * Partage un fichier avec un autre utilisateur
     *
     * @param int $fileId ID du fichier à partager
     * @param string $username Nom d'utilisateur du destinataire
     * @return bool Succès ou échec du partage
     */
    public function shareFileWithUser($fileId, $username) {
        try {
            // D'abord, créer la table shared_files si elle n'existe pas
            $createTableQuery = "CREATE TABLE IF NOT EXISTS shared_files (
                id INT AUTO_INCREMENT PRIMARY KEY,
                file_id INT NOT NULL,
                recipient_id INT NOT NULL,
                shared_at DATETIME NOT NULL,
                UNIQUE KEY (file_id, recipient_id)
            )";
            $this->db->exec($createTableQuery);
            
            // Vérifier si l'utilisateur existe
            $query = "SELECT id FROM users WHERE username = :username LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['username' => $username]);
            $recipient = $stmt->fetch();
            
            if (!$recipient) {
                return false; // L'utilisateur n'existe pas
            }
            
            $recipientId = $recipient['id'];
            
            // Vérifier si le partage existe déjà
            $query = "SELECT id FROM shared_files WHERE file_id = :file_id AND recipient_id = :recipient_id LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'file_id' => $fileId,
                'recipient_id' => $recipientId
            ]);
            
            if ($stmt->fetch()) {
                return true; // Le partage existe déjà
            }
            
            // Créer un nouveau partage
            $query = "INSERT INTO shared_files (file_id, recipient_id, shared_at) 
                    VALUES (:file_id, :recipient_id, NOW())";
            
            $stmt = $this->db->prepare($query);
            return $stmt->execute([
                'file_id' => $fileId,
                'recipient_id' => $recipientId
            ]);
        } catch (Exception $e) {
            error_log("Exception dans shareFileWithUser: " . $e->getMessage());
            return false;
        }
    }
}
