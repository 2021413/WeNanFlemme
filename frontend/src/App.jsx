import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import LockedHomePage from './pages/LockedHomePage'
import UnlockedHomePage from './pages/UnlockedHomePage'
import InscriptionPage from './pages/InscriptionPage'
import ConnexionPage from './pages/ConnexionPage'
import SettingPage from './pages/SettingPage.jsx'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LockedHomePage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route 
            path="/unlocked-home" 
            element={<PrivateRoute element={<UnlockedHomePage />} />} 
          />
          <Route 
            path='/compte' 
            element={<PrivateRoute element={<SettingPage />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App