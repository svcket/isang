import type { EntityType, PanelPayload, DayHours } from "@/types/panel";

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
            subtitle: "National Capital",
            rating: 4.8,
            reviews_count: 154000,
            tags: ["Capital", "Culture", "Modern Architecture"],
        },
        hero: {
            title: name,
            layout: "single",
            images: [
                { id: "d-1", url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=500&fit=crop", kind: "hero", source: "unsplash" },
                { id: "d-2", url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=500&fit=crop", kind: "gallery" },
                { id: "d-3", url: "https://images.unsplash.com/photo-1549144811-2037160756e0?w=800&h=500&fit=crop", kind: "gallery" },
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
                ],
            },
            {
                id: "things-to-know",
                title: "Things to know",
                blocks: [
                    {
                        type: "info_grid",
                        items: [
                            { label: "Currency", value: "NGN (Naira)", icon: "Banknote" },
                            { label: "Language", value: "English, Yoruba, Hausa", icon: "Languages" },
                            { label: "Timezone", value: "WAT (GMT+1)", icon: "Clock" },
                            { label: "Visas", value: "Required for most", icon: "FileText" },
                        ],
                    },
                ],
            },
            {
                id: "stays",
                title: "Stays",
                blocks: [
                    {
                        type: "rail",
                        title: "Popular Hotels",
                        items: [
                            { id: "s1", title: "Costa Luz Boutique", image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop", meta: ["4.9 ★", "City Center"], price_chip: "$240/night", entity_type: "HOTEL", entity_id: "costa-luz" },
                            { id: "s2", title: "The Grand Resort", image_url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop", meta: ["4.8 ★", "Beachfront"], price_chip: "$450/night", entity_type: "HOTEL", entity_id: "grand-resort" },
                            { id: "s3", title: "Urban Loft Suites", image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop", meta: ["4.6 ★", "Downtown"], price_chip: "$180/night", entity_type: "HOTEL", entity_id: "urban-loft" },
                        ]
                    }
                ]
            },
            {
                id: "restaurants",
                title: "Restaurants",
                blocks: [
                    {
                        type: "rail",
                        title: "Top Rated Dining",
                        items: [
                            { id: "r1", title: "Bistro 44", image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop", meta: ["4.7 ★", "French", "$$"], entity_type: "RESTAURANT", entity_id: "bistro-44" },
                            { id: "r2", title: "Sakura Sushi", image_url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop", meta: ["4.9 ★", "Japanese", "$$$"], entity_type: "RESTAURANT", entity_id: "sakura-sushi" },
                        ]
                    }
                ]
            },
            {
                id: "things-to-do",
                title: "Things To Do",
                blocks: [
                    {
                        type: "rail",
                        title: "Must-See Attractions",
                        items: [
                            { id: "a1", title: "National Museum", image_url: "https://images.unsplash.com/photo-1518998053401-878939634e9e?w=400&h=300&fit=crop", meta: ["History", "Indoor"], price_chip: "$15", entity_type: "ACTIVITY", entity_id: "national-museum" },
                            { id: "a2", title: "City Tour Bus", image_url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop", meta: ["2 Hours", "Outdoor"], price_chip: "$30", entity_type: "ACTIVITY", entity_id: "city-tour" },
                        ]
                    }
                ]
            }
        ],
        actions: [
            { id: "save", label: "Save", variant: "secondary", icon: "heart", action: "TOGGLE_SAVE" },
            { id: "add", label: "+ Add to trip", variant: "primary", action: "ADD_TO_TRIP" },
        ],
    };
}

// ─── HOTEL ─────────────────────────────────────────────────────────────

function hotelPayload(name: string): PanelPayload {
    const isVienna = name.includes("Vienna") || name === "vienna-grand";
    const displayName = isVienna ? "The Vienna Grand Hotel" : "The Marly Boutique Hotel";

    return {
        panel_type: "HOTEL",
        header: {
            title: displayName,
            rating: 4.9,
            reviews_count: 2450,
            reviews_count_formatted: "2.4k",
            tags: ["Hotel", "Luxury", "Historic"],
            subtitle: isVienna ? "Ringstrasse, Vienna" : "Camps Bay, Cape Town",
        },
        hero: {
            images: isVienna ? [
                { id: "v1", url: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=2000", kind: "hero" },
                { id: "v2", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "v3", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "v4", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "v5", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
            ] : [
                { id: "h1", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000", kind: "hero" },
                { id: "h2", url: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "h3", url: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "h4", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "h5", url: "https://images.unsplash.com/photo-1562767675-d7486a455ced?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
            ],
            title: displayName,
            subtitle: isVienna ? "Ringstrasse, Vienna" : "Camps Bay, Cape Town",
            layout: "grid",
        },
        tabs: ["Overview", "Rooms", "Details", "Reviews"],
        sections: [
            {
                id: "overview",
                title: "Overview",
                blocks: [
                    {
                        type: "text",
                        variant: "breadcrumb",
                        content: isVienna ? "Austria > Vienna > Ringstrasse" : "South Africa > Cape Town > Camps Bay",
                    },
                    {
                        type: "text",
                        content: isVienna 
                            ? "Located on the famous Ringstrasse, The Vienna Grand Hotel is a landmark of imperial elegance. Since its opening in 1873, it has been a preferred residence for royalty and aristocracy. Today, it combines historic charm with modern luxury, featuring high-ceilinged suites, a two-Michelin-starred restaurant, and an opulent spa."
                            : "Steps away from the beach, The Marly Boutique Hotel is an 11-suite hotel in Cape Town's Camps Bay. The hotel features a rooftop pool bar, a Japanese restaurant, and a spa.",
                    },
                    {
                        type: "booking_card",
                        price: isVienna ? "$350" : "$550",
                        price_unit: "night",
                        button_label: "Check Availability",
                    },
                    {
                        type: "info_grid",
                        items: [
                            { icon: "ShieldCheck", label: "Safety first", value: "Verified secure premises" },
                            { icon: "Sparkles", label: "Prime location", value: isVienna ? "Heart of Vienna" : "Heart of Camps Bay" },
                            { icon: "Heart", label: "Top-rated", value: "Favorite for couples" },
                        ],
                    },
                ],
            },
            {
                id: "rooms",
                title: "Rooms & offer",
                blocks: [
                    {
                        type: "room_selection",
                        layout: "grid",
                        rooms: isVienna ? [
                            {
                                id: "v-r1",
                                name: "Deluxe Double Room",
                                price: "$350",
                                price_unit: "night",
                                beds: "1 King bed",
                                capacity: "Sleeps 2",
                                images: [{ id: "vrm1", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&fit=crop" }],
                                features: ["Free WiFi", "Minibar", "City View"]
                            },
                            {
                                id: "v-r2",
                                name: "Junior Suite",
                                price: "$550",
                                price_unit: "night",
                                beds: "1 King bed",
                                capacity: "Sleeps 3",
                                images: [{ id: "vrm2", url: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=800&fit=crop" }],
                                features: ["Living area", "Balcony"]
                            },
                            {
                                id: "v-r3",
                                name: "Grand Suite",
                                price: "$850",
                                price_unit: "night",
                                beds: "1 King bed",
                                capacity: "Sleeps 4",
                                images: [{ id: "vrm3", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&fit=crop" }],
                                features: ["Kitchenette", "Butler service"]
                            },
                            {
                                id: "v-r4",
                                name: "Family Room",
                                price: "$450",
                                price_unit: "night",
                                beds: "2 Queen beds",
                                capacity: "Sleeps 4",
                                images: [{ id: "vrm4", url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&fit=crop" }],
                                features: ["Spacious", "Connected rooms"]
                            },
                        ] : [
                            {
                                id: "r1",
                                name: "Luxury Studio Ocean View",
                                price: "$550",
                                price_unit: "night",
                                images: [{ id: "rm1", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&fit=crop" }],
                                features: ["1 King bed", "Ocean View", "45 sqm"]
                            },
                            {
                                id: "r2",
                                name: "Mountain View Room",
                                price: "$450",
                                price_unit: "night",
                                images: [{ id: "rm2", url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&fit=crop" }],
                                features: ["1 King bed", "Mountain View", "38 sqm"]
                            },
                        ]
                    }
                ],
            },
            {
                id: "details",
                title: "Details",
                blocks: [
                    {
                        type: "hotel_rules",
                        check_in: "3:00 PM",
                        check_out: "12:00 PM",
                        policies: [
                            "Pets allowed with prior arrangement",
                            "Strictly no smoking in suites and public areas",
                            "Child-friendly with babysitting services available",
                            "Valet parking available for all guests"
                        ]
                    },
                    {
                        type: "info_grid",
                        items: [
                            { icon: "Wifi", label: "WiFi", value: "Free high-speed available" },
                            { icon: "Waves", label: "Pool", value: "Rooftop pool & bar" },
                            { icon: "Car", label: "Parking", value: "Valet parking" },
                            { icon: "Utensils", label: "Dining", value: "3 on-site restaurants" },
                        ],
                    },
                ],
            },
            {
                id: "knowledge",
                title: "Know before you go",
                blocks: [
                    {
                        type: "color_cards",
                        items: [
                            {
                                title: "Imperial Access",
                                items: ["Skip-the-line opera tickets", "Private palace tours"],
                                tone: "amber",
                            },
                            {
                                title: "Transportation",
                                items: ["Airport limousine service", "Walking distance to metro"],
                                tone: "sky",
                            },
                        ],
                    },
                ],
            },
            {
                id: "faq",
                title: "Frequently Asked Questions",
                blocks: [
                    {
                        type: "qa_list",
                        items: [
                            { question: "Is breakfast included?", answer: "Yes, a full English breakfast is served daily." },
                            { question: "Is there a fitness center?", answer: "Guests have access to a state-of-the-art gym." },
                            { question: "Are pets allowed?", answer: "The hotel is not pet-friendly." },
                        ],
                    },
                ],
            },
            {
                id: "similar-stays",
                title: "Similar Stays",
                blocks: [
                    {
                        type: "rail",
                        items: [
                            { id: "s1", title: "The Silo Hotel", image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&fit=crop", meta: ["4.9 ★", "Waterfront"], price_chip: "$850/night", entity_type: "HOTEL", entity_id: "silo" },
                            { id: "s2", title: "Twelve Apostles", image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&fit=crop", meta: ["4.8 ★", "Oudekraal"], price_chip: "$420/night", entity_type: "HOTEL", entity_id: "twelve" },
                        ]
                    }
                ]
            }
        ],
        actions: [],
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
            title: name,
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
    const isCathedral = name.toLowerCase().includes("cathedral") || name === "Sagrada Familia";
    const isPicasso = name.toLowerCase().includes("picasso");
    const displayName = isCathedral ? "Barcelona Cathedral (Catedral de Barcelona)" : name;

    const description = isPicasso 
        ? "Barcelona, the cosmopolitan capital of Spain's Catalonia region, is known for its art and architecture. The city is a vibrant mix of old and new, where narrow medieval streets meet modernist landmarks. The iconic Sagrada Familia church and other modernist landmarks designed by Antoni Gaudí dot the city. Barcelona is also home to the"
        : `${displayName} is widely considered to be just as beautiful as its more famous neighbors. Rich in history and architectural beauty, it draws millions of visitors each year. The stunning Gothic facade and the peaceful cloister with its famous 13 white geese make it a must-visit for anyone exploring the Gothic Quarter's winding streets and historic secrets.`;

    const hours: DayHours[] = [
        { day: "Mon", hours: "Closed" },
        { day: "Tue", hours: "10 AM – 7 PM" },
        { day: "Wed", hours: "10 AM – 7 PM" },
        { day: "Thu", hours: "10 AM – 7 PM" },
        { day: "Fri", hours: "10 AM – 7 PM" },
        { day: "Sat", hours: "10 AM – 7 PM" },
        { day: "Sun", hours: "10 AM – 7 PM" },
    ];

    return {
        panel_type: type,
        header: {
            title: displayName,
            location: "Barcelona, Catalonia, Spain",
            rating: 4.8,
            reviews_count_formatted: "637k",
            category: "Attraction",
            tags: ["History", "Architecture", "Landmark"],
        },
        hero: {
            title: displayName,
            subtitle: "🇪🇸 Barcelona, Spain",
            layout: "grid",
            images: [
                { id: "p-1", url: "https://images.unsplash.com/photo-1548680696-6e3e15776d65?auto=format&fit=crop&q=80&w=2000", kind: "hero" },
                { id: "p-2", url: "https://images.unsplash.com/photo-1511527663162-8e1001f3016a?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "p-3", url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "p-4", url: "https://images.unsplash.com/photo-1549144811-2037160756e0?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
                { id: "p-5", url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800", kind: "gallery" },
            ],
            cta: { label: "Show all photos", action: "OPEN_GALLERY" },
        },
        tabs: ["Overview", "Reviews", "Tours", "Explore"],
        sections: [
            {
                id: "overview",
                title: "Overview",
                is_booking_required: !isPicasso, // Picasso is horizontal (Image 2), others vertical (Image 1)
                blocks: [
                    {
                        type: "text",
                        variant: "breadcrumb",
                        content: "Spain > Barcelona > Gothic Quarter",
                    },
                    {
                        type: "text",
                        content: description,
                    },
                    ...(isPicasso ? [] : [
                        {
                            type: "booking_card" as const,
                            date: "18 May",
                            travellers: "2 - adults",
                            button_label: "Visit website",
                        }
                    ]),
                    {
                        type: "business_info",
                        mode: isPicasso ? "horizontal" : "vertical",
                        address: isPicasso ? "C/ de Montcada\n15-23, 08003 Barcelona\nSpain" : "La Rambla\nBarcelona\nSpain",
                        website: isPicasso ? "museupicassobcn.cat" : "www.viator.com",
                        phone: isPicasso ? "+34 932 56 30 00" : undefined,
                        hours: isPicasso ? hours : undefined,
                    },
                    {
                        type: "qa_list",
                        items: [
                            { question: "What are the must-see attractions in Barcelona?", answer: "Barcelona offers a wealth of attractions including the Sagrada Familia, Park Güell, and the Gothic Quarter." },
                            { question: "What is the best time of year to visit Barcelona?", answer: "Spring (May-June) and Autumn (September-October) offer the best weather and fewer crowds." },
                        ]
                    }
                ],
            },
            {
                id: "knowledge",
                title: "Things to know about Gothic Quarter",
                blocks: [
                    {
                        type: "pros_cons",
                        pros: [
                            { title: "Rich History", description: "Barcelona is steeped in history, with landmarks dating back to Roman times." },
                            { title: "Beautiful Beaches", description: "The city boasts beautiful beaches, perfect for relaxation and water sports." },
                            { title: "Delicious Cuisine", description: "The city offers a variety of delicious local and international cuisine." },
                            { title: "Vibrant Nightlife", description: "Barcelona is known for its vibrant nightlife, with numerous bars and clubs." },
                            { title: "Art and Architecture", description: "Barcelona is famous for its unique architecture, particularly the works of Antoni Gaudí." }
                        ],
                        cons: [
                            { title: "Crowded", description: "The city can get very crowded, especially during the summer months." },
                            { title: "Traffic", description: "Traffic can be heavy, especially during peak hours." },
                            { title: "Expensive", description: "Barcelona can be quite expensive, particularly in tourist areas." },
                            { title: "Pickpocketing", description: "Like many tourist destinations, pickpocketing can be a problem." },
                            { title: "Language Barrier", description: "While many people speak English, a language barrier can still exist." }
                        ]
                    },
                ],
            },
            {
                id: "stays",
                title: "Stays near Gothic Quarter",
                blocks: [
                    {
                        type: "rail",
                        layout: "grid",
                        items: [
                            { 
                                id: "s1", 
                                title: "H10 Madison", 
                                image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                price_chip: "From ₦550,000", 
                                entity_type: "HOTEL", 
                                entity_id: "h10-madison" 
                            },
                            { 
                                id: "s2", 
                                title: "Majestic Hotel & Spa Barcelona", 
                                image_url: "https://images.unsplash.com/photo-1551882547-ff40c0d58444?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                price_chip: "From ₦550,000", 
                                entity_type: "HOTEL", 
                                entity_id: "majestic-hotel" 
                            },
                            { 
                                id: "s3", 
                                title: "Hotel Astoria", 
                                image_url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                price_chip: "From ₦550,000", 
                                entity_type: "HOTEL", 
                                entity_id: "hotel-astoria" 
                            },
                            { 
                                id: "s4", 
                                title: "Seventy Barcelona", 
                                image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                price_chip: "From ₦550,000", 
                                entity_type: "HOTEL", 
                                entity_id: "seventy-barcelona" 
                            }
                        ]
                    }
                ]
            },
            {
                id: "restaurants",
                title: "Restaurants in Gothic Quarter",
                blocks: [
                    {
                        type: "rail",
                        layout: "grid",
                        items: [
                             { 
                                id: "r1", 
                                title: "Torre d'Alta Mar", 
                                image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                price_chip: "From ₦550,000", 
                                entity_type: "RESTAURANT", 
                                entity_id: "torre-dalta" 
                            },
                            { 
                                id: "r2", 
                                title: "Agua", 
                                image_url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                price_chip: "From ₦550,000", 
                                entity_type: "RESTAURANT", 
                                entity_id: "agua" 
                            },
                            { 
                                id: "r3", 
                                title: "Cervecería El Vaso de Oro", 
                                image_url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                price_chip: "From ₦550,000", 
                                entity_type: "RESTAURANT", 
                                entity_id: "el-vaso" 
                            },
                            { 
                                id: "r4", 
                                title: "Restaurante Barceloneta", 
                                image_url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                price_chip: "From ₦550,000", 
                                entity_type: "RESTAURANT", 
                                entity_id: "restaurante-barceloneta" 
                            }
                        ]
                    }
                ]
            },
            {
                id: "attractions",
                title: "Activities in Gothic Quarter",
                blocks: [
                    {
                        type: "rail",
                        layout: "grid",
                        items: [
                             { 
                                id: "a1", 
                                title: "La Boqueria Market (Merc...", 
                                image_url: "https://images.unsplash.com/photo-1583422409516-15eba53492dc?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                entity_type: "ATTRACTION", 
                                entity_id: "la-boqueria" 
                            },
                            { 
                                id: "a2", 
                                title: "Milà House (Casa Milà)", 
                                image_url: "https://images.unsplash.com/photo-1572455857811-045fb4255b5d?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                entity_type: "ATTRACTION", 
                                entity_id: "casa-mila" 
                            },
                            { 
                                id: "a3", 
                                title: "Catalunya Square (Plaça...", 
                                image_url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                entity_type: "ATTRACTION", 
                                entity_id: "catalunya-square" 
                            },
                            { 
                                id: "a4", 
                                title: "Casa Batlló", 
                                image_url: "https://images.unsplash.com/photo-1554160408-dc40940ca519?w=800&fit=crop", 
                                meta: ["Hotel", "★ 4.8 (637k)"], 
                                subtext: "Barcelona, Catalonia",
                                entity_type: "ATTRACTION", 
                                entity_id: "casa-batllo" 
                            }
                        ]
                    }
                ]
            }
        ],
        actions: [
            { id: "add", label: "+ Add to trip", variant: "primary", action: "ADD_TO_TRIP" },
            { id: "save", label: "Save", variant: "secondary", icon: "heart", action: "TOGGLE_SAVE" },
            { id: "share", label: "Share", variant: "secondary", icon: "share", action: "SHARE" },
        ]
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
            title: name,
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
