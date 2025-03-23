import React from "react"
import '../../styles/ReturnHeader.css'
import { useNavigate } from "react-router-dom"

function ReturnHeader(){
    const navigate = useNavigate();
    
    const handleReturn = () => {
        navigate(-1); // Retourne à la page précédente
    };
    
    return(
        <div className="Header">
            <div onClick={handleReturn} className="Connexion-button">
                <img src="<../../../static/icons/chevron-left.svg" className="Chevron"/>
                <p className="Return">Retour</p>
            </div>
        </div>
    )
}

export default ReturnHeader