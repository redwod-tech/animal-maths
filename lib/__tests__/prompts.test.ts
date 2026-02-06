import { describe, it, expect } from "vitest";
import { buildProblemPrompt, buildExplanationPrompt, generateEquation } from "@/lib/prompts";
import { MathSection, DifficultyLevel } from "@/types";

describe("generateEquation", () => {
  it("generates valid addition equations for all levels", () => {
    for (let level = 1; level <= 5; level++) {
      const eq = generateEquation("addition", level as DifficultyLevel);
      expect(eq.equation).toContain("+");
      // Verify answer matches the equation
      const nums = eq.equation.split("+").map((s) => parseInt(s.trim(), 10));
      expect(eq.answer).toBe(nums.reduce((a, b) => a + b, 0));
    }
  });

  it("generates valid subtraction equations for all levels", () => {
    for (let level = 1; level <= 5; level++) {
      const eq = generateEquation("subtraction", level as DifficultyLevel);
      expect(eq.equation).toContain("-");
      const [a, b] = eq.equation.split("-").map((s) => parseInt(s.trim(), 10));
      expect(eq.answer).toBe(a - b);
      expect(eq.answer).toBeGreaterThan(0);
    }
  });

  it("generates valid multiplication equations for all levels", () => {
    for (let level = 1; level <= 5; level++) {
      const eq = generateEquation("multiplication", level as DifficultyLevel);
      expect(eq.equation).toContain("×");
      const [a, b] = eq.equation.split("×").map((s) => parseInt(s.trim(), 10));
      expect(eq.answer).toBe(a * b);
    }
  });

  it("generates valid skip-counting sequences for all levels", () => {
    for (let level = 1; level <= 5; level++) {
      const eq = generateEquation("skip-counting", level as DifficultyLevel);
      expect(eq.equation).toContain(",");
      const parts = eq.equation.replace("?", "").split(",").map((s) => s.trim()).filter(Boolean);
      expect(parts).toHaveLength(3);
      const nums = parts.map(Number);
      const step = nums[1] - nums[0];
      expect(nums[2] - nums[1]).toBe(step);
      expect(eq.answer).toBe(nums[2] + step);
    }
  });

  it("generates different equations on successive calls", () => {
    const equations = new Set<string>();
    for (let i = 0; i < 20; i++) {
      equations.add(generateEquation("addition", 1).equation);
    }
    // With truly random numbers, 20 calls should produce at least 10 unique equations
    expect(equations.size).toBeGreaterThanOrEqual(10);
  });

  it("skip-counting level 1 uses 3s, 4s, or 5s", () => {
    const steps = new Set<number>();
    for (let i = 0; i < 50; i++) {
      const eq = generateEquation("skip-counting", 1);
      const parts = eq.equation.replace("?", "").split(",").map((s) => parseInt(s.trim(), 10));
      steps.add(parts[1] - parts[0]);
    }
    // Should see variety in skip counts
    expect(steps.size).toBeGreaterThanOrEqual(2);
    for (const s of steps) {
      expect([3, 4, 5]).toContain(s);
    }
  });
});

describe("buildProblemPrompt", () => {
  it("includes the equation and answer from generateEquation", () => {
    const result = buildProblemPrompt("addition", 1);
    // Should contain an equation with + and a number for answer
    expect(result).toContain("=");
    expect(result).toContain("answer");
  });

  it('includes "arctic" or "penguin" theme reference', () => {
    const result = buildProblemPrompt("addition", 1);
    const lower = result.toLowerCase();
    expect(lower.includes("arctic") || lower.includes("penguin")).toBe(true);
  });

  it("works for all 4 sections at all levels", () => {
    const sections: MathSection[] = ["addition", "subtraction", "multiplication", "skip-counting"];
    for (const section of sections) {
      for (let level = 1; level <= 5; level++) {
        const result = buildProblemPrompt(section, level as DifficultyLevel);
        expect(result.length).toBeGreaterThan(0);
        expect(result.toLowerCase()).toContain("json");
      }
    }
  });

  it("asks for JSON response with question, answer, and hint", () => {
    const result = buildProblemPrompt("addition", 1);
    const lower = result.toLowerCase();
    expect(lower).toContain("json");
    expect(lower).toContain("question");
    expect(lower).toContain("answer");
    expect(lower).toContain("hint");
  });
});

describe("buildExplanationPrompt", () => {
  it("includes the question text", () => {
    const result = buildExplanationPrompt("What is 3 + 4?", 7, 5);
    expect(result).toContain("What is 3 + 4?");
  });

  it("includes the correct and wrong answers", () => {
    const result = buildExplanationPrompt("What is 3 + 4?", 7, 5);
    expect(result).toContain("7");
    expect(result).toContain("5");
  });

  it("includes encouragement instruction", () => {
    const result = buildExplanationPrompt("What is 3 + 4?", 7, 5);
    const lower = result.toLowerCase();
    expect(lower).toContain("encourag");
  });

  it("asks for JSON response with steps and encouragement", () => {
    const result = buildExplanationPrompt("What is 3 + 4?", 7, 5);
    const lower = result.toLowerCase();
    expect(lower).toContain("json");
    expect(lower).toContain("steps");
    expect(lower).toContain("encouragement");
  });

  it("mentions explanation suitable for a 2nd grader", () => {
    const result = buildExplanationPrompt("What is 3 + 4?", 7, 5);
    const lower = result.toLowerCase();
    expect(lower.includes("2nd grader") || lower.includes("second grader")).toBe(true);
  });
});
