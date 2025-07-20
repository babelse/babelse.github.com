# 🚀 FileHost Pro - Application d'Hébergement de Fichiers

Une application web moderne et élégante pour héberger et gérer tous types de fichiers avec une interface utilisateur intuitive.

## ✨ Fonctionnalités

### 📤 Upload de Fichiers
- **Glisser-déposer** : Interface drag & drop intuitive
- **Sélection multiple** : Upload de plusieurs fichiers simultanément
- **Types supportés** : Images, vidéos, audio, documents, archives, et plus
- **Taille maximale** : 100MB par fichier
- **Barre de progression** : Suivi en temps réel des uploads

### 📁 Gestion des Fichiers
- **Liste complète** : Affichage en grille avec icônes par type
- **Recherche** : Filtrage rapide par nom de fichier
- **Métadonnées** : Taille, date d'upload, type MIME
- **Actions** : Téléchargement, prévisualisation, suppression

### 👁️ Prévisualisation
- **Images** : Affichage direct dans une modal
- **Vidéos** : Lecteur intégré avec contrôles
- **Audio** : Lecteur audio intégré
- **Documents texte** : Prévisualisation du contenu
- **PDF** : Visualisation dans un iframe

### 📊 Statistiques
- **Nombre total** de fichiers
- **Espace utilisé** avec formatage automatique
- **Répartition par type** de fichiers
- **Interface graphique** claire et moderne

### 🎨 Interface Utilisateur
- **Design moderne** avec dégradés et animations
- **Responsive** : Compatible mobile et desktop
- **Mode sombre** : Support automatique selon les préférences système
- **Notifications** : Feedback visuel pour toutes les actions
- **Navigation par onglets** : Organisation claire des fonctionnalités

## 🛠️ Technologies Utilisées

### Backend
- **Flask** : Framework web Python léger et puissant
- **Flask-CORS** : Gestion des requêtes cross-origin
- **Werkzeug** : Utilitaires pour la sécurité des fichiers
- **JSON** : Base de données simple pour les métadonnées

### Frontend
- **HTML5** : Structure sémantique moderne
- **CSS3** : Styles avancés avec variables CSS et animations
- **JavaScript ES6+** : Logique interactive avec classes et async/await
- **Font Awesome** : Icônes vectorielles

## 📋 Prérequis

- **Python 3.7+**
- **pip** (gestionnaire de packages Python)
- **Navigateur web moderne** (Chrome, Firefox, Safari, Edge)

## 🚀 Installation et Démarrage

### Installation Rapide

1. **Cloner ou télécharger** le projet
2. **Rendre le script exécutable** :
   ```bash
   chmod +x start.sh
   ```
3. **Lancer l'application** :
   ```bash
   ./start.sh
   ```

### Installation Manuelle

1. **Créer un environnement virtuel** :
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

2. **Installer les dépendances** :
   ```bash
   pip install -r requirements.txt
   ```

3. **Créer les dossiers nécessaires** :
   ```bash
   mkdir -p uploads static/{css,js,images}
   ```

4. **Démarrer le serveur** :
   ```bash
   cd backend
   python app.py
   ```

5. **Ouvrir dans le navigateur** :
   ```
   http://localhost:5000
   ```

## 📁 Structure du Projet

```
file-hosting-app/
├── backend/
│   ├── app.py              # Serveur Flask principal
│   └── files_metadata.json # Base de données des métadonnées
├── frontend/
│   └── index.html          # Interface utilisateur principale
├── static/
│   ├── css/
│   │   └── style.css       # Styles CSS modernes
│   └── js/
│       └── app.js          # Logique JavaScript
├── uploads/                # Dossier de stockage des fichiers
├── requirements.txt        # Dépendances Python
├── start.sh               # Script de démarrage
└── README.md              # Documentation
```

## 🔧 Configuration

### Limites de Fichiers
Modifiez ces valeurs dans `backend/app.py` :
```python
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
ALLOWED_EXTENSIONS = set([
    'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif',
    # Ajoutez d'autres extensions...
])
```

### Port du Serveur
Changez le port dans `backend/app.py` :
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 🌐 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/` | Page d'accueil |
| `POST` | `/upload` | Upload d'un fichier |
| `GET` | `/files` | Liste des fichiers |
| `GET` | `/download/<filename>` | Téléchargement |
| `GET` | `/preview/<filename>` | Prévisualisation |
| `DELETE` | `/delete/<filename>` | Suppression |
| `GET` | `/stats` | Statistiques |

## 🔒 Sécurité

- **Validation des extensions** : Seuls les types autorisés sont acceptés
- **Noms sécurisés** : Utilisation de `secure_filename()` de Werkzeug
- **Gestion des doublons** : Renommage automatique des fichiers existants
- **Hachage MD5** : Vérification d'intégrité des fichiers

## 🎯 Fonctionnalités Avancées

### Upload par Drag & Drop
- Zone de drop visuelle avec feedback
- Support de la sélection multiple
- Indication visuelle lors du survol

### Prévisualisation Intelligente
- Détection automatique du type MIME
- Lecteurs intégrés pour média
- Gestion des erreurs de prévisualisation

### Notifications Contextuelles
- Messages de succès, erreur, avertissement
- Animation d'entrée et sortie
- Auto-suppression après 5 secondes

### Responsive Design
- Adaptation automatique aux écrans
- Navigation tactile optimisée
- Grille flexible pour les fichiers

## 🐛 Dépannage

### Problèmes Courants

**Erreur de permission lors du démarrage** :
```bash
chmod +x start.sh
```

**Module non trouvé** :
```bash
pip install -r requirements.txt
```

**Port déjà utilisé** :
Modifiez le port dans `backend/app.py` ou arrêtez l'autre processus :
```bash
sudo lsof -i :5000
kill -9 <PID>
```

**Fichiers non visibles** :
Vérifiez les permissions du dossier `uploads/` :
```bash
chmod 755 uploads/
```

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Optimiser le code

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la section dépannage
2. Consultez les issues GitHub
3. Créez une nouvelle issue si nécessaire

---

**FileHost Pro** - Une solution moderne pour l'hébergement de fichiers 🚀