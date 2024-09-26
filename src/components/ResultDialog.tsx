"use client";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useGameState } from "./state/States";
import { WordRow } from "./WordRow";

export function ResultDialog({ callback }: { callback: () => void }) {
  const {
    answer,
    openResultDialog,
    maximumRound,
    currentRow,
    gamePhase,
    setOpenResultDialog,
    setGamePhase,
    initialize,
  } = useGameState();

  return (
    <Dialog open={openResultDialog} onOpenChange={setOpenResultDialog}>
      <DialogContent className="h-96 flex flex-col items-center justify-evenly">
        <div className="text-4xl">
          {gamePhase == "won" ? "Congratulations!" : "Better luck next time!"}
        </div>
        <div>{gamePhase == "won" ? "You guessed:" : "The answer:"}</div>
        <WordRow rowIndex={-1} word={answer} />
        {gamePhase == "won" && <div>Number of tries: {currentRow}</div>}
        <div className="flex flex-col gap-4">
          <Button
            className="w-64"
            onClick={() => {
              setOpenResultDialog(false);
              initialize(maximumRound);
              callback();
            }}
          >
            Play another round!
          </Button>
          <Button
            className="w-64"
            variant={"secondary"}
            onClick={() => {
              setOpenResultDialog(false);
              setGamePhase("preGame");
              callback();
            }}
          >
            Back to menu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
