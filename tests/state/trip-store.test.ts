import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/lib/store";

describe("Trip Store (Zustand)", () => {
    beforeEach(() => {
        useAppStore.getState().reset();
    });

    it("should start with default state", () => {
        const state = useAppStore.getState();
        expect(state.messages).toEqual([]);
        expect(state.isLoading).toBe(false);
        expect(state.tripSnapshot).toBeNull();
    });

    it("should add messages", () => {
        const msg = { id: "1", role: "user" as const, content: "Hello", timestamp: new Date() };
        useAppStore.getState().addMessage(msg);
        expect(useAppStore.getState().messages).toContainEqual(msg);
    });

    it("should toggle selected items", () => {
        const store = useAppStore.getState();
        store.toggleItem("item-1");
        expect(useAppStore.getState().selectedItems).toContain("item-1");

        useAppStore.getState().toggleItem("item-1");
        expect(useAppStore.getState().selectedItems).not.toContain("item-1");
    });

    it("should update trip snapshot", () => {
        const snapshot = { destination: "Paris", duration: "5 days" };
        useAppStore.getState().setTripSnapshot(snapshot);
        expect(useAppStore.getState().tripSnapshot).toEqual(snapshot);
    });

    it("should process assistant data correctly", () => {
        const data = {
            tripSnapshot: { destination: "London" },
            sections: [{ category: "stays" as const, title: "Stays", items: [] }],
            itinerary: null
        };
        // @ts-ignore
        useAppStore.getState().processAssistantData(data);

        const state = useAppStore.getState();
        expect(state.tripSnapshot?.destination).toBe("London");
        expect(state.suggestions.length).toBe(1);
        expect(state.activeView).toBe("suggestions");
    });
});
