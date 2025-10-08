import React, {useState, useEffect} from "react";
import { FighterList } from "./fighters";
import './index.css'

function MMATable(props)
{
    const[targetFighter, setTargetFighter] = useState(FighterList[0]);
    const[guessCount, setGuessCount] = useState(0);
    const weightClasses = ["Flw", "BW", "FW", "LW", "WW", "MW", "LHW", "HW"];

    return(
        <>
        <head>
            <link rel="icon" href="../img/gloves.png" type = "image"/>
            <title>MMA-DLE</title>
        </head>
        <body>
        
        <div className = "headerBar">
            <input type="text" className = "searchBar" placeholder="Type a guess here..."/>
        </div>
        <div className = "fighterCard"> 
            <div className = "topRow">
            <div className = "fighterInfo"> {targetFighter.country}</div>
            <img loading = "lazy" alt="" className = "fighterImg"/>
            <div className = "fighterInfo"> {targetFighter.weightClass}</div>
            </div>
            <div className = "bottomRow">
            <div className = "fighterInfo"> {targetFighter.wins}</div>
            <div className = "fighterInfo"> {targetFighter.losses}</div>
            <div className = "fighterInfo"> {targetFighter.draws}</div>
            </div>
        </div>   
        </body>       
        </>
    );
}

export default MMATable;