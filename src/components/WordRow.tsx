"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    gamePhase,
    resultHistory,
    maximumRound,
    setGamePhase,
    setOpenResultDialog,
  } = useGameState();

  const [flipped, setFlipped] = useState<boolean>(false);
  const [result, setResult] = useState<string[]>(Array(5).fill(""));

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
    if (currentRow > rowIndex) {
      if (!!resultHistory[rowIndex]) setResult(resultHistory[rowIndex]);
      setFlipped(true);
    } else setFlipped(false);
    if (gamePhase != "inProgress") return;
    if (currentRow >= maximumRound) {
      setGamePhase("lost");
      setTimeout(() => setOpenResultDialog(true), 1500);
    }
  }, [currentRow]);

  useEffect(() => {
    if (gamePhase != "inProgress") return;
    if (result.every((result) => result === "Hit")) {
      setGamePhase("won");
      setTimeout(() => setOpenResultDialog(true), 2500);
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
