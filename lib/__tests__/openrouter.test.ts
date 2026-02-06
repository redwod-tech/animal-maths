import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { callOpenRouter } from "@/lib/openrouter";

const MOCK_RESPONSE = {
  choices: [{ message: { content: "response text" } }],
};

describe("callOpenRouter", () => {
  const originalEnv = process.env.OPENROUTER_API_KEY;

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(MOCK_RESPONSE),
      })
    );
  });

  afterEach(() => {
    process.env.OPENROUTER_API_KEY = originalEnv;
    vi.restoreAllMocks();
  });

  it("sends correct headers (Authorization, Content-Type, HTTP-Referer, X-Title)", async () => {
    await callOpenRouter({
      systemPrompt: "You are helpful.",
      userPrompt: "Hello",
    });

    expect(fetch).toHaveBeenCalledOnce();
    const callArgs = vi.mocked(fetch).mock.calls[0];
    const options = callArgs[1] as RequestInit;
    const headers = options.headers as Record<string, string>;

    expect(headers["Authorization"]).toBe("Bearer test-key");
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["HTTP-Referer"]).toBe("https://animal-maths.vercel.app");
    expect(headers["X-Title"]).toBe("Animal Maths");
  });

  it("sends correct model in request body", async () => {
    await callOpenRouter({
      systemPrompt: "You are helpful.",
      userPrompt: "Hello",
    });

    const callArgs = vi.mocked(fetch).mock.calls[0];
    const options = callArgs[1] as RequestInit;
    const body = JSON.parse(options.body as string);

    expect(body.model).toBe("anthropic/claude-haiku-4.5");
  });

  it("sends system + user messages", async () => {
    await callOpenRouter({
      systemPrompt: "You are a math tutor.",
      userPrompt: "What is 2+2?",
    });

    const callArgs = vi.mocked(fetch).mock.calls[0];
    const options = callArgs[1] as RequestInit;
    const body = JSON.parse(options.body as string);

    expect(body.messages).toEqual([
      { role: "system", content: "You are a math tutor." },
      { role: "user", content: "What is 2+2?" },
    ]);
  });

  it("parses response content correctly", async () => {
    const result = await callOpenRouter({
      systemPrompt: "You are helpful.",
      userPrompt: "Hello",
    });

    expect(result).toBe("response text");
  });

  it("throws on non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
      })
    );

    await expect(
      callOpenRouter({
        systemPrompt: "You are helpful.",
        userPrompt: "Hello",
      })
    ).rejects.toThrow("OpenRouter API error: 429 Too Many Requests");
  });

  it("throws on timeout", async () => {
    vi.useFakeTimers();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            const signal = init?.signal;
            if (signal) {
              signal.addEventListener("abort", () => {
                reject(new DOMException("The operation was aborted.", "AbortError"));
              });
            }
          })
      )
    );

    const promise = callOpenRouter({
      systemPrompt: "You are helpful.",
      userPrompt: "Hello",
    });

    vi.advanceTimersByTime(30_000);

    await expect(promise).rejects.toThrow();

    vi.useRealTimers();
  });

  it("respects maxTokens and temperature options", async () => {
    await callOpenRouter({
      systemPrompt: "You are helpful.",
      userPrompt: "Hello",
      maxTokens: 500,
      temperature: 0.7,
    });

    const callArgs = vi.mocked(fetch).mock.calls[0];
    const options = callArgs[1] as RequestInit;
    const body = JSON.parse(options.body as string);

    expect(body.max_tokens).toBe(500);
    expect(body.temperature).toBe(0.7);
  });
});
