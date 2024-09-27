import { updateSettings } from "../../settings";

export async function POST(req: Request) {
  const { newWordList, mode } = await req.json();

  updateSettings({ newWordList, mode });

  return new Response(
    JSON.stringify({
      res: "ok",
    })
  );
}
