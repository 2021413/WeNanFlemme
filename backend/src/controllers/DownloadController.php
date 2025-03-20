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

    public function downloadFile($linkHash) {
        $file = $this->fileModel->findByShareLink($linkHash);
        
        if (!$file) {
            return $this->jsonResponse(['error' => 'Invalid or expired link'], 404);
        }

        if ($file['is_protected']) {
            $data = $this->getRequestBody();
            if (!isset($data['password']) || !password_verify($data['password'], $file['password'])) {
                return $this->jsonResponse(['error' => 'Invalid password'], 401);
            }
        }

        $filePath = $this->uploadDir . $file['file_path'];
        if (!file_exists($filePath)) {
            return $this->jsonResponse(['error' => 'File not found'], 404);
        }

        // Log download
        $this->downloadModel->logDownload(
            $file['id'],
            $_SERVER['REMOTE_ADDR']
        );

        // Send file
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $file['file_name'] . '"');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
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
}
