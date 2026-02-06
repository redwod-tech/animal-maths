import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionCard } from "@/components/SectionCard";

describe("SectionCard", () => {
  const defaultProps = {
    id: "addition",
    name: "Addition",
    emoji: "🐻",
    level: 3,
  };

  it("renders section name", () => {
    render(<SectionCard {...defaultProps} />);
    expect(screen.getByText("Addition")).toBeInTheDocument();
  });

  it("renders section emoji", () => {
    render(<SectionCard {...defaultProps} />);
    expect(screen.getByText("🐻")).toBeInTheDocument();
  });

  it("renders current level", () => {
    render(<SectionCard {...defaultProps} />);
    expect(screen.getByText("Level 3")).toBeInTheDocument();
  });

  it("links to correct /play/{section} route", () => {
    render(<SectionCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/play/addition");
  });
});
