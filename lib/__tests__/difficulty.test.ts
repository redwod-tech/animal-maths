import { describe, it, expect } from "vitest";
import { DifficultyState } from "@/types";
import { updateDifficulty } from "@/lib/difficulty";

function makeState(
  level: 1 | 2 | 3 | 4 | 5,
  consecutiveCorrect: number,
  consecutiveWrong: number
): DifficultyState {
  return { level, consecutiveCorrect, consecutiveWrong };
}

describe("updateDifficulty", () => {
  it("promotes from level 1 to level 2 after 5 correct in a row", () => {
    const state = makeState(1, 4, 0);
    const result = updateDifficulty(state, true);
    expect(result.level).toBe(2);
  });

  it("promotes from level 2 to level 3 after 5 correct in a row", () => {
    const state = makeState(2, 4, 0);
    const result = updateDifficulty(state, true);
    expect(result.level).toBe(3);
  });

  it("promotes from level 3 to level 4 after 5 correct in a row", () => {
    const state = makeState(3, 4, 0);
    const result = updateDifficulty(state, true);
    expect(result.level).toBe(4);
  });

  it("promotes from level 4 to level 5 after 5 correct in a row", () => {
    const state = makeState(4, 4, 0);
    const result = updateDifficulty(state, true);
    expect(result.level).toBe(5);
  });

  it("stays at level 5 after 5 correct in a row (cap)", () => {
    const state = makeState(5, 4, 0);
    const result = updateDifficulty(state, true);
    expect(result.level).toBe(5);
  });

  it("demotes from level 5 to level 4 after 3 wrong in a row", () => {
    const state = makeState(5, 0, 2);
    const result = updateDifficulty(state, false);
    expect(result.level).toBe(4);
  });

  it("demotes from level 4 to level 3 after 3 wrong in a row", () => {
    const state = makeState(4, 0, 2);
    const result = updateDifficulty(state, false);
    expect(result.level).toBe(3);
  });

  it("demotes from level 3 to level 2 after 3 wrong in a row", () => {
    const state = makeState(3, 0, 2);
    const result = updateDifficulty(state, false);
    expect(result.level).toBe(2);
  });

  it("stays at level 1 after 3 wrong in a row (floor)", () => {
    const state = makeState(1, 0, 2);
    const result = updateDifficulty(state, false);
    expect(result.level).toBe(1);
  });

  it("resets consecutiveWrong to 0 on a correct answer", () => {
    const state = makeState(1, 0, 2);
    const result = updateDifficulty(state, true);
    expect(result.consecutiveWrong).toBe(0);
  });

  it("resets consecutiveCorrect to 0 on a wrong answer", () => {
    const state = makeState(1, 3, 0);
    const result = updateDifficulty(state, false);
    expect(result.consecutiveCorrect).toBe(0);
  });

  it("resets both counters on promotion", () => {
    const state = makeState(1, 4, 0);
    const result = updateDifficulty(state, true);
    expect(result.consecutiveCorrect).toBe(0);
    expect(result.consecutiveWrong).toBe(0);
  });

  it("resets both counters on demotion", () => {
    const state = makeState(3, 0, 2);
    const result = updateDifficulty(state, false);
    expect(result.consecutiveCorrect).toBe(0);
    expect(result.consecutiveWrong).toBe(0);
  });

  it("stays at same level when 4 correct then 1 wrong, counters reset", () => {
    const state = makeState(1, 4, 0);
    const result = updateDifficulty(state, false);
    expect(result.level).toBe(1);
    expect(result.consecutiveCorrect).toBe(0);
    expect(result.consecutiveWrong).toBe(1);
  });
});
