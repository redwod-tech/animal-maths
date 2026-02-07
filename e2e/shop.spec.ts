import { test, expect } from "@playwright/test";

function seedSession(tokens: number, purchasedItems: string[] = []) {
  return JSON.stringify({
    tokens,
    purchasedItems,
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
  });
}

test.describe("Shop", () => {
  test("shop displays items with prices including accessories", async ({ page }) => {
    // Seed localStorage with enough tokens
    await page.goto("/");
    await page.evaluate((data) => {
      localStorage.setItem("animal-maths-session", data);
    }, seedSession(100));
    await page.goto("/shop");

    // Category headings are visible
    await expect(page.getByText("Hats")).toBeVisible();
    await expect(page.getByText("Scarves")).toBeVisible();
    await expect(page.getByText("Accessories")).toBeVisible();
    await expect(page.getByText("Backgrounds")).toBeVisible();

    // Some items with their prices are visible
    await expect(page.getByText("Arctic Explorer Hat")).toBeVisible();
    await expect(page.getByText("5 tokens")).toBeVisible();
    await expect(page.getByText("Snowflake Scarf")).toBeVisible();
    await expect(page.getByText("4 tokens")).toBeVisible();
    await expect(page.getByText("Cool Shades")).toBeVisible();
    await expect(page.getByText("Northern Lights")).toBeVisible();
    await expect(page.getByText("10 tokens")).toBeVisible();
  });

  test("can purchase an item when tokens sufficient", async ({ page }) => {
    // Seed with 100 tokens
    await page.goto("/");
    await page.evaluate((data) => {
      localStorage.setItem("animal-maths-session", data);
    }, seedSession(100));
    await page.goto("/shop");

    // Find the Arctic Explorer Hat card — it's a direct child div of the grid
    // Use a narrow locator: find the heading, go up to the card container
    const hatCard = page
      .locator("h3", { hasText: "Arctic Explorer Hat" })
      .locator("..");
    await hatCard.getByRole("button", { name: "Buy" }).click();

    // After purchasing, the item should show "Wear" button instead of "Buy"
    await expect(
      hatCard.getByRole("button", { name: "Wear" })
    ).toBeVisible();

    // Token count should decrease by 5 (100 - 5 = 95)
    const tokenCounter = page.locator("img[alt='M token'] + span");
    await expect(tokenCounter).toHaveText("95");
  });

  test("navigating back to home works", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((data) => {
      localStorage.setItem("animal-maths-session", data);
    }, seedSession(100));
    await page.goto("/shop");

    await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();

    // Click the Back link
    await page.getByRole("link", { name: "Back" }).click();

    // Should navigate back to home
    await page.waitForURL("/");
    await expect(page.getByText("Animal Maths")).toBeVisible();
  });
});
