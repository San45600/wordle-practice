let answer = "";

let hitLetter: string[] = [];
let presentedLetter: string[] = [];
let missLetter: string[] = [];

export const getGameData = () => {
  return { answer, hitLetter, presentedLetter, missLetter };
};

export const initialize = (ans: string) => {
  answer = ans;
  hitLetter = [];
  presentedLetter = [];
  missLetter = [];
};
