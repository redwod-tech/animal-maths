import { MathSection, DifficultyLevel } from "@/types";

const LEVEL_RANGES: Record<DifficultyLevel, string> = {
  1: "1-10",
  2: "1-20",
  3: "1-50",
};

export function buildProblemPrompt(
  section: MathSection,
  level: DifficultyLevel
): string {
  const range = LEVEL_RANGES[level];

  return [
    `Generate a ${section} math problem for a 2nd grader.`,
    `Use numbers in the range ${range}.`,
    `Theme the word problem around arctic penguins.`,
    `Respond with JSON in this format: { "question": string, "answer": number, "hint": string }`,
  ].join("\n");
}

export function buildExplanationPrompt(
  question: string,
  correctAnswer: number,
  wrongAnswer: number
): string {
  return [
    `A 2nd grader was asked: "${question}"`,
    `The correct answer is ${correctAnswer}, but they answered ${wrongAnswer}.`,
    `Provide a step-by-step explanation suitable for a 2nd grader.`,
    `Be encouraging and supportive.`,
    `Respond with JSON in this format: { "steps": string[], "encouragement": string }`,
  ].join("\n");
}
