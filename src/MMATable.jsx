import React, {useState, useEffect} from "react";
import Fighter from "./Fighter";
import './index.css'

function MMATable(props)
{
    url = 'http://127.0.0.1:8000'
    const[targetFighter, setTargetFighter] = useState(FighterList[0]);
    const[guessCount, setGuessCount] = useState(1);
    const weightClasses = ["Flw", "BW", "FW", "LW", "WW", "MW", "LHW", "HW", "SW", "Flw", "BW"];
    const [guesses, setGuesses] = useState([]);

    const [currGuess, setCurrGuess] = useState("")

    gameOver = false;
    playerWon = false;

    async function searchFighter(fighterName)
    {
        const url = `http://127.0.0.1:8000/fighters/?fighter=${encodeURIComponent(fighterName)}`;
        const fetchPromise = fetch(url);
        
        fetchPromise.then(response =>{
            if (!response.ok)
            {
                throw new Error(`HTTP Error! status: ${response.status}`)
            }
            let jsonPromise = response.json()

            jsonPromise.then( data =>{
                let f = new Fighter(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
                return f;
            });
        });

    }

    async function chooseTarget()
    {
        const url = `http://127.0.0.1:8000/names`;
        const fetchPromise = fetch(url);  
        fetchPromise.then(response =>{
            if (!response.ok)
            {
                throw new Error(`HTTP Error! status: ${response.status}`)
            }
            let jsonPromise = response.json()

            jsonPromise.then( data =>{
                let targetNumb = Math.floor(Math.random()* data.length)
                setTargetFighter(searchFighter(data[targetNumb]))
            });
        });

    }
    useEffect(() =>{
        chooseTarget();
    }, [])
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
    function computeGuess(fighterName)
    {
        if (gameOver)
        {
            return;
        }
        try{
            let tempFighter = searchFighter(fighterName);
            tempFighter.stylesArr = getColors(tempFighter);
            setGuesses([...guesses, tempFighter]);
            setGuessCount(guessCount+1);
            if (guessCount == 11)
            {
                gameOver=true;
            }
        }
        catch (e){
            console.error(e);
        }
        
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