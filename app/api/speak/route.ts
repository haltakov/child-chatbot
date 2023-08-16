import { getTTS } from "@/lib/tts";
import { NextResponse, NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export async function POST(request: NextRequest) {
    const tts = getTTS({});

    const req = await request.json();
    const text = req.text;

    const audio = await tts.speak(text);

    const response = new NextResponse(audio);
    response.headers.set("Content-Type", "audio/wav");

    return response;
}
