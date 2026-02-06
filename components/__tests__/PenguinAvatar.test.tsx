import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PenguinAvatar } from "@/components/PenguinAvatar";

describe("PenguinAvatar", () => {
  const emptyEquipped = { hat: null, scarf: null, background: null };

  it("renders the penguin image", () => {
    render(<PenguinAvatar equipped={emptyEquipped} />);
    const img = screen.getByAltText(/penguin/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/images/penguin.png");
  });

  it("renders with default md size", () => {
    const { container } = render(
      <PenguinAvatar equipped={emptyEquipped} />
    );
    // md size container should have w-24 h-24
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("w-24");
  });

  it("renders sm size when specified", () => {
    const { container } = render(
      <PenguinAvatar equipped={emptyEquipped} size="sm" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("w-16");
  });

  it("renders lg size when specified", () => {
    const { container } = render(
      <PenguinAvatar equipped={emptyEquipped} size="lg" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("w-32");
  });

  it("shows hat emoji overlay when hat is equipped", () => {
    const equipped = { hat: "arctic-explorer-hat", scarf: null, background: null };
    render(<PenguinAvatar equipped={equipped} />);
    // Arctic Explorer Hat emoji is 🧊
    expect(screen.getByText("🧊")).toBeInTheDocument();
  });

  it("shows scarf emoji overlay when scarf is equipped", () => {
    const equipped = { hat: null, scarf: "snowflake-scarf", background: null };
    render(<PenguinAvatar equipped={equipped} />);
    expect(screen.getByText("❄️")).toBeInTheDocument();
  });

  it("shows background emoji overlay when background is equipped", () => {
    const equipped = { hat: null, scarf: null, background: "northern-lights" };
    render(<PenguinAvatar equipped={equipped} />);
    expect(screen.getByText("🌌")).toBeInTheDocument();
  });

  it("does not render overlays when nothing is equipped", () => {
    const { container } = render(
      <PenguinAvatar equipped={emptyEquipped} />
    );
    // Only the image should be inside, no emoji spans
    const emojiSpans = container.querySelectorAll("[data-testid^='cosmetic-']");
    expect(emojiSpans).toHaveLength(0);
  });

  it("renders multiple overlays simultaneously", () => {
    const equipped = {
      hat: "arctic-explorer-hat",
      scarf: "snowflake-scarf",
      background: "northern-lights",
    };
    render(<PenguinAvatar equipped={equipped} />);
    expect(screen.getByText("🧊")).toBeInTheDocument();
    expect(screen.getByText("❄️")).toBeInTheDocument();
    expect(screen.getByText("🌌")).toBeInTheDocument();
  });
});
