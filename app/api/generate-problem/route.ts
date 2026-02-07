import { buildProblemPrompt, generateGeometryProblem } from "@/lib/prompts";
import { callOpenRouter } from "@/lib/openrouter";
import type { MathSection, DifficultyLevel, Problem } from "@/types";

const VALID_SECTIONS: MathSection[] = [
  "addition",
  "subtraction",
  "multiplication",
  "skip-counting",
  "area-perimeter",
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
  "area-perimeter": {
    question: "Find the area of a rectangle with width 4 and height 3",
    answer: 12,
    hint: "Area = width × height!",
    shape: { type: "rectangle", dimensions: { width: 4, height: 3 }, questionType: "area" },
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

  // Area & Perimeter: generate locally, use AI for themed question text
  if (section === "area-perimeter") {
    const geo = generateGeometryProblem(level);
    try {
      const prompt = [
        `Create a brief arctic penguin-themed math question.`,
        `You MUST incorporate this geometry problem: ${geo.equation}`,
        `The correct answer is ${geo.answer}.`,
        `Respond ONLY with JSON: { "question": "<themed question ending with the problem>", "answer": ${geo.answer}, "hint": "<short hint>" }`,
      ].join("\n");

      const raw = await callOpenRouter({
        systemPrompt: "You are a math problem generator for kids. Wrap the given geometry problem in a fun, brief penguin-themed story.",
        userPrompt: prompt,
        temperature: 0.8,
      });
      const problem: Problem = JSON.parse(raw);
      return jsonResponse({ ...problem, shape: geo.shape });
    } catch (error) {
      console.error("Geometry problem generation failed:", error);
      return jsonResponse({
        question: geo.equation,
        answer: geo.answer,
        hint: geo.shape.questionType === "area" ? "Multiply the sides!" : "Add all the sides!",
        shape: geo.shape,
      });
    }
  }

  try {
    const prompt = buildProblemPrompt(section, level);
    const raw = await callOpenRouter({
      systemPrompt: "You are a math problem generator for kids. Wrap the given equation in a fun, brief penguin-themed story.",
      userPrompt: prompt,
      temperature: 0.8,
    });
    const problem: Problem = JSON.parse(raw);
    return jsonResponse(problem);
  } catch (error) {
    console.error("Problem generation failed:", error);
    return jsonResponse(FALLBACK_PROBLEMS[section as MathSection]);
  }
}
