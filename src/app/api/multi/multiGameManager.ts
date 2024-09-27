import { getMultiSettings } from "./multiSettings";

let answer = "";

let hitLetter: string[] = [];
let presentedLetter: string[] = [];
let missLetter: string[] = [];
let candidates: string[] = []

export const getMultiGameData = () => {
  return { answer, hitLetter, presentedLetter, missLetter, candidates };
};

export const updateMultiAnswer = (ans: string) => {
  answer = ans
}

export const updateMultiCandidates = (val: string[]) => {
  candidates = val
}

export const multiInitialize = () => {
  const { wordList } = getMultiSettings()
  candidates = wordList
  answer = ""
  hitLetter = [];
  presentedLetter = [];
  missLetter = [];
};
