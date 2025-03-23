import React, { useState, useEffect } from "react"
import ReturnHeader from '../components/header/ReturnHeader'
import '../styles/SettingPage.css'
import { useAuth } from '../context/AuthContext'
import axios from 'axios';

function SettingPage(){
    const { user, login } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [formErrors, setFormErrors] = useState({ username: false, email: false });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        
        const errors = {
            username: username.trim() === '',
            email: email.trim() === ''
        };
        
        setFormErrors(errors);
        
        if (errors.username || errors.email) {
            setProfileMessage('Tous les champs sont obligatoires');
            return;
        }
        
        setProfileMessage('');
        setShowPasswordConfirm(true);
    };

    const confirmProfileUpdate = async (e) => {
        e.preventDefault();
        
        if (!confirmPassword.trim()) {
            setProfileMessage('Le mot de passe est obligatoire');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await axios.put(
                'http://localhost:8000/api/auth/profile',
                {
                    username,
                    email,
                    password: confirmPassword
                },
                { withCredentials: true }
            );
            
            const updatedUser = response.data.user;
            login(updatedUser);
            setProfileMessage('Profil mis à jour avec succès!');
            setShowPasswordConfirm(false);
            setConfirmPassword('');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            const errorMessage = error.response?.data?.error || 'Erreur lors de la mise à jour du profil';
            setProfileMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        if (!oldPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
            setPasswordMessage('Tous les champs sont obligatoires');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            setPasswordMessage('Les nouveaux mots de passe ne correspondent pas');
            return;
        }
        
        setIsLoading(true);
        
        try {
            await axios.put(
                'http://localhost:8000/api/auth/password',
                {
                    oldPassword,
                    newPassword,
                    confirmNewPassword
                },
                { withCredentials: true }
            );
            
            setPasswordMessage('Mot de passe mis à jour avec succès!');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du mot de passe:', error);
            const errorMessage = error.response?.data?.error || 'Erreur lors de la mise à jour du mot de passe';
            setPasswordMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelProfileUpdate = () => {
        setShowPasswordConfirm(false);
        setConfirmPassword('');
        setProfileMessage('');
    };

    const messageStyle = (isSuccess) => ({
        color: isSuccess ? 'green' : 'red',
        marginBottom: '10px'
    });

    return(
        <div>
            <ReturnHeader/>
            <div className="settings-page">
                <div className="settings-page__header">
                    <h3 className="settings-page__username">{user ? user.username : 'Username'}</h3>
                    <h1 className="settings-page__title">Profil et sécurité</h1>
                    <div className="settings-page__divider"></div>
                </div>

                {!showPasswordConfirm ? (
                    <div className="settings-page__form">
                        <h2 className="settings-page__form-title">Modifier profil</h2>
                        {profileMessage && <p style={messageStyle(profileMessage.includes('succès'))}>{profileMessage}</p>}
                        <form onSubmit={handleProfileSubmit}>
                            <div className="settings-page__form-group">
                                <input 
                                    className="settings-page__input" 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (e.target.value.trim() !== '') {
                                            setFormErrors({...formErrors, username: false});
                                        }
                                    }}
                                    placeholder="Nom d'utilisateur"
                                    style={formErrors.username ? {borderColor: 'red'} : {}}
                                />
                                <input 
                                    className="settings-page__input" 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (e.target.value.trim() !== '') {
                                            setFormErrors({...formErrors, email: false});
                                        }
                                    }}
                                    placeholder="Email" 
                                    style={formErrors.email ? {borderColor: 'red'} : {}}
                                />
                                <input 
                                    className="settings-page__submit-button" 
                                    type="submit" 
                                    value={isLoading ? 'Chargement...' : 'Enregistrer les modifications'} 
                                    disabled={isLoading}
                                />
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="settings-page__form">
                        <h2 className="settings-page__form-title">Confirmer votre mot de passe</h2>
                        {profileMessage && <p style={messageStyle(profileMessage.includes('succès'))}>{profileMessage}</p>}
                        <form onSubmit={confirmProfileUpdate}>
                            <div className="settings-page__form-group">
                                <input 
                                    className="settings-page__input" 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Entrez votre mot de passe pour confirmer" 
                                />
                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                    <button 
                                        onClick={cancelProfileUpdate}
                                        style={{
                                            width: '230px',
                                            height: '55px',
                                            border: 'none',
                                            backgroundColor: '#6b6b6b',
                                            borderRadius: '12px',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
                                        type="button"
                                        disabled={isLoading}
                                    >
                                        Annuler
                                    </button>
                                    <input 
                                        className="settings-page__submit-button" 
                                        type="submit" 
                                        value={isLoading ? 'Chargement...' : 'Confirmer'} 
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                <div className="settings-page__form">
                    <h2 className="settings-page__form-title">Mot de passe</h2>
                    {passwordMessage && <p style={messageStyle(passwordMessage.includes('succès'))}>{passwordMessage}</p>}
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="settings-page__form-group">
                            <input 
                                className="settings-page__input" 
                                type="password" 
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Ancien mot de passe" 
                            />
                            <input 
                                className="settings-page__input" 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nouveau mot de passe" 
                            />
                            <input 
                                className="settings-page__input" 
                                type="password" 
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Confirmer le nouveau mot de passe" 
                            />
                            <input 
                                className="settings-page__submit-button settings-page__submit-button--last" 
                                type="submit" 
                                value={isLoading ? 'Chargement...' : 'Enregistrer les modifications'} 
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SettingPage