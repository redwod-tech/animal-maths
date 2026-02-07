import { test, expect } from "@playwright/test";

test.describe("Fast Multiplication", () => {
  test("mode select screen loads from home", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Multiplication").click();
    await page.waitForURL("**/play/multiplication");

    // Should show mode select
    await expect(page.getByText("Fast Multiplication")).toBeVisible();
    await expect(page.getByText("Mixed Tables")).toBeVisible();
    await expect(page.getByText("Boss Mode")).toBeVisible();
  });

  test("can select single table and see countdown", async ({ page }) => {
    await page.goto("/play/multiplication");
    await expect(page.getByText("Fast Multiplication")).toBeVisible();

    // Click ×7 table
    await page.getByText("×7").click();

    // Should see countdown (3, 2, 1, GO!)
    await expect(page.getByText("3")).toBeVisible();
    // Wait for GO!
    await expect(page.getByText("GO!")).toBeVisible({ timeout: 5000 });
  });

  test("gameplay shows timer, score, question, and number pad", async ({ page }) => {
    await page.goto("/play/multiplication");

    // Select Mixed Tables
    await page.getByText("Mixed Tables").click();

    // Wait for countdown to finish
    await expect(page.getByText("GO!")).toBeVisible({ timeout: 5000 });

    // Wait for gameplay to appear (after GO! disappears)
    await page.waitForTimeout(1000);

    // Should see score display
    await expect(page.getByText("Score")).toBeVisible();

    // Should see a multiplication question with ×
    await expect(page.locator("text=/\\d+ × \\d+/")).toBeVisible();

    // Should see number pad (digit buttons)
    await expect(page.getByRole("button", { name: "5", exact: true })).toBeVisible();
    await expect(page.getByLabel("Submit")).toBeVisible();
  });

  test("can answer a question correctly", async ({ page }) => {
    await page.goto("/play/multiplication");

    // Select ×2 (easiest table for predictable answers)
    await page.getByText("×2").click();

    // Wait for countdown
    await expect(page.getByText("GO!")).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // Read the question text
    const questionEl = page.locator("text=/\\d+ × \\d+/");
    await expect(questionEl).toBeVisible();
    const questionText = await questionEl.textContent();

    // Parse the question to compute answer
    const match = questionText?.match(/(\d+) × (\d+)/);
    if (!match) throw new Error("Could not parse question");
    const answer = parseInt(match[1]) * parseInt(match[2]);

    // Type the answer digit by digit
    const digits = String(answer).split("");
    for (const digit of digits) {
      await page.getByRole("button", { name: digit, exact: true }).click();
    }

    // Submit
    await page.getByLabel("Submit").click();

    // Score should now be 1
    await expect(page.getByText("1")).toBeVisible();
  });

  test("back link returns to home", async ({ page }) => {
    await page.goto("/play/multiplication");
    await expect(page.getByText("Fast Multiplication")).toBeVisible();

    await page.getByRole("link", { name: /Back/ }).click();
    await page.waitForURL("/");
    await expect(page.getByText("Animal Maths")).toBeVisible();
  });

  test("boss mode is disabled when no miss history", async ({ page }) => {
    // Clear localStorage
    await page.goto("/play/multiplication");
    await page.evaluate(() => {
      const session = JSON.parse(localStorage.getItem("animal-maths-session") || "{}");
      session.multiplicationData = {
        bestScores: { single: {}, mixed: 0, boss: 0 },
        missHistory: [],
      };
      localStorage.setItem("animal-maths-session", JSON.stringify(session));
    });
    await page.reload();

    const bossBtn = page.getByText("Boss Mode");
    await expect(bossBtn).toBeVisible();
    // Boss button should be disabled
    const btn = bossBtn.locator("..");
    await expect(btn).toBeDisabled();
  });
});
