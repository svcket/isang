import { NextResponse, type NextRequest } from "next/server";
import type {
    AssistantResponse,
    SuggestionSection,
    Itinerary,
    EntryRequirements,
} from "@/types";

// ─── MVP: Static response generator (no LLM yet) ──────────────────────

function generateMockResponse(
    message: string,
    turnCount: number
): { reply: string; data?: AssistantResponse } {
    const lower = message.toLowerCase();

    // ─── Detect destination intent ───────────────────────────────────────
    const destinations = [
        { names: ["paris", "france"], dest: "Paris" },
        { names: ["tokyo", "japan"], dest: "Tokyo" },
        { names: ["bali", "indonesia"], dest: "Bali" },
        { names: ["new york", "nyc", "manhattan"], dest: "New York" },
        { names: ["london", "england", "uk"], dest: "London" },
        { names: ["barcelona", "spain"], dest: "Barcelona" },
        { names: ["rome", "italy"], dest: "Rome" },
        { names: ["dubai", "uae"], dest: "Dubai" },
        { names: ["bangkok", "thailand"], dest: "Bangkok" },
        { names: ["cape town", "south africa"], dest: "Cape Town" },
    ];

    let detectedDest = "";
    for (const d of destinations) {
        if (d.names.some((n) => lower.includes(n))) {
            detectedDest = d.dest;
            break;
        }
    }

    // Budget detection
    const budgetMatch = lower.match(/\$\s*([\d,]+)/);
    const budgetAmount = budgetMatch
        ? parseInt(budgetMatch[1].replace(/,/g, ""), 10)
        : undefined;

    // ─── Turn 0 or 1: Intent capture ────────────────────────────────────
    if (turnCount <= 0 && detectedDest) {
        const snapshot = {
            destination: detectedDest,
            budget: budgetAmount
                ? { amount: budgetAmount, currency: "USD" }
                : undefined,
            travelStyle: lower.includes("backpack")
                ? "Backpacking"
                : lower.includes("luxury")
                    ? "Luxury"
                    : lower.includes("family")
                        ? "Family"
                        : lower.includes("food")
                            ? "Foodie"
                            : lower.includes("beach")
                                ? "Beach & Relaxation"
                                : "Explorer",
        };

        return {
            reply: `Great choice! ${detectedDest} is a wonderful destination. ${budgetAmount
                    ? `With a budget of $${budgetAmount.toLocaleString()}, `
                    : ""
                }I can put together some tailored suggestions for you.\n\nLet me find the best stays, restaurants, activities, and flight options. Here's what I've got:`,
            data: {
                summary: `Planning a trip to ${detectedDest}`,
                tripSnapshot: snapshot,
                sections: generateSuggestions(detectedDest),
                entryRequirements: generateEntryReqs(detectedDest),
                cta: {
                    label: "Generate itinerary",
                    action: "generate_itinerary",
                },
            },
        };
    }

    // ─── Itinerary request ───────────────────────────────────────────────
    if (
        lower.includes("itinerary") ||
        lower.includes("plan") ||
        lower.includes("schedule")
    ) {
        const dest = detectedDest || "your destination";
        return {
            reply: `Here's a suggested day-by-day plan for ${dest}. Remember, this is a starting point — you can move, swap, or remove anything to make it yours.`,
            data: {
                itinerary: generateItinerary(dest),
            },
        };
    }

    // ─── Generic clarifying response ─────────────────────────────────────
    if (!detectedDest) {
        return {
            reply:
                "That sounds exciting! To give you the best suggestions, could you tell me:\n\n• Where are you thinking of going (or should I suggest somewhere)?\n• When are you hoping to travel?\n• What's your budget range?\n• Any preferences — beach, city, adventure, food?",
        };
    }

    return {
        reply: `I'd love to help you plan more for ${detectedDest}! Would you like me to generate a full itinerary, or would you prefer to browse more suggestions first?`,
        data: {
            tripSnapshot: { destination: detectedDest },
            cta: { label: "Generate itinerary", action: "generate_itinerary" },
        },
    };
}

// ─── Mock Data Generators ──────────────────────────────────────────────

