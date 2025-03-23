import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "../../styles/ConnectedHeader.css"

function ConnectedHeader() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                logout();
                navigate('/');
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }

    const handleSettings = () => {
        navigate('/compte');
        setIsOpen(false); // Fermer le menu après navigation
    }

    return (
        <div className="Header-bar">
            <div className="WNF-Title">WNF</div>
            <div className="header" onClick={toggleDropdown}>
                <div className="header-title-and-icon">
                    <h1>{user?.email || 'Utilisateur'}</h1>
                    <img src="../../static/icons/chevron-right.svg"/>
                </div>
                <div className={`dropdown ${isOpen ? "open" : ""}`}>
                    <div className="button-container">
                        <div className="separator"></div>
                        <button className="button" onClick={handleSettings}>Paramètres</button>
                        <div className="separator"></div>
                        <button className="button disconnect" onClick={handleLogout}>Se déconnecter</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConnectedHeader 