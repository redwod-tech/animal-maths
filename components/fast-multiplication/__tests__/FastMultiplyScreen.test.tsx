import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import FastMultiplyScreen from "../FastMultiplyScreen";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, whileHover, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, whileHover, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, whileHover, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, whileHover, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock sound effects
vi.mock("@/lib/sound-effects", () => ({
  playCorrectSound: vi.fn(),
  playWrongSound: vi.fn(),
  playCelebrateSound: vi.fn(),
  unlockAudio: vi.fn(),
}));

// Mock useSession
const mockAddTokens = vi.fn();
const mockUpdateMultiplicationData = vi.fn();
vi.mock("@/hooks/useSession", () => ({
  useSession: () => ({
    session: {
      userName: "TestKid",
      tokens: 10,
      purchasedItems: [],
      equipped: { hat: null, scarf: null, background: null, accessory: null },
      sections: {
        addition: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        subtraction: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        multiplication: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        "skip-counting": { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        "area-perimeter": { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
      },
      multiplicationData: {
        bestScores: { single: {}, mixed: 0, boss: 0 },
        missHistory: [],
      },
    },
    addTokens: mockAddTokens,
    updateMultiplicationData: mockUpdateMultiplicationData,
    updateSection: vi.fn(),
    purchaseItem: vi.fn(),
    equipItem: vi.fn(),
    unequipItem: vi.fn(),
    setUserName: vi.fn(),
  }),
}));

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
  mockAddTokens.mockClear();
  mockUpdateMultiplicationData.mockClear();
});

describe("FastMultiplyScreen", () => {
  it("renders mode select on initial load", () => {
    render(<FastMultiplyScreen />);
    expect(screen.getByText("Fast Multiplication")).toBeDefined();
    expect(screen.getByText("Mixed Tables")).toBeDefined();
    expect(screen.getByText("Boss Mode")).toBeDefined();
  });

  it("shows Back link", () => {
    render(<FastMultiplyScreen />);
    expect(screen.getByText(/Back/)).toBeDefined();
  });

  it("starts countdown when mode is selected", () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    render(<FastMultiplyScreen />);

    // Click Mixed Tables
    fireEvent.click(screen.getByText("Mixed Tables"));

    // Should see countdown (3, 2, 1, GO!)
    expect(screen.getByText("3")).toBeDefined();

    vi.useRealTimers();
  });
});
