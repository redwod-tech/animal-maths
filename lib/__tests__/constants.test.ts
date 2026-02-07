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

  it("every category has at least one item (hat, scarf, background, accessory)", () => {
    const categories: CosmeticCategory[] = ["hat", "scarf", "background", "accessory"];
    for (const category of categories) {
      const items = SHOP_ITEMS.filter((item) => item.category === category);
      expect(items.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("has 5 hats, 4 scarves, 3 accessories, 5 backgrounds", () => {
    expect(SHOP_ITEMS.filter((i) => i.category === "hat")).toHaveLength(5);
    expect(SHOP_ITEMS.filter((i) => i.category === "scarf")).toHaveLength(4);
    expect(SHOP_ITEMS.filter((i) => i.category === "accessory")).toHaveLength(3);
    expect(SHOP_ITEMS.filter((i) => i.category === "background")).toHaveLength(5);
  });

  it("all background items have bgStyle", () => {
    const bgs = SHOP_ITEMS.filter((i) => i.category === "background");
    for (const bg of bgs) {
      expect(bg.bgStyle).toBeDefined();
      expect(bg.bgStyle!.length).toBeGreaterThan(0);
    }
  });

  it("contains the new items", () => {
    expect(getShopItemById("narwhal-horn")).toBeDefined();
    expect(getShopItemById("ice-crown")).toBeDefined();
    expect(getShopItemById("santa-hat")).toBeDefined();
    expect(getShopItemById("fire-scarf")).toBeDefined();
    expect(getShopItemById("star-scarf")).toBeDefined();
    expect(getShopItemById("cool-shades")).toBeDefined();
    expect(getShopItemById("bow-tie")).toBeDefined();
    expect(getShopItemById("gold-medal")).toBeDefined();
    expect(getShopItemById("aurora-borealis")).toBeDefined();
    expect(getShopItemById("deep-ocean")).toBeDefined();
    expect(getShopItemById("starry-night")).toBeDefined();
  });
});

describe("SECTIONS", () => {
  it("all 5 math sections defined", () => {
    expect(SECTIONS).toHaveLength(5);

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

    const areaPerimeter = sectionMap.get("area-perimeter");
    expect(areaPerimeter).toBeDefined();
    expect(areaPerimeter!.name).toBe("Area & Perimeter");
    expect(areaPerimeter!.emoji).toBe("📐");
  });
});

describe("CATEGORY_ORDER", () => {
  it("contains all four categories in correct order", () => {
    expect(CATEGORY_ORDER).toEqual(["hat", "scarf", "accessory", "background"]);
  });
});

describe("CATEGORY_LABELS", () => {
  it("maps each category to its display label", () => {
    expect(CATEGORY_LABELS.hat).toBe("Hats");
    expect(CATEGORY_LABELS.scarf).toBe("Scarves");
    expect(CATEGORY_LABELS.accessory).toBe("Accessories");
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
    expect(getShopItemById("cool-shades")?.category).toBe("accessory");
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
