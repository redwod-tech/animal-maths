import { test, expect } from "@playwright/test";

test.describe("Play flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the generate-problem API to return deterministic problems
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

    // Mock the explain API
    await page.route("**/api/explain", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          steps: ["Look at the numbers", "Add them together", "2 + 3 = 5"],
          encouragement: "You can do it!",
        }),
      });
    });
  });

  test("can solve a problem: enter digits via number pad, submit, see celebration", async ({
    page,
  }) => {
    await page.goto("/play/addition");

    // Wait for the problem to load
    await expect(page.getByText("2 + 3 = ?")).toBeVisible();

    // Click digit 5 on the number pad
    await page.getByRole("button", { name: "5", exact: true }).click();

    // Submit the answer
    await page.getByLabel("Submit").click();

    // Should see celebration overlay
    await expect(page.getByText("Great Job!")).toBeVisible();
  });

  test("wrong answer shows explanation with try again button", async ({
    page,
  }) => {
    await page.goto("/play/addition");

    // Wait for the problem to load
    await expect(page.getByText("2 + 3 = ?")).toBeVisible();

    // Click wrong digit 4
    await page.getByRole("button", { name: "4", exact: true }).click();

    // Submit the answer
    await page.getByLabel("Submit").click();

    // Should see explanation card
    await expect(page.getByText("Let me explain!")).toBeVisible();
    await expect(page.getByText("Look at the numbers")).toBeVisible();
    await expect(page.getByText("You can do it!")).toBeVisible();

    // Try Again button should be visible
    await expect(
      page.getByRole("button", { name: "Try Again" })
    ).toBeVisible();
  });

  test("tokens increase after correct answer", async ({ page }) => {
    await page.goto("/play/addition");

    // Wait for the problem to load
    await expect(page.getByText("2 + 3 = ?")).toBeVisible();

    // Initially tokens are 0 — the token counter shows "0"
    const tokenCounter = page.locator("img[alt='M token'] + span");
    await expect(tokenCounter).toHaveText("0");

    // Enter correct answer: 5
    await page.getByRole("button", { name: "5", exact: true }).click();
    await page.getByLabel("Submit").click();

    // Celebration overlay shows tokens awarded
    await expect(page.getByText("Great Job!")).toBeVisible();
    // The overlay shows "+3 tokens" (reward for first try)
    await expect(page.getByText("tokens")).toBeVisible();

    // Dismiss the celebration overlay by clicking it
    await page.getByText("Great Job!").click();

    // After dismissal, wait for next problem to load and check token counter
    // Token counter should now show 3
    await expect(page.getByText("2 + 3 = ?")).toBeVisible();
    // The token counter in the header should reflect the new total
    await expect(tokenCounter).toHaveText("3");
  });

  test("can navigate back to home from play screen", async ({ page }) => {
    await page.goto("/play/addition");

    // Wait for the problem to load
    await expect(page.getByText("2 + 3 = ?")).toBeVisible();

    // Click the Back link
    await page.getByRole("link", { name: "Back" }).click();

    // Should navigate back to home
    await page.waitForURL("/");
    await expect(page.getByText("Animal Maths")).toBeVisible();
  });
});
