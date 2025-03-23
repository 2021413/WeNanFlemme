import React from "react"
import LockedMainCard from "./LockedMainCard"
import MainText from "./MainText"
import "../../styles/lockedCard.css"

function LockedHomeMain() {
    return (
        <div className="LockedHomeMain">
            <LockedMainCard/>
            <div className="main-text-wrapper">
                <MainText/>
            </div>
        </div>
    )
}

export default LockedHomeMain