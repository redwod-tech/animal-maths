import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CollectionsScreen from "@/components/CollectionsScreen";

const mockEquipItem = vi.fn();
const mockUnequipItem = vi.fn();

const defaultMockSession = {
  userName: "Ava",
  tokens: 15,
  purchasedItems: ["arctic-explorer-hat", "snowflake-scarf"],
  equipped: { hat: "arctic-explorer-hat", scarf: null, background: null },
  sections: {
    addition: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
    subtraction: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
    multiplication: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
    "skip-counting": { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
  },
};

let mockSession = { ...defaultMockSession };

vi.mock("@/hooks/useSession", () => ({
  useSession: () => ({
    session: mockSession,
    addTokens: vi.fn(),
    updateSection: vi.fn(),
    purchaseItem: vi.fn(),
    equipItem: mockEquipItem,
    unequipItem: mockUnequipItem,
    setUserName: vi.fn(),
  }),
}));

describe("CollectionsScreen", () => {
  beforeEach(() => {
    mockSession = { ...defaultMockSession };
    mockEquipItem.mockClear();
    mockUnequipItem.mockClear();
  });

  it("renders Back link", () => {
    render(<CollectionsScreen />);
    const backLink = screen.getByRole("link", { name: /back/i });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders TokenCounter with current tokens", () => {
    render(<CollectionsScreen />);
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("renders PenguinAvatar", () => {
    render(<CollectionsScreen />);
    const img = screen.getByAltText(/penguin/i);
    expect(img).toBeInTheDocument();
  });

  it('renders "My Collection" title', () => {
    render(<CollectionsScreen />);
    expect(screen.getByText("My Collection")).toBeInTheDocument();
  });

  it("renders category headers", () => {
    render(<CollectionsScreen />);
    expect(screen.getByText("Hats")).toBeInTheDocument();
    expect(screen.getByText("Scarves")).toBeInTheDocument();
    expect(screen.getByText("Backgrounds")).toBeInTheDocument();
  });

  it("shows progress for each category", () => {
    render(<CollectionsScreen />);
    // 1 of 2 hats purchased, 1 of 2 scarves, 0 of 2 backgrounds
    const progressTexts = screen.getAllByText(/of 2 collected/);
    expect(progressTexts).toHaveLength(3);
  });

  it("shows purchased items as CollectionItem cards", () => {
    render(<CollectionsScreen />);
    expect(screen.getByText("Arctic Explorer Hat")).toBeInTheDocument();
    expect(screen.getByText("Snowflake Scarf")).toBeInTheDocument();
  });

  it("shows Equipped badge on equipped item", () => {
    render(<CollectionsScreen />);
    // arctic-explorer-hat is equipped
    expect(screen.getByText(/equipped/i)).toBeInTheDocument();
  });

  it("shows empty state for categories with no purchased items", () => {
    render(<CollectionsScreen />);
    // No backgrounds purchased
    expect(
      screen.getByText(/no backgrounds yet/i)
    ).toBeInTheDocument();
  });

  it("renders Visit Shop link", () => {
    render(<CollectionsScreen />);
    const shopLink = screen.getByRole("link", { name: /visit shop/i });
    expect(shopLink).toHaveAttribute("href", "/shop");
  });

  it("calls equipItem when tapping unequipped item", async () => {
    render(<CollectionsScreen />);
    // Snowflake Scarf is purchased but not equipped
    const wearButton = screen.getByRole("button", { name: /wear snowflake scarf/i });
    await userEvent.click(wearButton);
    expect(mockEquipItem).toHaveBeenCalledWith("snowflake-scarf", "scarf");
  });

  it("calls unequipItem when tapping equipped item", async () => {
    render(<CollectionsScreen />);
    // Arctic Explorer Hat is equipped
    const removeButton = screen.getByRole("button", {
      name: /remove arctic explorer hat/i,
    });
    await userEvent.click(removeButton);
    expect(mockUnequipItem).toHaveBeenCalledWith("hat");
  });

  it("shows empty state for all categories when nothing purchased", () => {
    mockSession = { ...defaultMockSession, purchasedItems: [] };
    render(<CollectionsScreen />);
    expect(screen.getByText(/no hats yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no scarves yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no backgrounds yet/i)).toBeInTheDocument();
  });
});
