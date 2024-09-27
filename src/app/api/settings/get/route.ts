import { getSettings } from "../../settings";
import { NextResponse } from "next/server";

export async function GET() {
  const settings = getSettings();

  return NextResponse.json({
    wordlist: settings.wordList,
    hardMode: settings.hardMode,
    maximumRound: settings.maximumRound
  });
}
