import { describe, it, expect, beforeEach } from "vitest";
import { usePanelStore, panelCacheKey } from "@/lib/panel-store";
import type { PanelPayload } from "@/types/panel";

describe("Panel Store", () => {
    beforeEach(() => {
        // Reset store to defaults
        usePanelStore.setState({
            open: false,
            selected: null,
            panelData: {},
            activeTab: "",
            loading: false,
            error: null,
            galleryOpen: false,
            galleryIndex: 0,
        });
    });

    it("should open panel with selected entity", () => {
        const store = usePanelStore.getState();
        store.openPanel({ entity_type: "HOTEL", entity_id: "h1", title: "Grand Hotel" });

        const state = usePanelStore.getState();
        expect(state.open).toBe(true);
        expect(state.selected?.entity_type).toBe("HOTEL");
        expect(state.selected?.entity_id).toBe("h1");
        expect(state.selected?.title).toBe("Grand Hotel");
        expect(state.loading).toBe(true);
    });

    it("should close panel and clear selection", () => {
        const store = usePanelStore.getState();
        store.openPanel({ entity_type: "HOTEL", entity_id: "h1" });
        store.closePanel();

        const state = usePanelStore.getState();
        expect(state.open).toBe(false);
        expect(state.selected).toBeNull();
        expect(state.loading).toBe(false);
    });

    it("should hydrate panel data and cache it", () => {
        const mockPayload: PanelPayload = {
            panel_type: "HOTEL",
            header: { title: "Test Hotel" },
            hero: { layout: "grid", images: [] },
            tabs: ["Overview", "Reviews"],
            sections: [],
            actions: [],
        };

        const store = usePanelStore.getState();
        const key = panelCacheKey("HOTEL", "h1");
        store.hydratePanel(key, mockPayload);

        const state = usePanelStore.getState();
        expect(state.panelData[key]).toBeDefined();
        expect(state.panelData[key]!.header.title).toBe("Test Hotel");
        expect(state.loading).toBe(false);
        expect(state.activeTab).toBe("Overview");
    });

    it("should generate correct cache keys", () => {
        expect(panelCacheKey("DESTINATION", "barcelona")).toBe("DESTINATION:barcelona");
        expect(panelCacheKey("HOTEL", "h-123")).toBe("HOTEL:h-123");
    });

    it("should manage gallery state", () => {
        const store = usePanelStore.getState();
        store.openGallery(3);

        let state = usePanelStore.getState();
        expect(state.galleryOpen).toBe(true);
        expect(state.galleryIndex).toBe(3);

        store.closeGallery();
        state = usePanelStore.getState();
        expect(state.galleryOpen).toBe(false);
    });

    it("should set active tab", () => {
        const store = usePanelStore.getState();
        store.setActiveTab("Reviews");

        expect(usePanelStore.getState().activeTab).toBe("Reviews");
    });
});
