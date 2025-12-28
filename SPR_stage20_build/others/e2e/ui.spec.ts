import { test, expect } from "@playwright/test";
import crypto from "crypto";

function sha256(text: string) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

test("register → login session → token → ingest → appears in dashboard", async ({ page }) => {
  const email = `e2e_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
  const password = process.env.E2E_PASSWORD || `P@ss_${Date.now()}_${Math.floor(Math.random()*1e6)}`;

  // Go to login
  await page.goto("/login");
  await page.getByTestId("toggle-mode").click(); // switch to register
  await page.getByTestId("email").fill(email);
  await page.getByTestId("password").fill(password);
  await page.getByTestId("submit").click();

  // Should land on home
  await expect(page).toHaveURL(/\/$/);

  // Settings: extract API token (for extension-style auth)
  await page.goto("/settings");
  const tokenLine = page.locator("text=API Token:");
  await expect(tokenLine).toBeVisible();
  const token = (await tokenLine.locator("xpath=..").locator("span.font-mono").textContent())?.trim();
  expect(token).toBeTruthy();

  // Ingest a prompt via API using bearer token (simulates extension sync)
  const promptText = "E2E: hello from playwright";
  const deviceId = "e2e-device";
  const clientEventId = crypto.randomUUID();

  const res = await page.request.post("/api/prompts", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: {
      site: "chatgpt",
      pageUrl: "https://chat.openai.com/",
      conversationId: "e2e",
      promptText,
      promptHash: sha256(promptText),
      deviceId,
      clientEventId,
      meta: null,
      analysis: null,
      tags: ["e2e"],
    },
  });

  expect(res.ok()).toBeTruthy();

  // Back to home: should see the ingested prompt
  await page.goto("/");
  await expect(page.locator(`text=${promptText}`)).toBeVisible();
});

test("export json/csv → delete account → cannot access session", async ({ page }) => {
  const email = `e2e_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
  const password = process.env.E2E_PASSWORD || `P@ss_${Date.now()}_${Math.floor(Math.random()*1e6)}`;

  await page.goto("/login");
  await page.getByTestId("toggle-mode").click();
  await page.getByTestId("email").fill(email);
  await page.getByTestId("password").fill(password);
  await page.getByTestId("submit").click();
  await expect(page).toHaveURL(/\/$/);

  // Go to settings
  await page.goto("/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

  // Export JSON
  const dl1 = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export JSON/i }).click();
  const download1 = await dl1;
  expect(await download1.suggestedFilename()).toMatch(/spr-export\.json/i);

  // Export CSV
  const dl2 = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export CSV/i }).click();
  const download2 = await dl2;
  expect(await download2.suggestedFilename()).toMatch(/spr-export\.csv/i);

  // Delete account (confirm dialog)
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: /Delete Account & Data/i }).click();

  // After deletion, app should send user back to login on navigation
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
});
