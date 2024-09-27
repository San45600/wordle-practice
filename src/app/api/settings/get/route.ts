import { getSettings } from "../../settings";

export async function GET() {
  const settings = getSettings();

  return new Response(
    JSON.stringify({
      wordlist: settings.wordList,
      hardMode: settings.hardMode,
    })
  );
}
