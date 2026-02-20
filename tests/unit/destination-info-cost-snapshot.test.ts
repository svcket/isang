import { describe, it, expect } from "vitest";
import { generateMockResponse } from "@/app/api/chat/route";
import { ResponseBlock } from "@/types";

describe("Destination Info - Pattern B+ Criteria", () => {
    it("should return DESTINATION_INFO with highlights when cost keywords are present", () => {
        const response = generateMockResponse("How much does a trip to Paris cost?", 0);
        const block = response.data?.responseBlock;

        expect(block?.type).toBe("DESTINATION_INFO");
        expect(block?.summary).toContain("Paris");

        // Cost queries now return highlights feed (cost_snapshot was removed in highlights refactor)
        const highlightsBlock = block?.blocks?.find(b => b.kind === "highlights");
        expect(highlightsBlock).toBeDefined();
    });

    it("should return DESTINATION_INFO with Highlights for generic city query", () => {
        const response = generateMockResponse("What can you tell me about Barcelona?", 0);
        const block = response.data?.responseBlock;

        expect(block?.type).toBe("DESTINATION_INFO");

        // Should NOT have cost snapshot
        const costBlock = block?.blocks?.find(b => b.kind === "cost_snapshot");
        expect(costBlock).toBeUndefined();

        // Should HAVE highlights
        const highlightsBlock = block?.blocks?.find(b => b.kind === "highlights");
        expect(highlightsBlock).toBeDefined();
        if (highlightsBlock && highlightsBlock.kind === 'highlights') {
            expect(highlightsBlock.items.length).toBeGreaterThanOrEqual(3);
        }
    });

    it("should return DESTINATION_INFO (highlights) even for 'trip to X' if no other details", () => {
        // "Trip to Paris" -> Ambiguous, but per user rule, if no duration/budget, default to Info?
        // Actually, user said: "Only output TRIP_PLAN when plan-ready: destination + (dates OR duration) + (budget OR “budget-friendly” cue)"
        // So "Trip to Paris" should return DESTINATION_INFO.

        const response = generateMockResponse("Trip to Paris", 0);
        const block = response.data?.responseBlock;

        expect(block?.type).toBe("DESTINATION_INFO");
    });
});
