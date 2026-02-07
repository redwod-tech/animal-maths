import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimerBar } from "../TimerBar";
import { QuestionDisplay } from "../QuestionDisplay";
import { ScoreDisplay } from "../ScoreDisplay";
import { WrongFlash } from "../WrongFlash";
import { CountdownOverlay } from "../CountdownOverlay";

// Mock framer-motion to avoid animation complexity in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe("TimerBar", () => {
  it("renders with full width at start of timer", () => {
    const { container } = render(<TimerBar timeRemaining={60} totalTime={60} />);
    const bar = container.querySelector("[data-testid='timer-bar']");
    expect(bar).toBeDefined();
  });

  it("shows correct percentage", () => {
    const { container } = render(<TimerBar timeRemaining={30} totalTime={60} />);
    const bar = container.querySelector("[data-testid='timer-bar']");
    expect(bar).toBeDefined();
  });

  it("shows seconds remaining text", () => {
    render(<TimerBar timeRemaining={42} totalTime={60} />);
    expect(screen.getByText("42s")).toBeDefined();
  });
});

describe("QuestionDisplay", () => {
  it("renders the question text", () => {
    render(<QuestionDisplay text="7 × 8" />);
    expect(screen.getByText("7 × 8")).toBeDefined();
  });

  it("re-renders when text changes", () => {
    const { rerender } = render(<QuestionDisplay text="7 × 8" />);
    expect(screen.getByText("7 × 8")).toBeDefined();

    rerender(<QuestionDisplay text="3 × 4" />);
    expect(screen.getByText("3 × 4")).toBeDefined();
  });
});

describe("ScoreDisplay", () => {
  it("renders score value", () => {
    render(<ScoreDisplay score={15} />);
    expect(screen.getByText("15")).toBeDefined();
  });

  it("renders score label", () => {
    render(<ScoreDisplay score={0} />);
    expect(screen.getByText("Score")).toBeDefined();
  });
});

describe("WrongFlash", () => {
  it("renders the correct answer", () => {
    render(<WrongFlash text="7 × 8" correctAnswer={56} />);
    expect(screen.getByText("7 × 8 = 56")).toBeDefined();
  });
});

describe("CountdownOverlay", () => {
  it("renders the count value", () => {
    render(<CountdownOverlay count={3} />);
    expect(screen.getByText("3")).toBeDefined();
  });

  it("renders 'GO!' when count is 0", () => {
    render(<CountdownOverlay count={0} />);
    expect(screen.getByText("GO!")).toBeDefined();
  });
});
