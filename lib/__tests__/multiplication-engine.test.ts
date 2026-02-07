import { describe, it, expect } from "vitest";
import {
  getFactPool,
  pickQuestion,
  adjustWeights,
  getMissDrillQuestions,
} from "@/lib/multiplication-engine";
import type { MissRecord, WeightedFact } from "@/types";

describe("getFactPool", () => {
  it("returns 10 facts for single-table mode (e.g., table 7)", () => {
    const pool = getFactPool("single", 7);
    expect(pool).toHaveLength(10);
    pool.forEach((fact) => {
      expect(fact.a).toBe(7);
      expect(fact.b).toBeGreaterThanOrEqual(1);
      expect(fact.b).toBeLessThanOrEqual(10);
      expect(fact.answer).toBe(fact.a * fact.b);
      expect(fact.weight).toBe(1);
    });
  });

  it("returns 80 facts for mixed mode (tables 2-9 × 1-10)", () => {
    const pool = getFactPool("mixed");
    expect(pool).toHaveLength(80);
    const uniqueFacts = new Set(pool.map((f) => `${f.a}x${f.b}`));
    expect(uniqueFacts.size).toBe(80);
  });

  it("applies initial weights from missHistory", () => {
    const missHistory: MissRecord[] = [
      { fact: { a: 7, b: 8 }, wrongAnswer: 54, timestamp: 1000 },
      { fact: { a: 7, b: 8 }, wrongAnswer: 54, timestamp: 2000 },
    ];
    const pool = getFactPool("single", 7, missHistory);
    const fact78 = pool.find((f) => f.a === 7 && f.b === 8);
    // Each miss doubles weight: 1 * 2 * 2 = 4
    expect(fact78!.weight).toBe(4);
  });

  it("caps initial weight at 8", () => {
    const missHistory: MissRecord[] = Array.from({ length: 10 }, (_, i) => ({
      fact: { a: 3, b: 4 },
      wrongAnswer: 10,
      timestamp: i * 1000,
    }));
    const pool = getFactPool("single", 3, missHistory);
    const fact34 = pool.find((f) => f.a === 3 && f.b === 4);
    expect(fact34!.weight).toBe(8);
  });

  it("returns facts from missHistory for boss mode", () => {
    const missHistory: MissRecord[] = [
      { fact: { a: 7, b: 8 }, wrongAnswer: 54, timestamp: 1000 },
      { fact: { a: 6, b: 9 }, wrongAnswer: 52, timestamp: 2000 },
    ];
    const pool = getFactPool("boss", undefined, missHistory);
    expect(pool).toHaveLength(2);
    expect(pool.find((f) => f.a === 7 && f.b === 8)).toBeDefined();
    expect(pool.find((f) => f.a === 6 && f.b === 9)).toBeDefined();
  });

  it("returns empty array for boss mode with no missHistory", () => {
    const pool = getFactPool("boss", undefined, []);
    expect(pool).toHaveLength(0);
  });
});

describe("pickQuestion", () => {
  it("returns a question from the pool", () => {
    const pool: WeightedFact[] = [
      { a: 7, b: 8, answer: 56, weight: 1 },
      { a: 3, b: 4, answer: 12, weight: 1 },
    ];
    const question = pickQuestion(pool);
    expect(question.answer).toBe(question.a * question.b);
    expect(question.text).toMatch(/\d+ × \d+/);
  });

  it("weighted selection favors higher-weighted facts", () => {
    const pool: WeightedFact[] = [
      { a: 7, b: 8, answer: 56, weight: 8 },
      { a: 3, b: 4, answer: 12, weight: 1 },
    ];
    // Run many picks, expect heavily-weighted fact to appear more
    const counts = { "7x8": 0, "3x4": 0 };
    for (let i = 0; i < 1000; i++) {
      const q = pickQuestion(pool);
      if (q.a === 7 && q.b === 8) counts["7x8"]++;
      else counts["3x4"]++;
    }
    // With 8:1 ratio, 7x8 should appear ~88% of the time
    expect(counts["7x8"]).toBeGreaterThan(700);
  });
});

describe("adjustWeights", () => {
  it("doubles weight on miss (capped at 8)", () => {
    const pool: WeightedFact[] = [
      { a: 7, b: 8, answer: 56, weight: 1 },
      { a: 3, b: 4, answer: 12, weight: 1 },
    ];
    const updated = adjustWeights(pool, { a: 7, b: 8 }, false);
    const fact = updated.find((f) => f.a === 7 && f.b === 8);
    expect(fact!.weight).toBe(2);
  });

  it("caps weight at 8 on miss", () => {
    const pool: WeightedFact[] = [
      { a: 7, b: 8, answer: 56, weight: 8 },
    ];
    const updated = adjustWeights(pool, { a: 7, b: 8 }, false);
    expect(updated[0].weight).toBe(8);
  });

  it("reduces weight by 0.7 on correct for previously missed (min 1)", () => {
    const pool: WeightedFact[] = [
      { a: 7, b: 8, answer: 56, weight: 4 },
    ];
    const updated = adjustWeights(pool, { a: 7, b: 8 }, true);
    expect(updated[0].weight).toBeCloseTo(2.8);
  });

  it("does not reduce weight below 1", () => {
    const pool: WeightedFact[] = [
      { a: 7, b: 8, answer: 56, weight: 1 },
    ];
    const updated = adjustWeights(pool, { a: 7, b: 8 }, true);
    expect(updated[0].weight).toBe(1);
  });

  it("does not modify other facts", () => {
    const pool: WeightedFact[] = [
      { a: 7, b: 8, answer: 56, weight: 2 },
      { a: 3, b: 4, answer: 12, weight: 1 },
    ];
    const updated = adjustWeights(pool, { a: 7, b: 8 }, false);
    expect(updated.find((f) => f.a === 3)!.weight).toBe(1);
  });
});

describe("getMissDrillQuestions", () => {
  it("returns up to 10 questions from misses", () => {
    const misses = Array.from({ length: 15 }, (_, i) => ({
      a: 2 + (i % 8),
      b: 1 + (i % 10),
      answer: (2 + (i % 8)) * (1 + (i % 10)),
      text: "",
    }));
    const drillQs = getMissDrillQuestions(misses);
    expect(drillQs.length).toBeLessThanOrEqual(10);
  });

  it("returns all misses when fewer than 10", () => {
    const misses = [
      { a: 7, b: 8, answer: 56, text: "7 × 8" },
      { a: 6, b: 9, answer: 54, text: "6 × 9" },
    ];
    const drillQs = getMissDrillQuestions(misses);
    expect(drillQs).toHaveLength(2);
  });

  it("returns empty array when no misses", () => {
    const drillQs = getMissDrillQuestions([]);
    expect(drillQs).toHaveLength(0);
  });

  it("deduplicates repeated misses", () => {
    const misses = [
      { a: 7, b: 8, answer: 56, text: "7 × 8" },
      { a: 7, b: 8, answer: 56, text: "7 × 8" },
      { a: 7, b: 8, answer: 56, text: "7 × 8" },
    ];
    const drillQs = getMissDrillQuestions(misses);
    expect(drillQs).toHaveLength(1);
  });
});
