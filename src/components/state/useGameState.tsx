import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GamePhaseType = "preGame" | "inProgress" | "lost" | "won" | "initializing";

interface GameState {
  answer: string;
  guessList: string[];
  currentGuess: string;
  currentRow: number;
  resultHistory: Record<number, string[]>;
  gamePhase: GamePhaseType;
  openResultDialog: boolean;
  openSettingsDialog: boolean;
  originalWordList: string[];
  originalHardMode: boolean;
  originalMaximumRound: number;

  presentedLetter: string[];
  hitLetter: string[];
  missLetter: string[];

  pushPresentedLetter: (val: string) => void;
  pushHitLetter: (val: string) => void;
  pushMissLetter: (val: string) => void;

  setAnswer: (val: string) => void;
  setGuessList: (val: string) => void;
  setCurrentGuess: (val: string) => void;
  setCurrentRow: (val: number) => void;
  setGamePhase: (val: GamePhaseType) => void;
  setOpenResultDialog: (val: boolean) => void;
  setOpenSettingsDialog: (val: boolean) => void;
  setOriginalWordList: (val: string[]) => void;
  setOriginalHardMode: (val: boolean) => void;
  setOriginalMaximumRound: (val: number) => void;

  initialize: (rows: number) => void;
  handleEnter: () => void;
}

export const useGameState = create<GameState>()((set, get) => ({
  answer: "",
  guessList: Array(6).fill(""),
  currentGuess: "",
  currentRow: 0,
  resultHistory: Array(6).fill(Array(5).fill("")),
  gamePhase: "preGame",
  openResultDialog: false,
  openSettingsDialog: false,
  presentedLetter: [],
  hitLetter: [],
  missLetter: [],
  originalWordList: [], // used for recovery when the user clicks cancel.
  originalHardMode: false,
  originalMaximumRound: 6,

  pushPresentedLetter: (val) =>
    set(({ presentedLetter }) => ({
      presentedLetter: [...presentedLetter, val],
    })),
  pushHitLetter: (val) =>
    set(({ hitLetter }) => ({ hitLetter: [...hitLetter, val] })),
  pushMissLetter: (val) =>
    set(({ missLetter }) => ({ missLetter: [...missLetter, val] })),


  setAnswer: (val) => set({ answer: val }),
  setGuessList: (val) =>
    set((state) => ({ guessList: [...state.guessList, val] })),
  setCurrentGuess: (val) => {
    if (val == "")
      set(({ currentGuess }) => ({ currentGuess: currentGuess.slice(0, -1) }));
    else set(({ currentGuess }) => ({ currentGuess: currentGuess + val }));
  },
  setCurrentRow: (val) => set({ currentRow: val }),
  setGamePhase: (val) => set({ gamePhase: val }),
  setOpenResultDialog: (val) => set({ openResultDialog: val }),
  setOpenSettingsDialog: (val) => set({ openSettingsDialog: val }),
  setOriginalWordList: (val) => set({ originalWordList: val }),
  setOriginalHardMode: (val) => set({ originalHardMode: val }),
  setOriginalMaximumRound: (val) => {
    set({
      originalMaximumRound: val,
      guessList: Array(val).fill(""),
      answer: "",
      resultHistory: Array(val).fill(Array(5).fill("")),
      currentRow: 0,
    });
  },

  initialize: async (rows) => {
    try {
      set({
        gamePhase: "initializing",
      });
      const response = await fetch("/api/game/new", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to start new game");
      }

      const { res } = await response.json();

      if (res != "ok") {
        throw new Error("Failed to create answer for the game");
      }

      setTimeout(() => {
        set({
          guessList: Array(rows).fill(""),
          currentGuess: "",
          gamePhase: "inProgress",
          currentRow: 0,
          presentedLetter: [],
          hitLetter: [],
          missLetter: [],
        });
      }, 500);
    } catch (error) {
      console.error("Error initializing game:", error);
      toast.error("Error initializing game");
      set({ gamePhase: "preGame" });
    }
  },

  // Function to handle events after pressing enter button
  handleEnter: async () => {
    const { currentGuess } = get();
    try {
      const response = await fetch("/api/game/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess: currentGuess }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const { hitLetter, presentedLetter, missLetter, result } =
        await response.json();

      set((state) => {
        return {
          hitLetter: [...state.hitLetter, ...hitLetter],
          presentedLetter: [...state.presentedLetter, ...presentedLetter],
          missLetter: [...state.missLetter, ...missLetter],
          currentRow: state.currentRow + 1,
          resultHistory: { ...state.resultHistory, [state.currentRow]: result },
          guessList: state.guessList.map((guess, index) =>
            index === state.currentRow ? currentGuess : guess
          ),
          currentGuess: "", // Reset currentGuess after entering
        };
      });
    } catch (error) {
      console.error(error);
      toast.error(String((error as Error).message));
    }
  },
}));
