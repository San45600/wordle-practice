import { getSettings } from "./settings";

let answer = "";

let hitLetter: string[] = [];
let presentedLetter: string[] = [];
let missLetter: string[] = [];
let candidates: string[] = []

export const getGameData = () => {
  return { answer, hitLetter, presentedLetter, missLetter, candidates };
};

export const updateAnswer = (ans: string) => {
  answer = ans
}

export const updateCandidates = (val: string[]) => {
  candidates = val
}

export const initialize = () => {
  const { wordList } = getSettings()
  candidates = wordList
  answer = ""
  hitLetter = [];
  presentedLetter = [];
  missLetter = [];
};
