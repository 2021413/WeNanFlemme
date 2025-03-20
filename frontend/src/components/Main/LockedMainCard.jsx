import React from "react"
import MainCard from "./MainCard"
import ConnexionNavBar from "../header/ConnexionNavBar"
import "../../styles/lockedCard.css"

function LockedMainCard(){
    return(
        <div>
            <MainCard/>
            <div className="Card-Overlay">
                <img className="Lock-img" src="../../static/icons/Lock.svg" />
                <p className="Text-Locked-Card-Overlay">Veuillez creer un compte ou vous connectez pour utiliser WeNanFlemme</p>
                <ConnexionNavBar/>
            </div>
        </div>
    )
}

export default LockedMainCard