import React from 'react'
import { HashRouter as  Router, Routes, Route } from 'react-router-dom'
import LockedHomePage from './pages/LockedHomePage'
import InscriptionPage from './pages/InscriptionPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LockedHomePage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
      </Routes>
    </Router>
  )
}

export default App