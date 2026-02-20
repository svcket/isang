import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/lib/store";

describe("Transition Flow & Store", () => {
    beforeEach(() => {
        useAppStore.getState().reset();
    });

    it("should toggle highlights in store", () => {
        const store = useAppStore.getState();
        expect(store.selectedHighlights).toHaveLength(0);

        store.toggleHighlight("h1");
        expect(useAppStore.getState().selectedHighlights).toContain("h1");

        store.toggleHighlight("h1");
        expect(useAppStore.getState().selectedHighlights).not.toContain("h1");
    });

    // We cannot easily test the async API call in ChatMessages unit test without mocking fetch/store fully.
    // So we focus on the store state logic here.
});
