import React from 'react'
import { HashRouter as  Router, Routes, Route } from 'react-router-dom'
import LockedHomePage from './pages/LockedHomePage'
import UnlockedHomePage from './pages/UnlockedHomePage'
import InscriptionPage from './pages/InscriptionPage'
import ConnexionPage from './pages/ConnexionPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LockedHomePage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/let's-transfer" element={<UnlockedHomePage />} />
      </Routes>
    </Router>
  )
}

export default App