import {useState, useEffect} from "react";
import { createPortal} from  'react-dom';
import './index.css'
import IsBordering from "./Country";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

function MMATable(props)
{
    //SERVER VARIABLES
    const[targetFighter, setTargetFighter] = useState(null);
    const [allNames, setAllNames] = useState([]);

    //USER VARIABLES
    const[guessCount, setGuessCount] = useState(1);
    const [guesses, setGuesses] = useState([]);
    const [currGuess, setCurrGuess] = useState("");

    //STATE MANAGING VARIABLES
    const[gameOver, setGameOver] = useState(false);
    const[playerWon, setPlayerWon] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingStorage, setFetchingStorage] = useState(false);
    const [query, setQuery] = useState('')
    const [showTutorial, setShowTutorial] = useState(false)

    //USED FOR CALCULATIONS LATER
    const weightClasses = ["SW", "Flw", "BW", "FW", "LW", "WW", "MW", "LHW", "HW"];
    const startDate = new Date(2026, 0, 25, 0, 0, 0, 0);
    let daysPassed=0;
    let idx = [166, 20, 127, 124, 117, 86, 91, 61, 65, 72, 103, 169, 6, 37, 159, 35, 81, 54, 121, 78, 96, 87, 71, 90, 145, 23, 139, 44, 167, 162, 51, 5, 52, 115, 156, 13, 138, 137, 60, 158, 40, 82, 109, 29, 83, 114, 101, 9, 136, 134, 73, 89, 95, 25, 85, 27, 175, 0, 172, 126, 132, 77, 74, 84, 118, 62, 59, 173, 133, 165, 153, 97, 32, 120, 1, 129, 111, 94, 98, 147, 112, 4, 15, 56, 128, 57, 36, 47, 146, 28, 26, 38, 50, 39, 70, 110, 42, 10, 131, 63, 113, 148, 58, 164, 102, 122, 34, 142, 19, 11, 43, 123, 174, 3, 105, 143, 8, 99, 7, 92, 108, 67, 163, 79, 116, 170, 107, 75, 33, 21, 104, 12, 106, 16, 125, 93, 46, 152, 141, 144, 171, 100, 157, 48, 24, 88, 53, 49, 161, 154, 66, 80, 160, 68, 76, 45, 140, 149, 30, 155, 64, 130, 17, 18, 150, 31, 119, 135, 22, 151, 14, 168, 69, 55, 41, 2];

    // LOCAL MACHINE TESTING
    // const baseUrl = 'http://127.0.0.1:8000';

    //DEPLOYED URL
    const baseUrl = 'https://mma-dle.onrender.com';

    //Search for a specified fighter from fighterName string
    async function searchFighter(fighterName)
    {
        const url = `${baseUrl}/fighters/?fighter=${encodeURIComponent(fighterName)}`;
        const response = await fetch(url);
        
        if (!response.ok)
        {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }
        let jsonResponse = await response.json();

        return jsonResponse; //return fighter object (see Fighter.js)
    }

    //Choose a fighter randomly to be the target from list of full names
    async function chooseTarget()
    {
        const url = `${baseUrl}/names`;
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


                //If nothing previously stored, select new user variables
                if (storedTarget && storedTarget != 'null' && storedNames && storedNames != []) {
                    setTargetFighter(JSON.parse(storedTarget));
                    setAllNames(JSON.parse(storedNames));
                } else {
                    console.log("???")
                    await chooseTarget();
                }

                if (storedGuesses && storedGuesses != []) {
                    const parsedGuesses = JSON.parse(storedGuesses);
                    if (parsedGuesses.length > 0) {
                        setGuesses(parsedGuesses);                    
                    }
                }

                if (storedGuessCount && storedGuessCount != 'null'){
                    setGuessCount(Number(storedGuessCount) || 1);
                }

                if (storedGameOver && storedGameOver != 'null'){
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


    //Determine if player has won
    function isExactMatch(fighter) {
        return (
            fighter.Country === targetFighter.Country &&
            fighter.WeightClass === targetFighter.WeightClass &&
            fighter.Ranking === targetFighter.Ranking &&
            fighter.Wins === targetFighter.Wins &&
            fighter.Losses === targetFighter.Losses &&
            fighter.Draws === targetFighter.Draws
        );
    }

    //Determine if fighter has correct or close paramaters to target fighter
    //Store result in "styles" array. correct-> Green, close->yellow, ''->gray
    function getColors(fighter)
    {
        let styles = [];

        if (fighter.Country === targetFighter.Country)
        {
            styles.push("-correct");
        }
        else if (IsBordering(targetFighter.Country, fighter.Country))
        {
            styles.push("-close");  
        }
        else
        {
            styles.push("");
        }

        if (fighter.WeightClass === targetFighter.WeightClass)
        {
            styles.push("-correct");
        }
        else if (Math.abs(weightClasses.indexOf(fighter.WeightClass) - weightClasses.indexOf(targetFighter.WeightClass)) < 2)
        {
            styles.push("-close");   
        }
        else
        {
            styles.push("");
        }

        if (fighter.Ranking === targetFighter.Ranking)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.Ranking - targetFighter.Ranking) <=3)
        {
            styles.push("-close");  
        }
        else
        {
            styles.push("");      
        }

        if (fighter.Wins === targetFighter.Wins)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.Wins - targetFighter.Wins) <=3)
        {
            styles.push("-close");      
        }
        else
        {
            styles.push("");
        }

        if (fighter.Losses === targetFighter.Losses)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.Losses - targetFighter.Losses) <=3)
        {
            styles.push("-close");   
        }
        else
        {
            styles.push("");      
        }

        if (fighter.Draws === targetFighter.Draws)
        {
            styles.push("-correct");
        }
        else if (Math.abs(fighter.Draws - targetFighter.Draws) <=3)
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
        if (gameOver || !targetFighter || !fighterName)
        {
            console.log("invalid guess");
            return;
        }
        if (guesses.some((g)=>g.tempFighter.Name === fighterName))
        {
            console.log('Already Guessed');
            return;
        }
        try{ //Obtain fighter object, compare with target
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

    const filteredNames =  //Get names list for dropdown
        query === ''
        ? []
        : allNames.filter(name =>
              name.toLowerCase().includes(query.toLowerCase())
          );

    return(
        <>  
        <link rel="icon" href="/img/gloves.png" type = "image"/>
        <title>MMA-DLE</title>
        
        <h1>MMA-DLE</h1>
        <p className = 'info-text-bold'> Find out if you are a casual!</p>

        <div className = 'info-text-box'>
            <p className = 'info-text'> Try and guess the mystery ranked UFC fighter *CURRENT FIGHTERS ONLY.</p>
            <img className = "help-img" src="/img/help-127.png" alt="help button" onClick = { () => setShowTutorial(!showTutorial)}/>
        </div>

        <p className = 'info-text'> Game resets daily !</p>

        {showTutorial && createPortal(
        <div className="overlay" onClick={() => setShowTutorial(false)}>
            <div className="tutorial-modal" onClick={(e) => e.stopPropagation()}>
                <div className = "header-button">
                    <h2>How to Play</h2>
                    <button className="close-btn" onClick={() => setShowTutorial(false)}>✕</button>
                </div>

                <div className = "left-box">
                    <p className = "tut-info">Guess any fighter in the dropdown search</p>
                </div>

                <div className = "center-box">
                    <img src="/img/tut1.png" className ="tut-img" alt="" />
                    <img src="/img/tut2.png" className ="tut-img" alt="" />
                </div>

                <div className = "left-box">
                    <p className = "tut-info">*Correct fields will be green.</p>
                    <p className = "tut-info">*Fields that are close (within 3 for W-L-D or ranking, one weight class off, bordering country) will be yellow.</p>
                    <p className = "tut-info">*Incorrect Fields will be gray</p>
                </div>

                <div className = "center-box">
                    <img src="/img/tut3.png" className ="tut-img" alt="" />
                </div>
                <div className = "left-box">
                    <p className = "tut-info-f"> Try and guess the correct fighter in 10 guesses or less! </p>
                </div>

            </div>
        </div>,
        document.body
        )}

        {fetchingStorage ? (
        <div className = 'subtext'>Loading... this may take a while</div>      
        ) : (

        <div className = "headerBar">
        <Combobox value={currGuess} onChange={(name) => {
            setCurrGuess(name);
            setQuery('');
            computeGuess(name);
            }}>

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

        {guessCount >=10 &&
        <p className = "sideText">Guess 10 of 10 </p>
        }
        {guessCount <10 &&
        <p className = "sideText">Guess {guessCount} of 10 </p>
        }
        </div>
        )}
        <ul>
            {!isLoading && guesses != null && guesses.map((f) =>(
                <li key = {f.tempFighter.Name}>
                <div className = "fighterCard"> 
                
                <div className = "topRow">
                <div className = 'column'>
                    <p className = 'subtext'> Country of Origin:</p>
                    <div className = {`countryName${f.stylesArr[0]}`}> {f.tempFighter.Country}</div>
                </div>

                <div className = 'column'>
                    <img src = {f.tempFighter.Pic} loading ="lazy" alt="pic" className = "fighterImg"/>
                </div>

                <div className = 'column'>
                    <p className = 'subtext'> Weight Class:</p>
                    <div className = {`fighterInfo${f.stylesArr[1]}`}> {f.tempFighter.WeightClass}</div>
                    <p className = 'ranking-text'> Ranking:</p>
                    <div className = {`fighterInfo${f.stylesArr[2]}`}> { (f.tempFighter.Ranking===0 ? 'C' : '#' + f.tempFighter.Ranking)}</div>
                </div>
                </div>
                <p className = 'fighter-name'> {f.tempFighter.Name}</p>
                <div className = "bottomRow">
                <div className = {`fighterInfo${f.stylesArr[3]}`}> {f.tempFighter.Wins}</div>
                <div className = 'dash'>-</div>
                <div className = {`fighterInfo${f.stylesArr[4]}`}> {f.tempFighter.Losses}</div>
                <div className = 'dash'>-</div>
                <div className = {`fighterInfo${f.stylesArr[5]}`}> {f.tempFighter.Draws}</div>
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