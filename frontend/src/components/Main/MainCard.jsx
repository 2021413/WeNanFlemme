import React, { useRef } from "react"
import "../../styles/card.css"

function MainCard() {
    const fileInputRef = useRef(null)

    const handleFileUpload = () => {
        fileInputRef.current.click()
    }

    return(
        <div className="Card">
            <div className="Importation-buttons">
                <button className="File" onClick={handleFileUpload}>
                    <input type="file" className="File-Button" ref={fileInputRef} style={{ display: 'none', }} />
                    <img src="../../static/icons/Plus-icon.svg" className="Importation-buttons-icons"/>
                    <p className="Importation-buttons-text">Ajouter un fichier</p>
                </button>
                <button className="Folder" >
                    <img src="../../static/icons/Folder-icon.svg" className="Importation-buttons-icons"/>
                    <p className="Importation-buttons-text">Ajouter un dossier</p>
                </button>
            </div>
            <p className="Maximum-size">jusqu'à 20Mo</p>
            <form className="Form">
                <div className="form-group">
                    <label htmlFor="titre" className="Titre">Titre</label>
                    <input className="Input-titre" />
                    <div className="Bar"></div>
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="Description">Description</label>
                    <textarea className="Input-description" />
                    <div className="Bar"></div>
                </div>
            </form>
            <div className="Convert-button"><h3 className="Convert-button-text">Obtenir un lien</h3></div>
        </div>
    )
}

export default MainCard