import React, { useState } from "react"
import '../../styles/CardFolder.css'

function CardFolder({ refreshTrigger }) {
    const [files, setFiles] = useState([])
    const [activeMenu, setActiveMenu] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [downloadError, setDownloadError] = useState(null)

    // Fonction pour récupérer les fichiers de l'utilisateur
    const fetchUserFiles = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('http://localhost:8000/api/files', {
                credentials: 'include'
            })
            if (response.ok) {
                const data = await response.json()
                setFiles(data.files || [])
            } else {
                setFiles([])
                setError('Erreur lors de la récupération des fichiers')
            }
        } catch (error) {
            setFiles([])
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction pour télécharger un fichier
    const handleDownload = async (fileId) => {
        try {
            setDownloadError(null);
            
            const downloadResponse = await fetch(`http://localhost:8000/api/files/${fileId}/download`, {
                credentials: 'include'
            });
            
            if (downloadResponse.ok) {
                const blob = await downloadResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = files.find(f => f.id === fileId).file_name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } else {
                throw new Error('Erreur lors du téléchargement du fichier');
            }
        } catch (error) {
            setDownloadError(error.message);
        }
    };

    // Fonction pour supprimer un fichier
    const handleDelete = async (fileId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
            try {
                const response = await fetch(`http://localhost:8000/api/files/${fileId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
                if (response.ok) {
                    setFiles(files.filter(f => f.id !== fileId))
                }
            } catch (error) {
            }
        }
    }

    // Charger les fichiers au montage du composant
    React.useEffect(() => {
        fetchUserFiles()
    }, [refreshTrigger])

    return (
        <div className="Files-Container">
            {isLoading ? (
                <p>Chargement...</p>
            ) : error ? (
                <p>Erreur: {error}</p>
            ) : files.length === 0 ? (
                <p>Aucun fichier trouvé</p>
            ) : (
                files.map((file) => (
                    <div 
                        className="Card-Folder" 
                        key={file.id}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="Folder-Info">
                            <h3 className="Folder-Name">
                                {file.file_name}
                            </h3>
                            <p className="Folder-Weight">
                                {file.file_size ? 
                                    `${(file.file_size / (1024 * 1024)).toFixed(2)}Mo` : 
                                    "Taille inconnue"}
                            </p>
                        </div>
                        <div className="Menu-Container">
                            <button 
                                className="Menu-Button"
                                onClick={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                            >
                                •••
                            </button>
                            {activeMenu === file.id && (
                                <div className="Menu-Dropdown">
                                    <button 
                                        className="Menu-Item"
                                        onClick={() => handleDownload(file.id)}
                                    >
                                        Télécharger
                                    </button>
                                    <button 
                                        className="Menu-Item Menu-Item-Delete"
                                        onClick={() => handleDelete(file.id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default CardFolder