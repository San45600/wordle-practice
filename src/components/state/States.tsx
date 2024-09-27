import { create } from "zustand";
import { persist } from "zustand/middleware";

type GamePhaseType = "preGame" | "inProgress" | "lost" | "won" | "initializing";
type ResultType = "Hit" | "Present" | "Miss";

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
  hardMode: boolean;
  candidates: string[];

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
  setHardMode: (val: boolean) => void;
  setCandidates: (val: string[]) => void;

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
  hardMode: false,
  candidates: [],

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
      currentRow: 0,
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
  setHardMode: (val) => set({ hardMode: val }),
  setCandidates: (val) => set({ candidates: val }),

  initialize: (rows) => {
    set({
      gamePhase: "initializing",
    });

    setTimeout(() => {
      set({
        guessList: Array(rows).fill(""),
        answer: "",
        candidates: get().wordList,
        currentGuess: "",
        gamePhase: "inProgress",
        currentRow: 0,
        presentedLetter: [],
        hitLetter: [],
        missLetter: [],
      });
    }, 1000);
  },

  // Function to handle events after pressing enter button
  handleEnter: () => {
    const { currentGuess, candidates, currentRow, answer, wordList } = get();
    if (currentGuess.length !== 5) return; // Ensure guess is complete

    const generateResult = (guess: string, target: string): ResultType[] => {
      const result: ResultType[] = Array(5).fill("Miss");
      const remainingLetters = target.split("");

      // First pass: Mark exact matches (hits)
      for (let i = 0; i < 5; i++) {
        if (guess[i] === remainingLetters[i]) {
          result[i] = "Hit";
          remainingLetters[i] = "";
        }
      }

      // Second pass: Check for presented letters
      for (let i = 0; i < 5; i++) {
        if (result[i] !== "Hit") {
          const index = remainingLetters.indexOf(guess[i]);
          if (index !== -1) {
            result[i] = "Present";
            remainingLetters[index] = "";
          }
        }
      }

      return result;
    };

    const calculateScore = (result: ResultType[]): number => {
      const hitCount = result.filter((f) => f === "Hit").length;
      const presentCount = result.filter((f) => f === "Present").length;
      return hitCount * 2 + presentCount;
    };

    let newCandidates = [...candidates];
    let selectedResult: { candidate: string; result: ResultType[] };

    if (answer) {
      // Normal Wordle behavior
      selectedResult = {
        candidate: answer,
        result: generateResult(currentGuess, answer),
      };
      newCandidates = [answer];
    } else {
      // Host cheating behavior
      let results = candidates.map((candidate) => ({
        candidate,
        result: generateResult(currentGuess, candidate),
      }));

      // Find the feedback with the lowest score
      const lowestScore = Math.min(
        ...results.map((f) => calculateScore(f.result))
      );
      const lowestScoreResults = results.filter(
        (f) => calculateScore(f.result) === lowestScore
      );

      // Randomly select one of the lowest score feedbacks
      selectedResult =
        lowestScoreResults[
          Math.floor(Math.random() * lowestScoreResults.length)
        ];

      // Filter candidates based on the selected result
      newCandidates = candidates.filter(
        (candidate) =>
          JSON.stringify(generateResult(currentGuess, candidate)) ===
          JSON.stringify(selectedResult.result)
      );

      // Check if we need to set an answer
      if (newCandidates.length <= 100 && wordList.length >= 500) {
        const randomAnswer =
          newCandidates[Math.floor(Math.random() * newCandidates.length)];
        set({ answer: randomAnswer });
      } else if (newCandidates.length == 1) {
        set({ answer: newCandidates[0] });
      }
    }

    set((state) => {
      const newHitLetter = [...state.hitLetter];
      const newPresentedLetter = [...state.presentedLetter];
      const newMissLetter = [...state.missLetter];

      currentGuess.split("").forEach((letter, i) => {
        if (
          selectedResult.result[i] === "Hit" &&
          !newHitLetter.includes(letter)
        ) {
          newHitLetter.push(letter);
        } else if (
          selectedResult.result[i] === "Present" &&
          !newPresentedLetter.includes(letter)
        ) {
          newPresentedLetter.push(letter);
        } else if (
          selectedResult.result[i] === "Miss" &&
          !newMissLetter.includes(letter) &&
          !newHitLetter.includes(letter) &&
          !newPresentedLetter.includes(letter)
        ) {
          newMissLetter.push(letter);
        }
      });

      return {
        candidates: newCandidates,
        guessList: state.guessList.map((guess, index) =>
          index === state.currentRow ? currentGuess : guess
        ),
        currentGuess: "",
        currentRow: state.currentRow + 1,
        resultHistory: {
          ...state.resultHistory,
          [currentRow]: selectedResult.result,
        },
        hitLetter: newHitLetter,
        presentedLetter: newPresentedLetter,
        missLetter: newMissLetter,
      };
    });
    console.log(newCandidates);
  },
}));
