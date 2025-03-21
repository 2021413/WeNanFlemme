import React, { useState } from "react"
import "../../styles/ConnectedHeader.css"

function ConnectedHeader() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="Header-bar">
            <div className="WNF-Title">WNF</div>
            <div className="header" onClick={toggleDropdown}>
                <div className="header-title-and-icon">
                    <h1>adreesse@mail.com</h1>
                    <img src="../../static/icons/chevron-right.svg"/>
                </div>
                <div className={`dropdown ${isOpen ? "open" : ""}`}>
                    <div className="button-container">
                        <div className="separator"></div>
                        <button className="button">Paramètres</button>
                        <div className="separator"></div>
                        <button className="button disconnect">Se déconnecter</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConnectedHeader 