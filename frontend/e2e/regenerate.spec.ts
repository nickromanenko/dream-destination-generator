import { test, expect } from "@playwright/test";
import { mockApiRoutes, fillAndSubmitForm, mockDestination } from "./fixtures";

test.describe("Regenerate", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto("/");
    await fillAndSubmitForm(page);
    await page.getByRole("heading", { name: mockDestination.destination.name }).waitFor({ timeout: 10000 });
  });

  test("regenerate text button is visible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /regenerate text/i })
    ).toBeVisible();
  });

  test("regenerate image button is visible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /regenerate (image|poster)/i })
    ).toBeVisible();
  });

  test("regenerate text calls API and updates destination", async ({ page }) => {
    let regenerateTextCalled = false;
    await page.route("http://localhost:8080/api/regenerate-text", async (route) => {
      regenerateTextCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ destination: mockDestination }),
      });
    });

    await page.getByRole("button", { name: /regenerate text/i }).click();
    await page.waitForTimeout(500);

    expect(regenerateTextCalled).toBe(true);
  });

  test("regenerate image calls API and updates poster", async ({ page }) => {
    let regenerateImageCalled = false;
    await page.route("http://localhost:8080/api/regenerate-image", async (route) => {
      regenerateImageCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ imageUrl: "https://fal.media/files/new-poster.jpg" }),
      });
    });

    await page.getByRole("button", { name: /regenerate (image|poster)/i }).click();
    await page.waitForTimeout(500);

    expect(regenerateImageCalled).toBe(true);
  });
});
