import React from "react"
import Header from '../components/header/ReturnHeader'
import '../styles/InscriptionPage.css'

function InscriptionPage(){
    return(
        <div >
            <Header/>
            <div className="Main-Indentifier" i>
                <h1 className="Main-Title">WeNanFlemme</h1>
                <div className="Subtitle">
                    <h2 className="Welcome-Title">Bienvenue sur WeNanFlemme</h2>
                    <p className="Inustructions">Inscrivez vous et commencez à envoyer et recevoir des fichiers</p>
                </div>
                <div className="Form">
                    <form action="Indentification">
                        <ul>

                            <li>
                                <input className="Text-Input" type="text" name="user_name" id="user_name" placeholder="Search.." />
                            </li>

                            <li>
                                <input className="Text-Input" type="text" name="name" id="name" placeholder="Search.." />
                            </li>

                            <li>
                                <input className="Password-Input" type="password" name="password" id="password" placeholder="Search.." />
                            </li>

                            <li>
                                <input className="Password-Input" type="password" name="CPassword" id="CPassword" placeholder="Search.." />
                            </li>

                            <input className="Submit-Button" type="submit" value="Inscription" />

                        </ul>
                    </form>
                </div>
                <p className="Text-switch-To-Indentifier">Vous avez déjà un compte ? <span className="Switch-To-Identifier">S'identifier</span></p>
            </div>
        </div>
    )
}

export default InscriptionPage