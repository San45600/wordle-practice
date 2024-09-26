import { create } from "zustand";
import { persist } from "zustand/middleware";

// const wordList = ["apple", "brain", "flame", "crown", "light"]; // Example word list
const wordList = ["qqqqq", "wwwww"];

type GamePhaseType = "preGame" | "inProgress" | "lost" | "won" | "initializing";

interface SettingsState {
  maximumRounds: number;

  setMaximumRounds: (val: number) => void;
}

export const useSettingsState = create<SettingsState>()(
  persist(
    (set, get) => ({
      maximumRounds: 6,
      setMaximumRounds: (val) => set({ maximumRounds: val }),
    }),
    {
      name: "settings-storage",
    }
  )
);

interface GameState {
  answer: string;
  guessList: string[];
  currentGuess: string;
  currentRow: number;
  gamePhase: GamePhaseType;
  openResultDialog: boolean;

  setAnswer: (val: string) => void;
  setGuessList: (val: string) => void;
  setCurrentGuess: (val: string) => void;
  setCurrentRow: (val: number) => void;
  setGamePhase: (val: GamePhaseType) => void;
  setOpenResultDialog: (val: boolean) => void;

  initialize: (rows: number) => void;
  handleEnter: () => void;
}

export const useGameState = create<GameState>()((set, get) => ({
  answer: "",
  guessList: Array(6).fill(""),
  currentGuess: "",
  currentRow: 0,
  gamePhase: "preGame",
  openResultDialog: false,

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

  initialize: (rows) => {
    const { answer } = get();
    const newWords = wordList.filter((word) => word !== (answer ?? ""));

    set({
      gamePhase: "initializing",
    });

    setTimeout(() => {
      set({
        guessList: Array(rows).fill(""),
        currentGuess: "",
        gamePhase: "inProgress",
        currentRow: 0,
        answer: newWords[Math.floor(Math.random() * newWords.length)],
      });
    }, 1000);
  },

  // Function to handle events after pressing enter button
  handleEnter: () => {
    const { currentRow, guessList, currentGuess } = get();
    if (currentRow >= guessList.length) return;
    if (currentGuess.length !== 5) return; // Ensure guess is complete
    set((state) => ({
      currentRow: state.currentRow + 1,
      guessList: state.guessList.map((guess, index) =>
        index === currentRow ? currentGuess : guess
      ),
      currentGuess: "", // Reset currentGuess after entering
    }));
  },
}));
