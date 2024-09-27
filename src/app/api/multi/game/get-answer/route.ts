import { NextResponse } from "next/server";
import { getMultiGameData } from "../../multiGameManager";
import { getMultiSettings } from "../../multiSettings";

export async function GET() {
  try {
    const { answer } = getMultiGameData();
    const { wordList } = getMultiSettings();

    let finalAnswer = "";

    if (answer == "") {
      finalAnswer = wordList[Math.floor(Math.random() * wordList.length)];
    } else finalAnswer = answer;
    return NextResponse.json({
      answer: finalAnswer,
    });
  } catch (error) {
    console.error("Error getting answer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
