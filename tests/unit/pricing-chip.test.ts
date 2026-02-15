import { describe, it, expect } from "vitest";
import { generateMockResponse } from "@/app/api/chat/route";

describe("Pricing Chip Formatting", () => {
    it("should format pricing chips as short strings", () => {
        const { data } = generateMockResponse("Trip to Tokyo for 5 days", 0);
        const sections = data?.responseBlock?.sections || [];

        let checkedCount = 0;
        sections.forEach(section => {
            section.items.forEach(item => {
                if (item.price_chip) {
                    // Non-null assertion added as per instruction, though type-narrowed by 'if'
                    expect(item.price_chip!.length).toBeLessThan(50); // Arbitrary "short" limit
                    expect(item.price_chip!).not.toMatch(/\n/); // No newlines (paragraphs)
                    checkedCount++;
                }
            });
        });

        // Ensure we actually checked something
        if (sections.length > 0) {
            expect(checkedCount).toBeGreaterThan(0);
        }
    });

    it("should handle free items correctly if present", () => {
        // Based on mock data specific knowledge or generic logic
        // "Activity" sections sometimes have "Free" items
        const { data } = generateMockResponse("Trip to Tokyo for 5 days", 0);
        const activitySection = data?.responseBlock?.sections.find(s => s.type === "ACTIVITY" || s.type === "HIGHLIGHT");
        if (activitySection) {
            const freeItem = activitySection.items.find(i => i.price_chip?.toLowerCase() === "free");
            if (freeItem && freeItem.price_chip) {
                expect(freeItem.price_chip).toBe("Free");
            }
        }
    });
});
