import React, {useState, useEffect} from "react";
import { FighterList } from "./fighters";
import './index.css'

function MMATable(props)
{
    const[targetFighter, setTargetFighter] = useState(FighterList[0]);
    const[guessCount, setGuessCount] = useState(0);
    const weightClasses = ["Flw", "BW", "FW", "LW", "WW", "MW", "LHW", "HW", "SW", "Flw", "BW"];
    const [guesses, setGuesses] = useState([]);

    const [currGuess, setCurrGuess] = useState("")

    function handleInputChange(e){
        setCurrGuess(e.target.value);
    }

    function getColors(fighter)
    {
        let styles = [];

        if (fighter.country === targetFighter.country)
        {
            styles.push("-correct");
        }
        else
        {
            styles.push("");    
        }

        if (fighter.weightClass === targetFighter.weightClass)
        {
            styles.push("-correct");
        }
        else if (Math.abs(weightClasses.indexOf([fighter.weightClass]) - weightClasses.indexOf([targetFighter.weightClass])) < 2)
        {
            console.log(`FIGHTER: ${fighter.weightClass}, INDEX: ${weightClasses.indexOf([fighter.weightClass])}`);
            console.log(`FIGHTER: ${targetFighter.weightClass}, INDEX: ${weightClasses.indexOf([targetFighter.weightClass])}`);
            styles.push("-close");    
        }
        else
        {
            styles.push("");    
        }

        if (fighter.ranking === targetFighter.ranking)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.ranking - targetFighter.ranking) <=3)
        {
            styles.push("-close");    
        }
        else
        {
            styles.push("");    
        }

        if (fighter.wins === targetFighter.wins)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.wins - targetFighter.wins) <=3)
        {
            styles.push("-close");    
        }
        else
        {
            styles.push("");
        }

        if (fighter.losses === targetFighter.losses)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.losses - targetFighter.losses) <=3)
        {
            styles.push("-close");    
        }
        else
        {
            styles.push("");    
        }

        if (fighter.draws === targetFighter.draws)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.draws - targetFighter.draws) <=3)
        {
            styles.push("-close");    
        }
        else
        {
            styles.push("");    
        }

        console.log(styles);
        return styles
    }
    function computeGuess(Guess)
    {
        if (guessCount > 9)
        {
            return;
        }
        FighterList.forEach((fighter)=>{
        if (fighter.name === Guess)
        {
            let stylesArr = getColors(fighter);
            let tempFighter = {
                ...fighter,
                stylesArr
            }
            console.log(tempFighter);
            setGuesses([...guesses, tempFighter]);
            setGuessCount(guessCount+1);
        }

        })
    }

    return(
        <>
        <link rel="icon" href="../img/gloves.png" type = "image"/>
        <title>MMA-DLE</title>
        
        <div className = "headerBar">
        <input type="text" onChange = {handleInputChange}className = "searchBar" placeholder="Type a guess here..."/>
        <button onClick = {() => computeGuess(currGuess)}> Guess </button>
        </div>
        <ul>
            {guesses.map((f) =>(
                <li key = {f.name}>
                <div className = "fighterCard"> 
                <div className = "topRow">
                <div className = {`countryName${f.stylesArr[0]}`}> {f.country}</div>
                <img src = {f.picURL} loading ="lazy" alt="" className = "fighterImg"/>
                <div className = "infoBox">
                    <div className = {`fighterInfo${f.stylesArr[1]}`}> {f.weightClass}</div>
                    <div className = {`fighterInfo${f.stylesArr[2]}`}> # {f.ranking}</div>
                </div>
                </div>
                <div className = "bottomRow">
                <div className = {`fighterInfo${f.stylesArr[3]}`}> {f.wins}</div>
                <p></p>
                <div className = {`fighterInfo${f.stylesArr[4]}`}> {f.losses}</div>
                <div className = {`fighterInfo${f.stylesArr[5]}`}> {f.draws}</div>
                </div>
                </div>
                </li>
            ))} 

        </ul>     
        </>
    );
}

export default MMATable;