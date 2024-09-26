import { create } from "zustand";
import { persist } from "zustand/middleware";

type GamePhaseType = "preGame" | "inProgress" | "lost" | "won" | "initializing";

interface GameState {
  maximumRound: number;
  answer: string;
  guessList: string[];
  currentGuess: string;
  currentRow: number;
  resultHistory: Record<number, string[]>;
  gamePhase: GamePhaseType;
  openResultDialog: boolean;
  openSettingsDialog: boolean;
  wordList: string[];

  presentedLetter: string[];
  hitLetter: string[];
  missLetter: string[];

  pushPresentedLetter: (val: string) => void;
  pushHitLetter: (val: string) => void;
  pushMissLetter: (val: string) => void;

  setMaximumRound: (val: number) => void;
  setAnswer: (val: string) => void;
  setGuessList: (val: string) => void;
  setCurrentGuess: (val: string) => void;
  setCurrentRow: (val: number) => void;
  setGamePhase: (val: GamePhaseType) => void;
  setOpenResultDialog: (val: boolean) => void;
  setOpenSettingsDialog: (val: boolean) => void;
  setWordList: (val: string[]) => void;

  initialize: (rows: number) => void;
  handleEnter: () => void;
}

export const useGameState = create<GameState>()((set, get) => ({
  maximumRound: 6,
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
  wordList: ["apple", "brain", "flame", "crown", "light"], // Example word list

  pushPresentedLetter: (val) =>
    set(({ presentedLetter }) => ({
      presentedLetter: [...presentedLetter, val],
    })),
  pushHitLetter: (val) =>
    set(({ hitLetter }) => ({ hitLetter: [...hitLetter, val] })),
  pushMissLetter: (val) =>
    set(({ missLetter }) => ({ missLetter: [...missLetter, val] })),

  setMaximumRound: (val) => {
    set({
      maximumRound: val,
      guessList: Array(val).fill(""),
      answer: "",
      resultHistory: Array(val).fill(Array(5).fill("")),
      currentRow: 0
    });
  },
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
  setWordList: (val) => set({ wordList: val }),

  initialize: (rows) => {
    const { answer, wordList } = get();
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
        presentedLetter: [],
        hitLetter: [],
        missLetter: [],
        answer: newWords[Math.floor(Math.random() * newWords.length)],
      });
    }, 1000);
  },

  // Function to handle events after pressing enter button
  handleEnter: () => {
    set((state) => {
      const { currentGuess, answer } = state;
      if (currentGuess.length !== 5) return state; // Ensure guess is complete

      const newEvaluatedHitLetter = [...state.hitLetter];
      const newEvaluatedPresentedLetter = [...state.presentedLetter];
      const newEvaluatedMissLetter = [...state.missLetter];

      // Create a copy of the answer to track remaining letters
      const remainingLetters = answer.split("");
      const result = Array(5).fill("");

      // First pass: Mark exact matches (hits)
      for (let i = 0; i < currentGuess.length; i++) {
        const guessLetter = currentGuess[i].toLowerCase();
        if (guessLetter === remainingLetters[i]) {
          if (!newEvaluatedHitLetter.includes(guessLetter)) {
            newEvaluatedHitLetter.push(guessLetter);
          }
          result[i] = "Hit";
          remainingLetters[i] = ""; // Mark this letter as used
        }
      }

      // Second pass: Check for presented and miss letters
      for (let i = 0; i < currentGuess.length; i++) {
        const guessLetter = currentGuess[i].toLowerCase();
        if (guessLetter !== answer[i]) {
          const indexInRemaining = remainingLetters.indexOf(guessLetter);
          if (indexInRemaining !== -1) {
            // Letter is present but in wrong position
            if (
              !newEvaluatedPresentedLetter.includes(guessLetter) &&
              !newEvaluatedHitLetter.includes(guessLetter)
            ) {
              newEvaluatedPresentedLetter.push(guessLetter);
            }
            result[i] = "Present";
            remainingLetters[indexInRemaining] = ""; // Mark this letter as used
          } else {
            // Letter is not in the word or all instances have been accounted for
            if (
              !newEvaluatedMissLetter.includes(guessLetter) &&
              !newEvaluatedPresentedLetter.includes(guessLetter) &&
              !newEvaluatedHitLetter.includes(guessLetter)
            ) {
              newEvaluatedMissLetter.push(guessLetter);
            }
          }
        }
      }

      return {
        // ... other state updates ...
        hitLetter: newEvaluatedHitLetter,
        presentedLetter: newEvaluatedPresentedLetter,
        missLetter: newEvaluatedMissLetter,
        currentRow: state.currentRow + 1,
        resultHistory: { ...state.resultHistory, [state.currentRow]: result },
        guessList: state.guessList.map((guess, index) =>
          index === state.currentRow ? currentGuess : guess
        ),
        currentGuess: "", // Reset currentGuess after entering
      };
    });
  },
}));
