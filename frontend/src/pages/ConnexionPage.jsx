import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from '../components/header/ReturnHeader'
import '../styles/ConnexionPage.css'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function ConnexionPage(){
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setLoginSuccess(false);

        try {
            // Utiliser axios comme dans SettingPage
            const response = await axios.post(
                'http://localhost:8000/api/auth/login',
                {
                    email: formData.email,
                    password: formData.password
                },
                { withCredentials: true }
            );

            // IMPORTANT: Extraire spécifiquement l'utilisateur, comme dans SettingPage
            // Dans SettingPage: const updatedUser = response.data.user;
            const userData = response.data.user || response.data;
            
            // Stocker le token séparément dans localStorage s'il existe
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }
            
            // Mettre à jour le contexte d'authentification avec UNIQUEMENT les données utilisateur
            // comme dans SettingPage : login(updatedUser);
            login(userData);
            
            // Console log pour déboguer
            console.log('Utilisateur connecté:', userData);
            
            // Indiquer que la connexion a réussi
            setLoginSuccess(true);
            
            // Attendre plus longtemps que le contexte soit mis à jour avant de rediriger (2 secondes)
            setTimeout(() => {
                setLoading(false);
                navigate('/unlocked-home');
            }, 1000);
        } catch (error) {
            setLoading(false);
            console.error('Erreur de connexion:', error);
            const errorMessage = error.response?.data?.error || 'Erreur lors de la connexion';
            setError(errorMessage);
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
                        {loginSuccess && <div style={{color: 'green', marginBottom: '10px'}}>Connexion réussie! Redirection...</div>}
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
                                    disabled={loading || loginSuccess}
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
                                    disabled={loading || loginSuccess}
                                />
                            </li>

                            <input 
                                className="Submit-Button" 
                                type="submit" 
                                value={loading ? "Connexion en cours..." : loginSuccess ? "Connecté!" : "Connexion"} 
                                disabled={loading || loginSuccess}
                            />
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