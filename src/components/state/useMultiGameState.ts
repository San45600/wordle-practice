import { toast } from "sonner";
import { create } from "zustand";

type GamePhaseType =
  | "preGame"
  | "inProgress"
  | "lost"
  | "1won"
  | "2won"
  | "initializing";

interface MultiGameState {
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
  playerControlling: number;
  isTimerRunning: boolean;
  cardText: string;
  originalWordList: string[];
  originalHardMode: boolean;

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
  setPlayerControlling: (val: number) => void;
  setTimerRunning: (val: boolean) => void;
  setCardText: (val: string) => void;
  setOriginalWordList: (val: string[]) => void;
  setOriginalHardMode: (val: boolean) => void;

  initialize: () => void;
  handleEnter: () => void;
}

export const useMultiGameState = create<MultiGameState>()((set, get) => ({
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
  playerControlling: 1,
  isTimerRunning: false,
  cardText: "",
  originalWordList: [], // used for recovery when the user clicks cancel.
  originalHardMode: false,

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
  setPlayerControlling: (val) => set({ playerControlling: val }),
  setTimerRunning: (val) => set({ isTimerRunning: val }),
  setCardText: (val) => set({ cardText: val }),
  setOriginalWordList: (val) => set({ originalWordList: val }),
  setOriginalHardMode: (val) => set({ originalHardMode: val }),

  initialize: async () => {
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
        const playerRow =
          state.playerControlling == 1
            ? "player1CurrentRow"
            : "player2CurrentRow";
        const playerResultHistory =
          state.playerControlling == 1
            ? "player1ResultHistory"
            : "player2ResultHistory";
        const playerGuessList =
          state.playerControlling == 1
            ? "player1GuessList"
            : "player2GuessList";

        const playerRowValue = state[playerRow];

        let newGuessList = state[playerGuessList].map((guess, index) =>
          index === state[playerRow] ? currentGuess : guess
        );

        newGuessList.push(""); // Add an empty string to increase the length by 1

        return {
          hitLetter: [...state.hitLetter, ...hitLetter],
          presentedLetter: [...state.presentedLetter, ...presentedLetter],
          missLetter: [...state.missLetter, ...missLetter],
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
    } catch (error) {
      console.error(error);
      toast.error(String((error as Error).message));
    }
  },
}));
