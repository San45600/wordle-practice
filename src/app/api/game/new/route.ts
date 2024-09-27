import { NextResponse } from "next/server";
import { getSettings } from "../../settings";
import { initialize } from "../../gameManager";

export async function GET() {
  try {
    const { wordList } = getSettings();

    const newWords = wordList[Math.floor(Math.random() * wordList.length)];

    initialize(newWords);

    return NextResponse.json({ res: "ok" });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
