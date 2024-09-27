let wordList = ["apple", "brain", "flame", "crown", "light"];

let hardMode = false;

let maximumRound = 6;

export const getSettings = () => {
  return { wordList, hardMode, maximumRound };
};

export const updateSettings = ({
  newWordList,
  mode,
  newMaximumRound,
}: {
  newWordList: string[];
  mode: boolean;
  newMaximumRound: number;
}) => {
  wordList = newWordList;
  hardMode = mode;
  maximumRound = newMaximumRound;
};
