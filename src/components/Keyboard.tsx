import React from "react";
import { useGameState } from "./state/States";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function Keyboard() {
  const firstRow = "QWERTYUIOP".split("");
  const secondRow = "ASDFGHJKL".split("");
  const thirdRow = "ZXCVBNM".split("");

  const {
    currentGuess,
    gamePhase,
    setGamePhase,
    setCurrentGuess,
    handleEnter,
  } = useGameState();

  const handleClick = (key:string) => {
    if(currentGuess.length >= 5) return
    setCurrentGuess(key.toLowerCase())
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 mt-8">
      {/* First row of keys */}
      <div className="gap-2 flex">
        {firstRow.map((key) => (
          <Button
            size={"icon"}
            key={key}
            disabled={gamePhase != "inProgress"}
            onClick={() => handleClick(key.toLowerCase())}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Second row of keys */}
      <div className="gap-2 flex">
        {secondRow.map((key) => (
          <Button
            size={"icon"}
            key={key}
            disabled={gamePhase != "inProgress"}
            onClick={() => handleClick(key.toLowerCase())}
          >
            {key}
          </Button>
        ))}
      </div>

      {/* Third row of keys */}
      <div className="gap-2 flex">
        {thirdRow.map((key) => (
          <Button
            size={"icon"}
            key={key}
            disabled={gamePhase != "inProgress"}
            onClick={() => handleClick(key.toLowerCase())}
          >
            {key}
          </Button>
        ))}

        {/* Backspace */}
        <Button
          onClick={() => setCurrentGuess("")}
          disabled={gamePhase != "inProgress"}
        >
          ⌫
        </Button>

        {/* Enter */}
        <Button
          onClick={() => {
            if (currentGuess.length !== 5) {
              toast.warning("Not enough letter!");
              console.log(currentGuess)
              return;
            } // Ensure guess is complete
            handleEnter();
          }}
          disabled={gamePhase != "inProgress"}
        >
          Enter
        </Button>
      </div>
    </div>
  );
}
