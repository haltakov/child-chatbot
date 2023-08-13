import { NextResponse, NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export async function POST(request: NextRequest) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const req = await request.json();
    const question = req.question;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant answering to a 5 years old child in Bulgarian." },
            { role: "user", content: question },
        ],
    });

    console.log({ completion });

    return NextResponse.json({ answer: completion.data.choices[0].message?.content });
}
