import React, { useRef, useState } from "react"
import "../../styles/card.css"
import CardFolder from "./CardFolder"
import JSZip from 'jszip';

function MainCard() {
    const fileInputRef = useRef(null)
    const folderInputRef = useRef(null)
    const [file, setFile] = useState(null)
    const [folder, setFolder] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isHistoryVisible, setIsHistoryVisible] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleFileUpload = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        if (selectedFile && selectedFile.size <= 20 * 1024 * 1024) { // 20Mo max
            setFile(selectedFile)
        } else {
            alert("Le fichier est trop volumineux. La taille maximale est de 20Mo.")
        }
    }

    const handleFolderClick = () => {
        folderInputRef.current.click();
    };

    const handleFolderUpload = async (event) => {
        const selectedFolder = event.target.files;
        const folderPath = selectedFolder[0].webkitRelativePath;
        const folderName = folderPath.split('/')[0];
        setFolder({ files: selectedFolder, name: folderName });
    }

    const handleSubmit = async () => {
        if (!file && !folder) {
            alert("Veuillez sélectionner un fichier ou un dossier")
            return
        }
        if (!title.trim()) {
            alert("Veuillez ajouter un titre")
            return
        }

        setIsUploading(true)
        const formData = new FormData()

        try {
            if (folder) {
                const zip = new JSZip();
                
                for (let i = 0; i < folder.files.length; i++) {
                    const file = folder.files[i];
                    zip.file(file.name, file);
                }
                
                const zipContent = await zip.generateAsync({type: "blob"});
                formData.append('file', zipContent, 'folder.zip');
            } else {
                formData.append("file", file)
            }

            formData.append("title", title)
            formData.append("description", description)

            const response = await fetch("http://localhost:8000/api/files/upload", {
                method: "POST",
                credentials: 'include',
                body: formData,
            })

            if (response.ok) {
                alert(folder ? "Dossier uploadé avec succès!" : "Fichier uploadé avec succès!")
                setFile(null)
                setFolder(null)
                setTitle("")
                setDescription("")
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
                if (folderInputRef.current) {
                    folderInputRef.current.value = ""
                }
                setRefreshTrigger(prev => prev + 1)
            } else {
                throw new Error("Erreur lors de l'upload")
            }
        } catch (error) {
            alert("Erreur lors de l'upload: " + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    const toggleHistoryVisibility = () => {
        setIsHistoryVisible(!isHistoryVisible)
    }

    return(
        <div className="main-card">
            <div className="main-card__left-side">
                <div className="main-card__import-buttons">
                    <button className="main-card__file-button" onClick={handleFileUpload} disabled={isUploading}>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange}
                        />
                        <img src="../../static/icons/Plus-icon.svg" className="main-card__button-icon"/>
                        <p className="main-card__button-text">
                            {file ? file.name : "Ajouter un fichier"}
                        </p>
                    </button>
                    <button className="main-card__folder-button" onClick={handleFolderClick} disabled={isUploading}>
                        <input 
                            type="file"
                            ref={folderInputRef}
                            webkitdirectory="true"
                            directory="true"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFolderUpload}
                        />
                        <img src="../../static/icons/Folder-icon.svg" className="main-card__button-icon"/>
                        <p className="main-card__button-text">
                            {folder ? folder.name : "Ajouter un dossier"}
                        </p>
                    </button>
                </div>
                <p className="main-card__max-size">jusqu'à 20Mo</p>
                <form className="main-card__form" onSubmit={(e) => e.preventDefault()}>
                    <div className="main-card__form-group">
                        <label htmlFor="titre" className="main-card__title-label">Titre</label>
                        <input 
                            className="main-card__title-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isUploading}
                        />
                        <div className="main-card__divider"></div>
                    </div>
                    <div className="main-card__form-group">
                        <label htmlFor="description" className="main-card__description-label">Description</label>
                        <textarea 
                            className="main-card__description-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isUploading}
                        />
                        <div className="main-card__divider"></div>
                    </div>
                </form>
                <button 
                    className="main-card__convert-button" 
                    onClick={handleSubmit}
                    disabled={isUploading}
                >
                    <h3 className="main-card__button-text">
                        {isUploading ? "Upload en cours..." : "Obtenir un lien"}
                    </h3>
                </button>
            </div>
            <div className="main-card__right-side">
                <div className={`main-card__history ${isHistoryVisible ? 'main-card__history--visible' : ''}`}>
                    <h1 className="main-card__files-title">Mes fichiers</h1>
                    <CardFolder refreshTrigger={refreshTrigger} />
                </div>
                <img className="main-card__chevron" src="../../static/icons/chevron-right.svg" onClick={toggleHistoryVisibility} />
            </div>
        </div>
    )
}

export default MainCard