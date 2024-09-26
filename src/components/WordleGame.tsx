"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WordRow } from "./WordRow";
import { useGameState } from "./state/States";
import { Keyboard } from "./Keyboard";
import { MdMenu } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CgSpinner } from "react-icons/cg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ResultDialog } from "./ResultDialog";

const buttonClassName = "hover:text-green-500 w-fit";

export function WordleGame() {
  const {
    guessList,
    currentGuess,
    answer,
    gamePhase,
    openResultDialog,
    maximumRound,
    setOpenResultDialog,
    setGamePhase,
    currentRow,
    setGuessList,
    setCurrentGuess,
    initialize,
  } = useGameState();

  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!confirm) return;
    setTimeout(() => setConfirm(false), 5000);
  }, [confirm]);

  return (
    <>
      <motion.div className="relative text-white p-12 w-full h-full flex items-center justify-center ">
        <AnimatePresence>
          {gamePhase == "preGame" && (
            <>
              <motion.div
                className="w-full "
                key={"menu"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                }}
              >
                <h1 className="text-6xl " onClick={() => console.log(answer)}>
                  Wordle Game
                </h1>
                <div className="mt-8 flex flex-col gap-4 text-3xl">
                  <button
                    className={buttonClassName}
                    onClick={() => {
                      initialize(maximumRound);
                    }}
                  >
                    Play
                  </button>
                  <button
                    className={buttonClassName}
                    onClick={() => setOpenResultDialog(true)}
                  >
                    Settings
                  </button>
                  <button className={buttonClassName}>GitHub</button>
                </div>
              </motion.div>

              <motion.div
                key={"menugrid"}
                className="w-full justify-center h-fit items-center flex flex-col gap-8 "
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                }}
              >
                <div className="flex flex-col">
                  {guessList.map((_, index) => (
                    <WordRow key={index} rowIndex={index} />
                  ))}
                </div>
              </motion.div>
            </>
          )}
          {gamePhase != "preGame" && gamePhase != "initializing" && (
            <motion.div
              key={"game"}
              className="absolute flex flex-col h-full justify-center items-center "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="fixed top-16 left-20 ">
                    <MdMenu size={32} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      if (!confirm) {
                        e.preventDefault();
                        setConfirm(true);
                      } else {
                        setConfirm(false);
                        setGamePhase("preGame");
                      }
                    }}
                    className={`${
                      confirm ? "text-red-500 hover:text-red-500" : ""
                    }`}
                  >
                    {!confirm ? "Back to menu" : "Are you sure?"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {guessList.map((_, index) => (
                <WordRow key={index} rowIndex={index} />
              ))}
              <Keyboard />
            </motion.div>
          )}
          {gamePhase == "initializing" && (
            <motion.div
              key={"loading"}
              className="absolute flex h-full justify-center items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
              }}
            >
              <CgSpinner className="animate-spin" size={32} /> Loading...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <ResultDialog />
    </>
  );
}
