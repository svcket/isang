export type ResponseType = 'TRIP_PLAN' | 'DESTINATION_INFO' | 'TRIP_EDIT';

export interface ResponseBlock {
    type: ResponseType;
    summary: string; // One sentence max
    trip_meta?: {
        destination: string;
        origin?: string;
        startDate?: string; // ISO
        endDate?: string; // ISO
        duration?: string; // e.g. "5 days"
        currency: string;
        budget_est: string; // e.g. "$2,500"
    };
    sections: Section[];
    actions: Action[]; // Primary + Secondary CTAs
    followups?: string[]; // Max 1 question if strictly necessary
}

export interface Section {
    id: string;
    type: 'FLIGHT' | 'LODGING' | 'FOOD' | 'ACTIVITY' | 'HIGHLIGHT' | 'GENERIC';
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
    deep_link?: string;
    coordinates?: { lat: number; lng: number };
}

export interface Action {
    label: string;
    action_id: string; // e.g. "create_itinerary", "show_cheaper"
    style: 'PRIMARY' | 'SECONDARY';
    payload?: any; // Data needing to be passed back
}
