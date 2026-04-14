import { test, expect } from "@playwright/test";

test.describe("Dark mode", () => {
  test("toggles dark mode on click", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /switch to (dark|light) mode/i });
    await expect(toggle).toBeVisible();

    const initialIsDark = await page.locator("html").evaluate((el) =>
      el.classList.contains("dark")
    );

    await toggle.click();

    const updatedIsDark = await page.locator("html").evaluate((el) =>
      el.classList.contains("dark")
    );
    expect(updatedIsDark).toBe(!initialIsDark);
  });

  test("persists dark mode preference across reload", async ({ page }) => {
    await page.goto("/");

    // Set dark mode via localStorage then reload
    await page.evaluate(() => {
      localStorage.setItem("dream-destinations-theme", "dark");
    });
    await page.reload();

    // Wait for React to hydrate and apply the class
    await expect(page.locator("html")).toHaveClass(/dark/, { timeout: 5000 });
  });

  test("respects system dark mode preference on first visit", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      colorScheme: "dark",
      baseURL: "http://localhost:3000",
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/");

    // Wait for React hydration to apply system preference
    await expect(page.locator("html")).toHaveClass(/dark/, { timeout: 5000 });

    await context.close();
  });
});
