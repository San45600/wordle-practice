import { NextResponse } from "next/server";
import { getSettings } from "../../settings";
import { getGameData, initialize } from "../../gameManager";

export async function POST(req: Request) {
  try {
    const { guess } = await req.json();
    const { answer, hitLetter, presentedLetter, missLetter } = getGameData();
    const { hardMode, wordList } = getSettings();

    if (answer == "") {
      const newWords = wordList[Math.floor(Math.random() * wordList.length)];
      initialize(newWords);
    }

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

    const newEvaluatedHitLetter = [...hitLetter];
    const newEvaluatedPresentedLetter = [...presentedLetter];
    const newEvaluatedMissLetter = [...missLetter];

    // Create a copy of the answer to track remaining letters
    const remainingLetters = answer.split("");
    const result = Array(5).fill("");

    // First pass: Mark exact matches (hits)
    for (let i = 0; i < guess.length; i++) {
      const guessLetter = guess[i].toLowerCase();
      if (guessLetter === remainingLetters[i]) {
        if (!newEvaluatedHitLetter.includes(guessLetter)) {
          newEvaluatedHitLetter.push(guessLetter);
        }
        result[i] = "Hit";
        remainingLetters[i] = ""; // Mark this letter as used
      }
    }

    // Second pass: Check for presented and miss letters
    for (let i = 0; i < guess.length; i++) {
      const guessLetter = guess[i].toLowerCase();
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

    return NextResponse.json({
      hitLetter: newEvaluatedHitLetter,
      presentedLetter: newEvaluatedPresentedLetter,
      missLetter: newEvaluatedMissLetter,
      result,
    });
  } catch (error) {
    console.error("Error checking guess:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
