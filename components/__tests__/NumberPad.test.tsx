import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberPad from "@/components/NumberPad";

describe("NumberPad", () => {
  const defaultProps = {
    onDigit: vi.fn(),
    onBackspace: vi.fn(),
    onSubmit: vi.fn(),
  };

  it("renders all digits 0-9", () => {
    render(<NumberPad {...defaultProps} />);

    for (let d = 0; d <= 9; d++) {
      expect(
        screen.getByRole("button", { name: String(d) })
      ).toBeInTheDocument();
    }
  });

  it("renders backspace and submit buttons", () => {
    render(<NumberPad {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /backspace/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit/i })
    ).toBeInTheDocument();
  });

  it("calls onDigit with correct number when digit button clicked", async () => {
    const onDigit = vi.fn();
    const user = userEvent.setup();

    render(<NumberPad {...defaultProps} onDigit={onDigit} />);

    await user.click(screen.getByRole("button", { name: "7" }));
    expect(onDigit).toHaveBeenCalledWith(7);

    await user.click(screen.getByRole("button", { name: "0" }));
    expect(onDigit).toHaveBeenCalledWith(0);

    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onDigit).toHaveBeenCalledWith(3);
  });

  it("calls onBackspace when backspace clicked", async () => {
    const onBackspace = vi.fn();
    const user = userEvent.setup();

    render(<NumberPad {...defaultProps} onBackspace={onBackspace} />);

    await user.click(screen.getByRole("button", { name: /backspace/i }));
    expect(onBackspace).toHaveBeenCalledOnce();
  });

  it("calls onSubmit when submit clicked", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<NumberPad {...defaultProps} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("all buttons have min-height of 64px (large touch targets for iPad)", () => {
    render(<NumberPad {...defaultProps} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(12); // 10 digits + backspace + submit

    for (const button of buttons) {
      expect(button.className).toMatch(/min-h-16/);
    }
  });

  it("does not render any input elements (no keyboard trigger on iPad)", () => {
    const { container } = render(<NumberPad {...defaultProps} />);

    const inputs = container.querySelectorAll("input, textarea, [contenteditable]");
    expect(inputs).toHaveLength(0);
  });
});
