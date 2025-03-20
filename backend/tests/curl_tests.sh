#!/bin/bash

# Configuration
BASE_URL="http://localhost:8000/api"
COOKIE_JAR="cookies.txt"

# Test de santé
echo "Test de santé de l'API..."
curl -X GET "$BASE_URL/health"
echo -e "\n"

# Test d'inscription
echo "Test d'inscription..."
curl -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "test_user",
        "email": "test@example.com",
        "password": "password123"
    }'
echo -e "\n"

# Test de connexion
echo "Test de connexion..."
curl -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_JAR" \
    -d '{
        "username": "test_user",
        "password": "password123"
    }'
echo -e "\n"

# Test d'upload de fichier
echo "Test d'upload de fichier..."
curl -X POST "$BASE_URL/files/upload" \
    -b "$COOKIE_JAR" \
    -F "file=@test_file.txt"
echo -e "\n"

# Test de liste des fichiers
echo "Test de liste des fichiers..."
curl -X GET "$BASE_URL/files" \
    -b "$COOKIE_JAR"
echo -e "\n"

# Nettoyage
rm -f "$COOKIE_JAR" 