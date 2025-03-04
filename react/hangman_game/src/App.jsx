import { useState } from 'react'
import {languages} from "./assets/languages.js";
import LanguageChips from "./LanguageChips.jsx";
import clsx from "clsx"
import Key from "./Key.jsx";
import {getFarewellText, getRandomWord} from "./utils.js";
import Confetti from "react-confetti"

function App() {

    const [languageChips,setLanguageChips]= useState(languages)
    const [currentWord, setCurrentWord] = useState(getRandomWord)
    const [guessedLetters, setGuessedLetters] = useState([])

    const wrongGuessCount =
        guessedLetters.filter(letter => !currentWord.includes(letter)).length

    const isGameWon =
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languageChips.length
    const isGameOver = isGameWon || isGameLost
    const lastGuess = guessedLetters[guessedLetters.length-1]
    const isLastGuessIncorrect = lastGuess && !currentWord.includes(lastGuess)

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const wordElements = currentWord.split("")
        .map((letter, index) => {
            const className = clsx("letter", {
                guessed: guessedLetters.includes(letter),
                missed: isGameLost && !guessedLetters.includes(letter)
            })
            return (
                <span key={index} className={className}>
                    {letter.toUpperCase()}
                </span>
            )
        })

    function guess(letter){
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    const keyElements = alphabet.split("")
        .map(key => {
            const isGuessed = guessedLetters.includes(key)
            const isCorrect = currentWord.includes(key)
            const className = clsx({
                correct: isGuessed && isCorrect,
                wrong: isGuessed && !isCorrect
            })
            return (
                <Key onClick={() => guess(key)}
                     value={key.toUpperCase()}
                     className={className}
                     isGameOver={isGameOver}
                     ariaDisabled={guessedLetters.includes(key)}
                />
            )
        })

    const languageChipElements = languageChips.map((chip, index) => {
        const isLanguageLost = index < wrongGuessCount
        return (<LanguageChips
            className={isLanguageLost ? "lost" : ""}
            name={chip.name}
            backgroundColor={chip.backgroundColor}
            color={chip.color}
        />)
    })

    function resetGame(){
        setCurrentWord(getRandomWord())
        setGuessedLetters([])

    }

    const gameStatus = clsx("status",{gameWon: isGameWon, gameLost: isGameLost})

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <h2>{getFarewellText(languages[wrongGuessCount-1].name)}</h2>
            )
        }
        if (isGameWon) {
            return (
                <>
                    <h2>You Won</h2>
                    <p>Well Done</p>
                </>
            )
        }
        if (isGameLost) {
            return (
                <>
                    <h2>You Lost</h2>
                    <p>Try Again</p>
                </>
            )
        }
        return (
            <>
                <h2>Guess a Letter</h2>
            </>
        )
    }

  return (
      <main>
          {
              isGameWon &&
              <Confetti
                  recycle={false}
                  numberOfPieces={1000}
              />
          }
          <header className={"gameHeader"}>
              <h1>Hangman Game</h1>
              <p> Guess the word </p>
          </header>
          <section
              aria-live={"polite"}
              role={"status"}
              className={gameStatus}
          >
              {renderGameStatus()}
          </section>
          <section className={"languages"}>
              {languageChipElements}
          </section>
          <section className={"wordContainer"}>
              {wordElements}
          </section>
          <section
              className="sr-only"
              aria-live="polite"
              role="status"
          >
              <p>
                  {currentWord.includes(lastGuess) ?
                      `Correct! The letter ${lastGuess} is in the word.` :
                      `Sorry, the letter ${lastGuess} is not in the word.`
                  }
                  You have {languageChips.length - wrongGuessCount} attempts left.
              </p>
              <p>Current word: {currentWord.split("").map(letter =>
                  guessedLetters.includes(letter) ? letter + "." : "blank.")
                  .join(" ")}</p>
          </section>
          <section className={"keyboard"}>
              {keyElements}
          </section>
          <button style={{visibility: isGameOver ? "visible" : "hidden"}}
                  className={"newGame"}
                  onClick={resetGame}
          >
              New Game
          </button>
      </main>
  )
}

export default App
