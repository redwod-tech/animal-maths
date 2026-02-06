import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TokenCounter from "@/components/TokenCounter";

describe("TokenCounter", () => {
  it("renders the token count", () => {
    render(<TokenCounter tokens={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders the M token image", () => {
    render(<TokenCounter tokens={3} />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", expect.stringMatching(/token/i));
    expect(img).toHaveAttribute("src", "/images/m-token.png");
  });

  it("displays 0 when tokens is 0", () => {
    render(<TokenCounter tokens={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("displays large numbers correctly", () => {
    render(<TokenCounter tokens={1234} />);
    expect(screen.getByText("1234")).toBeInTheDocument();
  });
});
