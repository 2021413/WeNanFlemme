import React from "react"
import { Link } from "react-router-dom"

function ConnexionNavBar() {
    return (
        <div className="ConnexionNavBar">
            <Link to="/connexion" className="Connexion-button">
                <p className="Connexion-button-text">Connexion</p>
            </Link>
            <Link to="/inscription" className="Inscription-button">
                <p className="Inscription-button-text">S'inscrire</p>
            </Link>
        </div>
    )
}

export default ConnexionNavBar