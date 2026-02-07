import { describe, it, expect } from "vitest";
import { ARCTIC_ANIMALS, ARCTIC_FACTS } from "@/lib/arctic-knowledge";

describe("ARCTIC_ANIMALS", () => {
  it("has at least 8 animals", () => {
    expect(ARCTIC_ANIMALS.length).toBeGreaterThanOrEqual(8);
  });

  it("all animals have unique IDs", () => {
    const ids = ARCTIC_ANIMALS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all animals have required fields", () => {
    for (const animal of ARCTIC_ANIMALS) {
      expect(animal.id).toBeTruthy();
      expect(animal.name).toBeTruthy();
      expect(animal.emoji).toBeTruthy();
      expect(animal.funFacts.length).toBeGreaterThanOrEqual(1);
      expect(animal.habitat).toBeTruthy();
      expect(animal.diet).toBeTruthy();
    }
  });

  it("includes emperor penguin", () => {
    const penguin = ARCTIC_ANIMALS.find((a) => a.id === "emperor-penguin");
    expect(penguin).toBeDefined();
    expect(penguin!.emoji).toBe("🐧");
  });
});

describe("ARCTIC_FACTS", () => {
  it("has at least 6 facts", () => {
    expect(ARCTIC_FACTS.length).toBeGreaterThanOrEqual(6);
  });

  it("all facts have unique IDs", () => {
    const ids = ARCTIC_FACTS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all facts have required fields", () => {
    for (const fact of ARCTIC_FACTS) {
      expect(fact.id).toBeTruthy();
      expect(fact.title).toBeTruthy();
      expect(fact.emoji).toBeTruthy();
      expect(fact.description).toBeTruthy();
      expect(fact.category).toBeTruthy();
    }
  });
});
