"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGameState } from "./state/States";
import { LetterSquare } from "./LetterSquare";
import { SparklesAnimation } from "./SparklesAnimation";
import { toast } from "sonner";

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
    originalMaximumRound,
    maximumRound,
    candidates,
    setAnswer,
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

  const fetchAnswer = async () => {
    try {
      const response = await fetch("/api/game/get-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentRow }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch answer");
      }

      const data = await response.json();

      setAnswer(data.answer);
      setTimeout(() => setOpenResultDialog(true), 1500);
    } catch (error) {
      console.error("Error fetching answer:", error);
      toast.error("Failed to get game result. Please try again.");
    }
  };

  useEffect(() => {
    if (currentRow > rowIndex) {
      if (!!resultHistory[rowIndex]) setResult(resultHistory[rowIndex]);
      setFlipped(true);
    } else setFlipped(false);
  }, [currentRow]);

  useEffect(() => {
    if (gamePhase != "inProgress") return;
    if (result.every((result) => result === "Hit")) {
      setGamePhase("won");
      setAnswer(guessList[rowIndex]);
      setTimeout(() => setOpenResultDialog(true), 2500);
    } else if (currentRow >= originalMaximumRound) {
      setGamePhase("lost");
      fetchAnswer();
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
