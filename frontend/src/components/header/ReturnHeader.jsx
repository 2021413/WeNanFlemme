import React from "react"
import '../../styles/ReturnHeader.css'
import { Link } from "react-router-dom"

function ReturnHeader(){
    return(
        <div className="Header">
            <Link to="/" className="Connexion-button">
                <img src="<../../../static/icons/chevron-left.svg" className="Chevron"/>
                <p className="Return">Retour</p>
            </Link>
        </div>
    )
}

export default ReturnHeader