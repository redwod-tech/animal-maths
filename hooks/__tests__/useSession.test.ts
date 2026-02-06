import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSession } from "@/hooks/useSession";
import { defaultSession, SESSION_KEY } from "@/lib/session";

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
});
