import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomeScreen from "@/components/HomeScreen";

const mockSetUserName = vi.fn();

const defaultMockSession = {
  tokens: 10,
  userName: "Ava",
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
};

let mockSession = { ...defaultMockSession };

vi.mock("@/hooks/useSession", () => ({
  useSession: () => ({
    session: mockSession,
    addTokens: vi.fn(),
    updateSection: vi.fn(),
    purchaseItem: vi.fn(),
    equipItem: vi.fn(),
    unequipItem: vi.fn(),
    setUserName: mockSetUserName,
  }),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    mockSession = { ...defaultMockSession };
    mockSetUserName.mockClear();
  });

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
    const shopLink = screen.getByRole("link", { name: /^shop$/i });
    expect(shopLink).toHaveAttribute("href", "/shop");
  });

  it("renders My Collection link", () => {
    render(<HomeScreen />);
    const collectionLink = screen.getByRole("link", {
      name: /my collection/i,
    });
    expect(collectionLink).toHaveAttribute("href", "/collections");
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

  it("shows welcome message when userName is set", () => {
    mockSession = { ...defaultMockSession, userName: "Ava" };
    render(<HomeScreen />);
    expect(screen.getByText(/welcome.*ava/i)).toBeInTheDocument();
  });

  it("shows name input when userName is empty", () => {
    mockSession = { ...defaultMockSession, userName: "" };
    render(<HomeScreen />);
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  });

  it("saves name when submitted", async () => {
    mockSession = { ...defaultMockSession, userName: "" };
    const user = userEvent.setup();
    render(<HomeScreen />);

    const input = screen.getByPlaceholderText(/name/i);
    await user.type(input, "Ava");
    await user.click(screen.getByRole("button", { name: /go|start|save/i }));

    expect(mockSetUserName).toHaveBeenCalledWith("Ava");
  });
});
