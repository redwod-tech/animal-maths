import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/openrouter", () => ({
  callOpenRouter: vi.fn(),
}));

import { POST } from "@/app/api/generate-problem/route";
import { callOpenRouter } from "@/lib/openrouter";

const mockedCallOpenRouter = vi.mocked(callOpenRouter);

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/generate-problem", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/generate-problem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns valid Problem shape for addition section", async () => {
    mockedCallOpenRouter.mockResolvedValue(
      JSON.stringify({ question: "2 + 3 = ?", answer: 5, hint: "Count on your fingers" })
    );

    const req = makeRequest({ section: "addition", level: 1 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      question: "2 + 3 = ?",
      answer: 5,
      hint: "Count on your fingers",
    });
  });

  it("returns valid Problem for each difficulty level (1-5)", async () => {
    mockedCallOpenRouter.mockResolvedValue(
      JSON.stringify({ question: "2 + 3 = ?", answer: 5, hint: "Count on your fingers" })
    );

    for (const level of [1, 2, 3, 4, 5]) {
      const req = makeRequest({ section: "addition", level });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.question).toBeTypeOf("string");
      expect(data.answer).toBeTypeOf("number");
    }

    expect(mockedCallOpenRouter).toHaveBeenCalledTimes(5);
  });

  it("rejects invalid section names (400 status)", async () => {
    const req = makeRequest({ section: "division", level: 1 });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("rejects invalid level values (400 status)", async () => {
    const req = makeRequest({ section: "addition", level: 6 });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("accepts level 4 and level 5 as valid", async () => {
    mockedCallOpenRouter.mockResolvedValue(
      JSON.stringify({ question: "1234 + 5678 = ?", answer: 6912, hint: "Add column by column" })
    );

    for (const level of [4, 5]) {
      const req = makeRequest({ section: "addition", level });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }
  });

  it("returns fallback problem when OpenRouter fails", async () => {
    mockedCallOpenRouter.mockRejectedValue(new Error("API down"));

    const req = makeRequest({ section: "addition", level: 1 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.question).toBeTypeOf("string");
    expect(data.answer).toBeTypeOf("number");
    expect(data.hint).toBeTypeOf("string");
  });

  it("response has question (string) and answer (number)", async () => {
    mockedCallOpenRouter.mockResolvedValue(
      JSON.stringify({ question: "2 + 3 = ?", answer: 5, hint: "Count on your fingers" })
    );

    const req = makeRequest({ section: "subtraction", level: 2 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("question");
    expect(data).toHaveProperty("answer");
    expect(data.question).toBeTypeOf("string");
    expect(data.answer).toBeTypeOf("number");
  });
});
