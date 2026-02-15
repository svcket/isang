import { test, expect } from "@playwright/test";

test.describe("Trip Plan Flow", () => {
    test("should create a trip plan from prompt", async ({ page }) => {
        await page.goto("/");

        // Wait for landing
        await expect(page.getByText("Where to next?")).toBeVisible({ timeout: 10000 });

        // Type prompt
        const input = page.locator('input').first(); // Generic input
        await expect(input).toBeVisible();
        await input.fill("Trip to Tokyo for 5 days");
        await input.press("Enter");

        // Wait for response
        await expect(page.getByText(/trip plan/i)).toBeVisible({ timeout: 15000 });

        // Check for sections
        await expect(page.getByText("Where to Stay")).toBeVisible();
        await expect(page.getByText("Local Eats")).toBeVisible();

        // Check Actions
        const cta = page.getByRole("button", { name: /Create itinerary/i });
        await expect(cta).toBeVisible();

        // Click CTA
        await cta.click();

        // Verify Itinerary View
        // Depending on transition, check URL or specific element
        // await expect(page).toHaveURL(/.*itinerary/); // If URL changes
        // OR check for itinerary specific element
        await expect(page.getByText("Itinerary")).toBeVisible();
    });
});
