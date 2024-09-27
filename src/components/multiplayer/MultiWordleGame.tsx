"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaGithub } from "react-icons/fa6";
import { MdMenu } from "react-icons/md";
import { toast } from "sonner";
import { SparklesAnimation } from "../SparklesAnimation";
import { Card } from "../ui/card";
import { useMultiGameState } from "../state/useMultiGameState";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MultiWordRow } from "./MultiWordRow";
import { Timer } from "./Timer";
import { MultiKeyboard } from "./MultiKeyboard";
import { MultiResultDialog } from "./MultiResultDialog";
import { MultiSettingsDialog } from "./MultiSettingsDialog";

const buttonClassName = "hover:text-green-500 w-fit";

export function MultiWordleGame() {
  const {
    player1GuessList,
    player2GuessList,
    player1CurrentRow,
    player2CurrentRow,
    playerControlling,
    answer,
    gamePhase,
    isTimerRunning,
    cardText,
    originalHardMode,
    setAnswer,
    setCardText,
    setTimerRunning,
    setOpenSettingsDialog,
    setOpenResultDialog,
    setGamePhase,
    initialize,
  } = useMultiGameState();

  const [confirm, setConfirm] = useState(false);
  const [triggerSparkle, setTriggerSparkle] = useState(false);
  const player1ScrollAreaRef = useRef<HTMLDivElement>(null);
  const player2ScrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (player1ScrollAreaRef.current) {
      player1ScrollAreaRef.current.scrollTop = 64 * player1CurrentRow - 336;
    }
  }, [player1CurrentRow]);

  useEffect(() => {
    if (player2ScrollAreaRef.current) {
      player2ScrollAreaRef.current.scrollTop = 64 * player2CurrentRow - 336;
    }
  }, [player2CurrentRow]);

  useEffect(() => {
    if (!confirm) return;
    setTimeout(() => setConfirm(false), 5000);
  }, [confirm]);

  useEffect(() => {
    if (gamePhase == "1won" || gamePhase == "2won")
      setTimeout(() => setTriggerSparkle(true), 1500);
    if (gamePhase == "inProgress") {
      setTimeout(() => setCardText("3"), 2000);
      setTimeout(() => setCardText("2"), 3000);
      setTimeout(() => setCardText("1"), 4000);
      setTimeout(() => setCardText("Go!"), 5000);
      setTimeout(() => setTimerRunning(true), 5250);
    }
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
                <h1 className="text-6xl ">Wordle Time Attack!</h1>

                <div className="mt-8 flex flex-col gap-4 text-3xl">
                  <button
                    className={buttonClassName}
                    onClick={() => {
                      initialize();
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
                  <div
                    className={
                      "absolute bottom-4 left-6 flex gap-2 items-center text-lg"
                    }
                  >
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
                <div className="flex gap-2">
                  <ScrollArea className="flex flex-col max-h-[30rem]">
                    {player1GuessList.map((_, index) => (
                      <MultiWordRow key={index} player={1} rowIndex={index} />
                    ))}
                  </ScrollArea>
                  <ScrollArea className="flex flex-col max-h-[30rem]">
                    {player2GuessList.map((_, index) => (
                      <MultiWordRow key={index} player={2} rowIndex={index} />
                    ))}
                  </ScrollArea>
                </div>
                {answer && (
                  <MultiWordRow rowIndex={-1} player={1} word={answer} />
                )}
              </motion.div>
            </>
          )}
          {gamePhase != "preGame" && gamePhase != "initializing" && (
            <motion.div
              key={"game"}
              className="absolute w-full flex flex-col h-full justify-around items-center "
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

              {originalHardMode && (
                <div className="fixed top-[65px] left-32 h-8 flex justify-center items-center uppercase text-red-500">
                  Hard
                </div>
              )}

              <div className="absolute pointer-events-none w-full h-full flex justify-center items-start pt-8">
                <Timer
                  isRunning={isTimerRunning}
                  onTimeUp={async () => {
                    setGamePhase("lost");
                    setCardText("")
                    toast("Time's up!");
                    setTimerRunning(false);
                    try {
                      const response = await fetch(
                        "/api/multi/game/get-answer"
                      );
                      if (!response.ok)
                        throw new Error("Failed to fetch answer");
                      const data = await response.json();
                      setAnswer(data.answer);
                    } catch (error) {
                      console.error("Error fetching answer:", error);
                    }
                    setTimeout(() => {
                      setOpenResultDialog(true);
                    }, 2000);
                  }}
                  duration={60}
                />
              </div>

              <AnimatePresence>
                {!isTimerRunning && !!cardText && (
                  <motion.div
                    key={"ready"}
                    className="absolute w-full h-full flex justify-center items-center"
                    exit={{ y: 2000 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="w-[60%] h-[40%] flex justify-center items-center z-20 border-2 border-white text-7xl">
                      {cardText}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-evenly w-full h-full pt-12">
                <div className="flex flex-col gap-2 items-center">
                  {playerControlling == 1 && gamePhase == "inProgress" ? (
                    <div className="text-2xl">{"Player1's turn!"}</div>
                  ) : (
                    <div className="h-8" /> // placeholder
                  )}
                  <div
                    ref={player1ScrollAreaRef}
                    className="flex flex-col max-h-[26rem] overflow-scroll"
                  >
                    {player1GuessList.map((_, index) => (
                      <MultiWordRow key={index} player={1} rowIndex={index} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  {playerControlling == 2 && gamePhase == "inProgress" ? (
                    <div className="text-2xl">{"Player2's turn!"}</div>
                  ) : (
                    <div className="h-8" /> // placeholder
                  )}

                  <div
                    ref={player2ScrollAreaRef}
                    className="flex flex-col max-h-[26rem] overflow-scroll"
                  >
                    {player2GuessList.map((_, index) => (
                      <MultiWordRow key={index} player={2} rowIndex={index} />
                    ))}
                  </div>
                </div>
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
              <MultiKeyboard disabled={!isTimerRunning} />
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
      <MultiResultDialog
        callback={() => {
          setTriggerSparkle(false);
        }}
      />
      <MultiSettingsDialog />
    </>
  );
}
