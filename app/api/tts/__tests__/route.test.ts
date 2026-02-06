import { describe, it, expect, vi, beforeEach } from "vitest";
import { Readable } from "stream";

// Mock the elevenlabs module
vi.mock("elevenlabs", () => {
  const mockConvert = vi.fn();
  return {
    ElevenLabsClient: vi.fn().mockImplementation(() => ({
      textToSpeech: {
        convert: mockConvert,
      },
    })),
    __mockConvert: mockConvert,
  };
});

// Must import after mock setup
import { POST } from "@/app/api/tts/route";
import * as elevenLabsMock from "elevenlabs";

const mockConvert = (elevenLabsMock as unknown as { __mockConvert: ReturnType<typeof vi.fn> }).__mockConvert;

function buildRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/tts", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function createMockAudioStream(): Readable {
  const stream = new Readable();
  stream.push(Buffer.from("fake-mp3-data"));
  stream.push(null);
  return stream;
}

describe("POST /api/tts", () => {
  beforeEach(() => {
    vi.stubEnv("ELEVEN_LABS", "test-api-key");
    mockConvert.mockReset();
    mockConvert.mockResolvedValue(createMockAudioStream());
  });

  it("returns audio/mpeg response on success", async () => {
    const req = buildRequest({ text: "Hello world" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("audio/mpeg");
  });

  it("returns audio body from ElevenLabs", async () => {
    const req = buildRequest({ text: "Hello world" });
    const res = await POST(req);

    const body = await res.arrayBuffer();
    expect(body.byteLength).toBeGreaterThan(0);
  });

  it("calls ElevenLabs convert with the provided text", async () => {
    const req = buildRequest({ text: "Say this" });
    await POST(req);

    expect(mockConvert).toHaveBeenCalledOnce();
    // First arg is voiceId, second is request object with text
    const callArgs = mockConvert.mock.calls[0];
    expect(callArgs[1]).toEqual(
      expect.objectContaining({ text: "Say this" })
    );
  });

  it("returns 400 when text is missing", async () => {
    const req = buildRequest({});
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("returns 400 when text is empty string", async () => {
    const req = buildRequest({ text: "" });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("returns 503 when ELEVEN_LABS key is not set", async () => {
    vi.stubEnv("ELEVEN_LABS", "");
    const req = buildRequest({ text: "Hello" });
    const res = await POST(req);

    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("returns 500 when ElevenLabs API fails", async () => {
    mockConvert.mockRejectedValue(new Error("API failure"));

    const req = buildRequest({ text: "Hello" });
    const res = await POST(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });
});
