import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ConfettiEffect } from "@/components/ConfettiEffect";

describe("ConfettiEffect", () => {
  it("renders between 20-30 confetti particles", () => {
    const { container } = render(<ConfettiEffect />);
    const particles = container.querySelectorAll('[data-testid="confetti-particle"]');
    expect(particles.length).toBeGreaterThanOrEqual(20);
    expect(particles.length).toBeLessThanOrEqual(30);
  });

  it("particles are positioned absolutely", () => {
    const { container } = render(<ConfettiEffect />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("absolute");
    expect(wrapper.className).toContain("inset-0");
  });
});
