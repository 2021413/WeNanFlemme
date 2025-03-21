import React from "react"
import { Link } from "react-router-dom"
import Header from '../components/header/ReturnHeader'
import '../styles/ConnexionPage.css'

function ConnexionPage(){
    return(
        <div>
            <Header/>
            <div className="Main-Indentifier">
                <h1 className="Main-Title">WeNanFlemme</h1>
                <div className="Subtitle">
                    <h2 className="Welcome-Title">De retour WeNanFlemme !</h2>
                    <p className="Inustructions">Connectez-vous et continuez à envoyer et recevoir des fichiers</p>
                </div>
                <div className="Form">
                    <form>
                        <ul>
                            <li>
                                <input 
                                    className="Text-Input" 
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                    placeholder="Pseudo ou email"
                                    required
                                />
                            </li>

                            <li>
                                <input 
                                    className="Password-Input" 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="Mot de passe"
                                    required
                                />
                            </li>

                            <input className="Submit-Button" type="submit" value="Inscription" />
                        </ul>
                    </form>
                </div>
                <p className="Text-switch-To-Indentifier">Vous avez déjà un compte ? <span><Link className="Switch-To-Identifier" to="/inscription">S'inscrire</Link></span></p>
            </div>
        </div>
    )
}

export default ConnexionPage