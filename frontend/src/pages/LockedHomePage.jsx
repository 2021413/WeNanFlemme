import React from "react"
import Header from "../components/header/LockedHomePageHeader.jsx"
import LockedHomeMain from "../components/Main/LockedHomeMain.jsx"
import Footer from "../components/footer/footer.jsx"
import '../styles/LockedHomePage.css'

function LockedHomePage() {
    return (
        <div>
            <Header />
            <LockedHomeMain />
            <Footer />
        </div> 
    )
}

export default LockedHomePage