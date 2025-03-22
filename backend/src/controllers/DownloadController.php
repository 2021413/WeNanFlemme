<?php

namespace App\Controllers;

use App\Models\File;
use App\Models\Download;

class DownloadController extends BaseController {
    private $fileModel;
    private $downloadModel;
    private $uploadDir;

    public function __construct() {
        $this->fileModel = new File();
        $this->downloadModel = new Download();
        $this->uploadDir = __DIR__ . '/../../uploads/';
    }

    public function downloadFile($fileId) {
        try {
            session_start();
            if (!isset($_SESSION['user_id'])) {
                return $this->jsonResponse(['error' => 'Unauthorized'], 401);
            }

            $file = $this->fileModel->findById($fileId);
            
            if (!$file || $file['user_id'] !== $_SESSION['user_id']) {
                return $this->jsonResponse(['error' => 'File not found or unauthorized'], 404);
            }

            $filePath = $this->uploadDir . $file['file_path'];
            if (!file_exists($filePath)) {
                return $this->jsonResponse(['error' => 'File not found'], 404);
            }

            // Récupérer l'IP
            $clientIP = $this->getClientIP();
            
            // Logger le téléchargement AVANT d'envoyer le fichier
            $this->downloadModel->logDownload(
                $file['id'],
                $clientIP
            );

            // Envoyer le fichier
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . $file['original_name'] . '"');
            header('Content-Length: ' . filesize($filePath));
            readfile($filePath);
            exit;
            
        } catch (Exception $e) {
            return $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    public function getStats($fileId) {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            return $this->jsonResponse(['error' => 'Unauthorized'], 401);
        }

        $file = $this->fileModel->findById($fileId);
        if (!$file || $file['user_id'] !== $_SESSION['user_id']) {
            return $this->jsonResponse(['error' => 'File not found or unauthorized'], 404);
        }

        $stats = $this->downloadModel->getDownloadStats($fileId);
        $downloads = $this->downloadModel->getFileDownloads($fileId);

        return $this->jsonResponse([
            'stats' => $stats,
            'downloads' => $downloads
        ]);
    }

    // Ajouter cette nouvelle méthode pour obtenir l'IP client
    private function getClientIP() {
        // Pour le développement local, si vous utilisez localhost
        if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] === '::1') {
            return '127.0.0.1';
        }

        // Le reste de la logique pour obtenir l'IP
        $headers = [
            'HTTP_CLIENT_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_FORWARDED',
            'HTTP_X_CLUSTER_CLIENT_IP',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED',
            'REMOTE_ADDR'
        ];

        foreach ($headers as $header) {
            if (isset($_SERVER[$header])) {
                $ips = array_map('trim', explode(',', $_SERVER[$header]));
                foreach ($ips as $ip) {
                    if (filter_var($ip, FILTER_VALIDATE_IP)) {
                        return $ip;
                    }
                }
            }
        }

        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}
