"use client";

import { useMultiGameState } from "../state/useMultiGameState";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { MultiWordRow } from "./MultiWordRow";


export function MultiResultDialog({ callback }: { callback: () => void }) {
  const {
    answer,
    openResultDialog,
    gamePhase,
    player1CurrentRow,
    player2CurrentRow,
    setOpenResultDialog,
    setGamePhase,
    initialize,
  } = useMultiGameState();

  return (
    <Dialog open={openResultDialog} onOpenChange={setOpenResultDialog}>
      <DialogContent className="h-96 flex flex-col items-center justify-evenly">
        <div className="text-4xl">
          {gamePhase == "1won" ? "player1 won!" : gamePhase == "2won" ? "player2 won!" : "Time's up!"}
        </div>
        <div>The answer:</div>
        <MultiWordRow rowIndex={-1} word={answer} player={0} />
         <div>Number of tries: {player1CurrentRow + player2CurrentRow}</div>
        <div className="flex flex-col gap-4">
          <Button
            className="w-64"
            onClick={() => {
              setOpenResultDialog(false);
              initialize();
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