function generateSuggestions(dest: string): SuggestionSection[] {
    return [
        {
            category: "stays",
            title: "Where to Stay",
            items: [
                {
                    id: "stay-1",
                    name: `Central ${dest} Boutique Hotel`,
                    imageUrl: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop`,
                    description: `A charming boutique hotel in the heart of ${dest} with modern amenities and a rooftop terrace.`,
                    priceHint: "From $120/night",
                    category: "stays",
                    meta: {
                        neighbourhood: "City Centre",
                        vibe: "Modern Boutique",
                        rating: "4.7 ★",
                    },
                },
                {
                    id: "stay-2",
                    name: `${dest} Garden Resort`,
                    imageUrl: `https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop`,
                    description: `A peaceful resort surrounded by gardens. Perfect for relaxation with a spa and infinity pool.`,
                    priceHint: "From $180/night",
                    category: "stays",
                    meta: {
                        neighbourhood: "Outskirts",
                        vibe: "Relaxation & Spa",
                        rating: "4.8 ★",
                    },
                },
                {
                    id: "stay-3",
                    name: `Backpacker's ${dest} Hostel`,
                    imageUrl: `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop`,
                    description: `Social hostel with great reviews. Private and shared rooms available, with a lively common area.`,
                    priceHint: "From $25/night",
                    category: "stays",
                    meta: {
                        neighbourhood: "Old Town",
                        vibe: "Social & Budget",
                        rating: "4.4 ★",
                    },
                },
            ],
        },
        {
            category: "restaurants",
            title: "Where to Eat",
            items: [
                {
                    id: "rest-1",
                    name: `The Local Table`,
                    imageUrl: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop`,
                    description: `Authentic local cuisine using fresh seasonal ingredients. A favourite among locals and visitors alike.`,
                    priceHint: "$15–30/person",
                    category: "restaurants",
                    meta: {
                        cuisine: "Local Traditional",
                        best_time: "Dinner",
                        reservation: "Recommended",
                    },
                },
                {
                    id: "rest-2",
                    name: `Skyline Rooftop Bar & Grill`,
                    imageUrl: `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop`,
                    description: `Fine dining with panoramic views. Perfect for a special evening with international fusion cuisine.`,
                    priceHint: "$40–80/person",
                    category: "restaurants",
                    meta: {
                        cuisine: "International Fusion",
                        best_time: "Evening",
                        reservation: "Required",
                    },
                },
                {
                    id: "rest-3",
                    name: `Street Bites Food Market`,
                    imageUrl: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop`,
                    description: `A vibrant outdoor food market with dozens of stalls serving street food staples. Great for trying a bit of everything.`,
                    priceHint: "$5–15/person",
                    category: "restaurants",
                    meta: {
                        cuisine: "Street Food",
                        best_time: "Lunchtime",
                        reservation: "Not needed",
                    },
                },
            ],
        },
        {
            category: "activities",
            title: "Things to Do",
            items: [
                {
                    id: "act-1",
                    name: `${dest} Walking Tour`,
                    imageUrl: `https://images.unsplash.com/photo-1569949381669-ecf31ae8b453?w=400&h=300&fit=crop`,
                    description: `A guided 3-hour walking tour covering historic landmarks, hidden gems, and the best photo spots.`,
                    priceHint: "$25/person",
                    category: "activities",
                    meta: {
                        duration: "3 hours",
                        intensity: "Easy",
                        group_size: "Up to 12",
                    },
                },
                {
                    id: "act-2",
                    name: `Sunset Cruise`,
                    imageUrl: `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop`,
                    description: `Enjoy the golden hour on water with drinks and snacks. A memorable experience with live music.`,
                    priceHint: "$60/person",
                    category: "activities",
                    meta: {
                        duration: "2 hours",
                        intensity: "Relaxed",
                        includes: "Drinks & snacks",
                    },
                },
                {
                    id: "act-3",
                    name: `Cooking Class Experience`,
                    imageUrl: `https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop`,
                    description: `Learn to cook traditional dishes with a local chef. Includes a market tour and a meal you prepare yourself.`,
                    priceHint: "$45/person",
                    category: "activities",
                    meta: {
                        duration: "4 hours",
                        intensity: "Moderate",
                        includes: "Ingredients & meal",
                    },
                },
            ],
        },
        {
            category: "flights",
            title: "Getting There",
            items: [
                {
                    id: "flight-1",
                    name: `Direct Flight`,
                    imageUrl: `https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&h=300&fit=crop`,
                    description: `Non-stop flights available from major hubs. Best prices when booking 3–6 weeks ahead.`,
                    priceHint: "From $350 round-trip",
                    category: "flights",
                    meta: {
                        airline: "Various carriers",
                        stops: "Non-stop",
                        duration: "Varies",
                    },
                },
                {
                    id: "flight-2",
                    name: `Budget Connection`,
                    imageUrl: `https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400&h=300&fit=crop`,
                    description: `Save money with a single stop. Budget carriers offer significantly lower fares for flexible travellers.`,
                    priceHint: "From $180 round-trip",
                    category: "flights",
                    meta: {
                        airline: "Budget carriers",
                        stops: "1 stop",
                        duration: "+2–4 hours",
                    },
                },
            ],
        },
    ];
}

