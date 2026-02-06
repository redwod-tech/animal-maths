import { test, expect } from "@playwright/test";

test.describe("Difficulty progression", () => {
  test("difficulty increases after streak of correct answers", async ({
    page,
  }) => {
    // Track the level sent in API requests
    const requestLevels: number[] = [];

    // Mock generate-problem to capture the level from each request
    await page.route("**/api/generate-problem", async (route) => {
      const body = route.request().postDataJSON();
      requestLevels.push(body.level);

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

    await page.route("**/api/explain", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          steps: ["Try again!"],
          encouragement: "You can do it!",
        }),
      });
    });

    await page.goto("/play/addition");

    // The promote threshold is 5 consecutive correct answers.
    // We need to answer correctly 5 times to trigger level promotion,
    // then the 6th problem fetch should have level 2.
    for (let i = 0; i < 5; i++) {
      // Wait for problem to load
      await expect(page.getByText("2 + 3 = ?")).toBeVisible();

      // Enter correct answer: 5
      await page.getByRole("button", { name: "5", exact: true }).click();
      await page.getByLabel("Submit").click();

      // Wait for celebration overlay
      await expect(page.getByText("Great Job!")).toBeVisible();

      // Dismiss celebration to trigger next problem fetch
      await page.getByText("Great Job!").click();
    }

    // Wait for the 6th problem to load (this one should have level 2)
    await expect(page.getByText("2 + 3 = ?")).toBeVisible();

    // Verify the API request levels:
    // First request (initial load): level 1
    // Requests 2-5 (after correct answers 1-4): still level 1
    // Request 6 (after 5th correct answer triggers promotion): level 2
    expect(requestLevels.length).toBeGreaterThanOrEqual(6);
    expect(requestLevels[0]).toBe(1); // Initial fetch at level 1
    expect(requestLevels[5]).toBe(2); // After 5 correct, promoted to level 2

    // Also verify via localStorage
    const session = await page.evaluate(() => {
      const raw = localStorage.getItem("animal-maths-session");
      return raw ? JSON.parse(raw) : null;
    });

    expect(session).not.toBeNull();
    expect(session.sections.addition.level).toBe(2);
  });
});
