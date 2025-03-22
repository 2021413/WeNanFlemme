<?php

namespace App\Controllers;

use App\Models\File;
use Exception;
use DateTime;

class FileController extends BaseController {
    private $fileModel;
    private $uploadDir;

    public function __construct() {
        $this->fileModel = new File();
        $this->uploadDir = __DIR__ . '/../../uploads/';
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    public function upload() {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            return $this->jsonResponse(['error' => 'Unauthorized'], 401);
        }

        if (!isset($_FILES['file'])) {
            return $this->jsonResponse(['error' => 'No file uploaded'], 400);
        }

        $file = $_FILES['file'];
        $originalName = basename($file['name']);
        $fileSize = $file['size'];
        $title = $_POST['title'] ?? $originalName;
        $uniqueName = uniqid() . '_' . $originalName;
        $filePath = $this->uploadDir . $uniqueName;

        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            return $this->jsonResponse(['error' => 'Failed to upload file'], 500);
        }

        $fileId = $this->fileModel->createFile(
            $_SESSION['user_id'],
            $title,
            $originalName,
            $uniqueName,
            $fileSize
        );

        return $this->jsonResponse([
            'message' => 'File uploaded successfully',
            'file' => [
                'id' => $fileId,
                'name' => $title,
                'original_name' => $originalName,
                'size' => $fileSize
            ]
        ]);
    }

    public function createShareLink() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['file_id']) || !isset($data['expires_at'])) {
            return $this->jsonResponse(['error' => 'Missing required fields'], 400);
        }

        $linkHash = $this->fileModel->createShareLink(
            $data['file_id'],
            $data['expires_at']
        );

        return $this->jsonResponse([
            'link' => $linkHash
        ]);
    }

    public function listUserFiles() {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            return $this->jsonResponse(['error' => 'Unauthorized'], 401);
        }

        $files = $this->fileModel->findByUserId($_SESSION['user_id']);
        return $this->jsonResponse(['files' => $files]);
    }

    public function delete($id) {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            return $this->jsonResponse(['error' => 'Unauthorized'], 401);
        }

        $file = $this->fileModel->findById($id);
        if (!$file || $file['user_id'] !== $_SESSION['user_id']) {
            return $this->jsonResponse(['error' => 'File not found or unauthorized'], 404);
        }

        $filePath = $this->uploadDir . $file['file_path'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $this->fileModel->delete($id);
        return $this->jsonResponse(['message' => 'File deleted successfully']);
    }
}
