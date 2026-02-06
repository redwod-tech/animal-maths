import { MathSection, DifficultyLevel } from "@/types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface RawEquation {
  equation: string;
  answer: number;
}

export function generateEquation(section: MathSection, level: DifficultyLevel): RawEquation {
  switch (section) {
    case "addition": {
      if (level === 1) { const a = randInt(10, 99), b = randInt(10, 99); return { equation: `${a} + ${b}`, answer: a + b }; }
      if (level === 2) { const a = randInt(100, 999), b = randInt(100, 999); return { equation: `${a} + ${b}`, answer: a + b }; }
      if (level === 3) { const a = randInt(100, 999), b = randInt(100, 999), c = randInt(100, 999); return { equation: `${a} + ${b} + ${c}`, answer: a + b + c }; }
      if (level === 4) { const a = randInt(100, 999), b = randInt(100, 999), c = randInt(100, 999); return { equation: `${a} + ${b} + ${c}`, answer: a + b + c }; }
      { const a = randInt(1000, 9999), b = randInt(1000, 9999); return { equation: `${a} + ${b}`, answer: a + b }; }
    }
    case "subtraction": {
      if (level === 1) { const a = randInt(50, 99), b = randInt(10, 49); return { equation: `${a} - ${b}`, answer: a - b }; }
      if (level === 2) { const a = randInt(500, 999), b = randInt(100, 499); return { equation: `${a} - ${b}`, answer: a - b }; }
      if (level === 3) { const a = randInt(500, 999), b = randInt(100, 499); return { equation: `${a} - ${b}`, answer: a - b }; }
      if (level === 4) { const a = pick([1000, 2000, 3000, 4000, 5000, 3004, 5003, 6001]); const b = randInt(100, a - 1); return { equation: `${a} - ${b}`, answer: a - b }; }
      { const a = randInt(5000, 9999), b = randInt(1000, 4999); return { equation: `${a} - ${b}`, answer: a - b }; }
    }
    case "multiplication": {
      if (level === 1) { const a = randInt(10, 99), b = randInt(2, 9); return { equation: `${a} × ${b}`, answer: a * b }; }
      if (level === 2) { const a = randInt(10, 99), b = randInt(10, 99); return { equation: `${a} × ${b}`, answer: a * b }; }
      if (level === 3) { const a = randInt(100, 999), b = randInt(2, 9); return { equation: `${a} × ${b}`, answer: a * b }; }
      if (level === 4) { let a: number, b: number; do { a = randInt(20, 99); b = randInt(20, 99); } while (a * b < 1000); return { equation: `${a} × ${b}`, answer: a * b }; }
      { const a = randInt(100, 999), b = randInt(10, 99); return { equation: `${a} × ${b}`, answer: a * b }; }
    }
    case "skip-counting": {
      const skipOptions: Record<DifficultyLevel, number[]> = {
        1: [3, 4, 5], 2: [6, 7, 8], 3: [9, 11, 12], 4: [13, 15, 17], 5: [25, 50],
      };
      const skipBy = pick(skipOptions[level]);
      const minStart = level >= 3 ? 100 : 10;
      const maxStart = level >= 3 ? 500 : 90;
      const start = randInt(minStart, maxStart);
      const seq = [start, start + skipBy, start + 2 * skipBy];
      return { equation: `${seq.join(", ")}, ?`, answer: start + 3 * skipBy };
    }
  }
}

export function buildProblemPrompt(
  section: MathSection,
  level: DifficultyLevel
): string {
  const eq = generateEquation(section, level);

  return [
    `Create a brief arctic penguin-themed math question.`,
    `You MUST use this EXACT equation: ${eq.equation} = ?`,
    `The correct answer is ${eq.answer}.`,
    `Respond ONLY with JSON: { "question": "<themed question ending with the equation>", "answer": ${eq.answer}, "hint": "<short hint>" }`,
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
