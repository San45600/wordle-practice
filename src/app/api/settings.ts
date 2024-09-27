let wordList = ["apple", "brain", "flame", "crown", "light"];

let hardMode = false;

export const getSettings = () => {
  return { wordList, hardMode };
};

export const updateSettings = ({
  newWordList,
  mode,
}: {
  newWordList: string[];
  mode: boolean;
}) => {
  wordList = newWordList;
  hardMode = mode
};