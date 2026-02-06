import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShopItem } from "@/components/ShopItem";

describe("ShopItem", () => {
  const defaultProps = {
    id: "hat-1",
    name: "Top Hat",
    cost: 50,
    emoji: "🎩",
    isPurchased: false,
    isEquipped: false,
    canAfford: true,
    onBuy: vi.fn(),
    onEquip: vi.fn(),
  };

  it("renders item name and cost", () => {
    render(<ShopItem {...defaultProps} />);
    expect(screen.getByText("Top Hat")).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('renders "Buy" button when affordable and not purchased', () => {
    render(<ShopItem {...defaultProps} />);
    expect(screen.getByRole("button", { name: /buy/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buy/i })).toBeEnabled();
  });

  it('renders "Wear" button when purchased but not equipped', () => {
    render(
      <ShopItem {...defaultProps} isPurchased={true} isEquipped={false} />
    );
    expect(screen.getByRole("button", { name: /wear/i })).toBeInTheDocument();
  });

  it('"Wearing" indicator when equipped', () => {
    render(<ShopItem {...defaultProps} isPurchased={true} isEquipped={true} />);
    expect(screen.getByText(/wearing/i)).toBeInTheDocument();
  });

  it("disables purchase when tokens < cost", () => {
    render(<ShopItem {...defaultProps} canAfford={false} />);
    const buyButton = screen.getByRole("button");
    expect(buyButton).toBeDisabled();
  });

  it("calls onBuy when Buy clicked", async () => {
    const onBuy = vi.fn();
    render(<ShopItem {...defaultProps} onBuy={onBuy} />);
    const buyButton = screen.getByRole("button", { name: /buy/i });
    await userEvent.click(buyButton);
    expect(onBuy).toHaveBeenCalledOnce();
  });

  it("calls onEquip when Wear clicked", async () => {
    const onEquip = vi.fn();
    render(
      <ShopItem
        {...defaultProps}
        isPurchased={true}
        isEquipped={false}
        onEquip={onEquip}
      />
    );
    const wearButton = screen.getByRole("button", { name: /wear/i });
    await userEvent.click(wearButton);
    expect(onEquip).toHaveBeenCalledOnce();
  });
});
