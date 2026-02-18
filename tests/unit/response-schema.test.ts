import { describe, it, expect } from "vitest";
import { generateMockResponse } from "@/app/api/chat/route";


describe("Response Schema Contract", () => {
    it("should validate TRIP_PLAN structure", () => {
        const { data } = generateMockResponse("Trip to Tokyo for 5 days with $3000", 0);
        const block = data?.responseBlock;

        expect(block).toBeDefined();
        expect(block?.type).toBe("TRIP_PLAN");

        // Summary checks
        expect(typeof block?.summary).toBe("string");
        expect(block?.summary.length).toBeGreaterThan(0);

        // Trip Meta
        expect(block?.trip_meta?.destination).toBeDefined();
        expect(block?.trip_meta?.duration).toBeDefined();
        expect(block?.trip_meta?.budget_est).toBeDefined();

        // Sections
        expect(Array.isArray(block?.sections)).toBe(true);
        expect(block?.sections?.length).toBeGreaterThan(0);
        block?.sections?.forEach(section => {
            expect(section.id).toBeDefined();
            expect(section.title).toBeDefined();
            expect(Array.isArray(section.items)).toBe(true);
        });

        // Actions
        expect(Array.isArray(block?.actions)).toBe(true);
        expect(block?.actions?.length).toBeGreaterThan(0);
        expect(block?.actions?.[0]?.style).toBe("SECONDARY");
    });

    it("should validate items structure", () => {
        const { data } = generateMockResponse("Trip to Tokyo for 5 days", 0);
        const items = data?.responseBlock?.sections?.[0]?.items;

        expect(items).toBeDefined();
        if (items && items.length > 0) {
            items.forEach(item => {
                expect(item.id).toBeDefined();
                expect(item.title).toBeDefined();
                expect(typeof item.image_url).toBe("string");
                expect(typeof item.price_chip).toBe("string");
            });
        }
    });
});
