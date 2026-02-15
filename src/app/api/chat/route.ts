import { NextResponse, type NextRequest } from "next/server";
import type {
    AssistantResponse,
    ResponseBlock,
    Section,
    Item,
    ResponseType,
} from "@/types";

// 1. TRIP_PLAN: Dest + (Dates OR Duration OR Budget)
// 2. DESTINATION_INFO: Dest only
// 3. TRIP_EDIT: Context + Refinement keywords (simplified for MVP)

export function generateMockResponse(
    message: string,
    turnCount: number,
    snapshot?: AssistantResponse['tripSnapshot']
): { reply: string; data?: AssistantResponse } {
    const lower = message.toLowerCase();

    // ─── MOCK: Santorini Specific Response ───────────────────────────────
    if (lower.includes("santorini")) {
        return {
            reply: "I've found some great options for your trip to Santorini! Here are the best flights and some top-rated places to stay.",
            data: {
                tripSnapshot: {
                    destination: "Santorini, Greece",
                    dates: { start: "2024-06-15", end: "2024-06-21" },
                    duration: "9 days",
                    budget: { amount: 5000, currency: "$" },
                    travelStyle: "Relaxed"
                },
                responseBlock: {
                    type: "TRIP_PLAN",
                    summary: "I've curated a mix of direct and 1-stop flights, plus some stunning caldera-view hotels.",
                    trip_meta: {
                        destination: "Santorini, Greece",
                        startDate: "15/06",
                        duration: "9 days",
                        currency: "$",
                        budget_est: "$5.5M (est. budget)"
                    },
                    sections: [
                        {
                            id: "flights-1",
                            type: "FLIGHT",
                            title: "Flights",
                            sources: ["Booking.com", "agoda", "Reddit"],
                            items: [
                                {
                                    id: "f1",
                                    title: "Ibom Airlines",
                                    image_url: "", // In a real app, this would be a logo URL
                                    meta: ["Lagos", "Capetown", "Round trip, 2 stops"],
                                    price_chip: "$319 +VAT"
                                },
                                {
                                    id: "f2",
                                    title: "FLY Rwanda",
                                    image_url: "",
                                    meta: ["Lagos", "London", "Round trip"],
                                    price_chip: "$319 +VAT"
                                },
                                {
                                    id: "f3",
                                    title: "Emirates Airlines",
                                    image_url: "",
                                    meta: ["Lagos", "London", "Round trip"],
                                    price_chip: "$319 +VAT"
                                }
                            ]
                        },
                        {
                            id: "lodging-1",
                            type: "LODGING",
                            title: "Lodgings",
                            sources: ["Booking.com", "agoda", "Reddit"],
                            items: [
                                {
                                    id: "l1",
                                    title: "The Marly Boutique Hotel – beachfront luxury",
                                    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦450k / night"
                                },
                                {
                                    id: "l2",
                                    title: "Kloof Street Hotel – urban charm",
                                    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦520k / night"
                                },
                                {
                                    id: "l3",
                                    title: "Cloud 9 Boutique Hotel – affordable & scenic",
                                    image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦400k / night"
                                }
                            ]
                        }
                    ],
                    actions: [
                        { label: "Ask me anything!", action_id: "ask", style: "SECONDARY" }
                    ]
                }
            }
        };
    }
    const destinations = [
        { names: ["paris", "france"], dest: "Paris", currency: "€" },
        { names: ["tokyo", "japan"], dest: "Tokyo", currency: "¥" },
        { names: ["bali", "indonesia"], dest: "Bali", currency: "IDR" },
        { names: ["new york", "nyc", "manhattan"], dest: "New York", currency: "$" },
        { names: ["london", "england", "uk"], dest: "London", currency: "£" },
        { names: ["barcelona", "spain"], dest: "Barcelona", currency: "€" },
        { names: ["rome", "italy"], dest: "Rome", currency: "€" },
        { names: ["dubai", "uae"], dest: "Dubai", currency: "AED" },
        { names: ["bangkok", "thailand"], dest: "Bangkok", currency: "฿" },
        { names: ["cape town", "south africa"], dest: "Cape Town", currency: "R" },
        { names: ["vienna", "austria"], dest: "Vienna", currency: "€" },
    ];

    let detectedDest = null;
    for (const d of destinations) {
        if (d.names.some((n) => lower.includes(n))) {
            detectedDest = d;
            break;
        }
    }

    const budgetMatch = lower.match(/\$\s*([\d,]+)/) || lower.match(/(\d+)k/);
    const hasBudget = !!budgetMatch || lower.includes("budget") || lower.includes("cheap");

    const durationMatch = lower.match(/(\d+)\s*(?:day|night|week)/);
    const hasDuration = !!durationMatch || lower.includes("weekend");

    // ─── 3. TRIP_EDIT (Pattern C) ───────────────────────────────────────
    // Rule: Context exists + refinement
    if (snapshot && (lower.includes("cheap") || lower.includes("stay") || lower.includes("hotel"))) {
        const dest = snapshot.destination || "Target City";
        return {
            reply: `I've found some ${lower.includes("cheap") ? "cheaper " : ""}options for you.`,
            data: {
                // Return just the block for merge
                responseBlock: {
                    type: "TRIP_EDIT",
                    summary: `Updated lodging options for ${dest}.`,
                    trip_meta: {
                        destination: dest,
                        duration: snapshot.duration || "5 days",
                        currency: snapshot.budget?.currency || "$",
                        budget_est: lower.includes("cheap") ? "$1000" : "$2500"
                    },
                    sections: [
                        generateSection("LODGING", dest.split(",")[0] || "City")
                    ],
                    actions: []
                }
            }
        };
    }

    // ─── 2. Classification & Generation ──────────────────────────────────

    // ─── 2. Classification & Generation ──────────────────────────────────

    // Case A: TRIP_PLAN (Pattern A) or Default Fallback
    // If we have a detected strict destination OR if the input is short enough to be a destination query

    let targetDest = detectedDest ? detectedDest.dest : null;
    let targetCurrency = detectedDest ? detectedDest.currency : "$";

    // Fallback: Attempt to extract destination from "Trip to X" or just treat the whole string as dest if short
    // Fallback: Attempt to extract destination from "Trip to X" or "I'm headed to X"
    if (!targetDest) {
        // Regex to catch "Trip to [Dest]" or "I'm headed to [Dest]"
        // Matches: "headed to [Dest] starting" OR "trip to [Dest] starting" OR just "headed to [Dest]" at end
        const tripToMatch = lower.match(/(?:trip|headed) to (.+?)(?: starting| for| with|$)/i);

        if (tripToMatch) {
            // Capitalize first letter of each word
            targetDest = tripToMatch[1].replace(/\b\w/g, l => l.toUpperCase());
        } else if (message.length < 50 && !lower.includes("help") && !lower.includes("hello")) {
            // Assume the whole message might be a place name if it's short and not a greeting
            targetDest = message.replace(/\b\w/g, l => l.toUpperCase());
        }
    }

    if (targetDest) {
        const title = targetDest;
        const duration = durationMatch ? `${durationMatch[1]} days` : (hasDuration ? "5 days" : null);
        const budget = budgetMatch ? `$${budgetMatch[1]}` : (hasBudget ? "$1,500" : null);

        // Classify Intent
        // TRIP_PLAN requires explicit intent keywords OR specific details (dates/duration/budget)
        const isTripPlan = lower.includes("plan") ||
            lower.includes("trip") ||
            lower.includes("itinerary") ||
            lower.includes("guide") ||
            !!duration ||
            !!budget;

        if (isTripPlan) {
            const finalDuration = duration || "5 days";
            const finalBudget = budget || "$2,500";

            const responseBlock: ResponseBlock = {
                type: "TRIP_PLAN",
                summary: `Here is a structured ${finalDuration} trip plan for ${title} with an estimated budget of ${finalBudget}.`,
                trip_meta: {
                    destination: title,
                    duration: finalDuration,
                    currency: targetCurrency,
                    budget_est: finalBudget,
                },
                sections: [
                    generateSection("FLIGHT", title),
                    generateSection("LODGING", title),
                    generateSection("FOOD", title),
                    generateSection("ACTIVITY", title),
                ],
                actions: [
                    {
                        label: `Create itinerary for this ${finalDuration} trip`,
                        action_id: "create_itinerary",
                        style: "PRIMARY",
                    },
                    {
                        label: "Show cheaper stays",
                        action_id: "refine_cheaper",
                        style: "SECONDARY",
                    },
                ],
            };

            return {
                reply: responseBlock.summary,
                data: { responseBlock },
            };
        } else {
            // DESTINATION_INFO logic
            const responseBlock: ResponseBlock = {
                type: "DESTINATION_INFO",
                summary: `${title} is a beautiful destination. Here are some highlights.`,
                trip_meta: {
                    destination: title,
                    currency: targetCurrency,
                },
                sections: [
                    generateSection("HIGHLIGHT", title),
                    generateSection("FOOD", title),
                ],
                actions: [
                    {
                        label: `Plan a trip to ${title}`,
                        action_id: "plan_trip",
                        style: "PRIMARY",
                    }
                ]
            };

            return {
                reply: responseBlock.summary,
                data: { responseBlock },
            };
        }
    }

    // Case: Generic / No Destination
    return {
        reply: "That sounds exciting! To give you the best suggestions, could you tell me where you want to go? (e.g., 'Trip to Tokyo for 5 days')",
    };
}

