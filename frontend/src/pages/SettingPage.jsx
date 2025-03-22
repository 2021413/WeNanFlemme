import React from "react"
import ReturnHeader from '../components/header/ReturnHeader'
import '../styles/SettingPage.css'

function SettingPage(){
    return(
        <div>
            <ReturnHeader/>
            <div className="Main">
                <div className="Title-Part">
                    <h3 className="User-Name-Title">Username</h3>
                    <h1 className="Main-Title">Profil et sécurité</h1>
                    <div className="Bar"></div>
                </div>

                <div className="Form">
                    <h2 className="Form-Title">Profil</h2>
                    <div className="Form-Part">
                        <input className="Inputs" type="text" value="User-Name"/>
                        <input className="Inputs" type="email" value="User Emal" />
                        <input className="Submit-Input" type="submit" value="Enregistrer les modification" />
                    </div>
                </div>

                <div className="Form">
                    <h2 className="Form-Title">Mot de passe</h2>
                    <div className="Form-Part">
                        <input className="Inputs" type="password" placeholder="Ancien mot de passe" />
                        <input className="Inputs" type="password" placeholder="Nouveau mot de passe" />
                        <input className="Inputs" type="password" placeholder="Confirmer le nouveau mot de passe" />
                        <input id="Last" className="Submit-Input" type="submit" value="Enregistrer les modification" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingPage