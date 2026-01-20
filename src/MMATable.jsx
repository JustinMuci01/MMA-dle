import {useState, useEffect} from "react";
import Fighter from "./Fighter";
import './index.css'

function MMATable(props)
{
    const[targetFighter, setTargetFighter] = useState(null);
    const[guessCount, setGuessCount] = useState(1);
    const weightClasses = ["SW", "Flw", "BW", "FW", "LW", "WW", "MW", "LHW", "HW"];
    const [guesses, setGuesses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [currGuess, setCurrGuess] = useState("");

    const[gameOver, setGameOver] = useState(false);
    const[playerWon, setPlayerWon] = useState(false);

    async function searchFighter(fighterName)
    {
        const url = `http://127.0.0.1:8000/fighters/?fighter=${encodeURIComponent(fighterName)}`;
        const response = await fetch(url);
        
        if (!response.ok)
        {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }
        let jsonResponse = await response.json();

        let f = new Fighter(jsonResponse[0], jsonResponse[1], jsonResponse[2], jsonResponse[3], jsonResponse[4], jsonResponse[5], jsonResponse[6], jsonResponse[7], jsonResponse[8]);
        return f;


    }

    async function chooseTarget()
    {
        const url = `http://127.0.0.1:8000/names`;
        const response = await fetch(url);  
        if (!response.ok)
        {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }
        let jsonResponse = await response.json();

        console.log("JSON RESPONSE RECEIVED ON NAMES:");
        console.log(jsonResponse);
        let targetNumb = Math.floor(Math.random()* jsonResponse.length);

        const fighter = await searchFighter(jsonResponse[targetNumb]);

        console.log("TARGET FIGHTER: ", fighter);
        setTargetFighter(fighter);
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

        setPlayerWon(true);
        if (fighter.country === targetFighter.country)
        {
            styles.push("-correct");
        }
        else
        {
            styles.push("");  
            setPlayerWon(false);
        }

        if (fighter.weightClass === targetFighter.weightClass)
        {
            styles.push("-correct");
        }
        else if (Math.abs(weightClasses.indexOf(fighter.weightClass) - weightClasses.indexOf(targetFighter.weightClass)) < 2)
        {
            styles.push("-close");   
            setPlayerWon(false);
        }
        else
        {
            styles.push("");    
            setPlayerWon(false);
        }

        if (fighter.ranking === targetFighter.ranking)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.ranking - targetFighter.ranking) <=3)
        {
            styles.push("-close"); 
            setPlayerWon(false); 
        }
        else
        {
            styles.push("");    
            setPlayerWon(false);  
        }

        if (fighter.wins === targetFighter.wins)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.wins - targetFighter.wins) <=3)
        {
            styles.push("-close");   
            setPlayerWon(false);   
        }
        else
        {
            styles.push("");
            setPlayerWon(false);
        }

        if (fighter.losses === targetFighter.losses)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.losses - targetFighter.losses) <=3)
        {
            styles.push("-close"); 
            setPlayerWon(false);  
        }
        else
        {
            styles.push("");    
            setPlayerWon(false);  
        }

        if (fighter.draws === targetFighter.draws)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.draws - targetFighter.draws) <=3)
        {
            styles.push("-close");    
            setPlayerWon(false);
        }
        else
        {
            styles.push("");    
            setPlayerWon(false);  
        }

        console.log(styles);
        return styles
    }
    async function computeGuess(fighterName)
    {
        if (gameOver)
        {
            return;
        }
        if (guesses.some((g)=>g.tempFighter.name === fighterName))
        {
            return;
        }
        try{
            setIsLoading(true);
            let tempFighter = await searchFighter(fighterName);
            const stylesArr = getColors(tempFighter);
            console.log("TEMP = ", tempFighter);
            setGuessCount(prev => {
                if (prev + 1 >= 11) setGameOver(true);
                return prev + 1;
            });

            let object = {tempFighter, stylesArr};
            setGuesses([object, ...guesses]);

            setIsLoading(false);
        }
        catch (e){
            console.error(e);
        }
        
    }

    return(
        <>
        <link rel="icon" href="../img/gloves.png" type = "image"/>
        <title>MMA-DLE</title>
        
        <h1>MMA-DLE</h1>
        <div className = "headerBar">
        <input type="text" onChange = {handleInputChange}className = "searchBar" placeholder="Type a guess here..."/>
        <button onClick = {() => computeGuess(currGuess)}> Guess </button>
        <p className = "sideText">Guess {guessCount} of 10 </p>
        </div>
        <ul>
            {!isLoading && guesses != null && guesses.map((f) =>(
                <li key = {f.tempFighter.name}>
                <div className = "fighterCard"> 
                
                <div className = "topRow">
                <div className = 'column'>
                    <p className = 'subtext'> Fighting out of:</p>
                    <div className = {`countryName${f.stylesArr[0]}`}> {f.tempFighter.country}</div>
                </div>

                <div className = 'column'>
                    <img src = {f.tempFighter.pic} loading ="lazy" alt="pic" className = "fighterImg"/>
                </div>

                <div className = 'column'>
                    <p className = 'subtext'> Weight Class:</p>
                    <div className = {`fighterInfo${f.stylesArr[1]}`}> {f.tempFighter.weightClass}</div>
                    <p className = 'ranking-text'> Ranking:</p>
                    <div className = {`fighterInfo${f.stylesArr[2]}`}> { (f.tempFighter.ranking===0 ? 'C' : '#' + f.tempFighter.ranking)}</div>
                </div>
                </div>
                <p className = 'fighter-name'> {f.tempFighter.name}</p>
                <div className = "bottomRow">
                <div className = {`fighterInfo${f.stylesArr[3]}`}> {f.tempFighter.wins}</div>
                <div className = 'dash'>-</div>
                <div className = {`fighterInfo${f.stylesArr[4]}`}> {f.tempFighter.losses}</div>
                <div className = 'dash'>-</div>
                <div className = {`fighterInfo${f.stylesArr[5]}`}> {f.tempFighter.draws}</div>
                </div>
                </div>
                </li>
            ))} 

        </ul>     
        </>
    );
}

export default MMATable;