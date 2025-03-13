import React from "react"

function Footer() {
    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100px",
            backgroundColor: "#161616"}}>
            <h1 className="footer-logo">WeNanFlemme</h1>
        </div>
    )
}   

export default Footer