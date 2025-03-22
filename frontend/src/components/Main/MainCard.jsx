import React, { useRef, useState } from "react"
import "../../styles/card.css"
import CardFolder from "./CardFolder"

function MainCard() {
    const fileInputRef = useRef(null)
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isHistoryVisible, setIsHistoryVisible] = useState(false)

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

    const handleSubmit = async () => {
        if (!file) {
            alert("Veuillez sélectionner un fichier")
            return
        }
        if (!title.trim()) {
            alert("Veuillez ajouter un titre")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("title", title)
        formData.append("description", description)

        try {
            const response = await fetch("http://localhost:8000/api/files/upload", {
                method: "POST",
                credentials: 'include',
                body: formData,
            })

            if (response.ok) {
                const data = await response.json()
                alert("Fichier uploadé avec succès!")
                // Reset form
                setFile(null)
                setTitle("")
                setDescription("")
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
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
        <div className="Card">
            <div className="Left-side">
                <div className="Importation-buttons">
                    <button className="File" onClick={handleFileUpload} disabled={isUploading}>
                        <input 
                            type="file" 
                            className="File-Button" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange}
                        />
                        <img src="../../static/icons/Plus-icon.svg" className="Importation-buttons-icons"/>
                        <p className="Importation-buttons-text">
                            {file ? file.name : "Ajouter un fichier"}
                        </p>
                    </button>
                    <button className="Folder" disabled={isUploading}>
                        <img src="../../static/icons/Folder-icon.svg" className="Importation-buttons-icons"/>
                        <p className="Importation-buttons-text">Ajouter un dossier</p>
                    </button>
                </div>
                <p className="Maximum-size">jusqu'à 20Mo</p>
                <form className="Form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="titre" className="Titre">Titre</label>
                        <input 
                            className="Input-titre"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isUploading}
                        />
                        <div className="Bar"></div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="Description">Description</label>
                        <textarea 
                            className="Input-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isUploading}
                        />
                        <div className="Bar"></div>
                    </div>
                </form>
                <button 
                    className="Convert-button" 
                    onClick={handleSubmit}
                    disabled={isUploading}
                >
                    <h3 className="Convert-button-text">
                        {isUploading ? "Upload en cours..." : "Obtenir un lien"}
                    </h3>
                </button>
            </div>
            <div className="Right-side">
                <div className={`History ${isHistoryVisible ? 'visible' : ''}`}>
                    <h1 className="Mes-Fichiers">Mes fichiers</h1>
                    <CardFolder />
                </div>
                <img className="chevron" src="../../static/icons/chevron-right.svg" onClick={toggleHistoryVisibility} />
            </div>
        </div>
    )
}

export default MainCard