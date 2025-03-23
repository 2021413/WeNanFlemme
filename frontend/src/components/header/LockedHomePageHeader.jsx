import React from "react";
import ConnexionNavBar from "./ConnexionNavBar.jsx";

function Header() {
    return (
        <div className="locked-home-page-header">
            <div><h2 className="locked-home-page-header-logo">WNF</h2></div>
            <ConnexionNavBar />
        </div>
    )
}

export default Header;