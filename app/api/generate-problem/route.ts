import { buildProblemPrompt } from "@/lib/prompts";
import { callOpenRouter } from "@/lib/openrouter";
import type { MathSection, DifficultyLevel, Problem } from "@/types";

const VALID_SECTIONS: MathSection[] = [
  "addition",
  "subtraction",
  "multiplication",
  "skip-counting",
];

const VALID_LEVELS: DifficultyLevel[] = [1, 2, 3, 4, 5];

const FALLBACK_PROBLEMS: Record<MathSection, Problem> = {
  addition: { question: "47 + 83 = ?", answer: 130, hint: "Add the ones first, then the tens!" },
  subtraction: { question: "83 - 47 = ?", answer: 36, hint: "Subtract the ones first, then the tens!" },
  multiplication: { question: "34 × 7 = ?", answer: 238, hint: "Break it into 30×7 and 4×7!" },
  "skip-counting": {
    question: "12, 15, 18, ?",
    answer: 21,
    hint: "Count by 3s!",
  },
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { section, level } = body;

  if (!VALID_SECTIONS.includes(section)) {
    return jsonResponse({ error: "Invalid section" }, 400);
  }

  if (!VALID_LEVELS.includes(level)) {
    return jsonResponse({ error: "Invalid level" }, 400);
  }

  try {
    const prompt = buildProblemPrompt(section, level);
    const raw = await callOpenRouter({
      systemPrompt: "You are a math problem generator for kids.",
      userPrompt: prompt,
    });
    const problem: Problem = JSON.parse(raw);
    return jsonResponse(problem);
  } catch {
    return jsonResponse(FALLBACK_PROBLEMS[section as MathSection]);
  }
}
