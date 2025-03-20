<?php

namespace App\Models;

class Download extends BaseModel {
    protected $table = 'downloads';

    public function logDownload($fileId, $ipAddress) {
        return $this->create([
            'file_id' => $fileId,
            'ip_address' => $ipAddress
        ]);
    }

    public function getFileDownloads($fileId) {
        $query = "SELECT * FROM {$this->table} WHERE file_id = :file_id ORDER BY downloaded_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['file_id' => $fileId]);
        return $stmt->fetchAll();
    }

    public function getDownloadStats($fileId) {
        $query = "SELECT COUNT(*) as total_downloads, 
                        COUNT(DISTINCT ip_address) as unique_downloads 
                 FROM {$this->table} 
                 WHERE file_id = :file_id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['file_id' => $fileId]);
        return $stmt->fetch();
    }
}
