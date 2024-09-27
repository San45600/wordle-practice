import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMultiGameState } from "../state/useMultiGameState";
import { Button } from "../ui/button";

export function MultiKeyboard({ disabled }: { disabled: boolean }) {
  const firstRow = "QWERTYUIOP".split("");
  const secondRow = "ASDFGHJKL".split("");
  const thirdRow = "ZXCVBNM".split("");

  const {
    currentGuess,
    gamePhase,
    hitLetter,
    presentedLetter,
    missLetter,
    setCurrentGuess,
    handleEnter,
  } = useMultiGameState();

  const currentGuessRef = useRef(currentGuess);

  useEffect(() => {
    currentGuessRef.current = currentGuess;
  }, [currentGuess]);

  const handleKeyPress = (key: string) => {
    if (currentGuessRef.current.length >= 5) return;
    setCurrentGuess(key.toLowerCase());
  };

  const getKeyColor = (key: string) => {
    if (hitLetter.includes(key.toLowerCase())) return "bg-[#6ca965] text-white";
    if (presentedLetter.includes(key.toLowerCase()))
      return "bg-[#c8b653] text-white";
    if (missLetter.includes(key.toLowerCase()))
      return "bg-[#787c7f] text-white";
    return ""; // default color
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gamePhase != "inProgress") return;
      if (disabled) return;
      if (event.key === "Enter") {
        handleEnter();
      } else if (event.key === "Backspace") {
        setCurrentGuess("");
      } else if (/^[a-z]$/i.test(event.key)) {
        // Only allow A-Z
        handleKeyPress(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gamePhase, disabled]);

  return (
    <div className="flex flex-col justify-center items-center gap-2 pb-12">
      {/* First row of keys */}
      <div className="gap-2 flex">
        {firstRow.map((key) => (
          <Button
            size={"icon"}
            key={key}
            className={cn(getKeyColor(key))}
            disabled={gamePhase != "inProgress" || disabled}
            onClick={() => handleKeyPress(key.toLowerCase())}
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
            className={cn(getKeyColor(key))}
            disabled={gamePhase != "inProgress" || disabled}
            onClick={() => handleKeyPress(key.toLowerCase())}
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
            className={cn(getKeyColor(key))}
            disabled={gamePhase != "inProgress" || disabled}
            onClick={() => handleKeyPress(key.toLowerCase())}
          >
            {key}
          </Button>
        ))}

        {/* Backspace */}
        <Button
          onClick={() => setCurrentGuess("")}
          disabled={gamePhase != "inProgress" || disabled}
        >
          ⌫
        </Button>

        {/* Enter */}
        <Button
          onClick={() => {
            handleEnter();
          }}
          disabled={gamePhase != "inProgress" || disabled}
        >
          Enter
        </Button>
      </div>
    </div>
  );
}
