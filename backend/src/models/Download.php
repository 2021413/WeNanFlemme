<?php

namespace App\Models;

/**
 * Modèle pour la gestion des téléchargements
 */
class Download extends BaseModel {
    /**
     * Nom de la table dans la base de données
     */
    protected $table = 'downloads';

    /**
     * Enregistre un téléchargement de fichier
     *
     * @param int $fileId ID du fichier téléchargé
     * @param string $ipAddress Adresse IP de l'utilisateur
     * @return int ID de l'enregistrement créé
     */
    public function logDownload($fileId, $ipAddress) {
        error_log("Enregistrement du téléchargement - ID Fichier: " . $fileId . ", IP: " . $ipAddress);
        return $this->create([
            'file_id' => $fileId,
            'ip_address' => $ipAddress
        ]);
    }

    /**
     * Récupère l'historique des téléchargements d'un fichier
     *
     * @param int $fileId ID du fichier
     * @return array Liste des téléchargements
     */
    public function getFileDownloads($fileId) {
        $query = "SELECT * FROM {$this->table} WHERE file_id = :file_id ORDER BY downloaded_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['file_id' => $fileId]);
        return $stmt->fetchAll();
    }

    /**
     * Récupère les statistiques de téléchargement d'un fichier
     *
     * @param int $fileId ID du fichier
     * @return array Statistiques de téléchargement
     */
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
