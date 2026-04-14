import { test, expect } from "@playwright/test";
import { mockApiRoutes, fillAndSubmitForm, mockDestination } from "./fixtures";

test.describe("Saved trips", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto("/");
  });

  test("save button appears after generation", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await expect(page.getByRole("button", { name: /save trip/i })).toBeVisible();
  });

  test("saving a trip increments the saved trips badge", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await page.getByRole("button", { name: /save trip/i }).click();

    // Badge on the bookmark icon should show 1
    await expect(page.locator("span").filter({ hasText: "1" }).first()).toBeVisible();
  });

  test("opens saved trips panel", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await page.getByRole("button", { name: /save trip/i }).click();
    await page.getByRole("button", { name: /open saved trips/i }).click();

    await expect(page.getByRole("heading", { name: /saved trips/i })).toBeVisible();
    // Match the trip card title (h4) in the saved trips panel
    await expect(page.locator("h4").filter({ hasText: mockDestination.destination.name })).toBeVisible();
  });

  test("deletes a saved trip from the panel", async ({ page }) => {
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });

    await page.getByRole("button", { name: /save trip/i }).click();
    await page.getByRole("button", { name: /open saved trips/i }).click();

    await page.getByRole("button", { name: /delete/i }).click();
    await expect(page.getByText(/no saved trips/i)).toBeVisible();
  });
});
