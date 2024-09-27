import { NextResponse } from "next/server";
import { getGameData } from "../../gameManager";

export async function GET() {
  try {
    const { answer } = getGameData();

    return NextResponse.json({
      answer: answer,
    });
  } catch (error) {
    console.error("Error getting answer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
