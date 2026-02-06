import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollectionItem } from "@/components/CollectionItem";

describe("CollectionItem", () => {
  const defaultProps = {
    emoji: "🧊",
    name: "Arctic Explorer Hat",
    isEquipped: false,
    onToggleEquip: vi.fn(),
  };

  it("renders emoji and name", () => {
    render(<CollectionItem {...defaultProps} />);
    expect(screen.getByText("🧊")).toBeInTheDocument();
    expect(screen.getByText("Arctic Explorer Hat")).toBeInTheDocument();
  });

  it('shows "Equipped" badge when equipped', () => {
    render(<CollectionItem {...defaultProps} isEquipped={true} />);
    expect(screen.getByText(/equipped/i)).toBeInTheDocument();
  });

  it('does not show "Equipped" badge when not equipped', () => {
    render(<CollectionItem {...defaultProps} isEquipped={false} />);
    expect(screen.queryByText(/equipped/i)).not.toBeInTheDocument();
  });

  it("calls onToggleEquip when tapped", async () => {
    const onToggleEquip = vi.fn();
    render(
      <CollectionItem {...defaultProps} onToggleEquip={onToggleEquip} />
    );
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(onToggleEquip).toHaveBeenCalledOnce();
  });

  it('shows "Wear" label when not equipped', () => {
    render(<CollectionItem {...defaultProps} isEquipped={false} />);
    expect(screen.getByRole("button", { name: /wear/i })).toBeInTheDocument();
  });

  it('shows "Remove" label when equipped', () => {
    render(<CollectionItem {...defaultProps} isEquipped={true} />);
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });
});
