import { test, expect } from "@playwright/test";

test.describe("Arctic Explorer", () => {
  test("navigate from home to explore and see animals", async ({ page }) => {
    await page.goto("/");

    // Click the Arctic Explorer link
    await page.getByRole("link", { name: "Arctic Explorer" }).click();
    await page.waitForURL("**/explore");

    // Should see the heading
    await expect(page.getByText("Arctic Explorer")).toBeVisible();

    // Animals tab should be active by default
    await expect(page.getByText("Emperor Penguin")).toBeVisible();
    await expect(page.getByText("Polar Bear")).toBeVisible();
  });

  test("switch to facts tab and see facts", async ({ page }) => {
    await page.goto("/explore");

    // Switch to facts tab
    await page.getByRole("button", { name: "Facts" }).click();

    // Should see fact cards
    await expect(page.getByText("Northern Lights")).toBeVisible();
    await expect(page.getByText("Midnight Sun")).toBeVisible();
  });

  test("back link navigates to home", async ({ page }) => {
    await page.goto("/explore");

    await page.getByRole("link", { name: "Back" }).click();
    await page.waitForURL("/");
  });
});