// ─── Mock Data Generators ──────────────────────────────────────────────

function generateSection(type: Section["type"], city: string): Section {
    const seed = city.length + type.length; // Deterministic-ish

    if (type === "FLIGHT") {
        return {
            id: `sec-${type}`,
            type,
            title: "Flights",
            items: [
                {
                    id: `fly-${city}-1`,
                    title: "Lufthansa",
                    image_url: "",
                    meta: ["Lagos", city, "Round trip, 1 stop"],
                    price_chip: "$850 +VAT"
                },
                {
                    id: `fly-${city}-2`,
                    title: "British Airways",
                    image_url: "",
                    meta: ["Lagos", "London", "Round trip"],
                    price_chip: "$920 +VAT"
                },
                {
                    id: `fly-${city}-3`,
                    title: "Air France",
                    image_url: "",
                    meta: ["Lagos", "Paris", "Round trip"],
                    price_chip: "$890 +VAT"
                }
            ],
            sources: ["Skyscanner", "Kayak"],
        };
    }

    if (type === "LODGING") {
        return {
            id: `sec-${type}`,
            type,
            title: "Where to Stay",
            items: [
                {
                    id: `stay-${city}-1`,
                    title: `Grand ${city} Hotel`,
                    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
                    meta: ["4.8 ★", "City Center"],
                    price_chip: "$220/night",
                },
                {
                    id: `stay-${city}-2`,
                    title: `${city} Boutique Stay`,
                    image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
                    meta: ["4.5 ★", "Quiet Neighborhood"],
                    price_chip: "$150/night",
                },
                {
                    id: `stay-${city}-3`,
                    title: `Urban Hostel ${city}`,
                    image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
                    meta: ["4.2 ★", "Social Vibe"],
                    price_chip: "$45/night",
                },
            ],
            sources: ["Booking.com", "Agoda"],
        };
    }

    if (type === "FOOD") {
        return {
            id: `sec-${type}`,
            type,
            title: "Local Eats",
            items: [
                {
                    id: `food-${city}-1`,
                    title: `The Golden Spoon`,
                    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
                    meta: ["Fine Dining", "Dinner"],
                    price_chip: "$50-80",
                },
                {
                    id: `food-${city}-2`,
                    title: `Street Corner`,
                    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
                    meta: ["Street Food", "Lunch"],
                    price_chip: "$10-20",
                },
            ],
            sources: ["Eater", "TripAdvisor"],
        };
    }

    if (type === "ACTIVITY" || type === "HIGHLIGHT") {
        return {
            id: `sec-${type}`,
            type,
            title: type === "HIGHLIGHT" ? "Top Highlights" : "Things to Do",
            items: [
                {
                    id: `act-${city}-1`,
                    title: `${city} City Tour`,
                    image_url: "https://images.unsplash.com/photo-1569949381669-ecf31ae8b453?w=400&h=300&fit=crop",
                    meta: ["3 hours", "Guided"],
                    price_chip: "$30",
                },
                {
                    id: `act-${city}-2`,
                    title: `Museum of ${city}`,
                    image_url: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&fit=crop",
                    meta: ["2 hours", "Culture"],
                    price_chip: "$15",
                },
                {
                    id: `act-${city}-3`,
                    title: `Sunset Viewpoint`,
                    image_url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=300&fit=crop",
                    meta: ["1 hour", "Scenic"],
                    price_chip: "Free",
                },
            ],
            sources: ["Viator", "Locals"],
        };
    }

    return {
        id: "generic",
        type: "GENERIC",
        title: "More Info",
        items: [],
    };
}

// ─── Route Handler ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, turnCount = 0, tripSnapshot } = body;
        console.log("API Request:", message, turnCount);

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Simulate a small delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const response = generateMockResponse(message, turnCount, tripSnapshot);

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                reply: "Something went wrong on my end. Could you try rephrasing that?",
            },
            { status: 500 }
        );
    }
}
