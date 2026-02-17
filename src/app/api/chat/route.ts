import { NextResponse, type NextRequest } from "next/server";
import type {
    ResponseBlock,
} from "@/types/response-block";
import { generateSection } from "@/lib/utils";
import type { AssistantResponse } from "@/types";

// 1. TRIP_PLAN: Dest + (Dates OR Duration OR Budget)
// 2. DESTINATION_INFO: Dest only
// 3. TRIP_EDIT: Context + Refinement keywords (simplified for MVP)

export function generateMockResponse(
    message: string,
    turnCount: number,
    snapshot?: AssistantResponse['tripSnapshot']
): { reply: string; data?: AssistantResponse } {
    const lower = message.toLowerCase();
    // Trigger rebuild

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
                                    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ibom_Air_Logo.jpg/800px-Ibom_Air_Logo.jpg", // Placeholder logo
                                    meta: ["Lagos", "Capetown", "Round trip, 2 stops"],
                                    price_chip: "$319 +VAT"
                                },
                                {
                                    id: "f2",
                                    title: "FLY Rwanda",
                                    image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/RwandAir_logo.svg/1200px-RwandAir_logo.svg.png", // Placeholder
                                    meta: ["Lagos", "London", "Round trip"],
                                    price_chip: "$319 +VAT"
                                },
                                {
                                    id: "f3",
                                    title: "Emirates Airlines",
                                    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png", // Placeholder
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
                                    title: "The Marly Boutique Hotel – beachfront luxury with ocean views",
                                    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦450k / night"
                                },
                                {
                                    id: "l2",
                                    title: "Kloof Street Hotel – urban charm in the heart of Cape Town",
                                    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦520k / night"
                                },
                                {
                                    id: "l3",
                                    title: "Cloud 9 Boutique Hotel – affordable & scenic, with modern amenities",
                                    image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦400k / night"
                                }
                            ]
                        },
                        {
                            id: "food-1",
                            type: "FOOD",
                            title: "Food & Restaurants",
                            sources: ["Booking.com", "agoda", "Reddit"],
                            items: [
                                {
                                    id: "r1",
                                    title: "Kloof Street House – romantic, colonial-era dining experience",
                                    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦15k / meal"
                                },
                                {
                                    id: "r2",
                                    title: "The Pot Luck Club – trendy tapas & cocktails at the Old Biscuit Mill",
                                    image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦45k / meal"
                                },
                                {
                                    id: "r3",
                                    title: "Codfather – Camps Bay seafood staple with fresh catches daily",
                                    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦30k / meal"
                                }
                            ]
                        },
                        {
                            id: "date-1",
                            type: "ACTIVITY",
                            title: "Things To Do",
                            sources: ["Booking.com", "agoda", "Reddit"],
                            items: [
                                {
                                    id: "a1",
                                    title: "Caldera sunset walk",
                                    image_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "Free"
                                },
                                {
                                    id: "a2",
                                    title: "Red Beach visit",
                                    image_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "Free"
                                },
                                {
                                    id: "a3",
                                    title: "Boat tour (half-day)",
                                    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "From ₦80k"
                                }
                            ]
                        }
                    ],
                    closing: "I can refine this to find cheaper flights, different dates, or hotels closer to Oia. What should we prioritize?",
                    actions: [
                        {
                            action_id: 'create_itinerary',
                            label: 'Create Itinerary',
                            style: 'PRIMARY',
                        },
                        {
                            action_id: 'modify_search',
                            label: 'Modify Search',
                            style: 'SECONDARY',
                        }
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
    const targetCurrency = detectedDest ? detectedDest.currency : "$";

    // Fallback: Attempt to extract destination from "Trip to X" or just treat the whole string as dest if short
    // Fallback: Attempt to extract destination from "Trip to X" or "I'm headed to X"
    if (!targetDest) {
        // Regex to catch "Trip to [Dest]" or "I'm headed to [Dest]"
        // Matches: "headed to [Dest] starting" OR "trip to [Dest] starting" OR just "headed to [Dest]" at end
        const tripToMatch = lower.match(/(?:trip|headed) to (.+?)(?: starting| for| with|$)/i);

        if (tripToMatch && tripToMatch[1]) {
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
                data: {
                    responseBlock,
                    tripSnapshot: {
                        destination: title,
                        dates: undefined,
                        duration: finalDuration,
                        budget: {
                            amount: parseInt(finalBudget.replace(/[^0-9]/g, "")) || 0,
                            currency: targetCurrency
                        },
                        travelStyle: "Explorer"
                    }
                },
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
                data: {
                    responseBlock,
                    tripSnapshot: {
                        destination: title,
                        dates: undefined,
                        duration: "Flexible",
                        budget: undefined,
                        travelStyle: "Explorer"
                    }
                },
            };
        }
    }

    // Case: Generic / No Destination
    return {
        reply: "That sounds exciting! To give you the best suggestions, could you tell me where you want to go? (e.g., 'Trip to Tokyo for 5 days')",
    };
}

// ─── Mock Data Generators ──────────────────────────────────────────────

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
