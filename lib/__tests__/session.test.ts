import { describe, it, expect, beforeEach } from "vitest";
import {
  getSession,
  saveSession,
  resetSession,
  SESSION_KEY,
  defaultSession,
} from "@/lib/session";
import type { SessionData } from "@/types";

// In-memory localStorage mock
function createLocalStorageMock() {
  let store: Record<string, string> = {};
  return {
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
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

describe("session", () => {
  beforeEach(() => {
    const mock = createLocalStorageMock();
    globalThis.localStorage = mock as unknown as Storage;
  });

  describe("defaultSession", () => {
    it("has 0 tokens, no equipped items, all sections at level 1", () => {
      const session = defaultSession();

      expect(session.tokens).toBe(0);
      expect(session.purchasedItems).toEqual([]);
      expect(session.equipped).toEqual({
        hat: null,
        scarf: null,
        background: null,
      });

      const sections: Array<keyof SessionData["sections"]> = [
        "addition",
        "subtraction",
        "multiplication",
        "skip-counting",
      ];
      for (const section of sections) {
        expect(session.sections[section]).toEqual({
          level: 1,
          consecutiveCorrect: 0,
          consecutiveWrong: 0,
        });
      }
    });
  });

  describe("getSession", () => {
    it("returns default session when localStorage is empty", () => {
      const session = getSession();
      expect(session).toEqual(defaultSession());
    });

    it("returns parsed session from localStorage", () => {
      const customSession: SessionData = {
        tokens: 42,
        purchasedItems: ["crown"],
        equipped: { hat: "crown", scarf: null, background: null },
        sections: {
          addition: { level: 2, consecutiveCorrect: 3, consecutiveWrong: 0 },
          subtraction: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
          multiplication: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
          "skip-counting": { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        },
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(customSession));

      const session = getSession();
      expect(session).toEqual(customSession);
    });

    it("handles corrupted localStorage gracefully (returns default)", () => {
      localStorage.setItem(SESSION_KEY, "not-valid-json{{{");

      const session = getSession();
      expect(session).toEqual(defaultSession());
    });
  });

  describe("saveSession", () => {
    it("writes session to localStorage as JSON", () => {
      const session = defaultSession();
      session.tokens = 10;

      saveSession(session);

      const stored = localStorage.getItem(SESSION_KEY);
      expect(stored).toBe(JSON.stringify(session));
    });

    it("can be read back by getSession", () => {
      const session: SessionData = {
        tokens: 99,
        purchasedItems: ["tophat", "blue-bg"],
        equipped: { hat: "tophat", scarf: null, background: "blue-bg" },
        sections: {
          addition: { level: 3, consecutiveCorrect: 0, consecutiveWrong: 1 },
          subtraction: { level: 2, consecutiveCorrect: 2, consecutiveWrong: 0 },
          multiplication: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
          "skip-counting": { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        },
      };

      saveSession(session);
      const loaded = getSession();
      expect(loaded).toEqual(session);
    });
  });

  describe("resetSession", () => {
    it("clears localStorage and returns default", () => {
      const session = defaultSession();
      session.tokens = 50;
      saveSession(session);

      const reset = resetSession();

      expect(reset).toEqual(defaultSession());
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });
  });
});
