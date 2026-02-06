import { describe, it, expect } from "vitest";
import {
  SHOP_ITEMS,
  SECTIONS,
  REWARD_AMOUNTS,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getShopItemById,
} from "@/lib/constants";
import type { CosmeticCategory } from "@/types";

describe("SHOP_ITEMS", () => {
  it("all items have unique IDs", () => {
    const ids = SHOP_ITEMS.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all items have positive cost", () => {
    for (const item of SHOP_ITEMS) {
      expect(item.cost).toBeGreaterThan(0);
    }
  });

  it("every category has at least one item (hat, scarf, background)", () => {
    const categories: CosmeticCategory[] = ["hat", "scarf", "background"];
    for (const category of categories) {
      const items = SHOP_ITEMS.filter((item) => item.category === category);
      expect(items.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("SECTIONS", () => {
  it("all 4 math sections defined (addition, subtraction, multiplication, skip-counting)", () => {
    expect(SECTIONS).toHaveLength(4);

    const sectionMap = new Map(SECTIONS.map((s) => [s.id, s]));

    const addition = sectionMap.get("addition");
    expect(addition).toBeDefined();
    expect(addition!.name).toBe("Addition");
    expect(addition!.emoji).toBe("➕");

    const subtraction = sectionMap.get("subtraction");
    expect(subtraction).toBeDefined();
    expect(subtraction!.name).toBe("Subtraction");
    expect(subtraction!.emoji).toBe("➖");

    const multiplication = sectionMap.get("multiplication");
    expect(multiplication).toBeDefined();
    expect(multiplication!.name).toBe("Multiplication");
    expect(multiplication!.emoji).toBe("✖️");

    const skipCounting = sectionMap.get("skip-counting");
    expect(skipCounting).toBeDefined();
    expect(skipCounting!.name).toBe("Skip Counting");
    expect(skipCounting!.emoji).toBe("🔢");
  });
});

describe("CATEGORY_ORDER", () => {
  it("contains all three categories in correct order", () => {
    expect(CATEGORY_ORDER).toEqual(["hat", "scarf", "background"]);
  });
});

describe("CATEGORY_LABELS", () => {
  it("maps each category to its display label", () => {
    expect(CATEGORY_LABELS.hat).toBe("Hats");
    expect(CATEGORY_LABELS.scarf).toBe("Scarves");
    expect(CATEGORY_LABELS.background).toBe("Backgrounds");
  });
});

describe("getShopItemById", () => {
  it("returns item when ID exists", () => {
    const item = getShopItemById("arctic-explorer-hat");
    expect(item).toBeDefined();
    expect(item!.name).toBe("Arctic Explorer Hat");
    expect(item!.category).toBe("hat");
  });

  it("returns undefined for non-existent ID", () => {
    expect(getShopItemById("nonexistent")).toBeUndefined();
  });

  it("finds items from each category", () => {
    expect(getShopItemById("snowflake-scarf")?.category).toBe("scarf");
    expect(getShopItemById("northern-lights")?.category).toBe("background");
  });
});

describe("REWARD_AMOUNTS", () => {
  it("first_try > retry > 0", () => {
    expect(REWARD_AMOUNTS.firstTry).toBeGreaterThan(REWARD_AMOUNTS.retry);
    expect(REWARD_AMOUNTS.retry).toBeGreaterThan(0);
  });

  it("firstTry is 3 and retry is 1", () => {
    expect(REWARD_AMOUNTS.firstTry).toBe(3);
    expect(REWARD_AMOUNTS.retry).toBe(1);
  });
});
