import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/openrouter", () => ({
  callOpenRouter: vi.fn(),
}));

import { POST } from "@/app/api/explain/route";
import { callOpenRouter } from "@/lib/openrouter";
import type { ExplanationResponse } from "@/types";

const MOCK_EXPLANATION: ExplanationResponse = {
  steps: ["Step 1: Look at the numbers", "Step 2: Add them together"],
  encouragement: "You're doing great!",
};

function buildRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/explain", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/explain", () => {
  beforeEach(() => {
    vi.mocked(callOpenRouter).mockReset();
    vi.mocked(callOpenRouter).mockResolvedValue(
      JSON.stringify(MOCK_EXPLANATION)
    );
  });

  it("returns valid ExplanationResponse shape (has steps array and encouragement string)", async () => {
    const req = buildRequest({
      question: "2 + 3 = ?",
      correctAnswer: 5,
      wrongAnswer: 4,
    });
    const res = await POST(req);
    const data: ExplanationResponse = await res.json();

    expect(Array.isArray(data.steps)).toBe(true);
    expect(typeof data.encouragement).toBe("string");
  });

  it("response has steps array and encouragement string", async () => {
    const req = buildRequest({
      question: "2 + 3 = ?",
      correctAnswer: 5,
      wrongAnswer: 4,
    });
    const res = await POST(req);
    const data: ExplanationResponse = await res.json();

    expect(data.steps).toEqual([
      "Step 1: Look at the numbers",
      "Step 2: Add them together",
    ]);
    expect(data.encouragement).toBe("You're doing great!");
  });

  it("rejects missing required fields (400 status)", async () => {
    const missingQuestion = buildRequest({
      correctAnswer: 5,
      wrongAnswer: 4,
    });
    const res1 = await POST(missingQuestion);
    expect(res1.status).toBe(400);

    const missingCorrectAnswer = buildRequest({
      question: "2 + 3 = ?",
      wrongAnswer: 4,
    });
    const res2 = await POST(missingCorrectAnswer);
    expect(res2.status).toBe(400);

    const missingWrongAnswer = buildRequest({
      question: "2 + 3 = ?",
      correctAnswer: 5,
    });
    const res3 = await POST(missingWrongAnswer);
    expect(res3.status).toBe(400);
  });

  it("returns generic fallback explanation when OpenRouter fails", async () => {
    vi.mocked(callOpenRouter).mockRejectedValue(new Error("API down"));

    const req = buildRequest({
      question: "2 + 3 = ?",
      correctAnswer: 5,
      wrongAnswer: 4,
    });
    const res = await POST(req);
    const data: ExplanationResponse = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data.steps)).toBe(true);
    expect(data.steps.length).toBeGreaterThan(0);
    expect(typeof data.encouragement).toBe("string");
    expect(data.encouragement.length).toBeGreaterThan(0);
  });
});
