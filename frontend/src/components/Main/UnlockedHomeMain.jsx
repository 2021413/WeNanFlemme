import React from "react"
import MainCard from "./MainCard"
import MainText from "./MainText"

function UnlockedMainCard(){
    return(
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", height: "80vh" }}>
            <MainCard/>
            <MainText/>
        </div>
    )
}

export default UnlockedMainCard