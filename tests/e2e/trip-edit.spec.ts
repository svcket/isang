import { test, expect } from "@playwright/test";

test.describe("Trip Edit Flow", () => {
    test("should update trip with refinement", async ({ page }) => {
        await page.goto("/");

        // Wait for landing
        await expect(page.getByText("I’m headed to")).toBeVisible({ timeout: 10000 });

        // 1. Create initial plan
        const input = page.getByPlaceholder("What’s the plan, buddy? Tell me anything...");
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
