import { NextResponse } from "next/server";
import { getMultiSettings } from "../../multiSettings";

export async function GET() {
  const settings = getMultiSettings();

  return NextResponse.json({
    wordlist: settings.wordList,
    hardMode: settings.hardMode,
  });
}
