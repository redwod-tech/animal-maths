import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PenguinAvatar } from "@/components/PenguinAvatar";

describe("PenguinAvatar", () => {
  const emptyEquipped = { hat: null, scarf: null, background: null, accessory: null };

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
    const equipped = { ...emptyEquipped, hat: "arctic-explorer-hat" };
    render(<PenguinAvatar equipped={equipped} />);
    expect(screen.getByText("🧊")).toBeInTheDocument();
  });

  it("shows scarf emoji overlay when scarf is equipped", () => {
    const equipped = { ...emptyEquipped, scarf: "snowflake-scarf" };
    render(<PenguinAvatar equipped={equipped} />);
    expect(screen.getByText("❄️")).toBeInTheDocument();
  });

  it("shows background with gradient when bgStyle present", () => {
    const equipped = { ...emptyEquipped, background: "northern-lights" };
    const { container } = render(<PenguinAvatar equipped={equipped} />);
    const bg = container.querySelector('[data-testid="cosmetic-background"]');
    expect(bg).toBeInTheDocument();
    expect(bg!.className).toContain("bg-gradient");
  });

  it("shows accessory emoji overlay when accessory is equipped", () => {
    const equipped = { ...emptyEquipped, accessory: "cool-shades" };
    render(<PenguinAvatar equipped={equipped} />);
    expect(screen.getByText("🕶️")).toBeInTheDocument();
    const accessoryEl = screen.getByTestId("cosmetic-accessory");
    expect(accessoryEl).toBeInTheDocument();
  });

  it("does not render overlays when nothing is equipped", () => {
    const { container } = render(
      <PenguinAvatar equipped={emptyEquipped} />
    );
    const emojiSpans = container.querySelectorAll("[data-testid^='cosmetic-']");
    expect(emojiSpans).toHaveLength(0);
  });

  it("renders multiple overlays simultaneously", () => {
    const equipped = {
      hat: "arctic-explorer-hat",
      scarf: "snowflake-scarf",
      background: "northern-lights",
      accessory: "bow-tie",
    };
    render(<PenguinAvatar equipped={equipped} />);
    expect(screen.getByText("🧊")).toBeInTheDocument();
    expect(screen.getByText("❄️")).toBeInTheDocument();
    expect(screen.getByTestId("cosmetic-background")).toBeInTheDocument();
    expect(screen.getByText("🎀")).toBeInTheDocument();
  });

  it("has rounded-full overflow-hidden on container", () => {
    const { container } = render(
      <PenguinAvatar equipped={emptyEquipped} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("rounded-full");
    expect(wrapper.className).toContain("overflow-hidden");
  });
});
