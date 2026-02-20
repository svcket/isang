import { describe, it, expect } from "vitest";
import { ResponseBlock, DestinationBlock } from "@/types";

describe("Response Schema - Destination Info", () => {
    it("should validate a valid DESTINATION_INFO payload with Cost Snapshot (Pattern B+)", () => {
        const payload: ResponseBlock = {
            type: "DESTINATION_INFO",
            summary: "Barcelona offers a vibrant mix of Gothic history.",
            blocks: [
                {
                    kind: "intro",
                    text: "Barcelona is a Mediterranean metropolis.",
                },
                {
                    kind: "cost_snapshot",
                    currency: "EUR",
                    tiers: [
                        { label: "Budget", range: "€60-90", note: "Hostel" },
                    ],
                    typicals: [
                        { label: "Coffee", value: "€2.50" },
                    ],
                    actions: [{ label: "Set dates", action_id: "set_budget", style: "PRIMARY" }]
                },
                {
                    kind: "highlights",
                    items: [
                        {
                            id: "sagrada",
                            title: "Sagrada Família",
                            description: "Masterpiece.",
                            photo_urls: ["/img1.jpg"],
                            actions: []
                        }
                    ]
                }
            ],
            sections: [], // Should be empty or optional
            actions: []   // Global actions
        };

        expect(payload.type).toBe("DESTINATION_INFO");
        expect(payload.blocks).toHaveLength(3);
        expect(payload.blocks?.[1]?.kind).toBe("cost_snapshot");
    });

    it("should validate a valid DESTINATION_INFO payload without Cost Snapshot", () => {
        const payload: ResponseBlock = {
            type: "DESTINATION_INFO",
            summary: "Vienna is the capital of music.",
            blocks: [
                { kind: "intro", text: "Vienna info." },
                { kind: "highlights", items: [] }
            ],
            sections: [],
            actions: []
        };

        expect(payload.type).toBe("DESTINATION_INFO");
        expect(payload.blocks).toHaveLength(2);
        const costBlock = payload.blocks!.find(b => b.kind === "cost_snapshot");
        expect(costBlock).toBeUndefined();
    });
});
