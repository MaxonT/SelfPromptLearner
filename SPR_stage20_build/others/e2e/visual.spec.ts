import { test, expect } from "@playwright/test";

const VISUAL = process.env.SPR_VISUAL === "1";

/**
 * Visual smoke checks (opt-in).
 * Run locally with: SPR_VISUAL=1 npm run test:ui
 * In CI, this suite is skipped by default to avoid snapshot churn.
 */
test.describe("visual-smoke (opt-in)", () => {
  test.skip(!VISUAL, "Set SPR_VISUAL=1 to enable visual smoke checks.");

  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Sign in|Login|Welcome/i })).toBeVisible();
    await expect(page).toHaveScreenshot("login.png", { fullPage: true });
  });

  test("settings page renders", async ({ page }) => {
    const email = `e2e_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
    const password = process.env.E2E_PASSWORD || `P@ss_${Date.now()}_${Math.floor(Math.random()*1e6)}`;

    await page.goto("/login");
    await page.getByTestId("toggle-mode").click();
    await page.getByTestId("email").fill(email);
    await page.getByTestId("password").fill(password);
    await page.getByTestId("submit").click();
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await expect(page).toHaveScreenshot("settings.png", { fullPage: true });
  });
});
