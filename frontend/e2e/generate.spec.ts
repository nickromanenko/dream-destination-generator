import { test, expect } from "@playwright/test";
import { mockApiRoutes, fillAndSubmitForm, mockDestination } from "./fixtures";

test.describe("Destination generation", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto("/");
  });

  test("shows destination card after generation", async ({ page }) => {
    await fillAndSubmitForm(page);

    await expect(
      page.getByRole("heading", { name: mockDestination.destination.name })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByText(mockDestination.destination.country)
    ).toBeVisible();
    await expect(
      page.getByText(mockDestination.destination.tagline)
    ).toBeVisible();
  });

  test("shows weather information", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await expect(
      page.getByText(mockDestination.weather.temperature)
    ).toBeVisible();
  });

  test("renders itinerary days", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await expect(page.getByText("Day 1")).toBeVisible();
    await expect(page.getByText("Day 2")).toBeVisible();
    await expect(page.getByText(mockDestination.itinerary[0].title)).toBeVisible();
  });

  test("renders insider tips", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await expect(
      page.getByText(mockDestination.insiderTips.localPhrase)
    ).toBeVisible();
    await expect(
      page.getByText(mockDestination.insiderTips.mustTryDishes[0].name)
    ).toBeVisible();
    await expect(
      page.getByText(mockDestination.insiderTips.hiddenGem)
    ).toBeVisible();
  });

  test("shows back button after generation", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await expect(page.getByRole("button", { name: /back to form/i })).toBeVisible();
  });

  test("back button returns to form", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await page.getByRole("button", { name: /back to form/i }).click();
    await expect(page.locator("#vibe")).toBeVisible();
  });

  test("shows error state when API fails", async ({ page }) => {
    // Override the generate route to return an error
    await page.route("http://localhost:8080/api/generate", async (route) => {
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: `event: error\ndata: ${JSON.stringify({ type: "error", message: "Claude is unavailable" })}\n\n`,
      });
    });

    await fillAndSubmitForm(page);
    await expect(page.getByText(/claude is unavailable/i)).toBeVisible({ timeout: 10000 });
  });
});
