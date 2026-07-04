import { test, expect } from "@playwright/test";

test.describe("Groundcrew Smoke Tests", () => {
  test("landing page loads with hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Groundcrew/);
    // Hero section visible
    await expect(page.locator("text=Signed to kickoff")).toBeVisible();
  });

  test("login page renders OTP form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type='email'], input[name='email']").first()).toBeVisible();
  });

  test("dashboard loads (redirects to login if not authed)", async ({ page }) => {
    const response = await page.goto("/dashboard");
    // Should either show dashboard or redirect to login
    expect(response?.status()).toBeLessThan(500);
  });

  test("upload page renders intake flow", async ({ page }) => {
    await page.goto("/upload");
    await expect(page.locator("text=Upload")).toBeVisible({ timeout: 10000 });
  });

  test("templates page loads", async ({ page }) => {
    await page.goto("/templates");
    const response = await page.goto("/templates");
    expect(response?.status()).toBe(200);
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/settings");
    const response = await page.goto("/settings");
    expect(response?.status()).toBe(200);
  });

  test("tower page loads", async ({ page }) => {
    await page.goto("/tower");
    const response = await page.goto("/tower");
    expect(response?.status()).toBe(200);
  });

  test("checkout page renders plan selector", async ({ page }) => {
    await page.goto("/pricing/checkout");
    await expect(page.locator("text=Pro")).toBeVisible({ timeout: 10000 });
  });

  test("portal page renders with test token", async ({ page }) => {
    const response = await page.goto("/p/test-token");
    expect(response?.status()).toBe(200);
  });

  test("review page renders with test id", async ({ page }) => {
    const response = await page.goto("/onboardings/test-id/review");
    expect(response?.status()).toBe(200);
  });

  test("API routes reject GET with 405", async ({ request }) => {
    const endpoints = ["/api/upload", "/api/extract", "/api/chase", "/api/portal/otp"];
    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(405);
    }
  });

  test("API /api/asana redirects to OAuth", async ({ request }) => {
    const response = await request.get("/api/asana", {
      maxRedirects: 0,
    });
    // Should redirect (307) to Asana OAuth
    expect([301, 302, 307, 308]).toContain(response.status());
  });

  test("onboardings list page loads", async ({ page }) => {
    const response = await page.goto("/onboardings");
    expect(response?.status()).toBe(200);
  });
});
