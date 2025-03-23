import React, { useState, useEffect } from "react"
import '../../styles/CardFolder.css'

function CardFolder({ refreshTrigger }) {
    const [files, setFiles] = useState([])
    const [activeItem, setActiveItem] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [downloadError, setDownloadError] = useState(null)
    const [copyLinkStatus, setCopyLinkStatus] = useState(null)
    const [showUsernameModal, setShowUsernameModal] = useState(false)
    const [username, setUsername] = useState('')
    const [currentFileId, setCurrentFileId] = useState(null)
    const [usernameError, setUsernameError] = useState(null)
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [sendSuccess, setSendSuccess] = useState(null)

    // Fonction pour récupérer les fichiers de l'utilisateur
    const fetchUserFiles = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('http://localhost:8000/api/files?include_shared=true', {
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
            setDownloadError(null)
            
            const downloadResponse = await fetch(`http://localhost:8000/api/files/${fileId}/download`, {
                credentials: 'include'
            })
            
            if (downloadResponse.ok) {
                const blob = await downloadResponse.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = files.find(f => f.id === fileId).file_name
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                a.remove()
            } else {
                throw new Error('Erreur lors du téléchargement du fichier')
            }
        } catch (error) {
            setDownloadError(error.message)
        }
    }

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
                console.error("Erreur lors de la suppression:", error)
            }
        }
    }

    // Fonction pour copier le lien de téléchargement dans le presse-papier
    const handleCopyLink = async (fileId) => {
        try {
            const downloadUrl = `http://localhost:8000/api/files/${fileId}/download`
            await navigator.clipboard.writeText(downloadUrl)
            setCopyLinkStatus('Lien copié !')
            
            // Réinitialiser le statut après 3 secondes
            setTimeout(() => {
                setCopyLinkStatus(null)
            }, 3000)
        } catch (error) {
            setCopyLinkStatus('Erreur lors de la copie du lien')
        }
    }

    // Charger les fichiers au montage du composant
    useEffect(() => {
        fetchUserFiles()
    }, [refreshTrigger])

    // Fonction pour basculer l'état actif d'un élément
    const toggleActiveItem = (fileId) => {
        setActiveItem(activeItem === fileId ? null : fileId)
        // Réinitialiser le statut de copie lorsqu'on ferme un élément
        if (activeItem === fileId) {
            setCopyLinkStatus(null)
        }
    }

    // Fonction pour ouvrir la modal pour envoyer un fichier à un utilisateur
    const handleSendClick = (fileId) => {
        setCurrentFileId(fileId)
        setShowUsernameModal(true)
        setUsernameError(null)
        setSendSuccess(null)
    }

    // Fonction pour envoyer le fichier à un utilisateur
    const handleSendToUser = async () => {
        if (!username.trim()) return
        
        try {
            setIsCheckingUsername(true)
            
            const response = await fetch(`http://localhost:8000/api/files/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    file_id: currentFileId,
                    username: username
                })
            })
            
            const responseData = await response.json()
            
            if (!response.ok) {
                throw new Error(responseData.error || "Erreur lors de l'envoi du fichier")
            }
            
            // Partage réussi
            setSendSuccess(`Fichier envoyé à ${username} avec succès!`)
            
            // Fermer la modal après 2 secondes
            setTimeout(() => {
                setShowUsernameModal(false)
                setUsername('')
                setCurrentFileId(null)
                setSendSuccess(null)
            }, 2000)
            
        } catch (error) {
            setUsernameError(error.message || "Une erreur s'est produite")
        } finally {
            setIsCheckingUsername(false)
        }
    }

    // Fonction pour gérer l'appui sur la touche Entrée
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && username.trim()) {
            e.preventDefault()
            handleSendToUser()
        }
    }

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
                        className={`Card-Folder ${activeItem === file.id ? 'Card-Folder-Active' : ''}`}
                        key={file.id}
                    >
                        {activeItem !== file.id && (
                            <div className="Folder-Info">
                                <h3 className="Folder-Name">
                                    {file.file_name}
                                    {file.is_shared && <span className="Shared-Badge" title={`Partagé par ${file.shared_by || 'un utilisateur'}`}> (Partagé)</span>}
                                </h3>
                                <p className="Folder-Weight">
                                    {file.file_size ? 
                                        `${(file.file_size / (1024 * 1024)).toFixed(2)}Mo` : 
                                        "Taille inconnue"}
                                </p>
                            </div>
                        )}
                        
                        {activeItem === file.id ? (
                            <div className="Action-Buttons">
                                <button 
                                    className="Close-Button"
                                    onClick={() => toggleActiveItem(file.id)}
                                    title="Fermer"
                                >
                                    &times;
                                </button>
                                <button 
                                    className="Action-Button"
                                    onClick={() => handleDownload(file.id)}
                                    title="Télécharger"
                                >
                                    Télécharger
                                </button>
                                <button 
                                    className="Action-Button"
                                    onClick={() => handleCopyLink(file.id)}
                                    title="Obtenir un lien"
                                >
                                    Obtenir un lien
                                </button>
                                <button 
                                    className="Action-Button Send-Button"
                                    onClick={() => handleSendClick(file.id)}
                                    title="Envoyer à un utilisateur"
                                >
                                    Envoyer
                                </button>
                                <button 
                                    className="Action-Button Delete-Button"
                                    onClick={() => handleDelete(file.id)}
                                    title="Supprimer"
                                >
                                    Supprimer
                                </button>
                                {copyLinkStatus && (
                                    <div className="Copy-Status">{copyLinkStatus}</div>
                                )}
                            </div>
                        ) : (
                            <button 
                                className="Menu-Button"
                                onClick={() => toggleActiveItem(file.id)}
                            >
                                •••
                            </button>
                        )}
                    </div>
                ))
            )}

            {/* Modal pour saisir le nom d'utilisateur */}
            {showUsernameModal && (
                <div className="Username-Modal">
                    <div className="Username-Modal-Content">
                        <div className="Username-Modal-Header">
                            <h3 className="Username-Modal-Title">Envoyer le fichier à un utilisateur</h3>
                            <button 
                                className="Username-Modal-Close" 
                                onClick={() => {
                                    setShowUsernameModal(false)
                                    setUsernameError(null)
                                    setSendSuccess(null)
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="Username-Modal-Body">
                            {sendSuccess ? (
                                <div className="Username-Success">{sendSuccess}</div>
                            ) : (
                                <>
                                    <label htmlFor="username-input" className="Username-Label">Nom d'utilisateur</label>
                                    <input
                                        id="username-input"
                                        type="text"
                                        className={`Username-Input ${usernameError ? 'Username-Input-Error' : ''}`}
                                        placeholder="Entrez le nom d'utilisateur"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                            if (usernameError) setUsernameError(null)
                                        }}
                                        onKeyPress={handleKeyPress}
                                        autoFocus
                                    />
                                    {usernameError && (
                                        <div className="Username-Error">{usernameError}</div>
                                    )}
                                </>
                            )}
                        </div>
                        {!sendSuccess && (
                            <div className="Username-Modal-Buttons">
                                <button 
                                    className="Username-Modal-Cancel" 
                                    onClick={() => {
                                        setShowUsernameModal(false)
                                        setUsernameError(null)
                                    }}
                                >
                                    Annuler
                                </button>
                                <button 
                                    className="Username-Modal-Send" 
                                    onClick={handleSendToUser}
                                    disabled={!username.trim() || isCheckingUsername}
                                >
                                    {isCheckingUsername ? 'Envoi en cours...' : 'Envoyer'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CardFolder