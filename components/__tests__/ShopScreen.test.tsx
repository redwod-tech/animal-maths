import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShopScreen from "@/components/ShopScreen";

const mockPurchaseItem = vi.fn();
const mockEquipItem = vi.fn();

vi.mock("@/hooks/useSession", () => ({
  useSession: () => ({
    session: {
      userName: "",
      tokens: 10,
      purchasedItems: ["snowflake-scarf"],
      equipped: { hat: null, scarf: null, background: null, accessory: null },
      sections: {
        addition: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        subtraction: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        multiplication: { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0 },
        "skip-counting": {
          level: 1,
          consecutiveCorrect: 0,
          consecutiveWrong: 0,
        },
        "area-perimeter": {
          level: 1,
          consecutiveCorrect: 0,
          consecutiveWrong: 0,
        },
      },
    },
    addTokens: vi.fn(),
    updateSection: vi.fn(),
    purchaseItem: mockPurchaseItem,
    equipItem: mockEquipItem,
    setUserName: vi.fn(),
  }),
}));

beforeEach(() => {
  mockPurchaseItem.mockClear();
  mockEquipItem.mockClear();
});

describe("ShopScreen", () => {
  it("renders shop items grouped by category", () => {
    render(<ShopScreen />);
    // Check category headers
    expect(screen.getByText("Hats")).toBeInTheDocument();
    expect(screen.getByText("Scarves")).toBeInTheDocument();
    expect(screen.getByText("Accessories")).toBeInTheDocument();
    expect(screen.getByText("Backgrounds")).toBeInTheDocument();
    // Check specific items exist
    expect(screen.getByText("Arctic Explorer Hat")).toBeInTheDocument();
    expect(screen.getByText("Snowflake Scarf")).toBeInTheDocument();
    expect(screen.getByText("Cool Shades")).toBeInTheDocument();
    expect(screen.getByText("Northern Lights")).toBeInTheDocument();
  });

  it("purchase calls purchaseItem", async () => {
    render(<ShopScreen />);
    // Arctic Explorer Hat costs 5 tokens, user has 10
    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    await userEvent.click(buyButtons[0]);
    expect(mockPurchaseItem).toHaveBeenCalled();
  });

  it("equip calls equipItem", async () => {
    render(<ShopScreen />);
    // Snowflake Scarf is purchased but not equipped
    const wearButton = screen.getByRole("button", { name: /wear/i });
    await userEvent.click(wearButton);
    expect(mockEquipItem).toHaveBeenCalled();
  });

  it('already purchased items show "Wear" instead of "Buy"', () => {
    render(<ShopScreen />);
    // Snowflake Scarf is in purchasedItems, so it should show "Wear"
    const wearButtons = screen.getAllByRole("button", { name: /wear/i });
    expect(wearButtons.length).toBeGreaterThanOrEqual(1);
    // Total SHOP_ITEMS = 17, purchased = 1 (snowflake-scarf), so Buy buttons = 16
    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    expect(buyButtons).toHaveLength(16);
  });
});
