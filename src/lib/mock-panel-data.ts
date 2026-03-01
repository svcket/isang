import type { EntityType, PanelPayload } from "@/types/panel";

/**
 * Returns a mock PanelPayload for the given entity.
 * Phase 1: Static data. Phase 2: replaced by real API enrichment.
 */
export function getMockPanelData(
    type: EntityType,
    id: string,
    title?: string
): PanelPayload | null {
    const name = title || id;

    switch (type) {
        case "DESTINATION":
            return destinationPayload(name);
        case "HOTEL":
            return hotelPayload(name);
        case "RESTAURANT":
            return restaurantPayload(name);
        case "PLACE":
        case "ACTIVITY":
            return placePayload(name, type);
        case "FLIGHT":
            return flightPayload(name);
        default:
            return placePayload(name, "PLACE");
    }
}

// ─── DESTINATION ───────────────────────────────────────────────────────

function destinationPayload(name: string): PanelPayload {
    return {
        panel_type: "DESTINATION",
        header: {
            title: name,
            subtitle: "Explore this destination",
            rating: 4.6,
            reviews_count: 128000,
            tags: ["City", "Culture", "Beach"],
        },
        hero: {
            layout: "single",
            images: [
                { id: "d-1", url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=500&fit=crop", kind: "hero", source: "unsplash" },
            ],
            cta: { label: "Show all photos", action: "OPEN_GALLERY" },
        },
        tabs: ["Overview", "Stays", "Restaurants", "Things To Do"],
        sections: [
            {
                id: "overview",
                title: "Overview",
                blocks: [
                    {
                        type: "text",
                        content: `${name} is a vibrant destination that seamlessly blends ancient history with modern culture. Whether you're drawn to iconic landmarks, world-class dining, or simply soaking in the local atmosphere, there's something for every traveler.`,
                    },
                    {
                        type: "travel_advice",
                        items: [
                            { season: "Spring", text: "Mild weather, fewer crowds. Ideal for walking tours." },
                            { season: "Summer", text: "Peak season. Book ahead. Great beach weather." },
                            { season: "Fall", text: "Pleasant temperatures, cultural festivals." },
                            { season: "Winter", text: "Cooler but charming. Lower prices." },
                        ],
                    },
                    {
                        type: "qa_list",
                        items: [
                            { q: `Best neighborhoods to stay in ${name}?`, action: "ASK_FOLLOWUP" },
                            { q: `Is ${name} safe for solo travelers?`, action: "ASK_FOLLOWUP" },
                            { q: `How many days do I need in ${name}?`, action: "ASK_FOLLOWUP" },
                        ],
                    },
                ],
            },
        ],
        actions: [
            { id: "save", label: "Save", variant: "secondary", icon: "heart", action: "TOGGLE_SAVE" },
            { id: "add", label: "+ Add to trip", variant: "primary", action: "ADD_TO_TRIP" },
        ],
    };
}

// ─── HOTEL ─────────────────────────────────────────────────────────────

function hotelPayload(name: string): PanelPayload {
    return {
        panel_type: "HOTEL",
        header: {
            title: name,
            subtitle: "City Center",
            rating: 4.8,
            reviews_count: 1240,
            tags: ["Luxury", "Pool", "Free WiFi"],
        },
        hero: {
            layout: "grid",
            images: [
                { id: "h-1", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop", kind: "hero", source: "unsplash" },
                { id: "h-2", url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&h=225&fit=crop", kind: "gallery", source: "unsplash" },
                { id: "h-3", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=225&fit=crop", kind: "gallery", source: "unsplash" },
                { id: "h-4", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=225&fit=crop", kind: "gallery", source: "unsplash" },
            ],
            cta: { label: "Show all photos", action: "OPEN_GALLERY" },
        },
        tabs: ["Overview", "Amenities", "Location", "Reviews"],
        sections: [
            {
                id: "overview",
                title: "Overview",
                blocks: [
                    {
                        type: "text",
                        content: `${name} offers an exceptional stay with stunning views and top-tier amenities. Located in the heart of the city, it's perfect for both leisure and business travelers.`,
                    },
                    {
                        type: "info_grid",
                        items: [
                            { label: "Check-in", value: "3:00 PM" },
                            { label: "Check-out", value: "11:00 AM" },
                            { label: "WiFi", value: "Free" },
                            { label: "Parking", value: "Valet ($35/day)" },
                        ],
                    },
                    {
                        type: "pros_cons",
                        pros: ["Central location", "Stunning views", "Excellent service"],
                        cons: ["Premium pricing", "Busy during peak season"],
                    },
                ],
            },
        ],
        actions: [
            { id: "save", label: "Save", variant: "secondary", icon: "heart", action: "TOGGLE_SAVE" },
            { id: "add", label: "+ Add to trip", variant: "primary", action: "ADD_TO_TRIP" },
            { id: "book", label: "View on Booking.com", variant: "ghost", action: "OPEN_LINK" },
        ],
    };
}

// ─── RESTAURANT ────────────────────────────────────────────────────────

function restaurantPayload(name: string): PanelPayload {
    return {
        panel_type: "RESTAURANT",
        header: {
            title: name,
            subtitle: "Local Cuisine",
            rating: 4.3,
            reviews_count: 4200,
            tags: ["$$", "Local Favorite"],
        },
        hero: {
            layout: "grid",
            images: [
                { id: "r-1", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=450&fit=crop", kind: "hero", source: "unsplash" },
                { id: "r-2", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=225&fit=crop", kind: "gallery", source: "unsplash" },
            ],
        },
        tabs: ["Overview", "Menu", "Location"],
        sections: [
            {
                id: "overview",
                title: "Overview",
                blocks: [
                    {
                        type: "text",
                        content: `${name} serves authentic local dishes in a warm, inviting atmosphere. A favorite among locals and tourists alike.`,
                    },
                    {
                        type: "info_grid",
                        items: [
                            { label: "Address", value: "City Center" },
                            { label: "Hours", value: "12 PM – 11 PM" },
                            { label: "Price Range", value: "$15–30 per person" },
                            { label: "Phone", value: "+1 234 567 890" },
                        ],
                    },
                ],
            },
        ],
        actions: [
            { id: "save", label: "Save", variant: "secondary", icon: "heart", action: "TOGGLE_SAVE" },
            { id: "add", label: "+ Add to trip", variant: "primary", action: "ADD_TO_TRIP" },
        ],
    };
}

// ─── PLACE / ACTIVITY ──────────────────────────────────────────────────

function placePayload(name: string, type: EntityType): PanelPayload {
    return {
        panel_type: type,
        header: {
            title: name,
            subtitle: "Popular attraction",
            rating: 4.5,
            reviews_count: 8500,
            tags: ["Attraction", "Must-See"],
        },
        hero: {
            layout: "grid",
            images: [
                { id: "p-1", url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=450&fit=crop", kind: "hero", source: "unsplash" },
                { id: "p-2", url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300&h=225&fit=crop", kind: "gallery", source: "unsplash" },
            ],
            cta: { label: "Show all photos", action: "OPEN_GALLERY" },
        },
        tabs: ["Overview", "Details", "Location"],
        sections: [
            {
                id: "overview",
                title: "Overview",
                blocks: [
                    {
                        type: "text",
                        content: `${name} is one of the most iconic landmarks in the area. Rich in history and architectural beauty, it draws millions of visitors each year.`,
                    },
                    {
                        type: "info_grid",
                        items: [
                            { label: "Hours", value: "9 AM – 6 PM" },
                            { label: "Admission", value: "From $15" },
                            { label: "Duration", value: "1-2 hours" },
                        ],
                    },
                ],
            },
        ],
        actions: [
            { id: "save", label: "Save", variant: "secondary", icon: "heart", action: "TOGGLE_SAVE" },
            { id: "add", label: "+ Add to trip", variant: "primary", action: "ADD_TO_TRIP" },
        ],
    };
}

// ─── FLIGHT ────────────────────────────────────────────────────────────

function flightPayload(name: string): PanelPayload {
    return {
        panel_type: "FLIGHT",
        header: {
            title: name,
            subtitle: "Round Trip",
            tags: ["Economy"],
        },
        hero: {
            layout: "none",
            images: [],
        },
        tabs: ["Fare Details", "Segments"],
        sections: [
            {
                id: "fare",
                title: "Fare Details",
                blocks: [
                    {
                        type: "info_grid",
                        items: [
                            { label: "Cabin", value: "Economy" },
                            { label: "Baggage", value: "1 carry-on included" },
                            { label: "Changes", value: "Flexible ($50 fee)" },
                            { label: "Cancellation", value: "Non-refundable" },
                        ],
                    },
                ],
            },
        ],
        actions: [
            { id: "save", label: "Save", variant: "secondary", icon: "heart", action: "TOGGLE_SAVE" },
            { id: "add", label: "+ Add to trip", variant: "primary", action: "ADD_TO_TRIP" },
        ],
    };
}
