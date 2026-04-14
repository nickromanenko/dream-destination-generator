import { test, expect } from "@playwright/test";
import { mockApiRoutes, fillAndSubmitForm } from "./fixtures";

test.describe("Generator form", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto("/");
  });

  test("renders form fields", async ({ page }) => {
    await expect(page.locator("#vibe")).toBeVisible();
    await expect(page.locator("#travelStyle")).toBeVisible();
    await expect(page.locator("#season")).toBeVisible();
    await expect(page.locator("#budgetTier")).toBeVisible();
  });

  test("submit button is disabled until all fields are filled", async ({
    page,
  }) => {
    const submit = page.getByRole("button", { name: /generate my dream/i });
    await expect(submit).toBeDisabled();

    await page.locator("#vibe").fill("I love exploring beaches and coastal towns");
    await expect(submit).toBeDisabled(); // still needs dropdowns

    await page.locator("#travelStyle").selectOption("relaxation");
    await page.locator("#season").selectOption("summer");
    await page.locator("#budgetTier").selectOption("budget");
    await expect(submit).toBeEnabled();
  });

  test("submit button is disabled when vibe is too short", async ({ page }) => {
    await page.locator("#vibe").fill("hi");
    await page.locator("#travelStyle").selectOption("relaxation");
    await page.locator("#season").selectOption("summer");
    await page.locator("#budgetTier").selectOption("budget");
    await expect(page.getByRole("button", { name: /generate my dream/i })).toBeDisabled();
  });

  test("shows loading state after submit", async ({ page }) => {
    // Delay the SSE response so the loading state is visible
    await page.route("http://localhost:8080/api/generate", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
        body: `event: status\ndata: ${JSON.stringify({ type: "status", message: "Analyzing your travel vibe..." })}\n\nevent: done\ndata: ${JSON.stringify({ type: "done", message: "Complete", data: null })}\n\n`,
      });
    });

    await fillAndSubmitForm(page);
    await expect(page.getByText(/analyzing your travel vibe/i)).toBeVisible({ timeout: 2000 });
  });
});
