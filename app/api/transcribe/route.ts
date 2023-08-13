import { NextResponse, NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { Readable } from "stream";

export async function POST(request: NextRequest) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    console.log({ OPENAI_API_KEY: process.env.OPENAI_API_KEY });

    const openai = new OpenAIApi(configuration);

    const data = await request.formData();

    for (const entry of Array.from(data.entries())) {
        const [key, value] = entry;

        const isFile = typeof value == "object";

        if (isFile) {
            const blob = value as Blob;
            const filename = blob.name;
            const buffer = Buffer.from(await blob.arrayBuffer());
            const stream = Readable.from(buffer);
            (stream as any).path = filename;

            const response = await openai.createTranscription(
                stream as any,
                "whisper-1",
                undefined,
                "json",
                undefined,
                "bg"
            );

            return NextResponse.json(response.data, { status: 200 });
        }
    }

    return NextResponse.json({ message: "Cannot transcribe audio" }, { status: 400 });
}
