import React from "react"

function MainText(){
    return(
        <div>
            <h1 className="Main-title">Passez vos équipes sur WeNanFlemme</h1>
            <div className="Chek-ligns">
                <div className="Check-lign"><img className="Check-img" src="../../static/icons/Check-icon.svg" /><h3 className="Check-text">Collaborez avec les membres de l'équipe</h3></div>
                <div className="Check-lign"><img className="Check-img" src="../../static/icons/Check-icon.svg" /><h3 className="Check-text">Restez cohérent avec l’image de marque utilisé par l’équipe</h3></div>
                <div className="Check-lign"><img className="Check-img" src="../../static/icons/Check-icon.svg" /><h3 className="Check-text">Plus d’espace de stockage pour votre équipe</h3></div>
            </div>
            <div></div>
        </div>
    )
}

export default MainText