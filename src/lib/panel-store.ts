import { create } from "zustand";
import type { EntityType, PanelPayload } from "@/types/panel";

// ─── Panel State ───────────────────────────────────────────────────────

interface PanelState {
    // Visibility
    open: boolean;

    // Selected entity
    selected: {
        entity_type: EntityType;
        entity_id: string;
        title?: string;
    } | null;

    // Cached payloads keyed by "TYPE:id"
    panelData: Record<string, PanelPayload>;

    // Active tab within panel
    activeTab: string;

    // Loading / Error
    loading: boolean;
    error: string | null;

    // Gallery sub-modal
    galleryOpen: boolean;
    galleryIndex: number;

    // ─── Actions ───────────────────────────────────────────────────────

    openPanel: (item: {
        entity_type: EntityType;
        entity_id: string;
        title?: string;
    }) => void;

    closePanel: () => void;

    hydratePanel: (key: string, payload: PanelPayload) => void;

    setActiveTab: (tab: string) => void;

    openGallery: (index?: number) => void;
    closeGallery: () => void;
}

// ─── Helper: cache key ─────────────────────────────────────────────────

export function panelCacheKey(type: EntityType, id: string): string {
    return `${type}:${id}`;
}

// ─── Store ─────────────────────────────────────────────────────────────

export const usePanelStore = create<PanelState>((set) => ({
    open: false,
    selected: null,
    panelData: {},
    activeTab: "",
    loading: false,
    error: null,
    galleryOpen: false,
    galleryIndex: 0,

    openPanel: (item) =>
        set({
            open: true,
            selected: item,
            activeTab: "", // will be set by DetailPanel after data loads
            loading: true,
            error: null,
            galleryOpen: false,
            galleryIndex: 0,
        }),

    closePanel: () =>
        set({
            open: false,
            selected: null,
            activeTab: "",
            loading: false,
            error: null,
            galleryOpen: false,
        }),

    hydratePanel: (key, payload) =>
        set((state) => ({
            panelData: { ...state.panelData, [key]: payload },
            loading: false,
            activeTab: payload.tabs[0] || "",
        })),

    setActiveTab: (tab) => set({ activeTab: tab }),

    openGallery: (index = 0) =>
        set({ galleryOpen: true, galleryIndex: index }),

    closeGallery: () =>
        set({ galleryOpen: false }),
}));
