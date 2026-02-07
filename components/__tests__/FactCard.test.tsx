import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FactCard } from "@/components/FactCard";

const testFact = {
  id: "northern-lights",
  title: "Northern Lights",
  emoji: "🌌",
  description: "Colorful lights in the sky near the North Pole.",
  category: "Sky",
};

describe("FactCard", () => {
  it("renders fact title and emoji", () => {
    render(<FactCard fact={testFact} />);
    expect(screen.getByText("Northern Lights")).toBeInTheDocument();
    expect(screen.getByText("🌌")).toBeInTheDocument();
  });

  it("renders fact description", () => {
    render(<FactCard fact={testFact} />);
    expect(screen.getByText(/Colorful lights/)).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(<FactCard fact={testFact} />);
    expect(screen.getByText("Sky")).toBeInTheDocument();
  });
});
