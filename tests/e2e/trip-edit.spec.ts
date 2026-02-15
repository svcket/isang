import { test, expect } from "@playwright/test";

test.describe("Trip Edit Flow", () => {
    test("should update trip with refinement", async ({ page }) => {
        await page.goto("/");

        // Wait for landing
        await expect(page.getByText("Where to next?")).toBeVisible({ timeout: 10000 });

        // 1. Create initial plan
        const input = page.locator('input').first();
        await expect(input).toBeVisible();
        await input.fill("Trip to Tokyo for 5 days");
        await input.press("Enter");

        await expect(page.getByText(/trip plan/i)).toBeVisible({ timeout: 15000 });

        // 2. Refine (Edit)
        await input.fill("Show cheaper stays");
        await input.press("Enter");

        // 3. Verify Update
        await expect(page.getByText("Updated lodging options")).toBeVisible();
        await expect(page.getByText("$1000")).toBeVisible(); // Cheaper budget
    });
});
