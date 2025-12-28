import { test, expect } from "@playwright/test";
import path from "path";

test("extension harness: configure token + inject capture + sync to server", async () => {
  // NOTE: Extensions require a persistent context and (usually) headed mode.
  const extensionPath = path.resolve(__dirname, "..", "extension");
  const userDataDir = path.resolve(__dirname, "..", ".pw-ext-user-data");

  const { chromium } = await import("playwright");

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  try {
    // Wait for service worker (MV3)
    let sw = context.serviceWorkers()[0];
    if (!sw) sw = await context.waitForEvent("serviceworker", { timeout: 15000 });

    const extensionId = await sw.evaluate(() => chrome.runtime.id);
    expect(extensionId).toBeTruthy();

    // Enable E2E mode in background
    await sw.evaluate(() => {
      return chrome.runtime.sendMessage({ type: "SPR_E2E_ENABLE" });
    });

    // Configure server URL + API token in extension storage
await sw.evaluate(({ serverUrl, token }) => {
  return chrome.runtime.sendMessage({
    type: "SET_SETTINGS",
    payload: { serverUrl, apiToken: token, autoSync: true },
  });
}, { serverUrl, token });

// Open fixture page (stable)
    const page = await context.newPage();
    await page.goto(`${serverUrl}/e2e/fixture/chat.html`);

    // Inject a prompt via E2E hook (bypasses DOM fragility, but exercises queue+sync+auth)
    const promptText = `E2E prompt ${Date.now()}`;
    const payload = {
      promptText,
      site: "e2e-fixture",
      pageUrl: page.url(),
      conversationId: "e2e-fixture",
    };

    const res = await sw.evaluate((payload) => {
      return chrome.runtime.sendMessage({ type: "SPR_E2E_CAPTURE", payload });
    }, payload);

    expect((res as any)?.ok).toBeTruthy();

    // Trigger sync via message
    await sw.evaluate(() => chrome.runtime.sendMessage({ type: "TRIGGER_SYNC" }));

    // Give it a moment
    await page.waitForTimeout(1500);

    // Verify server has the prompt via API (requires a valid token in env)
    // If no token provided, the test still verifies extension ran without crashing.
    {
      const apiRes = await page.request.get(`${serverUrl}/api/prompts?limit=5&offset=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(apiRes.ok()).toBeTruthy();
      const body = await apiRes.json();
      const texts = (body?.items || []).map((x: any) => x.promptText);
      expect(texts).toContain(promptText);
    }
  } finally {
    await context.close();
  }
});
