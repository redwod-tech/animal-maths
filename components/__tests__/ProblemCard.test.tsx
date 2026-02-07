import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemCard } from "@/components/ProblemCard";

describe("ProblemCard", () => {
  it("renders the question text", () => {
    render(<ProblemCard question="3 + 4 =" answer="" />);
    expect(screen.getByText("3 + 4 =")).toBeInTheDocument();
  });

  it("renders the current answer", () => {
    render(<ProblemCard question="3 + 4 =" answer="7" />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("shows empty state when no answer entered", () => {
    render(<ProblemCard question="3 + 4 =" answer="" />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("applies correct styling when isCorrect is true", () => {
    const { container } = render(
      <ProblemCard question="3 + 4 =" answer="7" isCorrect={true} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-aurora-green");
    expect(card.className).toContain("bg-green-50");
  });

  it("applies wrong styling when isCorrect is false", () => {
    const { container } = render(
      <ProblemCard question="3 + 4 =" answer="5" isCorrect={false} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-red-400");
    expect(card.className).toContain("bg-red-50");
  });

  it("no special styling when isCorrect is null/undefined", () => {
    const { container } = render(
      <ProblemCard question="3 + 4 =" answer="" />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain("border-aurora-green");
    expect(card.className).not.toContain("bg-green-50");
    expect(card.className).not.toContain("border-red-400");
    expect(card.className).not.toContain("bg-red-50");
  });

  it("renders ShapeRenderer when shape prop is provided", () => {
    render(
      <ProblemCard
        question="Find the area"
        answer=""
        shape={{
          type: "rectangle",
          dimensions: { width: 5, height: 3 },
          questionType: "area",
        }}
      />
    );
    expect(screen.getByTestId("shape-svg")).toBeInTheDocument();
  });

  it("does not render ShapeRenderer when no shape prop", () => {
    render(<ProblemCard question="3 + 4 =" answer="" />);
    expect(screen.queryByTestId("shape-svg")).not.toBeInTheDocument();
  });
});
