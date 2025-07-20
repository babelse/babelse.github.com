// Application d'hébergement de fichiers - JavaScript

class FileHostApp {
    constructor() {
        this.currentFiles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFiles();
        this.loadStats();
    }

    setupEventListeners() {
        // Upload area events
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        // Click to select files
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        // Modal events
        const modal = document.getElementById('previewModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePreview();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePreview();
            }
        });
    }

    handleFiles(files) {
        if (files.length === 0) return;

        Array.from(files).forEach(file => {
            this.uploadFile(file);
        });
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const progressBar = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        try {
            progressBar.style.display = 'block';
            progressText.textContent = `Upload de ${file.name}...`;

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.showNotification('Fichier uploadé avec succès!', 'success');
                this.loadFiles();
                this.loadStats();
                
                // Reset progress
                setTimeout(() => {
                    progressBar.style.display = 'none';
                    progressFill.style.width = '0%';
                }, 1000);
            } else {
                throw new Error(result.error || 'Erreur lors de l\'upload');
            }
        } catch (error) {
            this.showNotification(`Erreur: ${error.message}`, 'error');
            progressBar.style.display = 'none';
        }
    }

    async loadFiles() {
        try {
            const response = await fetch('/files');
            const files = await response.json();
            
            if (response.ok) {
                this.currentFiles = files;
                this.displayFiles(files);
            } else {
                throw new Error(files.error || 'Erreur lors du chargement des fichiers');
            }
        } catch (error) {
            this.showNotification(`Erreur: ${error.message}`, 'error');
        }
    }

    displayFiles(files) {
        const filesGrid = document.getElementById('filesGrid');
        
        if (files.length === 0) {
            filesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-folder-open" style="font-size: 64px; color: var(--text-secondary); margin-bottom: 20px;"></i>
                    <h3>Aucun fichier</h3>
                    <p style="color: var(--text-secondary);">Uploadez votre premier fichier pour commencer</p>
                </div>
            `;
            return;
        }

        filesGrid.innerHTML = files.map(file => {
            const fileIcon = this.getFileIcon(file.mime_type);
            const uploadDate = new Date(file.upload_date).toLocaleDateString('fr-FR');
            
            return `
                <div class="file-card">
                    <div class="file-header">
                        <div class="file-icon ${fileIcon.category}">
                            <i class="${fileIcon.icon}"></i>
                        </div>
                        <div class="file-info">
                            <h4 title="${file.original_name}">${this.truncateFileName(file.original_name, 25)}</h4>
                        </div>
                    </div>
                    <div class="file-meta">
                        <span>${file.size}</span>
                        <span>${uploadDate}</span>
                    </div>
                    <div class="file-actions">
                        ${this.canPreview(file.mime_type) ? `
                            <button class="btn btn-primary" onclick="app.previewFile('${file.filename}', '${file.original_name}')">
                                <i class="fas fa-eye"></i>
                                Aperçu
                            </button>
                        ` : ''}
                        <button class="btn btn-success" onclick="app.downloadFile('${file.filename}')">
                            <i class="fas fa-download"></i>
                            Télécharger
                        </button>
                        <button class="btn btn-danger" onclick="app.deleteFile('${file.filename}')">
                            <i class="fas fa-trash"></i>
                            Supprimer
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) {
            return { icon: 'fas fa-image', category: 'image' };
        } else if (mimeType.startsWith('video/')) {
            return { icon: 'fas fa-video', category: 'video' };
        } else if (mimeType.startsWith('audio/')) {
            return { icon: 'fas fa-music', category: 'audio' };
        } else if (mimeType.includes('pdf')) {
            return { icon: 'fas fa-file-pdf', category: 'document' };
        } else if (mimeType.includes('word') || mimeType.includes('document')) {
            return { icon: 'fas fa-file-word', category: 'document' };
        } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
            return { icon: 'fas fa-file-excel', category: 'document' };
        } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
            return { icon: 'fas fa-file-powerpoint', category: 'document' };
        } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) {
            return { icon: 'fas fa-file-archive', category: 'archive' };
        } else if (mimeType.startsWith('text/')) {
            return { icon: 'fas fa-file-alt', category: 'document' };
        } else {
            return { icon: 'fas fa-file', category: 'other' };
        }
    }

    canPreview(mimeType) {
        return mimeType.startsWith('image/') || 
               mimeType.startsWith('video/') || 
               mimeType.startsWith('audio/') || 
               mimeType.startsWith('text/') || 
               mimeType.includes('pdf');
    }

    truncateFileName(filename, maxLength) {
        if (filename.length <= maxLength) return filename;
        
        const extension = filename.split('.').pop();
        const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
        const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4) + '...';
        
        return `${truncatedName}.${extension}`;
    }

    async previewFile(filename, originalName) {
        try {
            const modal = document.getElementById('previewModal');
            const title = document.getElementById('previewTitle');
            const content = document.getElementById('previewContent');
            
            title.textContent = originalName;
            content.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';
            
            modal.classList.add('active');
            
            const response = await fetch(`/preview/${filename}`);
            
            if (response.ok) {
                const blob = await response.blob();
                const mimeType = response.headers.get('content-type');
                
                if (mimeType.startsWith('image/')) {
                    const imageUrl = URL.createObjectURL(blob);
                    content.innerHTML = `<img src="${imageUrl}" class="preview-image" alt="${originalName}">`;
                } else if (mimeType.startsWith('video/')) {
                    const videoUrl = URL.createObjectURL(blob);
                    content.innerHTML = `<video src="${videoUrl}" class="preview-video" controls></video>`;
                } else if (mimeType.startsWith('audio/')) {
                    const audioUrl = URL.createObjectURL(blob);
                    content.innerHTML = `<audio src="${audioUrl}" controls style="width: 100%;"></audio>`;
                } else if (mimeType.startsWith('text/')) {
                    const text = await blob.text();
                    content.innerHTML = `<pre class="preview-text">${this.escapeHtml(text)}</pre>`;
                } else if (mimeType.includes('pdf')) {
                    const pdfUrl = URL.createObjectURL(blob);
                    content.innerHTML = `<iframe src="${pdfUrl}" style="width: 100%; height: 500px; border: none;"></iframe>`;
                }
            } else {
                const error = await response.json();
                content.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--danger-color);">
                    <i class="fas fa-exclamation-triangle"></i><br>
                    ${error.error || 'Impossible de prévisualiser ce fichier'}
                </div>`;
            }
        } catch (error) {
            this.showNotification(`Erreur lors de la prévisualisation: ${error.message}`, 'error');
            this.closePreview();
        }
    }

    closePreview() {
        const modal = document.getElementById('previewModal');
        modal.classList.remove('active');
        
        // Clean up object URLs
        const content = document.getElementById('previewContent');
        const media = content.querySelectorAll('img, video, audio, iframe');
        media.forEach(element => {
            if (element.src && element.src.startsWith('blob:')) {
                URL.revokeObjectURL(element.src);
            }
        });
    }

    downloadFile(filename) {
        window.open(`/download/${filename}`, '_blank');
    }

    async deleteFile(filename) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
            return;
        }

        try {
            const response = await fetch(`/delete/${filename}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok) {
                this.showNotification('Fichier supprimé avec succès!', 'success');
                this.loadFiles();
                this.loadStats();
            } else {
                throw new Error(result.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            this.showNotification(`Erreur: ${error.message}`, 'error');
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/stats');
            const stats = await response.json();
            
            if (response.ok) {
                this.displayStats(stats);
            } else {
                throw new Error(stats.error || 'Erreur lors du chargement des statistiques');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    }

    displayStats(stats) {
        // Update header stats
        document.getElementById('totalFiles').textContent = stats.total_files;
        document.getElementById('totalSize').textContent = stats.total_size;
        
        // Update stats tab
        document.getElementById('statsFiles').textContent = stats.total_files;
        document.getElementById('statsSize').textContent = stats.total_size;
        
        // Display file types chart
        const chartContainer = document.getElementById('fileTypesChart');
        if (Object.keys(stats.file_types).length === 0) {
            chartContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucune donnée disponible</p>';
        } else {
            chartContainer.innerHTML = Object.entries(stats.file_types)
                .map(([type, count]) => `
                    <div class="chart-item">
                        <span class="chart-label">${this.formatFileType(type)}</span>
                        <span class="chart-value">${count}</span>
                    </div>
                `).join('');
        }
    }

    formatFileType(type) {
        const typeNames = {
            'image': 'Images',
            'video': 'Vidéos',
            'audio': 'Audio',
            'text': 'Texte',
            'application': 'Applications',
            'Other': 'Autres'
        };
        return typeNames[type] || type;
    }

    filterFiles() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredFiles = this.currentFiles.filter(file => 
            file.original_name.toLowerCase().includes(searchTerm)
        );
        this.displayFiles(filteredFiles);
    }

    refreshFiles() {
        this.loadFiles();
        this.showNotification('Liste des fichiers actualisée', 'info');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        container.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Tab management
function showTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load data if needed
    if (tabName === 'files') {
        app.loadFiles();
    } else if (tabName === 'stats') {
        app.loadStats();
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FileHostApp();
});

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);