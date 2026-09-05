import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.mjs",
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "npm run start -- --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
