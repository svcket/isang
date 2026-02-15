import { describe, it, expect } from "vitest";
import { generateMockResponse } from "@/app/api/chat/route";

describe("Intent Router Logic", () => {
    it("should classify TRIP_PLAN when destination and duration are present", () => {
        const { data } = generateMockResponse("Trip to Tokyo for 5 days", 0);
        expect(data?.responseBlock?.type).toBe("TRIP_PLAN");
        expect(data?.responseBlock?.trip_meta?.destination).toBe("Tokyo");
        expect(data?.responseBlock?.trip_meta?.duration).toBe("5 days");
    });

    it("should classify TRIP_PLAN when destination and budget are present", () => {
        const { data } = generateMockResponse("Trip to Bali with $1000 budget", 0);
        expect(data?.responseBlock?.type).toBe("TRIP_PLAN");
        expect(data?.responseBlock?.trip_meta?.destination).toBe("Bali");
        expect(data?.responseBlock?.trip_meta?.budget_est).toContain("$1");
    });

    it("should classify DESTINATION_INFO when only destination is present", () => {
        const { data } = generateMockResponse("Tell me about Paris", 0);
        expect(data?.responseBlock?.type).toBe("DESTINATION_INFO");
        expect(data?.responseBlock?.trip_meta?.destination).toBe("Paris");
    });

    it("should return fallback message for unclear intent", () => {
        const { reply, data } = generateMockResponse("Hello there", 0);
        expect(reply).toContain("could you tell me where you want to go");
        expect(data).toBeUndefined();
    });

    it("should handle Santorini special case", () => {
        const { data } = generateMockResponse("Plan a trip to Santorini", 0);
        expect(data?.tripSnapshot?.destination).toBe("Santorini, Greece");
        // The specific logic for Santorini returns a full tripSnapshot directly in data,
        // or a responseBlock. The mock logic does:
        // data: { tripSnapshot: ..., responseBlock: ... }
        expect(data?.responseBlock?.type).toBe("TRIP_PLAN");
    });
});
