import { MathSection, DifficultyLevel } from "@/types";

const LEVEL_DESCRIPTIONS: Record<MathSection, Record<DifficultyLevel, string>> = {
  addition: {
    1: "Add two numbers, each between 10 and 100 (two-digit numbers). Example: 47 + 83",
    2: "Add two or three numbers, each between 100 and 999 (three-digit numbers). Example: 372 + 263",
    3: "Add two or three numbers, each between 100 and 999 (three-digit numbers), with carrying. Example: 372 + 263 + 873",
  },
  subtraction: {
    1: "Subtract two numbers, each between 10 and 100 (two-digit numbers). The result must be positive. Example: 83 - 47",
    2: "Subtract two numbers, each between 100 and 999 (three-digit numbers). The result must be positive. Example: 847 - 263",
    3: "Subtract two numbers, each between 100 and 999 (three-digit numbers), with borrowing. Example: 903 - 467",
  },
  multiplication: {
    1: "Multiply a two-digit number (10-99) by a one-digit number (2-9). Example: 34 × 7",
    2: "Multiply two two-digit numbers, each between 10 and 99 (three-digit products). Example: 23 × 45",
    3: "Multiply a three-digit number (100-999) by a one-digit number (2-9). Example: 372 × 8",
  },
  "skip-counting": {
    1: "Count by 3s, 4s, or 5s starting from a two-digit number. Give 3 numbers in the sequence, ask for the 4th. Example: 12, 15, 18, ?",
    2: "Count by 6s, 7s, or 8s starting from a two-digit number. Give 3 numbers in the sequence, ask for the 4th. Example: 24, 31, 38, ?",
    3: "Count by 9s, 11s, or 12s starting from a three-digit number. Give 3 numbers, ask for the 4th. Example: 108, 119, 130, ?",
  },
};

export function buildProblemPrompt(
  section: MathSection,
  level: DifficultyLevel
): string {
  const description = LEVEL_DESCRIPTIONS[section][level];

  return [
    `Generate a ${section} math problem.`,
    `Difficulty: ${description}`,
    `IMPORTANT: Generate a UNIQUE problem with RANDOM numbers. Do NOT repeat the example. Use different numbers every time.`,
    `Theme: arctic penguins (brief, fun context).`,
    `Respond ONLY with JSON: { "question": "<equation> = ?", "answer": <number>, "hint": "<short hint>" }`,
    `The question should show the math equation clearly (e.g. "372 + 263 = ?").`,
  ].join("\n");
}

export function buildExplanationPrompt(
  question: string,
  correctAnswer: number,
  wrongAnswer: number
): string {
  return [
    `A student was asked: "${question}"`,
    `The correct answer is ${correctAnswer}, but they answered ${wrongAnswer}.`,
    `Provide a step-by-step explanation suitable for a 2nd grader.`,
    `Be encouraging and supportive.`,
    `Respond with JSON in this format: { "steps": string[], "encouragement": string }`,
  ].join("\n");
}
