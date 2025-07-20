#!/bin/bash

# Script de démarrage pour l'application d'hébergement de fichiers

echo "🚀 Démarrage de FileHost Pro..."

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez installer Python 3."
    exit 1
fi

# Vérifier si pip est installé
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 n'est pas installé. Veuillez installer pip3."
    exit 1
fi

# Créer un environnement virtuel s'il n'existe pas
if [ ! -d "venv" ]; then
    echo "📦 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances
echo "📋 Installation des dépendances..."
pip install -r requirements.txt

# Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
mkdir -p uploads
mkdir -p static/css
mkdir -p static/js
mkdir -p static/images

# Démarrer l'application
echo "✅ Démarrage du serveur..."
echo "🌐 L'application sera disponible sur: http://localhost:5000"
echo "🛑 Pour arrêter l'application, appuyez sur Ctrl+C"
echo ""

cd backend
python app.py