import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel — clear, friendly voice

async function streamToBuffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  const apiKey = process.env.ELEVEN_LABS;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 503 }
    );
  }

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.text || typeof body.text !== "string" || body.text.trim() === "") {
    return NextResponse.json({ error: "Missing text field" }, { status: 400 });
  }

  try {
    const client = new ElevenLabsClient({ apiKey });
    const audioStream = await client.textToSpeech.convert(VOICE_ID, {
      text: body.text,
      model_id: "eleven_turbo_v2",
    });

    const buffer = await streamToBuffer(audioStream);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(buffer.byteLength),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: 500 }
    );
  }
}
