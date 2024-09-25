"use client";

import { useState } from "react";

const wordList = ["apple", "brain", "flame", "crown", "light"]; // Example word list
const maxRounds = 6; // Maximum number of guesses

export function WordleGame() {
  const [answer, setAnswer] = useState<string>(
    wordList[Math.floor(Math.random() * wordList.length)]
  );
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Function to check if the guess is valid and provide feedback
  const evaluateGuess = (guess: string): string[] => {
    const result: string[] = [];

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        result.push("Hit");
      } else if (answer.includes(guess[i])) {
        result.push("Present");
      } else {
        result.push("Miss");
      }
    }

    return result;
  };

  // Handle the form submission (user's guess)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentGuess.length !== 5) {
      setMessage("Please enter a 5-letter word.");
      return;
    }

    if (guesses.length >= maxRounds) {
      setMessage("Game Over! You've used all your attempts.");
      setGameOver(true);
      return;
    }

    const feedback = evaluateGuess(currentGuess.toLowerCase());

    setGuesses([...guesses, currentGuess]);
    setCurrentGuess("");

    // Check if the player has won
    if (currentGuess.toLowerCase() === answer) {
      setMessage("Congratulations! You guessed the word!");
      setGameOver(true);
    } else if (guesses.length + 1 === maxRounds) {
      setMessage(`Game Over! The correct word was: ${answer}`);
      setGameOver(true);
    } else {
      setMessage(feedback.join(", "));
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Wordle Game</h1>

      {!gameOver && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            maxLength={5}
            placeholder="Enter a 5-letter word"
            disabled={gameOver}
            style={{
              padding: "10px",
              fontSize: "16px",
              textTransform: "uppercase",
            }}
          />
          <button
            type="submit"
            style={{ marginLeft: "10px", padding: "10px", fontSize: "16px" }}
          >
            Submit
          </button>
        </form>
      )}

      <div style={{ marginTop: "20px" }}>
        <p>{message}</p>
        <div>
          {guesses.map((guess, index) => (
            <div key={index} style={{ marginTop: "10px" }}>
              <p>{guess.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {gameOver && (
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "10px", marginTop: "20px" }}
        >
          Play Again
        </button>
      )}
    </div>
  );
}
