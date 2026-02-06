import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExplanationCard } from "@/components/ExplanationCard";

const defaultProps = {
  steps: ["First, count 3 penguins", "Then add 4 more", "Now count all: 7!"],
  encouragement: "You're doing great! Let's try again!",
  onTryAgain: vi.fn(),
  onReadAloud: vi.fn(),
};

describe("ExplanationCard", () => {
  it("renders all explanation steps", () => {
    render(<ExplanationCard {...defaultProps} />);
    expect(
      screen.getByText("First, count 3 penguins")
    ).toBeInTheDocument();
    expect(screen.getByText("Then add 4 more")).toBeInTheDocument();
    expect(screen.getByText("Now count all: 7!")).toBeInTheDocument();
  });

  it("renders encouragement message", () => {
    render(<ExplanationCard {...defaultProps} />);
    expect(
      screen.getByText("You're doing great! Let's try again!")
    ).toBeInTheDocument();
  });

  it('renders "Read Aloud" button', () => {
    render(<ExplanationCard {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /read aloud/i })
    ).toBeInTheDocument();
  });

  it('renders "Try Again" button', () => {
    render(<ExplanationCard {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });

  it('calls onTryAgain when "Try Again" clicked', async () => {
    const onTryAgain = vi.fn();
    render(<ExplanationCard {...defaultProps} onTryAgain={onTryAgain} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onTryAgain).toHaveBeenCalledOnce();
  });

  it('calls onReadAloud when "Read Aloud" clicked', async () => {
    const onReadAloud = vi.fn();
    render(<ExplanationCard {...defaultProps} onReadAloud={onReadAloud} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /read aloud/i }));
    expect(onReadAloud).toHaveBeenCalledOnce();
  });

  it("renders penguin-teacher image", () => {
    render(<ExplanationCard {...defaultProps} />);
    const img = screen.getByRole("img", { name: /penguin/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/images/penguin-teacher.png");
  });
});
