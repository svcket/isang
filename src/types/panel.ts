import type { Item } from "./response-block";

// ─── Entity Types ──────────────────────────────────────────────────────

export type EntityType =
    | "DESTINATION"
    | "PLACE"
    | "HOTEL"
    | "RESTAURANT"
    | "ACTIVITY"
    | "FLIGHT";

// ─── Image Reference ───────────────────────────────────────────────────

export interface ImageRef {
    id: string;
    url: string;
    source?: string;        // "unsplash" | "google_places" | "internal"
    attribution?: string;
    kind?: "hero" | "gallery" | "thumb";
}

// ─── Panel Payload (rendering contract) ────────────────────────────────

export interface PanelPayload {
    panel_type: EntityType;
    header: {
        title: string;
        subtitle?: string;
        rating?: number;
        reviews_count?: number;
        tags?: string[];
    };
    hero: {
        layout: "single" | "grid" | "none";
        images: ImageRef[];
        cta?: { label: string; action: string };
    };
    tabs: string[];
    sections: PanelSection[];
    actions: PanelAction[];
}

// ─── Panel Section ─────────────────────────────────────────────────────

export interface PanelSection {
    id: string;
    title: string;
    blocks: PanelBlock[];
}

// ─── Panel Content Blocks ──────────────────────────────────────────────

export type PanelBlock =
    | { type: "text"; content: string }
    | { type: "pros_cons"; pros: string[]; cons: string[] }
    | { type: "travel_advice"; items: { season: string; text: string }[] }
    | { type: "qa_list"; items: { q: string; action: string; payload?: unknown }[] }
    | { type: "info_grid"; items: { label: string; value: string; icon?: string }[] }
    | { type: "rail"; title: string; items: Item[] };

// ─── Panel Actions ─────────────────────────────────────────────────────

export interface PanelAction {
    id: string;
    label: string;
    variant: "primary" | "secondary" | "ghost";
    icon?: string;          // lucide icon name
    action: string;         // "TOGGLE_SAVE" | "ADD_TO_TRIP" | "SHARE" | "OPEN_LINK"
    payload?: unknown;
}
