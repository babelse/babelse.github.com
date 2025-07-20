#!/usr/bin/env python3
"""
Script de démonstration pour FileHost Pro
Ce script crée quelques fichiers de test et démarre l'application
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

def create_demo_files():
    """Créer quelques fichiers de démonstration"""
    print("📁 Création des fichiers de démonstration...")
    
    demo_dir = Path("demo_files")
    demo_dir.mkdir(exist_ok=True)
    
    # Créer un fichier texte
    with open(demo_dir / "sample.txt", "w", encoding="utf-8") as f:
        f.write("Ceci est un fichier de démonstration pour FileHost Pro!\n")
        f.write("Vous pouvez uploader ce fichier pour tester l'application.\n")
        f.write("L'application supporte de nombreux types de fichiers.\n")
    
    # Créer un fichier JSON
    with open(demo_dir / "config.json", "w", encoding="utf-8") as f:
        f.write('{\n')
        f.write('  "app_name": "FileHost Pro",\n')
        f.write('  "version": "1.0.0",\n')
        f.write('  "author": "Assistant IA",\n')
        f.write('  "description": "Application d\'hébergement de fichiers moderne"\n')
        f.write('}\n')
    
    # Créer un fichier HTML
    with open(demo_dir / "demo.html", "w", encoding="utf-8") as f:
        f.write('<!DOCTYPE html>\n')
        f.write('<html>\n<head>\n')
        f.write('  <title>Démonstration FileHost Pro</title>\n')
        f.write('</head>\n<body>\n')
        f.write('  <h1>Bienvenue dans FileHost Pro!</h1>\n')
        f.write('  <p>Cette application permet d\'héberger tous types de fichiers.</p>\n')
        f.write('</body>\n</html>\n')
    
    print(f"✅ Fichiers de démonstration créés dans {demo_dir}/")

def start_server():
    """Démarrer le serveur Flask"""
    print("🚀 Démarrage du serveur Flask...")
    
    os.chdir("backend")
    
    try:
        # Démarrer le serveur
        process = subprocess.Popen([sys.executable, "app.py"])
        
        # Attendre que le serveur démarre
        time.sleep(3)
        
        print("✅ Serveur démarré sur http://localhost:5000")
        print("🌐 Ouverture du navigateur...")
        
        # Ouvrir le navigateur
        webbrowser.open("http://localhost:5000")
        
        print("\n📋 Instructions:")
        print("1. Utilisez l'onglet 'Upload' pour télécharger des fichiers")
        print("2. Consultez vos fichiers dans l'onglet 'Mes Fichiers'")
        print("3. Visualisez les statistiques dans l'onglet 'Statistiques'")
        print("4. Testez avec les fichiers de démonstration dans demo_files/")
        print("\n🛑 Appuyez sur Ctrl+C pour arrêter le serveur")
        
        # Attendre l'interruption
        process.wait()
        
    except KeyboardInterrupt:
        print("\n🛑 Arrêt du serveur...")
        process.terminate()
        print("✅ Serveur arrêté")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    """Fonction principale"""
    print("🎉 Démonstration de FileHost Pro")
    print("=" * 40)
    
    # Vérifier la structure du projet
    if not os.path.exists("backend/app.py"):
        print("❌ Fichier backend/app.py non trouvé!")
        print("Assurez-vous d'être dans le répertoire du projet.")
        return
    
    # Créer les fichiers de démonstration
    create_demo_files()
    
    # Démarrer le serveur
    start_server()

if __name__ == "__main__":
    main()
