import { test, expect } from "@playwright/test";

test.describe("Area & Perimeter", () => {
  test("navigate to area-perimeter and see shape SVG", async ({ page }) => {
    // Mock generate-problem to return a geometry problem
    await page.route("**/api/generate-problem", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          question: "Find the area of a rectangle with width 4 and height 3",
          answer: 12,
          hint: "Multiply width by height!",
          shape: {
            type: "rectangle",
            dimensions: { width: 4, height: 3 },
            questionType: "area",
          },
        }),
      });
    });

    await page.goto("/play/area-perimeter");

    // Should see the question
    await expect(
      page.getByText("Find the area of a rectangle with width 4 and height 3")
    ).toBeVisible();

    // Should see the SVG shape
    await expect(page.locator('[data-testid="shape-svg"]')).toBeVisible();
  });

  test("answer geometry problem correctly", async ({ page }) => {
    await page.route("**/api/generate-problem", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          question: "Find the area of a rectangle with width 4 and height 3",
          answer: 12,
          hint: "Multiply width by height!",
          shape: {
            type: "rectangle",
            dimensions: { width: 4, height: 3 },
            questionType: "area",
          },
        }),
      });
    });

    await page.goto("/play/area-perimeter");

    await expect(
      page.getByText("Find the area of a rectangle with width 4 and height 3")
    ).toBeVisible();

    // Enter answer: 12
    await page.getByRole("button", { name: "1", exact: true }).click();
    await page.getByRole("button", { name: "2", exact: true }).click();
    await page.getByLabel("Submit").click();

    // Should see celebration
    await expect(page.getByText("Great Job!")).toBeVisible();
  });
});
