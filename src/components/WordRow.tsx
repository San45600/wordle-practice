"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGameState } from "./state/States";
import { LetterSquare } from "./LetterSquare";
import { SparklesAnimation } from "./SparklesAnimation";

export function WordRow({
  rowIndex,
  word,
}: {
  rowIndex: number;
  word?: string;
}) {
  const {
    guessList,
    currentGuess,
    currentRow,
    answer,
    gamePhase,
    setGamePhase,
    setOpenResultDialog,
  } = useGameState();

  const [flipped, setFlipped] = useState<boolean>(false);
  const [result, setResult] = useState<string[]>(Array(5).fill(""));
  const [isTriggered, setTriggered] = useState(false);

  const displayedGuess = useMemo(() => {
    if (word) return word;
    if (rowIndex < currentRow) {
      return guessList[rowIndex] || "";
    } else if (rowIndex === currentRow) {
      return currentGuess;
    }
    return "";
  }, [guessList, currentGuess, currentRow, rowIndex]);

  useEffect(() => {
    if (!displayedGuess) return;
    const processingResult: string[] = Array(5).fill("");

    for (let i = 0; i < 5; i++) {
      if (displayedGuess[i] === answer[i]) {
        processingResult[i] = "Hit";
      } else if (answer.includes(displayedGuess[i])) {
        processingResult[i] = "Present";
      } else {
        processingResult[i] = "Miss";
      }
    }
    setResult(processingResult);
  }, [displayedGuess]);

  useEffect(() => {
    if (currentRow > rowIndex) setFlipped(true);
    if (gamePhase != "inProgress") return;
    if (result.every((result) => result === "Hit")) {
      setGamePhase("won");
      setTimeout(() => setTriggered(true), 1500);
      setTimeout(() => setOpenResultDialog(true), 2500);
    }
  }, [currentRow]);

  return (
    <motion.div
      className="mt-4 gap-2 flex relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => console.log(gamePhase)}
      transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
    >
      <SparklesAnimation
        isTriggered={isTriggered}
        className="absolute w-full flex items-end h-full justify-start"
        direction="top-left"
      />
      <SparklesAnimation
        isTriggered={isTriggered}
        className="absolute w-full flex items-end h-full justify-end"
        direction="top-right"
      />
      {result.map((val, index) => (
        <LetterSquare
          key={index}
          letter={displayedGuess[index] || ""}
          result={result[index]}
          delay={0.25 * index}
          flipped={flipped}
          forceGreen={!!word}
        />
      ))}
    </motion.div>
  );
}
