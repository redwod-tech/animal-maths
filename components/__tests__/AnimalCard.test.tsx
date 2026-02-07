import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnimalCard } from "@/components/AnimalCard";

const testAnimal = {
  id: "emperor-penguin",
  name: "Emperor Penguin",
  emoji: "🐧",
  funFacts: ["Fact 1", "Fact 2"],
  habitat: "Antarctica",
  diet: "Fish, squid, and krill",
};

describe("AnimalCard", () => {
  it("renders animal name and emoji", () => {
    render(
      <AnimalCard animal={testAnimal} isExpanded={false} onToggle={() => {}} />
    );
    expect(screen.getByText("Emperor Penguin")).toBeInTheDocument();
    expect(screen.getByText("🐧")).toBeInTheDocument();
  });

  it("shows habitat", () => {
    render(
      <AnimalCard animal={testAnimal} isExpanded={false} onToggle={() => {}} />
    );
    expect(screen.getByText("Antarctica")).toBeInTheDocument();
  });

  it("does not show fun facts when collapsed", () => {
    render(
      <AnimalCard animal={testAnimal} isExpanded={false} onToggle={() => {}} />
    );
    expect(screen.queryByText("Fact 1")).not.toBeInTheDocument();
  });

  it("shows fun facts and diet when expanded", () => {
    render(
      <AnimalCard animal={testAnimal} isExpanded={true} onToggle={() => {}} />
    );
    expect(screen.getByText("Fact 1")).toBeInTheDocument();
    expect(screen.getByText("Fact 2")).toBeInTheDocument();
    expect(screen.getByText(/Fish, squid/)).toBeInTheDocument();
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <AnimalCard animal={testAnimal} isExpanded={false} onToggle={onToggle} />
    );
    await user.click(screen.getByText("Emperor Penguin"));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
