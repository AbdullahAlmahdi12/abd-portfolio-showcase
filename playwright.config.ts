import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "browser.spec.ts",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3011", browserName: "chromium", trace: "retain-on-failure" },
  webServer: {
    command: "npm start -- --port 3011",
    url: "http://127.0.0.1:3011",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
