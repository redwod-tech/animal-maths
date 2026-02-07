import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExploreScreen from "@/components/ExploreScreen";

vi.mock("@/hooks/useSession", () => ({
  useSession: () => ({
    session: {
      tokens: 0,
      userName: "",
      purchasedItems: [],
      equipped: { hat: null, scarf: null, background: null, accessory: null },
      sections: {},
    },
    addTokens: vi.fn(),
    updateSection: vi.fn(),
    purchaseItem: vi.fn(),
    equipItem: vi.fn(),
    unequipItem: vi.fn(),
    setUserName: vi.fn(),
  }),
}));

describe("ExploreScreen", () => {
  it("renders Arctic Explorer heading", () => {
    render(<ExploreScreen />);
    expect(screen.getByText("Arctic Explorer")).toBeInTheDocument();
  });

  it("renders Animals and Facts tabs", () => {
    render(<ExploreScreen />);
    expect(screen.getByText("Animals")).toBeInTheDocument();
    expect(screen.getByText("Facts")).toBeInTheDocument();
  });

  it("shows animals by default", () => {
    render(<ExploreScreen />);
    expect(screen.getByText("Emperor Penguin")).toBeInTheDocument();
    expect(screen.getByText("Polar Bear")).toBeInTheDocument();
  });

  it("switches to facts tab", async () => {
    const user = userEvent.setup();
    render(<ExploreScreen />);

    await user.click(screen.getByText("Facts"));

    expect(screen.getByText("Northern Lights")).toBeInTheDocument();
    expect(screen.getByText("Midnight Sun")).toBeInTheDocument();
  });

  it("switches back to animals tab", async () => {
    const user = userEvent.setup();
    render(<ExploreScreen />);

    await user.click(screen.getByText("Facts"));
    await user.click(screen.getByText("Animals"));

    expect(screen.getByText("Emperor Penguin")).toBeInTheDocument();
  });

  it("has a back link to home", () => {
    render(<ExploreScreen />);
    const backLink = screen.getByRole("link", { name: /back/i });
    expect(backLink).toHaveAttribute("href", "/");
  });
});
