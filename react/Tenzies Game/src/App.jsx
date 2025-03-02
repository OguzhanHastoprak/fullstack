import './App.css'
import Die from './Die.jsx'
import { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti"

function App() {

    const[dice, setDice] = useState(() => generateAllNewDice())

    let gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)

    function generateAllNewDice(){
        const diceObj = [];
        for(let i=0; i<10 ; i++)
            diceObj.push({
                value: Math.floor(Math.random() * 5 + 1),
                isHeld: false,
                id: i
            })
        return diceObj;
    }

    const diceElements = dice.map((die) => (
        <Die className={die.isHeld ? "held" : null }
             key={die.id}
             id={die.id}
             value={die.value}
             hold={hold}
        />
    ))

    const newGameButton= useRef(null)

    useEffect( () => {
        if(gameWon)
            newGameButton.current.focus()}
        ,[gameWon])

    function roll(){
        setDice(oldDice =>
            oldDice.map(die =>
                die.isHeld ? die : {
                    ...die,
                    value: Math.floor(Math.random()*5+1)
                }
            )
        )
    }

    function newGame(){
        setDice(generateAllNewDice)
    }

    function hold(id){
        setDice(oldDice =>
            oldDice.map(die =>
                id === die.id ? {
                    ...die,
                    isHeld: !die.isHeld
                } : die
            )
        )
    }

    return(
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p> Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="tenzies">Tenzies</h1>
            <p className="tenziesDescription">Match all numbers to win, click to freeze</p>
            <div className= "dieContainer">
                {diceElements}
            </div>
            <button onClick={gameWon ? newGame : roll}
                    id="rollBtn"
                    ref={newGameButton}
            >
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
export default App
