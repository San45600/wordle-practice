"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGameState } from "./state/States";
import { LetterSquare } from "./LetterSquare";
import { SparklesAnimation } from "./SparklesAnimation";

export function WordRow({
  rowIndex,
  player,
  word,
}: {
  rowIndex: number;
  player: number;
  word?: string;
}) {
  const {
    player1GuessList,
    player2GuessList,
    currentGuess,
    playerControlling,
    player1CurrentRow,
    player2CurrentRow,
    gamePhase,
    player1ResultHistory,
    player2ResultHistory,
    setGamePhase,
    setTimerRunning,
    setOpenResultDialog,
    setCardText
  } = useGameState();

  const [flipped, setFlipped] = useState<boolean>(false);
  const [result, setResult] = useState<string[]>(Array(5).fill(""));

  const currentRow = player == 1 ? player1CurrentRow : player2CurrentRow;
  const currentGuessList = player == 1 ? player1GuessList : player2GuessList;


  const displayedGuess = useMemo(() => {
    if (word) return word;
    if (rowIndex < currentRow) {
      return currentGuessList[rowIndex] || "";
    } else if (playerControlling != player) return "";
    else if (rowIndex === currentRow) {
      return currentGuess;
    }
    return "";
  }, [currentGuessList, currentGuess, currentRow, rowIndex]);

  useEffect(() => {
    if (currentRow > rowIndex) {
      const resultHistory =
        player === 1 ? player1ResultHistory : player2ResultHistory;
      if (resultHistory[rowIndex]) {
        setResult(resultHistory[rowIndex]);
      }
      setFlipped(true);
    } else setFlipped(false);
  }, [currentRow]);

  useEffect(() => {
    if (gamePhase !== "inProgress") return;
    
    const resultHistory = player === 1 ? player1ResultHistory : player2ResultHistory;
    
    if (rowIndex === currentRow - 1 && resultHistory[rowIndex]) {
      const currentResult = resultHistory[rowIndex];
      if (currentResult.every((r) => r === "Hit")) {
        setCardText("")
        setTimerRunning(false)
        setGamePhase(player === 1 ? "1won" : "2won");
        setTimeout(() => setOpenResultDialog(true), 2500);
      }
    }
  }, [result]);

  return (
    <motion.div
      className="mt-4 gap-2 flex relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
    >
      {
        <div className=" w-8 flex items-center text-lg font-bold justify-center">
          {word ? "A" : rowIndex + 1}
        </div>
      }
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
