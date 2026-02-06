import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreakCounter } from "@/components/StreakCounter";

describe("StreakCounter", () => {
  it("renders streak text matching /streak.*\\d/i", () => {
    render(<StreakCounter streak={3} />);
    expect(screen.getByText(/streak.*3/i)).toBeInTheDocument();
  });

  it("shows one flame for streak 1-2", () => {
    const { container } = render(<StreakCounter streak={1} />);
    const flames = container.querySelectorAll('[data-testid="flame"]');
    expect(flames).toHaveLength(1);
  });

  it("shows two flames for streak 3-4", () => {
    const { container } = render(<StreakCounter streak={3} />);
    const flames = container.querySelectorAll('[data-testid="flame"]');
    expect(flames).toHaveLength(2);
  });

  it("shows three flames for streak 5+", () => {
    const { container } = render(<StreakCounter streak={5} />);
    const flames = container.querySelectorAll('[data-testid="flame"]');
    expect(flames).toHaveLength(3);
  });

  it("renders nothing when streak is 0", () => {
    const { container } = render(<StreakCounter streak={0} />);
    expect(container.firstChild).toBeNull();
  });
});
