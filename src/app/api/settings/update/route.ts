import { updateSettings } from "../../settings";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { newWordList, mode, newMaximumRound } = await req.json();

  updateSettings({ newWordList, mode, newMaximumRound });

  return NextResponse.json({
    res: "ok",
  });
}
