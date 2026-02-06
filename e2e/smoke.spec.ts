import { test, expect } from "@playwright/test";

test("page loads with title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Animal Maths");
});
