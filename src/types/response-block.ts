export type ResponseType = 'TRIP_PLAN' | 'DESTINATION_INFO' | 'TRIP_EDIT' | 'ITINERARY' | 'BUDGET_ONLY' | 'GENERAL_ASSIST' | 'GREETING';

export interface ResponseBlock {
    type: ResponseType;
    summary: string; // One sentence max
    introduction?: string; // Brief text before sections
    trip_meta?: {
        destination: string;
        origin?: string;
        startDate?: string; // ISO
        endDate?: string; // ISO
        duration?: string; // e.g. "5 days"
        currency: string;
        budget_est?: string; // e.g. "$2,500"
        dates?: string; // e.g. "Aug 24 - Aug 31"
        travelers?: string; // e.g. "2 Travelers"
    };
    // Standard Sections
    sections?: Section[];
    // Itinerary Specific
    days?: ItineraryDay[];

    actions: Action[]; // Primary + Secondary CTAs
    followups?: string[]; // Max 1 question if strictly necessary
    closing?: string; // Optional closing remark or prompt
    blocks?: DestinationBlock[]; // For DESTINATION_INFO

    // Added for refined DESTINATION_INFO behavior
    ui_hints?: {
        show_filter_nudge: boolean;
        filter_nudge_text?: string;
        focus_filter?: "budget" | "when" | "travelers" | "destination";
    };
    suggestions?: Array<{
        label: string;
        action: "send" | "focus_filter";
        payload?: unknown;
    }>;
}

export type DestinationBlock =
    | { kind: "intro"; text: string }
    | { kind: "cost_snapshot"; currency: string; tiers: BudgetTier[]; typicals: TypicalCost[]; actions: Action[] }
    | { kind: "highlights"; items: HighlightItem[] }
    | { kind: "cta_group"; primary: Action; secondary?: Action };

export interface BudgetTier {
    label: string; // "Budget", "Mid", "Comfort"
    range: string; // "€50-80"
    note: string;  // "Hostel + transit"
}

export interface TypicalCost {
    label: string; // "Coffee", "Meal", "Transit"
    value: string; // "€3.50", "€15", "€2.40"
}

export interface HighlightItem {
    id: string;
    title: string;
    description: string;
    photo_urls: string[];
    actions: Action[]; // "+ Add to trip", "♡"
}

export interface Section {
    id: string;
    type: 'FLIGHT' | 'LODGING' | 'FOOD' | 'ACTIVITY' | 'HIGHLIGHT' | 'DESTINATION' | 'GENERIC';
    title: string;
    items: Item[];
    sources?: string[]; // e.g. ["Booking.com", "Reddit"]
    cta?: Action; // Optional per-section CTA
}

export interface Item {
    id: string;
    title: string;
    image_url: string;
    meta: string[]; // e.g. ["4.5 ★", "Shinjuku", "15 mins away"]
    price_chip?: string; // e.g. "$120/night", "Free"
    // Compat / Extended fields
    price?: string;
    subtext?: string;
    rating?: string;
    deep_link?: string;
    coordinates?: { lat: number; lng: number };
}

export interface Action {
    label: string;
    action_id: string; // e.g. "create_itinerary", "show_cheaper"
    style: 'PRIMARY' | 'SECONDARY';
    payload?: unknown; // Data needing to be passed back
}

// ─── Itinerary Types ───────────────────────────────────────────────────

export interface ItineraryBlock {
    kind: 'plan' | 'tip' | 'spend';
    content?: string; // narrative or tip text
    title?: string; // Optional title for blocks
    amount?: string; // for 'spend' kind (e.g. "₦1.8M")
    note?: string; // for 'spend' kind (e.g. "mostly on hotel...")
    dateStr?: string; // for 'spend' labels (e.g. "Oct 12 2025")
}

export interface ItineraryDay {
    day_index: number; // 1-based
    title: string; // e.g. "Arrival & Oceanfront Welcome"
    overview: string; // The main narrative paragraph
    blocks: ItineraryBlock[];
}
