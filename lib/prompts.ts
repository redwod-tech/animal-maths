import { MathSection, DifficultyLevel, ShapeData } from "@/types";

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
    case "area-perimeter": {
      // Use generateGeometryProblem() instead for this section
      const a = randInt(2, 6), b = randInt(2, 6);
      return { equation: `${a} × ${b}`, answer: a * b };
    }
  }
}

export interface GeometryProblem {
  equation: string;
  answer: number;
  shape: ShapeData;
}

export function generateGeometryProblem(level: DifficultyLevel): GeometryProblem {
  const askArea = Math.random() < 0.5;
  const questionType = askArea ? "area" : "perimeter";

  if (level <= 2) {
    // Rectangles
    const maxSide = level === 1 ? 6 : 12;
    const minSide = level === 1 ? 2 : 5;
    const width = randInt(minSide, maxSide);
    const height = randInt(minSide, maxSide);
    const answer = askArea ? width * height : 2 * (width + height);
    const label = askArea ? "area" : "perimeter";
    return {
      equation: `Find the ${label} of a rectangle with width ${width} and height ${height}`,
      answer,
      shape: { type: "rectangle", dimensions: { width, height }, questionType },
    };
  }

  if (level === 3) {
    // Squares + rectangles mixed
    const isSquare = Math.random() < 0.5;
    if (isSquare) {
      const side = randInt(3, 15);
      const answer = askArea ? side * side : 4 * side;
      const label = askArea ? "area" : "perimeter";
      return {
        equation: `Find the ${label} of a square with side ${side}`,
        answer,
        shape: { type: "square", dimensions: { side }, questionType },
      };
    }
    const width = randInt(3, 15);
    const height = randInt(3, 15);
    const answer = askArea ? width * height : 2 * (width + height);
    const label = askArea ? "area" : "perimeter";
    return {
      equation: `Find the ${label} of a rectangle with width ${width} and height ${height}`,
      answer,
      shape: { type: "rectangle", dimensions: { width, height }, questionType },
    };
  }

  if (level === 4) {
    // Right triangles (area only for triangles, perimeter uses base+height+hypotenuse)
    const base = randInt(3, 10);
    const height = randInt(3, 10);
    if (askArea) {
      const answer = (base * height) / 2;
      // Only use integer areas
      if (answer === Math.floor(answer)) {
        return {
          equation: `Find the area of a triangle with base ${base} and height ${height}`,
          answer,
          shape: { type: "triangle", dimensions: { base, height }, questionType: "area" },
        };
      }
      // If non-integer, force even product
      const adjBase = base % 2 === 0 ? base : base + 1;
      return {
        equation: `Find the area of a triangle with base ${adjBase} and height ${height}`,
        answer: (adjBase * height) / 2,
        shape: { type: "triangle", dimensions: { base: adjBase, height }, questionType: "area" },
      };
    }
    // Perimeter of right triangle: base + height + hypotenuse
    // Use pythagorean triples for clean numbers
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
    const triple = pick(triples.filter(([a, b]) => a >= 3 && a <= 10 && b >= 3 && b <= 10));
    const [a, b, c] = triple || [3, 4, 5];
    return {
      equation: `Find the perimeter of a right triangle with sides ${a}, ${b}, and ${c}`,
      answer: a + b + c,
      shape: { type: "triangle", dimensions: { base: a, height: b, hypotenuse: c }, questionType: "perimeter" },
    };
  }

  // Level 5: L-shapes (composite rectangles)
  const w1 = randInt(3, 8);
  const h1 = randInt(3, 8);
  const w2 = randInt(3, 8);
  const h2 = randInt(3, 8);
  if (askArea) {
    return {
      equation: `Find the area of an L-shape made of two rectangles: ${w1}x${h1} and ${w2}x${h2}`,
      answer: w1 * h1 + w2 * h2,
      shape: { type: "l-shape", dimensions: { w1, h1, w2, h2 }, questionType: "area" },
    };
  }
  // Perimeter of L-shape: total outer edges
  const perimeter = 2 * (w1 + h1) + 2 * (w2 + h2) - 2 * Math.min(w1, w2);
  return {
    equation: `Find the perimeter of an L-shape made of two rectangles: ${w1}x${h1} and ${w2}x${h2}`,
    answer: perimeter,
    shape: { type: "l-shape", dimensions: { w1, h1, w2, h2 }, questionType: "perimeter" },
  };
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
