import { NextResponse } from "next/server";
import { updateMultiSettings } from "../../multiSettings";

export async function POST(req: Request) {
  const { newWordList, mode } = await req.json();

  updateMultiSettings({ newWordList, mode });

  return NextResponse.json({
    res: "ok",
  });
}
