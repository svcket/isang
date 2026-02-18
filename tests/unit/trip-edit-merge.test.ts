import { describe, it, expect } from "vitest";
import { mergeResponseBlocks } from "@/lib/utils";
import type { ResponseBlock } from "@/types";

describe("Trip Edit Merge Logic", () => {
    const baseBlock: ResponseBlock = {
        type: "TRIP_PLAN",
        summary: "Original summary",
        trip_meta: { destination: "Tokyo", currency: "$", budget_est: "$1000" },
        sections: [
            { id: "sec-1", type: "LODGING", title: "Original Lodging", items: [], sources: [] },
            { id: "sec-2", type: "FOOD", title: "Original Food", items: [], sources: [] }
        ],
        actions: []
    };

    it("should replace updated sections and persist unchanged ones", () => {
        const updateBlock: ResponseBlock = {
            type: "TRIP_EDIT",
            summary: "Updated summary",
            trip_meta: { destination: "Tokyo", currency: "$", budget_est: "$1200" }, // Budget updated
            sections: [
                { id: "sec-1", type: "LODGING", title: "Updated Lodging", items: [{ id: "new-1", title: "New Hotel", image_url: "", meta: [], price_chip: "$200" }], sources: [] }
            ],
            actions: []
        };

        const merged = mergeResponseBlocks(baseBlock, updateBlock);

        expect(merged.summary).toBe("Updated summary");
        expect(merged.trip_meta?.budget_est).toBe("$1200");

        // Check replaced section
        const sec1 = merged.sections?.find(s => s.id === "sec-1");
        expect(sec1?.title).toBe("Updated Lodging");
        expect(sec1?.items.length).toBe(1);

        // Check persisted section
        const sec2 = merged.sections?.find(s => s.id === "sec-2");
        expect(sec2?.title).toBe("Original Food");
    });

    it("should add new sections if they don't exist", () => {
        const newSectionBlock: ResponseBlock = {
            type: "TRIP_EDIT",
            summary: "Added section",
            trip_meta: { destination: "Tokyo", currency: "$", budget_est: "$1000" },
            sections: [
                { id: "sec-3", type: "ACTIVITY", title: "New Activities", items: [], sources: [] }
            ],
            actions: []
        };

        const merged = mergeResponseBlocks(baseBlock, newSectionBlock);
        expect(merged.sections?.length).toBe(3);
        expect(merged.sections?.find(s => s.id === "sec-3")).toBeDefined();
    });
});
