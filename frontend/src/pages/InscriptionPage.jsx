import React from "react"
import Header from '../components/header/ReturnHeader'
import '../styles/InscriptionPage.css'

function InscriptionPage(){
    return(
        <div>
            <Header/>
            <div className="Main-Indentifier">
                <h1 className="Main-Title">WeNanFlemme</h1>
                <div className="Subtitle">
                    <h2 className="Welcome-Title">Bienvenue sur WeNanFlemme</h2>
                    <p className="Inustructions">Inscrivez vous et commencez à envoyer et recevoir des fichiers</p>
                </div>
                <div className="Form">
                    <form action="Indentification">
                        <ul>

                            <li>
                                <input 
                                    className="Text-Input" 
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                    placeholder="Pseudo"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </li>

                            <li>
                                <input 
                                    className="Text-Input" 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </li>

                            <li>
                                <input 
                                    className="Password-Input" 
                                    type="password" 
                                    name="confirm_password" 
                                    id="confirm_password" 
                                    placeholder="Confirmer le mot de passe"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                />
                            </li>

                            <input className="Submit-Button" type="submit" value="Inscription" />
                        </ul>
                    </form>
                </div>
                <p className="Text-switch-To-Indentifier">Vous avez déjà un compte ? <span><Link className="Switch-To-Identifier" to="/connexion">S'identifier</Link></span></p>
            </div>
        </div>
    )
}

export default InscriptionPage