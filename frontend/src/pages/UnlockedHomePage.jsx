import React from "react"
import CustomHeader from "../components/header/ConnectedHeader.jsx"
import UnlockedHomeMain from "../components/Main/UnlockedHomeMain.jsx"
import Footer from "../components/footer/footer.jsx"

function UnlockedHomePage(){
    return(
        <div>
            <CustomHeader />
            <UnlockedHomeMain />
            <Footer />
        </div>
    )
}

export default UnlockedHomePage