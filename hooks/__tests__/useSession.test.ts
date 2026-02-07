import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSession } from "@/hooks/useSession";
import { defaultSession, SESSION_KEY, defaultMultiplicationData } from "@/lib/session";

let store: Record<string, string> = {};
beforeEach(() => {
  store = {};
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  });
});

describe("useSession", () => {
  it("returns default session on first render", () => {
    const { result } = renderHook(() => useSession());

    expect(result.current.session).toEqual(defaultSession());
  });

  it("addTokens: increases token count", () => {
    const { result } = renderHook(() => useSession());

    act(() => {
      result.current.addTokens(5);
    });

    expect(result.current.session.tokens).toBe(5);
  });

  it("updateSection: updates section difficulty state", () => {
    const { result } = renderHook(() => useSession());

    act(() => {
      result.current.updateSection("addition", {
        level: 2,
        consecutiveCorrect: 3,
        consecutiveWrong: 0,
      });
    });

    expect(result.current.session.sections.addition).toEqual({
      level: 2,
      consecutiveCorrect: 3,
      consecutiveWrong: 0,
    });
  });

  it("purchaseItem: deducts tokens and adds to purchasedItems", () => {
    const { result } = renderHook(() => useSession());

    // First give some tokens
    act(() => {
      result.current.addTokens(20);
    });

    act(() => {
      result.current.purchaseItem("crown", 10);
    });

    expect(result.current.session.tokens).toBe(10);
    expect(result.current.session.purchasedItems).toContain("crown");
  });

  it("equipItem: sets item in equipped slot", () => {
    const { result } = renderHook(() => useSession());

    act(() => {
      result.current.equipItem("crown", "hat");
    });

    expect(result.current.session.equipped.hat).toBe("crown");
  });

  it("purchaseItem: fails when tokens insufficient (no change)", () => {
    const { result } = renderHook(() => useSession());

    // Tokens start at 0, try to purchase item costing 10
    act(() => {
      result.current.purchaseItem("crown", 10);
    });

    expect(result.current.session.tokens).toBe(0);
    expect(result.current.session.purchasedItems).toEqual([]);
  });

  it("setUserName: updates and persists userName", () => {
    const { result } = renderHook(() => useSession());

    act(() => {
      result.current.setUserName("Ava");
    });

    expect(result.current.session.userName).toBe("Ava");

    // Check it persisted
    const stored = store[SESSION_KEY];
    const parsed = JSON.parse(stored);
    expect(parsed.userName).toBe("Ava");
  });

  it("unequipItem: sets equipped slot to null", () => {
    const { result } = renderHook(() => useSession());

    // First equip an item
    act(() => {
      result.current.equipItem("crown", "hat");
    });
    expect(result.current.session.equipped.hat).toBe("crown");

    // Now unequip it
    act(() => {
      result.current.unequipItem("hat");
    });
    expect(result.current.session.equipped.hat).toBeNull();
  });

  it("unequipItem: persists to localStorage", () => {
    const { result } = renderHook(() => useSession());

    act(() => {
      result.current.equipItem("crown", "hat");
    });

    act(() => {
      result.current.unequipItem("hat");
    });

    const stored = store[SESSION_KEY];
    const parsed = JSON.parse(stored);
    expect(parsed.equipped.hat).toBeNull();
  });

  it("persists changes to localStorage", () => {
    const { result } = renderHook(() => useSession());

    act(() => {
      result.current.addTokens(7);
    });

    const stored = store[SESSION_KEY];
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored);
    expect(parsed.tokens).toBe(7);
  });

  it("updateMultiplicationData: updates and persists multiplicationData", () => {
    const { result } = renderHook(() => useSession());

    const newData = {
      bestScores: { single: { 7: 15 }, mixed: 20, boss: 0 },
      missHistory: [{ fact: { a: 7, b: 8 }, wrongAnswer: 54, timestamp: 1000 }],
    };

    act(() => {
      result.current.updateMultiplicationData(newData);
    });

    expect(result.current.session.multiplicationData).toEqual(newData);

    const stored = store[SESSION_KEY];
    const parsed = JSON.parse(stored);
    expect(parsed.multiplicationData).toEqual(newData);
  });

  it("updateMultiplicationData: partial update merges with existing data", () => {
    const { result } = renderHook(() => useSession());

    // First set some data
    act(() => {
      result.current.updateMultiplicationData({
        bestScores: { single: { 7: 15 }, mixed: 20, boss: 0 },
        missHistory: [],
      });
    });

    // Now update just bestScores
    act(() => {
      result.current.updateMultiplicationData({
        ...result.current.session.multiplicationData!,
        bestScores: { single: { 7: 15, 3: 22 }, mixed: 20, boss: 5 },
      });
    });

    expect(result.current.session.multiplicationData!.bestScores.single).toEqual({ 7: 15, 3: 22 });
    expect(result.current.session.multiplicationData!.bestScores.boss).toBe(5);
  });
});
