import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    // Mock APIs to avoid real calls during navigation
    await page.route("**/api/generate-problem", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          question: "2 + 3 = ?",
          answer: 5,
          hint: "Count on your fingers!",
        }),
      });
    });
  });

  test("home page loads with penguin and section cards", async ({ page }) => {
    await page.goto("/");

    // Penguin avatar is visible
    await expect(page.getByAltText("penguin avatar")).toBeVisible();

    // Title is visible
    await expect(page.getByText("Animal Maths")).toBeVisible();

    // All four section cards are visible
    await expect(page.getByText("Addition")).toBeVisible();
    await expect(page.getByText("Subtraction")).toBeVisible();
    await expect(page.getByText("Multiplication")).toBeVisible();
    await expect(page.getByText("Skip Counting")).toBeVisible();
  });

  test("clicking a section card navigates to play screen", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Addition").click();

    // Should navigate to /play/addition and show play screen
    await page.waitForURL("**/play/addition");
    await expect(page.getByText("2 + 3 = ?")).toBeVisible();
  });

  test("shop button navigates to shop", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Shop" }).click();

    await page.waitForURL("**/shop");
    await expect(page.getByText("Shop")).toBeVisible();
  });

  test("token counter displays on home", async ({ page }) => {
    await page.goto("/");

    // Token counter should show the default 0 tokens
    await expect(page.getByAltText("M token")).toBeVisible();
    await expect(page.getByText("0")).toBeVisible();
  });
});
