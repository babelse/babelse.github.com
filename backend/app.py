from flask import Flask, request, jsonify, send_file, render_template_string, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import mimetypes
import hashlib
from datetime import datetime
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = '../uploads'
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
ALLOWED_EXTENSIONS = set([
    'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp',
    'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm',
    'mp3', 'wav', 'flac', 'aac', 'ogg',
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'zip', 'rar', '7z', 'tar', 'gz',
    'py', 'js', 'html', 'css', 'json', 'xml', 'csv'
])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Créer le dossier uploads s'il n'existe pas
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Base de données simple en JSON pour stocker les métadonnées
METADATA_FILE = 'files_metadata.json'

def load_metadata():
    """Charger les métadonnées des fichiers"""
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_metadata(metadata):
    """Sauvegarder les métadonnées des fichiers"""
    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

def allowed_file(filename):
    """Vérifier si le fichier est autorisé"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_hash(filepath):
    """Calculer le hash MD5 d'un fichier"""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def format_file_size(size_bytes):
    """Formater la taille du fichier"""
    if size_bytes == 0:
        return "0B"
    size_name = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_name) - 1:
        size_bytes /= 1024.0
        i += 1
    return f"{size_bytes:.1f}{size_name[i]}"

@app.route('/')
def index():
    """Page d'accueil"""
    return send_from_directory('../frontend', 'index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    """Servir les fichiers statiques"""
    return send_from_directory('../static', filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    """Uploader un fichier"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            
            # Générer un nom unique si le fichier existe déjà
            counter = 1
            original_filename = filename
            while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
                name, ext = os.path.splitext(original_filename)
                filename = f"{name}_{counter}{ext}"
                counter += 1
            
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Calculer les métadonnées
            file_size = os.path.getsize(filepath)
            file_hash = get_file_hash(filepath)
            mime_type = mimetypes.guess_type(filepath)[0] or 'application/octet-stream'
            
            # Sauvegarder les métadonnées
            metadata = load_metadata()
            metadata[filename] = {
                'original_name': file.filename,
                'size': file_size,
                'size_formatted': format_file_size(file_size),
                'upload_date': datetime.now().isoformat(),
                'mime_type': mime_type,
                'hash': file_hash
            }
            save_metadata(metadata)
            
            return jsonify({
                'message': 'Fichier uploadé avec succès',
                'filename': filename,
                'size': format_file_size(file_size),
                'mime_type': mime_type
            })
        else:
            return jsonify({'error': 'Type de fichier non autorisé'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Erreur lors de l\'upload: {str(e)}'}), 500

@app.route('/files', methods=['GET'])
def list_files():
    """Lister tous les fichiers"""
    try:
        metadata = load_metadata()
        files_list = []
        
        for filename, info in metadata.items():
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(filepath):
                files_list.append({
                    'filename': filename,
                    'original_name': info.get('original_name', filename),
                    'size': info.get('size_formatted', 'Unknown'),
                    'upload_date': info.get('upload_date', 'Unknown'),
                    'mime_type': info.get('mime_type', 'Unknown'),
                    'download_url': f'/download/{filename}'
                })
        
        return jsonify(files_list)
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des fichiers: {str(e)}'}), 500

@app.route('/download/<filename>')
def download_file(filename):
    """Télécharger un fichier"""
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(filepath):
            metadata = load_metadata()
            original_name = metadata.get(filename, {}).get('original_name', filename)
            return send_file(filepath, as_attachment=True, download_name=original_name)
        else:
            return jsonify({'error': 'Fichier non trouvé'}), 404
    except Exception as e:
        return jsonify({'error': f'Erreur lors du téléchargement: {str(e)}'}), 500

@app.route('/preview/<filename>')
def preview_file(filename):
    """Prévisualiser un fichier"""
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(filepath):
            mime_type = mimetypes.guess_type(filepath)[0] or 'application/octet-stream'
            
            # Pour les images, vidéos, et fichiers texte, on peut les servir directement
            if mime_type.startswith(('image/', 'video/', 'audio/', 'text/')) or mime_type == 'application/pdf':
                return send_file(filepath)
            else:
                return jsonify({'error': 'Prévisualisation non disponible pour ce type de fichier'}), 400
        else:
            return jsonify({'error': 'Fichier non trouvé'}), 404
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la prévisualisation: {str(e)}'}), 500

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    """Supprimer un fichier"""
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            
            # Supprimer des métadonnées
            metadata = load_metadata()
            if filename in metadata:
                del metadata[filename]
                save_metadata(metadata)
            
            return jsonify({'message': 'Fichier supprimé avec succès'})
        else:
            return jsonify({'error': 'Fichier non trouvé'}), 404
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la suppression: {str(e)}'}), 500

@app.route('/stats')
def get_stats():
    """Obtenir les statistiques"""
    try:
        metadata = load_metadata()
        total_files = len(metadata)
        total_size = sum(info.get('size', 0) for info in metadata.values())
        
        # Types de fichiers
        file_types = {}
        for info in metadata.values():
            mime_type = info.get('mime_type', 'Unknown')
            category = mime_type.split('/')[0] if '/' in mime_type else 'Other'
            file_types[category] = file_types.get(category, 0) + 1
        
        return jsonify({
            'total_files': total_files,
            'total_size': format_file_size(total_size),
            'file_types': file_types
        })
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des statistiques: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)