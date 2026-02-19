import {useState, useEffect} from "react";
import Fighter from "./Fighter";
import './index.css'
import IsBordering from "./Country";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

function MMATable(props)
{
    const[targetFighter, setTargetFighter] = useState(null);
    const[guessCount, setGuessCount] = useState(1);
    const [allNames, setAllNames] = useState([]);

    const [guesses, setGuesses] = useState([]);

    const [currGuess, setCurrGuess] = useState("");

    const[gameOver, setGameOver] = useState(false);
    const[playerWon, setPlayerWon] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingStorage, setFetchingStorage] = useState(false);

    const [query, setQuery] = useState('')

    const weightClasses = ["SW", "Flw", "BW", "FW", "LW", "WW", "MW", "LHW", "HW"];
    const startDate = new Date(2026, 0, 26, 0, 0, 0, 0);
    let daysPassed=0;
    let idx = [166, 20, 127, 124, 117, 86, 91, 61, 65, 72, 103, 169, 6, 37, 159, 35, 81, 54, 121, 78, 96, 87, 71, 90, 145, 23, 139, 44, 167, 162, 51, 5, 52, 115, 156, 13, 138, 137, 60, 158, 40, 82, 109, 29, 83, 114, 101, 9, 136, 134, 73, 89, 95, 25, 85, 27, 175, 0, 172, 126, 132, 77, 74, 84, 118, 62, 59, 173, 133, 165, 153, 97, 32, 120, 1, 129, 111, 94, 98, 147, 112, 4, 15, 56, 128, 57, 36, 47, 146, 28, 26, 38, 50, 39, 70, 110, 42, 10, 131, 63, 113, 148, 58, 164, 102, 122, 34, 142, 19, 11, 43, 123, 174, 3, 105, 143, 8, 99, 7, 92, 108, 67, 163, 79, 116, 170, 107, 75, 33, 21, 104, 12, 106, 16, 125, 93, 46, 152, 141, 144, 171, 100, 157, 48, 24, 88, 53, 49, 161, 154, 66, 80, 160, 68, 76, 45, 140, 149, 30, 155, 64, 130, 17, 18, 150, 31, 119, 135, 22, 151, 14, 168, 69, 55, 41, 2];

    //Search for a specified fighter
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
        return f; //return fighter object (see Fighter.js)
    }

    //Choose a fighter randomly to be the target
    async function chooseTarget()
    {
        const url = `http://127.0.0.1:8000/names`;
        const response = await fetch(url);  
        if (!response.ok)
        {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }
        let jsonResponse = await response.json();

        setAllNames(jsonResponse);

        const fighter = await searchFighter(jsonResponse[idx[daysPassed % 176]]);

        setTargetFighter(fighter);
    }

    //Check local Storage for stored guesses, choose target if needed
    useEffect(() => {
        async function restore(){
            try {
                setFetchingStorage(true);
                const now = new Date();
                daysPassed = Math.floor((now-startDate)/1000/60/60/24);
                console.log(daysPassed);
                const storedDate = localStorage.getItem('day');

                if (JSON.parse(storedDate)  && JSON.parse(storedDate) != daysPassed)
                {
                    console.log("days dont match " +JSON.parse(storedDate) + " " + daysPassed)
                    localStorage.clear();
                }
                localStorage.setItem('day', daysPassed)
                const storedGuesses = localStorage.getItem('guesses');
                const storedGuessCount = localStorage.getItem('guessCount');
                const storedGameOver = localStorage.getItem('gameOver');
                const storedTarget = localStorage.getItem('targetFighter');
                const storedNames = localStorage.getItem('names');

                console.log("STORED GUESSES " + JSON.parse(storedGuesses));
                console.log("STORED GUESSCOUNT " +Number(storedGuessCount));
                console.log("STORED GAMEOVER " +JSON.parse(storedGameOver));
                console.log("STORED TARGET " +JSON.parse(storedTarget));
                console.log("STORED names " +JSON.parse(storedNames));
                console.log("STORED day " +JSON.parse(storedDate));


                
                if (storedTarget && storedNames) {
                    setTargetFighter(JSON.parse(storedTarget));
                    setAllNames(JSON.parse(storedNames));
                } else {
                    await chooseTarget();
                }

                if (JSON.parse(storedGuesses)) {
                    const parsedGuesses = JSON.parse(storedGuesses);
                    if (parsedGuesses.length > 0) {
                        setGuesses(parsedGuesses);                    
                    }
                }

                if (Number(storedGuessCount)){
                    setGuessCount(Number(storedGuessCount) || 1);
                }

                if (storedGameOver){
                    setGameOver(storedGameOver ? JSON.parse(storedGameOver) : false);
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

    //for each guess, update local storage
    useEffect(() =>{
        localStorage.setItem('guessCount', guessCount);
        localStorage.setItem('guesses', JSON.stringify(guesses));
        localStorage.setItem('gameOver', JSON.stringify(gameOver));
        localStorage.setItem('targetFighter', JSON.stringify(targetFighter));
        localStorage.setItem('names', JSON.stringify(allNames));
    }, [guessCount])

    function handleInputChange(e){
        setCurrGuess(e.target.value);
    }

    //Determine if player has won
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

    //Determine if fighter has correct or close paramaters to target fighter
    function getColors(fighter)
    {
        let styles = [];

        if (fighter.country === targetFighter.country)
        {
            styles.push("-correct");
        }
        else if (IsBordering(targetFighter.country, fighter.country))
        {
            styles.push("-close");  
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

    //If game is not already over, fetch fighter and add to guesses list
    //Checks for duplicate guesses.
    async function computeGuess(fighterName)
    {
        console.log(fighterName);
        if (gameOver || !targetFighter || !fighterName)
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

    const filteredNames = 
        query === ''
        ? []
        : allNames.filter(name =>
              name.toLowerCase().includes(query.toLowerCase())
          );

    return(
        <>  
        <link rel="icon" href="../img/gloves.png" type = "image"/>
        <title>MMA-DLE</title>
        
        <h1>MMA-DLE</h1>
        <p className = 'info-text'> Try and guess the mystery ranked UFC fighter</p>
        <p className = 'info-text'> Game resets daily !</p>

        {fetchingStorage ? (
        <div className = 'subtext'>Loading...</div>      
        ) : (
        <div className = "headerBar">
        <Combobox value={currGuess} onChange={(name) => {
            setCurrGuess(name);
            setQuery('');
            computeGuess(name);
            }}
        >
            <ComboboxInput 
                className = "input-box"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fighter..."
            />
            <ComboboxOptions anchor="bottom" className="search-option">
            {filteredNames.map((person) => (
            <ComboboxOption className = "entry  " key={person} value={person}>
                {person}
            </ComboboxOption>
            ))}
            </ComboboxOptions>
        </Combobox>

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
                <p className = 'subtext'>W - L - D</p>
                </div>
                </li>
            ))} 

        </ul>     
        </>
    );
}

export default MMATable;