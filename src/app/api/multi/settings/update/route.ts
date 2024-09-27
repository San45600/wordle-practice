import { NextResponse } from "next/server";
import { updateMultiSettings } from "../../multiSettings";

export async function POST(req: Request) {
  const { newWordList, mode, newMaximumRound } = await req.json();

  updateMultiSettings({ newWordList, mode, newMaximumRound });

  return NextResponse.json({
    res: "ok",
  });
}
