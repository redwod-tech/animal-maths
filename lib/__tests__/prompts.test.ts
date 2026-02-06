import { describe, it, expect } from "vitest";
import { buildProblemPrompt, buildExplanationPrompt } from "@/lib/prompts";
import { MathSection, DifficultyLevel } from "@/types";

describe("buildProblemPrompt", () => {
  it("returns string containing the section name", () => {
    const result = buildProblemPrompt("addition", 1);
    expect(result.toLowerCase()).toContain("addition");
  });

  it("returns string containing the level constraint", () => {
    const level1 = buildProblemPrompt("addition", 1);
    expect(level1).toMatch(/10.*100|two.digit/i);

    const level2 = buildProblemPrompt("subtraction", 2);
    expect(level2).toMatch(/100.*999|three.digit/i);

    const level3 = buildProblemPrompt("multiplication", 3);
    expect(level3).toMatch(/100.*999|three.digit/i);
  });

  it('includes "arctic" or "penguin" theme reference', () => {
    const result = buildProblemPrompt("addition", 1);
    const lower = result.toLowerCase();
    expect(lower.includes("arctic") || lower.includes("penguin")).toBe(true);
  });

  it("works for all 4 sections", () => {
    const sections: MathSection[] = [
      "addition",
      "subtraction",
      "multiplication",
      "skip-counting",
    ];

    for (const section of sections) {
      const result = buildProblemPrompt(section, 1);
      expect(result.toLowerCase()).toContain(section);
      expect(result.length).toBeGreaterThan(0);
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
    expect(lower.includes("2nd grader") || lower.includes("second grader")).toBe(
      true
    );
  });
});
