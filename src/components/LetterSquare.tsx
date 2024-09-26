"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LetterSquare({
  letter,
  result,
  delay,
  flipped,
  forceGreen
}: {
  letter: string;
  result?: string;
  delay: number;
  flipped: boolean
  forceGreen: boolean
}) {
  const color = getColor(result ?? "");

  const squareVariants = {
    flipped: { rotateY: 360, backgroundColor: forceGreen ? "#6ca965" : color },
    unflipped: { rotateY: 0 },
  };

  return (
    <motion.div
      initial="unflipped"
      animate={flipped ? "flipped" : "unflipped"}
      variants={squareVariants}
      transition={{ delay: delay }}
      className={
        "w-12 h-12 border-2 border-gray-400 flex items-center justify-center text-2xl font-bold uppercase"
      }
    >
      {letter}
    </motion.div>
  );
}

const colorMap: { [key: string]: string } = {
  Hit: "#6ca965",
  Present: "#c8b653",
  default: "#18181b",
};
const getColor = (result: string): string => {
  switch (result) {
    case "Hit":
      return "#6ca965";
    case "Present":
      return "#c8b653";
    default:
      return "#787c7f";
  }
};
