import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModeSelect } from "../ModeSelect";
import { RoundEnd } from "../RoundEnd";
import { DrillEnd } from "../DrillEnd";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, whileHover, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileTap, whileHover, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe("ModeSelect", () => {
  it("renders all three mode buttons", () => {
    render(
      <ModeSelect
        bestScores={{ single: {}, mixed: 0, boss: 0 }}
        missHistoryCount={0}
        onSelectMode={() => {}}
      />
    );
    expect(screen.getByText("Mixed Tables")).toBeDefined();
    expect(screen.getByText("Boss Mode")).toBeDefined();
  });

  it("calls onSelectMode with mixed when Mixed is clicked", () => {
    const onSelect = vi.fn();
    render(
      <ModeSelect
        bestScores={{ single: {}, mixed: 0, boss: 0 }}
        missHistoryCount={0}
        onSelectMode={onSelect}
      />
    );
    fireEvent.click(screen.getByText("Mixed Tables"));
    expect(onSelect).toHaveBeenCalledWith("mixed");
  });

  it("shows best scores for modes that have them", () => {
    render(
      <ModeSelect
        bestScores={{ single: { 7: 15 }, mixed: 20, boss: 5 }}
        missHistoryCount={3}
        onSelectMode={() => {}}
      />
    );
    expect(screen.getByText("Best: 20")).toBeDefined();
    expect(screen.getByText("Best: 5")).toBeDefined();
  });

  it("disables boss mode when no miss history", () => {
    render(
      <ModeSelect
        bestScores={{ single: {}, mixed: 0, boss: 0 }}
        missHistoryCount={0}
        onSelectMode={() => {}}
      />
    );
    const bossBtn = screen.getByText("Boss Mode").closest("button");
    expect(bossBtn?.disabled).toBe(true);
  });

  it("enables boss mode when miss history exists", () => {
    render(
      <ModeSelect
        bestScores={{ single: {}, mixed: 0, boss: 0 }}
        missHistoryCount={3}
        onSelectMode={() => {}}
      />
    );
    const bossBtn = screen.getByText("Boss Mode").closest("button");
    expect(bossBtn?.disabled).toBe(false);
  });
});

describe("RoundEnd", () => {
  it("renders score and accuracy", () => {
    render(
      <RoundEnd
        score={15}
        totalAnswered={20}
        correctCount={15}
        bestStreak={5}
        isNewBest={false}
        tokensEarned={5}
        onContinue={() => {}}
      />
    );
    expect(screen.getByText("15")).toBeDefined();
    expect(screen.getByText("75%")).toBeDefined();
  });

  it("shows new best indicator", () => {
    render(
      <RoundEnd
        score={25}
        totalAnswered={25}
        correctCount={25}
        bestStreak={10}
        isNewBest={true}
        tokensEarned={8}
        onContinue={() => {}}
      />
    );
    expect(screen.getByText("New Best!")).toBeDefined();
  });

  it("shows tokens earned", () => {
    render(
      <RoundEnd
        score={15}
        totalAnswered={20}
        correctCount={15}
        bestStreak={5}
        isNewBest={false}
        tokensEarned={5}
        onContinue={() => {}}
      />
    );
    expect(screen.getByText("+5 tokens")).toBeDefined();
  });

  it("calls onContinue when button is clicked", () => {
    const onContinue = vi.fn();
    render(
      <RoundEnd
        score={15}
        totalAnswered={20}
        correctCount={15}
        bestStreak={5}
        isNewBest={false}
        tokensEarned={5}
        onContinue={onContinue}
      />
    );
    fireEvent.click(screen.getByText("Continue"));
    expect(onContinue).toHaveBeenCalled();
  });
});

describe("DrillEnd", () => {
  it("renders drill summary", () => {
    render(
      <DrillEnd corrected={3} total={5} onContinue={() => {}} />
    );
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
    expect(screen.getByText("Drill Complete!")).toBeDefined();
  });

  it("calls onContinue when Done is clicked", () => {
    const onContinue = vi.fn();
    render(
      <DrillEnd corrected={3} total={5} onContinue={onContinue} />
    );
    fireEvent.click(screen.getByText("Done"));
    expect(onContinue).toHaveBeenCalled();
  });
});
