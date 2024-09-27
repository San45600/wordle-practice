import { create } from "zustand";
import { persist } from "zustand/middleware";

type GamePhaseType =
  | "preGame"
  | "inProgress"
  | "lost"
  | "1won"
  | "2won"
  | "initializing";

interface GameState {
  answer: string;
  player1GuessList: string[];
  player2GuessList: string[];
  currentGuess: string;
  player1CurrentRow: number;
  player2CurrentRow: number;
  player1ResultHistory: Record<number, string[]>;
  player2ResultHistory: Record<number, string[]>;
  gamePhase: GamePhaseType;
  openResultDialog: boolean;
  openSettingsDialog: boolean;
  wordList: string[];
  hardMode: boolean;
  playerControlling: number;
  isTimerRunning: boolean;
  cardText: string;

  presentedLetter: string[];
  hitLetter: string[];
  missLetter: string[];

  pushPresentedLetter: (val: string) => void;
  pushHitLetter: (val: string) => void;
  pushMissLetter: (val: string) => void;

  setAnswer: (val: string) => void;
  setCurrentGuess: (val: string) => void;
  setCurrentRow: (val: number, player: number) => void;
  setGamePhase: (val: GamePhaseType) => void;
  setOpenResultDialog: (val: boolean) => void;
  setOpenSettingsDialog: (val: boolean) => void;
  setWordList: (val: string[]) => void;
  setHardMode: (val: boolean) => void;
  setPlayerControlling: (val: number) => void;
  setTimerRunning: (val: boolean) => void;
  setCardText: (val: string) => void;

  initialize: () => void;
  handleEnter: () => void;
}

export const useGameState = create<GameState>()((set, get) => ({
  answer: "",
  player1GuessList: Array(2).fill(""),
  player2GuessList: Array(2).fill(""),
  currentGuess: "",
  player1CurrentRow: 0,
  player2CurrentRow: 0,
  player1ResultHistory: {},
  player2ResultHistory: {},
  gamePhase: "preGame",
  openResultDialog: false,
  openSettingsDialog: false,
  presentedLetter: [],
  hitLetter: [],
  missLetter: [],
  wordList: ["apple", "brain", "flame", "crown", "light"], // Example word list
  hardMode: false,
  playerControlling: 1,
  isTimerRunning: false,
  cardText: "",

  pushPresentedLetter: (val) =>
    set(({ presentedLetter }) => ({
      presentedLetter: [...presentedLetter, val],
    })),
  pushHitLetter: (val) =>
    set(({ hitLetter }) => ({ hitLetter: [...hitLetter, val] })),
  pushMissLetter: (val) =>
    set(({ missLetter }) => ({ missLetter: [...missLetter, val] })),

  setAnswer: (val) => set({ answer: val }),
  setCurrentGuess: (val) => {
    if (val == "")
      set(({ currentGuess }) => ({ currentGuess: currentGuess.slice(0, -1) }));
    else set(({ currentGuess }) => ({ currentGuess: currentGuess + val }));
  },
  setCurrentRow: (val, player) => {
    set({ [`player${player}CurrentRow`]: val });
  },
  setGamePhase: (val) => set({ gamePhase: val }),
  setOpenResultDialog: (val) => set({ openResultDialog: val }),
  setOpenSettingsDialog: (val) => set({ openSettingsDialog: val }),
  setWordList: (val) => set({ wordList: val }),
  setHardMode: (val) => set({ hardMode: val }),
  setPlayerControlling: (val) => set({ playerControlling: val }),
  setTimerRunning: (val) => set({ isTimerRunning: val }),
  setCardText: (val) => set({ cardText: val }),

  initialize: () => {
    const { answer, wordList } = get();
    const newWords = wordList.filter((word) => word !== (answer ?? ""));

    set({
      gamePhase: "initializing",
    });

    setTimeout(() => {
      set({
        player1GuessList: Array(2).fill(""),
        player2GuessList: Array(2).fill(""),
        currentGuess: "",
        gamePhase: "inProgress",
        player1CurrentRow: 0,
        player2CurrentRow: 0,
        playerControlling: 1,
        isTimerRunning: false,
        cardText: "Ready?",

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

      const playerRow =
        state.playerControlling == 1
          ? "player1CurrentRow"
          : "player2CurrentRow";
      const playerResultHistory =
        state.playerControlling == 1
          ? "player1ResultHistory"
          : "player2ResultHistory";
      const playerGuessList =
        state.playerControlling == 1 ? "player1GuessList" : "player2GuessList";

      const playerRowValue = state[playerRow];

      let newGuessList = state[playerGuessList].map((guess, index) =>
        index === state[playerRow] ? currentGuess : guess
      );

      newGuessList.push(""); // Add an empty string to increase the length by 1

      return {
        // ... other state updates ...
        hitLetter: newEvaluatedHitLetter,
        presentedLetter: newEvaluatedPresentedLetter,
        missLetter: newEvaluatedMissLetter,
        [playerRow]: state[playerRow] + 1,
        [playerResultHistory]: {
          ...state[playerResultHistory],
          [playerRowValue]: result,
        },
        [playerGuessList]: newGuessList,
        currentGuess: "", // Reset currentGuess after entering
        playerControlling: state.playerControlling == 1 ? 2 : 1,
      };
    });
  },
}));
