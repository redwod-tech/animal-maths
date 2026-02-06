import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomeScreen from "@/components/HomeScreen";

vi.mock("@/hooks/useSession", () => ({
  useSession: () => ({
    session: {
      tokens: 10,
      purchasedItems: [],
      equipped: { hat: null, scarf: null, background: null },
      sections: {
        addition: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        subtraction: { level: 2, consecutiveCorrect: 0, consecutiveWrong: 0 },
        multiplication: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        "skip-counting": {
          level: 3,
          consecutiveCorrect: 0,
          consecutiveWrong: 0,
        },
      },
    },
    addTokens: vi.fn(),
    updateSection: vi.fn(),
    purchaseItem: vi.fn(),
    equipItem: vi.fn(),
  }),
}));

describe("HomeScreen", () => {
  it("renders all 4 section cards", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Addition")).toBeInTheDocument();
    expect(screen.getByText("Subtraction")).toBeInTheDocument();
    expect(screen.getByText("Multiplication")).toBeInTheDocument();
    expect(screen.getByText("Skip Counting")).toBeInTheDocument();
  });

  it("renders penguin avatar image", () => {
    render(<HomeScreen />);
    const penguinImg = screen.getByAltText(/penguin/i);
    expect(penguinImg).toBeInTheDocument();
  });

  it("renders token counter", () => {
    render(<HomeScreen />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders shop link", () => {
    render(<HomeScreen />);
    const shopLink = screen.getByRole("link", { name: /shop/i });
    expect(shopLink).toHaveAttribute("href", "/shop");
  });

  it("section cards link to correct routes", () => {
    render(<HomeScreen />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/play/addition");
    expect(hrefs).toContain("/play/subtraction");
    expect(hrefs).toContain("/play/multiplication");
    expect(hrefs).toContain("/play/skip-counting");
  });
});
