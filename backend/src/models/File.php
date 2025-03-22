<?php

namespace App\Models;

class File extends BaseModel {
    protected $table = 'files';

    public function findByUserId($userId) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function createFile($userId, $fileName, $originalName, $filePath, $fileSize) {
        return $this->create([
            'user_id' => $userId,
            'file_name' => $fileName,
            'original_name' => $originalName,
            'file_path' => $filePath,
            'file_size' => $fileSize
        ]);
    }

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

    public function findByShareLink($linkHash) {
        $query = "SELECT f.*, sl.expires_at
                 FROM {$this->table} f 
                 JOIN share_links sl ON f.id = sl.file_id 
                 WHERE sl.link_hash = :link_hash AND sl.expires_at > NOW()";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute(['link_hash' => $linkHash]);
        return $stmt->fetch();
    }
}
