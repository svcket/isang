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
        location?: string;
        rating?: number;
        reviews_count?: number;
        reviews_count_formatted?: string;
        category?: string;
        tags?: string[];
    };
    hero: PanelHero;
    tabs: string[];
    sections: PanelSection[];
    actions: PanelAction[];
}

// ─── Panel Section ─────────────────────────────────────────────────────

export interface PanelHero {
    images: ImageRef[];
    title: string;
    subtitle?: string; // High-fidelity overlay
    description?: string;
    layout?: 'single' | 'grid' | 'none';
    cta?: {
        label: string;
        action: string;
    };
}

export interface PanelSection {
    id: string;
    title: string;
    blocks: PanelBlock[];
    is_booking_required?: boolean; // Controls overview layout
}

// ─── Panel Content Blocks ──────────────────────────────────────────────

export interface DayHours {
    day: string;
    hours: string;
}

export type PanelBlock =
    | { type: "text"; content: string; variant?: 'p' | 'h3' | 'h4' | 'breadcrumb' }
    | { type: "pros_cons"; pros: { title: string; description: string }[]; cons: { title: string; description: string }[] }
    | { type: "booking_card"; price?: string; price_unit?: string; date?: string; travellers?: string; button_label: string }
    | { type: "travel_advice"; items: { day?: string; title: string; description: string }[] }
    | { type: "qa_list"; items: { question: string; answer: string }[] }
    | { type: "info_grid"; items: { icon?: string; label: string; value?: string }[] }
    | { type: "business_info"; mode?: 'horizontal' | 'vertical'; address?: string; website?: string; phone?: string; hours?: DayHours[] }
    | { type: "visit_period"; items: { season: string; text: string; color: 'green' | 'amber' | 'orange' | 'sky' }[] }
    | { type: "rail"; title?: string; items: Item[]; layout?: 'rail' | 'grid' }
    | { type: "room_selection"; title?: string; rooms: RoomItem[]; layout?: 'rail' | 'list' | 'grid' }
    | { type: "hotel_rules"; check_in: string; check_out: string; policies: string[] }
    | { type: 'color_cards'; items: { title: string; content?: string; items?: string[]; color?: string; tone?: 'amber' | 'rose' | 'emerald' | 'lime' | 'sky'; icon?: string }[] };

export interface RoomItem {
    id: string;
    name: string;
    price: string;
    price_unit?: string;
    images: ImageRef[];
    features: string[];
    beds?: string;
    capacity?: string;
}

// ─── Panel Actions ─────────────────────────────────────────────────────

export interface PanelAction {
    id: string;
    label: string;
    variant: "primary" | "secondary" | "ghost";
    icon?: string;          // lucide icon name
    action: string;         // "TOGGLE_SAVE" | "ADD_TO_TRIP" | "SHARE" | "OPEN_LINK"
    payload?: unknown;
}
