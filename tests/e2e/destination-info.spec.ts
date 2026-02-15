import { test, expect } from "@playwright/test";

test.describe("Destination Info Flow", () => {
    test("should show destination highlights", async ({ page }) => {
        await page.goto("/");

        // Wait for landing
        await expect(page.getByText("Where to next?")).toBeVisible({ timeout: 10000 });

        const input = page.locator('input').first();
        await expect(input).toBeVisible();
        await input.fill("Tell me about Barcelona");
        await input.press("Enter");

        await expect(page.getByText(/Barcelona is a stunning destination/)).toBeVisible({ timeout: 10000 });
        await expect(page.getByText("Top Highlights")).toBeVisible();

        // Check for Plan Trip CTA
        const cta = page.getByRole("button", { name: /Plan a trip/i });
        await expect(cta).toBeVisible();
    });
});