function generateEntryReqs(dest: string): EntryRequirements {
    return {
        essential: {
            passportValidity: "6 months from entry",
            visaStatus: "visa_free",
            visaStatusLabel: "Visa Free",
            allowedStay: "Up to 90 days",
            summary: `Most passport holders can enter ${dest} visa-free for tourism stays of up to 90 days. Ensure your passport is valid for at least 6 months from your planned entry date.`,
        },
        helpful: {
            documentsRequired: [
                "Valid passport (6+ months validity)",
                "Return or onward ticket",
                "Proof of accommodation",
                "Travel insurance (recommended)",
            ],
            entryFee: "Free",
            processingTime: "N/A — visa-free entry",
            whereToApply: "N/A — present passport at border",
        },
        actionable: [
            {
                label: "Check passport validity",
                description: "Make sure your passport meets the 6-month requirement",
            },
            {
                label: "What to prepare before you fly",
                description:
                    "Checklist of documents to have ready at immigration",
                steps: [
                    "Check passport validity",
                    "Book return/onward ticket",
                    "Print or save accommodation details",
                    "Purchase travel insurance",
                ],
            },
        ],
    };
}

function generateItinerary(dest: string): Itinerary {
    return {
        id: "itin-1",
        tripSnapshot: { destination: dest },
        totalEstimatedCost: "$850 – $1,200",
        days: [
            {
                dayNumber: 1,
                title: "Arrival & Settle In",
                blocks: [
                    {
                        id: "b-1-1",
                        time: "14:00",
                        name: "Check in at hotel",
                        description: `Arrive and settle into your accommodation in central ${dest}. Freshen up and get oriented.`,
                        costEstimate: "$120",
                    },
                    {
                        id: "b-1-2",
                        time: "16:00",
                        name: "Neighbourhood walk",
                        description: "Explore the area around your hotel. Pick up essentials and get a feel for the local vibe.",
                        costEstimate: "Free",
                    },
                    {
                        id: "b-1-3",
                        time: "19:00",
                        name: "Dinner at The Local Table",
                        description: "Try authentic local cuisine at this well-reviewed restaurant nearby.",
                        costEstimate: "$25",
                    },
                ],
            },
            {
                dayNumber: 2,
                title: "Explore & Discover",
                blocks: [
                    {
                        id: "b-2-1",
                        time: "09:00",
                        name: `${dest} Walking Tour`,
                        description: "Join a guided morning tour of the city's highlights and hidden gems.",
                        costEstimate: "$25",
                    },
                    {
                        id: "b-2-2",
                        time: "12:30",
                        name: "Lunch at Street Bites Food Market",
                        description: "Sample a variety of local street food at the bustling outdoor market.",
                        costEstimate: "$10",
                    },
                    {
                        id: "b-2-3",
                        time: "15:00",
                        name: "Free time to explore",
                        description: "Visit museums, shop for souvenirs, or relax at a local café.",
                        costEstimate: "$20",
                    },
                    {
                        id: "b-2-4",
                        time: "18:00",
                        name: "Sunset Cruise",
                        description: "Wind down the day with a scenic sunset cruise with drinks and live music.",
                        costEstimate: "$60",
                    },
                ],
            },
            {
                dayNumber: 3,
                title: "Culture & Cuisine",
                blocks: [
                    {
                        id: "b-3-1",
                        time: "09:30",
                        name: "Cooking Class Experience",
                        description: "Start with a market tour, then learn to cook local dishes with a chef.",
                        costEstimate: "$45",
                    },
                    {
                        id: "b-3-2",
                        time: "14:00",
                        name: "Cultural quarter visit",
                        description: "Walk through the cultural quarter, visit galleries and local artisan shops.",
                        costEstimate: "$15",
                    },
                    {
                        id: "b-3-3",
                        time: "19:30",
                        name: "Farewell dinner at Skyline Rooftop",
                        description: "End the trip on a high with panoramic views and fusion cuisine.",
                        costEstimate: "$60",
                    },
                ],
            },
        ],
    };
}

// ─── Route Handler ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, turnCount = 0 } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Simulate a small delay so the typing indicator feels natural
        await new Promise((resolve) => setTimeout(resolve, 800));

        const response = generateMockResponse(message, turnCount);

        return NextResponse.json(response);
    } catch {
        return NextResponse.json(
            {
                reply:
                    "Something went wrong on my end. Could you try rephrasing that?",
            },
            { status: 500 }
        );
    }
}
