import { getSettings } from "../../settings";
import { getGameData } from "../../gameManager";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentRow } = await req.json();
    const { maximumRound } = getSettings();
    const { answer } = getGameData();

    // Check if the game is over (either max rounds reached or game won)
    const gameOver = currentRow >= maximumRound;

    if (gameOver) {
      return NextResponse.json({
        answer: answer,
      });
    } else {
      return NextResponse.json(
        { error: "Game is not ended yet!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error getting answer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
