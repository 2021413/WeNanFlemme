import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from '../components/header/ReturnHeader'
import '../styles/ConnexionPage.css'

function ConnexionPage(){
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la connexion');
            }

            navigate('/unlocked-home');
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
                    <p className="Inustructions">Connectez-vous pour accéder à vos fichiers</p>
                </div>
                <div className="Form">
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        <ul>
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
                                    autoComplete="email"
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
                                    autoComplete="current-password"
                                />
                            </li>

                            <input className="Submit-Button" type="submit" value="Connexion" />
                        </ul>
                    </form>
                </div>
                <p className="Text-switch">
                    Vous n'avez pas de compte ? {' '}
                    <span className="Switch-wrapper">
                        <Link className="Switch-link" to="/inscription">
                            S'inscrire
                        </Link>
                    </span>
                </p>
            </div>
        </div>
    )
}

export default ConnexionPage