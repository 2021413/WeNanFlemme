import React from "react"
import '../../styles/CardFolder.css'

function CardFolder(){
    return(
        <div className="Card-Folder">
            <div className="Folder-Info">
                <h3 className="Folder-Name">Nom du fichier</h3>
                <p className="Folder-Weight">18Mo</p>
            </div>
            <img src="../../static/icons/more.svg" />
        </div>
    )
}

export default CardFolder