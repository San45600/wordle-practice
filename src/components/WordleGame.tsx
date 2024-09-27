"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
import { SettingsDialog } from "./SettingsDialog";
import { ScrollArea } from "./ui/scroll-area";
import { SparklesAnimation } from "./SparklesAnimation";
import { Separator } from "./ui/separator";
import { FaGithub } from "react-icons/fa6";

const buttonClassName = "hover:text-green-500 w-fit";

export function WordleGame() {
  const {
    guessList,
    answer,
    gamePhase,
    maximumRound,
    currentRow,
    hardMode,
    setOpenSettingsDialog,
    setGamePhase,
    initialize,
  } = useGameState();

  const [confirm, setConfirm] = useState(false);
  const [triggerSparkle, setTriggerSparkle] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 64 * currentRow - 336;
    }
  }, [currentRow]);

  useEffect(() => {
    if (!confirm) return;
    setTimeout(() => setConfirm(false), 5000);
  }, [confirm]);

  useEffect(() => {
    if (gamePhase == "won") setTimeout(() => setTriggerSparkle(true), 1500);
  }, [gamePhase]);

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
                    onClick={() => setOpenSettingsDialog(true)}
                  >
                    Settings
                  </button>
                  <div className={"absolute bottom-4 left-6 flex gap-2 items-center text-lg"}>
                    <span>Made by</span>
                    <a
                      href="https://x.com/HoSan45600"
                      className="text-[#A1A1AA] hover:text-white"
                    >
                      San Ho
                    </a>
                    <Separator
                      orientation="vertical"
                      className="h-6 bg-[#A1A1AA]"
                    />
                    <a
                      href="https://github.com/San45600/wordle-practice"
                      target="_blank"
                      className="text-[#A1A1AA] hover:text-white"
                    >
                      <FaGithub size={24} />
                    </a>
                  </div>
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
                <ScrollArea className="flex flex-col max-h-[30rem]">
                  {guessList.map((_, index) => (
                    <WordRow key={index} rowIndex={index} />
                  ))}
                  {answer && <WordRow rowIndex={-1} word={answer} />}
                </ScrollArea>
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

              {hardMode && (
                <div className="fixed top-[65px] left-32 h-8 flex justify-center items-center uppercase text-red-500">
                  Hard
                </div>
              )}

              <div
                ref={scrollAreaRef}
                className="flex flex-col max-h-[26rem] overflow-scroll"
              >
                {guessList.map((_, index) => (
                  <WordRow key={index} rowIndex={index} />
                ))}
              </div>
              <SparklesAnimation
                isTriggered={triggerSparkle}
                className="absolute w-full flex items-end justify-start"
                direction="top-left"
              />
              <SparklesAnimation
                isTriggered={triggerSparkle}
                className="absolute w-full flex items-end justify-end"
                direction="top-right"
              />
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
      <ResultDialog
        callback={() => {
          setTriggerSparkle(false);
        }}
      />
      <SettingsDialog />
    </>
  );
}
