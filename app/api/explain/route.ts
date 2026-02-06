import { buildExplanationPrompt } from "@/lib/prompts";
import { callOpenRouter } from "@/lib/openrouter";
import type { ExplanationResponse } from "@/types";

const FALLBACK_RESPONSE: ExplanationResponse = {
  steps: [
    "Let's look at this problem again.",
    "Try counting step by step.",
    "You'll get it next time!",
  ],
  encouragement: "Keep trying, you're learning!",
};

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { question, correctAnswer, wrongAnswer } = body;

  if (
    question === undefined ||
    correctAnswer === undefined ||
    wrongAnswer === undefined
  ) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const prompt = buildExplanationPrompt(question, correctAnswer, wrongAnswer);
    const rawResponse = await callOpenRouter({
      systemPrompt:
        "You are a friendly math tutor for young children. Respond only with valid JSON.",
      userPrompt: prompt,
    });
    const parsed: ExplanationResponse = JSON.parse(rawResponse);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify(FALLBACK_RESPONSE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
