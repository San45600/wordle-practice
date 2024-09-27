let wordList = ["apple", "brain", "flame", "crown", "light"];

let hardMode = false;

export const getMultiSettings = () => {
  return { wordList, hardMode };
};

export const updateMultiSettings = ({
  newWordList,
  mode,
}: {
  newWordList: string[];
  mode: boolean;
}) => {
  wordList = newWordList;
  hardMode = mode;
};
