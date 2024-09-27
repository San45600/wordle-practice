import { NextResponse } from "next/server";
import { getMultiGameData, updateMultiAnswer, updateMultiCandidates } from "../../multiGameManager";
import { getMultiSettings } from "../../multiSettings";

type ResultType = "Hit" | "Present" | "Miss";

export async function POST(req: Request) {
  try {
    const { guess } = await req.json();
    const { answer, hitLetter, presentedLetter, missLetter, candidates } =
      getMultiGameData();
    const { hardMode, wordList } = getMultiSettings();

    // Validate the guess
    if (guess.length !== 5) {
      return NextResponse.json(
        { error: "Not enough letters!" },
        { status: 400 }
      );
    }

    // Check if the word is in the word list (for hard mode)
    if (hardMode && !wordList.includes(guess.toLowerCase())) {
      return NextResponse.json({ error: "Word not in list" }, { status: 400 });
    }
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
      // Prioritize Hit count, then Present count
      return hitCount * 100 + presentCount;
    };

    let finalCandidate = [];
      if (candidates.length === 0) {
        finalCandidate = [...wordList]; // Initialize candidates with the full word list
      } else {
        finalCandidate = candidates;
      }

    let newCandidates = [...finalCandidate];
    let selectedResult: { candidate: string; result: ResultType[] };

    if (answer) {
      // Normal Wordle behavior
      selectedResult = {
        candidate: answer,
        result: generateResult(guess, answer),
      };
      newCandidates = [answer];
    } else {
      // Host cheating behavior
      let results = finalCandidate.map((candidate) => ({
        candidate,
        result: generateResult(guess, candidate),
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
      newCandidates = finalCandidate.filter(
        (candidate) =>
          JSON.stringify(generateResult(guess, candidate)) ===
          JSON.stringify(selectedResult.result)
      );

      // Check if we need to set an answer
      if (newCandidates.length <= 100 && wordList.length >= 500) {
        const randomAnswer =
          newCandidates[Math.floor(Math.random() * newCandidates.length)];
        updateMultiAnswer(randomAnswer);
      } else if (newCandidates.length == 1) {
        updateMultiAnswer(newCandidates[0]);
      }
    }

    const newHitLetter = [...hitLetter];
    const newPresentedLetter = [...presentedLetter];
    const newMissLetter = [...missLetter];

    guess.split("").forEach((letter: string, i: number) => {
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

    updateMultiCandidates(newCandidates)

    return NextResponse.json({
      hitLetter: newHitLetter,
      presentedLetter: newPresentedLetter,
      missLetter: newMissLetter,
      result: selectedResult.result,
    });
  } catch (error) {
    console.error("Error checking guess:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
