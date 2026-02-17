import { test, expect } from "@playwright/test";

test.describe("Destination Info Flow", () => {
    test("should show destination highlights", async ({ page }) => {
        await page.goto("/");

        // Wait for landing (Mad Libs hero)
        await expect(page.getByText("I’m headed to")).toBeVisible({ timeout: 10000 });

        const input = page.getByPlaceholder("What’s the plan, buddy? Tell me anything...");
        await expect(input).toBeVisible();
        await input.fill("Tell me about Barcelona");
        await input.press("Enter");

        await expect(page.getByText(/Barcelona is a beautiful destination/)).toBeVisible({ timeout: 10000 });
        await expect(page.getByText("Top highlight Barcelona")).toBeVisible();

        // Check for Plan Trip CTA
        const cta = page.getByRole("button", { name: /Plan a trip/i });
        await expect(cta).toBeVisible();
    });
});
