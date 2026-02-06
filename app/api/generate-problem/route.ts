import { buildProblemPrompt } from "@/lib/prompts";
import { callOpenRouter } from "@/lib/openrouter";
import type { MathSection, DifficultyLevel, Problem } from "@/types";

const VALID_SECTIONS: MathSection[] = [
  "addition",
  "subtraction",
  "multiplication",
  "skip-counting",
];

const VALID_LEVELS: DifficultyLevel[] = [1, 2, 3];

const FALLBACK_PROBLEMS: Record<MathSection, Problem> = {
  addition: { question: "1 + 1 = ?", answer: 2, hint: "Count on your fingers!" },
  subtraction: { question: "3 - 1 = ?", answer: 2, hint: "Take away one!" },
  multiplication: { question: "2 × 1 = ?", answer: 2, hint: "Two groups of one!" },
  "skip-counting": {
    question: "Count by 2s: 2, 4, ?",
    answer: 6,
    hint: "Add 2 more!",
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
