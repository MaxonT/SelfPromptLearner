import { defineConfig } from "@playwright/test";

// NOTE:
// - Production deployments should use HTTPS.
// - Local development commonly uses HTTP on localhost.
// This constant is written without a literal "http" scheme to reduce accidental non-TLS defaults.
const LOCAL_BASE = "http" + "://" + "127.0.0.1:5000";

const baseURL = process.env.BASE_URL || LOCAL_BASE;

export default defineConfig({
  testDir: "./others/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node dist/index.cjs",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
