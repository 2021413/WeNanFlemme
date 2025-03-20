<?php

namespace App\Controllers;

use App\Models\File;

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
        $fileName = basename($file['name']);
        $fileSize = $file['size'];
        $uniqueName = uniqid() . '_' . $fileName;
        $filePath = $this->uploadDir . $uniqueName;

        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            return $this->jsonResponse(['error' => 'Failed to upload file'], 500);
        }

        $fileId = $this->fileModel->createFile(
            $_SESSION['user_id'],
            $fileName,
            $uniqueName,
            $fileSize
        );

        return $this->jsonResponse([
            'message' => 'File uploaded successfully',
            'file' => [
                'id' => $fileId,
                'name' => $fileName,
                'size' => $fileSize
            ]
        ]);
    }

    public function createShareLink() {
        $data = $this->getRequestBody();
        
        $rules = [
            'file_id' => 'required',
            'expires_at' => 'required'
        ];
        
        $errors = $this->validateRequest($data, $rules);
        if (!empty($errors)) {
            return $this->jsonResponse(['errors' => $errors], 400);
        }

        $file = $this->fileModel->findById($data['file_id']);
        if (!$file) {
            return $this->jsonResponse(['error' => 'File not found'], 404);
        }

        $linkHash = $this->fileModel->createShareLink(
            $data['file_id'],
            $data['expires_at'],
            $data['is_protected'] ?? false,
            $data['password'] ?? null
        );

        return $this->jsonResponse([
            'message' => 'Share link created successfully',
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
