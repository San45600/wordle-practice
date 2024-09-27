import { NextResponse } from "next/server";
import { multiInitialize } from "../../multiGameManager";

export async function GET() {
  try {
    multiInitialize();

    return NextResponse.json({ res: "ok" });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
