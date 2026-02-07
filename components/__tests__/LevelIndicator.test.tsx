import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LevelIndicator } from "@/components/LevelIndicator";
import { PROMOTE_THRESHOLD } from "@/lib/difficulty";

describe("LevelIndicator", () => {
  it("renders 5 level dots", () => {
    const { container } = render(
      <LevelIndicator level={1} consecutiveCorrect={0} section="addition" />
    );
    const dots = container.querySelectorAll('[data-testid="level-dot"]');
    expect(dots).toHaveLength(5);
  });

  it("fills dots up to current level", () => {
    const { container } = render(
      <LevelIndicator level={3} consecutiveCorrect={0} section="addition" />
    );
    const dots = container.querySelectorAll('[data-testid="level-dot"]');
    const filled = Array.from(dots).filter((d) =>
      d.classList.contains("bg-aurora-green")
    );
    expect(filled).toHaveLength(3);
  });

  it("shows section emoji and name", () => {
    render(
      <LevelIndicator level={1} consecutiveCorrect={0} section="addition" />
    );
    expect(screen.getByText(/addition/i)).toBeInTheDocument();
  });

  it("renders progress pips matching PROMOTE_THRESHOLD (5)", () => {
    const { container } = render(
      <LevelIndicator level={1} consecutiveCorrect={0} section="addition" />
    );
    const pips = container.querySelectorAll('[data-testid="progress-pip"]');
    expect(pips).toHaveLength(PROMOTE_THRESHOLD);
    expect(pips).toHaveLength(5);
  });

  it("fills correct number of progress pips", () => {
    const { container } = render(
      <LevelIndicator level={2} consecutiveCorrect={3} section="subtraction" />
    );
    const pips = container.querySelectorAll('[data-testid="progress-pip"]');
    expect(pips).toHaveLength(PROMOTE_THRESHOLD);
    const filled = Array.from(pips).filter((p) =>
      p.classList.contains("bg-gold")
    );
    expect(filled).toHaveLength(3);
  });
});
