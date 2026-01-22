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
    const [fetchingStorage, setFetchingStorage] = useState(false);

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

        let targetNumb = Math.floor(Math.random()* jsonResponse.length);

        const fighter = await searchFighter(jsonResponse[targetNumb]);

        console.log("TARGET FIGHTER: ", fighter);
        setTargetFighter(fighter);
    }

    useEffect(() => {
        async function restore(){
            try {
                setFetchingStorage(true);
                const storedGuesses = localStorage.getItem('guesses');
                const storedGuessCount = localStorage.getItem('guessCount');
                const storedGameOver = localStorage.getItem('gameOver');
                const storedTarget = localStorage.getItem('targetFighter');

                console.log("STORED GUESSES " + JSON.parse(storedGuesses));
                console.log("STORED GUESSCOUNT " +Number(storedGuessCount));
                console.log("STORED GAMEOVER " +JSON.parse(storedGameOver));
                console.log("STORED TARGET " +JSON.parse(storedTarget));


                if (JSON.parse(storedGuesses)) {
                    const parsedGuesses = JSON.parse(storedGuesses);
                    if (parsedGuesses.length > 0) {
                        setGuesses(parsedGuesses);                    }
                }
                
                if (Number(storedGuessCount)){
                    setGuessCount(Number(storedGuessCount) || 1);
                }

                if (storedGameOver){
                    setGameOver(storedGameOver ? JSON.parse(storedGameOver) : false);
                }

                if (JSON.parse(storedTarget)) {
                    setTargetFighter(JSON.parse(storedTarget));
                } else {
                    console.log("now in choose");
                    await chooseTarget();
                }

            } catch (e) {
                console.error(e);
                await chooseTarget();
            }
            finally{
                setFetchingStorage(false);
            }
        }

        restore();
    }, []);


    useEffect(() =>{
        localStorage.setItem('guessCount', guessCount);
        localStorage.setItem('guesses', JSON.stringify(guesses));
        localStorage.setItem('gameOver', JSON.stringify(gameOver));
        localStorage.setItem('targetFighter', JSON.stringify(targetFighter));
    }, [guessCount])

    function handleInputChange(e){
        setCurrGuess(e.target.value);
    }

    function isExactMatch(fighter) {
    return (
        fighter.country === targetFighter.country &&
        fighter.weightClass === targetFighter.weightClass &&
        fighter.ranking === targetFighter.ranking &&
        fighter.wins === targetFighter.wins &&
        fighter.losses === targetFighter.losses &&
        fighter.draws === targetFighter.draws
    );
}

    function getColors(fighter)
    {
        let styles = [];

        console.log(targetFighter);
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
        else if (Math.abs(weightClasses.indexOf(fighter.weightClass) - weightClasses.indexOf(targetFighter.weightClass)) < 2)
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
        return styles
    }

    async function computeGuess(fighterName)
    {
        console.log(targetFighter);
        if (gameOver || !targetFighter)
        {
            return;
        }
        if (guesses.some((g)=>g.tempFighter.name === fighterName))
        {
            console.log('Already Guessed');
            return;
        }
        try{
            setIsLoading(true);
            let tempFighter = await searchFighter(fighterName);
            const stylesArr = getColors(tempFighter);
            setPlayerWon(isExactMatch(tempFighter));
            setGameOver(isExactMatch(tempFighter));
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
        {fetchingStorage ? (
        <div className = 'subtext'>Loading...</div>      
        ) : (
        <div className = "headerBar">
        <input type="text" onChange = {handleInputChange}className = "searchBar" placeholder="Type a guess here..."/>
        <button onClick = {() => computeGuess(currGuess)}> Guess </button>
        <p className = "sideText">Guess {guessCount} of 10 </p>
        </div>
        )}
        <ul>
            {!isLoading && guesses != null && guesses.map((f) =>(
                <li key = {f.tempFighter.name}>
                <div className = "fighterCard"> 
                
                <div className = "topRow">
                <div className = 'column'>
                    <p className = 'subtext'> Country of Origin:</p>
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