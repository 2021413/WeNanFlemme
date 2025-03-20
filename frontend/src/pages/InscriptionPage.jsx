import React, { useState } from "react"
import Header from '../components/header/ReturnHeader'
import '../styles/InscriptionPage.css'

function InscriptionPage(){
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation basique
        if (formData.password !== formData.confirm_password) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de l\'inscription');
            }

            setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            // Réinitialiser le formulaire
            setFormData({
                username: '',
                email: '',
                password: '',
                confirm_password: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

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
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
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
                <p className="Text-switch-To-Indentifier">Vous avez déjà un compte ? <span className="Switch-To-Identifier">S'identifier</span></p>
            </div>
        </div>
    )
}

export default InscriptionPage