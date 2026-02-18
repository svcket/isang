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
    snapshot?: AssistantResponse['tripSnapshot'],
    action_id?: string
): { reply: string; data?: AssistantResponse } {
    const lower = message.toLowerCase();
    // Trigger rebuild

    // ─── Helper: Generate Trip Response ──────────────────────────────────

    // ─── Helper: Generate Trip Response ──────────────────────────────────
    function generateTripResponse(destination: string, duration: string, budget: string, travelers: string, dateInfo: string, currencySymbol: string = "$") {
        const isSantorini = destination.toLowerCase().includes("santorini");

        // Normalize budget string to just get the amount if needed, but we mostly just need the symbol for new items
        // The `budget` param is the full string "3000 dollars" or "$3000".
        // Use the passed currencySymbol for all generated items.

        const airline1 = isSantorini ? "Ibom Airlines" : "Delta Airlines";
        const airline2 = isSantorini ? "Qatar Airways" : "British Airways";
        const airline3 = isSantorini ? "Air Peace" : "Lufthansa";

        const hotel1 = isSantorini ? "Cavo Tagoo Santorini – luxury cave pool suites" : `Grand Hotel ${destination} – City Center`;
        const hotel2 = isSantorini ? "Grace Hotel, Auberge Resorts Collection" : `The Ritz-Carlton ${destination}`;
        const hotel3 = isSantorini ? "Katikies Santorini – Leading Hotels of the World" : `Marriott ${destination} Downtown`;

        const activity1 = isSantorini ? "Caldera sunset walk" : `City Walking Tour of ${destination}`;
        const activity2 = isSantorini ? "Red Beach visit" : `${destination} Museum Visit`;
        const activity3 = isSantorini ? "Boat tour (half-day)" : `Local Food Tasting in ${destination}`;

        return {
            reply: `I've found some great options for your trip to ${destination}! Here are the best flights and some top-rated places to stay.`,
            data: {
                tripSnapshot: {
                    destination: destination,
                    dates: { start: dateInfo || "2024-06-15", end: "2024-06-21" }, // Mock dates
                    duration: duration,
                    budget: { amount: parseInt(budget.replace(/\D/g, '')) || 5000, currency: currencySymbol },
                    travelStyle: "Relaxed"
                },
                responseBlock: {
                    type: "TRIP_PLAN" as const,
                    summary: `I've curated a mix of flights and top-rated hotels for your ${duration} trip to ${destination}.`,
                    trip_meta: {
                        destination: destination,
                        startDate: dateInfo || undefined,
                        duration: duration,
                        currency: currencySymbol,
                        budget_est: budget || undefined,
                        travelers: travelers || undefined,
                        dates: dateInfo || undefined
                    },
                    introduction: `I've curated a mix of direct and 1-stop flights, plus some stunning hotels in ${destination}.`,
                    sections: [
                        {
                            id: "flight-1",
                            type: "FLIGHT" as const,
                            title: "Flights",
                            sources: ["Skyscanner", "Google Flights"],
                            items: [
                                {
                                    id: "f1",
                                    title: "Ibom Airlines",
                                    image_url: "https://pbs.twimg.com/profile_images/1384435887640428546/_E_d_j_t_400x400.jpg",
                                    meta: ["Lagos", destination, "Round trip", "Direct"],
                                    price_chip: `${currencySymbol}1,250`,
                                    price: `${currencySymbol}1,250`,
                                    subtext: "Economy • 14h 20m"
                                },
                                {
                                    id: "f2",
                                    title: airline2,
                                    image_url: "https://logos-world.net/wp-content/uploads/2020/03/Qatar-Airways-Logo.png",
                                    meta: ["Lagos", destination, "Round trip", "1 stop"],
                                    price_chip: `${currencySymbol}1,850`,
                                    price: `${currencySymbol}1,850`,
                                    subtext: "Economy • 12h 10m"
                                },
                                {
                                    id: "f3",
                                    title: airline3,
                                    image_url: "https://upload.wikimedia.org/wikipedia/commons/7/75/Air_Peace_Logo.png",
                                    meta: ["Lagos", destination, "Round trip", "2 stops"],
                                    price_chip: `${currencySymbol}950`,
                                    price: `${currencySymbol}950`,
                                    subtext: "Economy • 18h 45m"
                                }
                            ]
                        },
                        {
                            id: "stay-1",
                            type: "LODGING" as const,
                            title: "Stays",
                            sources: ["Booking.com", "Airbnb", "Hotels.com"],
                            items: [
                                {
                                    id: "h1",
                                    title: hotel1,
                                    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop",
                                    meta: ["4.9 ★", "City Center", "Luxury"],
                                    price_chip: `From ${currencySymbol}850 / night`
                                },
                                {
                                    id: "h2",
                                    title: hotel2,
                                    image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=450&fit=crop",
                                    meta: ["5.0 ★", "City Center", "Infinity pool"],
                                    price_chip: `From ${currencySymbol}1,200 / night`
                                },
                                {
                                    id: "h3",
                                    title: hotel3,
                                    image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=450&fit=crop",
                                    meta: ["4.8 ★", "Downtown", "Modern"],
                                    price_chip: `From ${currencySymbol}950 / night`
                                }
                            ]
                        },
                        {
                            id: "date-1",
                            type: "ACTIVITY" as const,
                            title: "Things To Do",
                            sources: ["Booking.com", "agoda", "Reddit"],
                            items: [
                                {
                                    id: "a1",
                                    title: activity1,
                                    image_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "Free"
                                },
                                {
                                    id: "a2",
                                    title: activity2,
                                    image_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: "Free"
                                },
                                {
                                    id: "a3",
                                    title: activity3,
                                    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=450&fit=crop",
                                    meta: [],
                                    price_chip: `From ${currencySymbol}80`
                                }
                            ]
                        },
                        {
                            id: "req-1",
                            type: "HIGHLIGHT" as const,
                            title: "Entry Requirements",
                            sources: ["Gov.uk", "VisaHQ"],
                            items: [
                                {
                                    id: "v1",
                                    title: "Visa Requirement",
                                    image_url: "",
                                    meta: [],
                                    subtext: "Check embassy for details"
                                },
                                {
                                    id: "v2",
                                    title: "Passport Validity",
                                    image_url: "",
                                    meta: [],
                                    subtext: "Must have 6 months validity"
                                }
                            ]
                        }
                    ],
                    closing: "I can refine this to find cheaper flights, different dates, or hotels closer to the center. What should we prioritize?",
                    actions: [
                        {
                            action_id: 'create_itinerary',
                            label: `Create itinerary for this ${duration || '9 days'} trip`,
                            style: 'SECONDARY' as const,
                        }
                    ]
                }
            }
        };
    }

    // ─── MOCK: Universal Response ───────────────────────────────
    // Extract duration for dynamic response
    const santoriniDurationMatch = lower.match(/(\d+)\s*days?/);
    const duration = santoriniDurationMatch ? `${santoriniDurationMatch[1]} days` : "9 days";

    // ─── Extract Travelers ───
    const travelersMatch = lower.match(/(\d+)\s*(?:people|travelers|pax)/) || lower.match(/(couple|family|solo)/);
    const travelers = travelersMatch ? (travelersMatch[1] === 'couple' ? '2 Travelers' : (travelersMatch[1] === 'solo' ? '1 Traveler' : `${travelersMatch[1]} Travelers`)) : undefined;

    // ─── Extract Dates ───
    let dateInfo: string | undefined;

    // Pattern 1: "Aug 6-12", "August 6th-12th"
    const rangeMatch = lower.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}(?:st|nd|rd|th)?)\s*(?:-|to)\s*(\d{1,2}(?:st|nd|rd|th)?)/i);
    // Pattern 2: "starting Aug 6", "on Aug 6"
    const startMatch = lower.match(/(?:starting|from|on)\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}(?:st|nd|rd|th)?)/i);
    // Pattern 3: "in August"
    const monthMatch = lower.match(/in\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/i);

    if (rangeMatch) {
        const month = rangeMatch[1]!.charAt(0).toUpperCase() + rangeMatch[1]!.slice(1, 3); // Aug
        dateInfo = `${month} ${rangeMatch[2]!.replace(/(st|nd|rd|th)/, '')}-${rangeMatch[3]!.replace(/(st|nd|rd|th)/, '')}`;
    } else if (startMatch) {
        const month = startMatch[1]!.charAt(0).toUpperCase() + startMatch[1]!.slice(1, 3);
        dateInfo = `Starting ${month} ${startMatch[2]!.replace(/(st|nd|rd|th)/, '')}`;
    } else if (monthMatch) {
        const month = monthMatch[1]!.charAt(0).toUpperCase() + monthMatch[1]!.slice(1);
        dateInfo = `in ${month}`;
    }

    if (lower.includes("santorini")) {
        return generateTripResponse("Santorini, Greece", duration, "$5.5M (est. budget)", travelers || "2 Travelers", dateInfo || "");
    }

    // ─── Detect Destination ─────────────────────────────────────────────
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
        { names: ["lagos", "nigeria"], dest: "Lagos", currency: "₦" },
    ];

    let detectedDest = null;
    for (const d of destinations) {
        if (d.names.some((n) => lower.includes(n))) {
            detectedDest = d;
            break;
        }
    }

    // ─── Extract Budget ───
    let budget: string | undefined;

    // Pattern 1: Symbols ($3000, $3k)
    const symbolMatch = lower.match(/([$€£¥₦])\s*([\d,]+(?:k)?)/i);
    // Pattern 2: Words (3000 dollars, 3k euros)
    const wordMatch = lower.match(/([\d,]+(?:k)?)\s*(?:(dollars|usd)|(euros|eur)|(pounds|gbp)|(yen|jpy)|(naira|ngn))/i);
    // Pattern 3: Context (budget of 3000) - defaults to destination currency or $
    const contextMatch = lower.match(/budget\s+(?:of\s+)?([\d,]+(?:k)?)/i);

    if (symbolMatch) {
        budget = `${symbolMatch[1]}${symbolMatch[2]}`;
    } else if (wordMatch) {
        const amount = wordMatch[1];
        let symbol = "$";
        if (wordMatch[3]) symbol = "€";
        if (wordMatch[4]) symbol = "£";
        if (wordMatch[5]) symbol = "¥";
        if (wordMatch[6]) symbol = "₦";
        budget = `${symbol}${amount}`;
    } else if (contextMatch) {
        // Use detected destination currency if available, else $
        const currency = detectedDest ? detectedDest.currency : "$";
        budget = `${currency}${contextMatch[1]}`;
    }

    const durationMatch = lower.match(/(\d+)\s*(?:day|night|week)/);
    const hasDuration = !!durationMatch || lower.includes("weekend");

    // ─── 4. ITINERARY (Pattern D) ──────────────────────────────────────
    if (lower.includes("itinerary") || (action_id === 'create_itinerary')) {
        const dest = snapshot?.destination || detectedDest?.dest || "Cape Town";
        let days = 3;

        // Try to parse days from prompt first
        if (durationMatch) {
            days = parseInt(durationMatch[1]!);
        }
        // Fallback to snapshot duration
        else if (snapshot?.duration) {
            const snapDays = parseInt(snapshot.duration);
            if (!isNaN(snapDays)) days = snapDays;
        }

        // Cap at 7 for demo
        if (days > 7) days = 7;
        if (days < 1) days = 3;

        return generateItineraryResponse(dest, days, snapshot?.budget);
    }

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

    // ─── Case A: TRIP_PLAN (Pattern A) or Default Fallback ──────────────────
    // If we have a detected strict destination OR if the input is short enough to be a destination query

    let targetDest = detectedDest ? detectedDest.dest : null;
    const targetCurrency = detectedDest ? detectedDest.currency : "$";

    // Fallback: Attempt to extract destination from "Trip to X" or just treat the whole string as dest if short
    if (!targetDest) {
        // Regex to catch "Trip to [Dest]" or "I'm headed to [Dest]"
        // Matches: "headed to [Dest] starting" OR "trip to [Dest] starting" OR just "headed to [Dest]" at end
        const tripToMatch = lower.match(/(?:trip|headed) to (.+?)(?: starting| for| with|$)/i);

        if (tripToMatch && tripToMatch[1]) {
            // Capitalize first letter of each word
            targetDest = tripToMatch[1].replace(/\b\w/g, (l) => l.toUpperCase());
        } else if (message.length < 50 && !lower.includes("help") && !lower.includes("hello")) {
            // Assume the whole message might be a place name if it's short and not a greeting
            targetDest = message.replace(/\b\w/g, (l) => l.toUpperCase());
        }
    }

    if (targetDest) {
        const title = targetDest;

        // Extracted values (nullable)
        const durationStr = durationMatch ? `${durationMatch[1]} days` : (hasDuration ? "5 days" : undefined);
        const budgetStr = budget;
        const dateStr = dateInfo || undefined;
        const travelersStr = travelers;

        // Classify Intent
        // TRIP_PLAN requires explicit intent keywords OR specific details (dates/duration/budget)
        // OR if we have a clear destination with no other intent
        const isTripPlan = lower.includes("plan") ||
            lower.includes("trip") ||
            lower.includes("itinerary") ||
            lower.includes("guide") ||
            !!durationStr ||
            !!budgetStr ||
            !!dateStr ||
            !!travelersStr;

        if (isTripPlan) {
            // Determine currency to use: if budget has a symbol, use it; else destination currency; else $
            const currencyStr = (budgetStr && budgetStr.match(/[$€£¥₦]/))
                ? budgetStr.match(/[$€£¥₦]/)![0]
                : targetCurrency;

            // Explicitly pass undefined for missing values to let the frontend handle placeholders
            return generateTripResponse(
                targetDest,
                durationStr || "5 days",
                budgetStr || "",
                travelersStr || "",
                dateStr || "",
                currencyStr
            );
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

    // ─── Case B: GENERAL_ASSIST (Pattern B) ──────────────────────────────
    // If no specific destination or intent is detected, but it's not a simple greeting
    if (!targetDest && !lower.includes("hello") && !lower.includes("hi") && !lower.includes("hey")) {
        return {
            reply: "I can help you plan your next adventure! Tell me where you'd like to go, for how long, and your estimated budget.",
            data: {
                responseBlock: {
                    type: "GENERAL_ASSIST",
                    summary: "Assistance with trip planning.",
                    actions: [
                        { label: "Plan a trip", action_id: "plan_trip", style: "PRIMARY" },
                        { label: "Explore destinations", action_id: "explore_destinations", style: "SECONDARY" }
                    ]
                }
            }
        };
    }

    // ─── Default Greeting ──────────────────────────────────────────────
    return {
        reply: "Hello there! I'm your AI travel assistant. How can I help you plan your next adventure?",
        data: {
            responseBlock: {
                type: "GREETING",
                summary: "AI Travel Assistant greeting.",
                actions: [
                    { label: "Plan a trip", action_id: "plan_trip", style: "PRIMARY" },
                    { label: "Explore destinations", action_id: "explore_destinations", style: "SECONDARY" }
                ]
            }
        }
    };
}

// ─── Hyper-Local Itinerary Generator ───────────────────────────────────
function generateItineraryResponse(destination: string, days: number, budget?: { amount: string | number, currency: string }) {
    // Default currency based on destination
    let currencySymbol = "$";
    if (destination.includes("London") || destination.includes("UK")) currencySymbol = "£";
    if (destination.includes("Paris") || destination.includes("Europe")) currencySymbol = "€";
    if (destination.includes("Tokyo")) currencySymbol = "¥";
    if (destination.includes("Lagos")) currencySymbol = "₦";
    if (destination.includes("Cape Town")) currencySymbol = "R";
    if (destination.includes("Dubai")) currencySymbol = "AED";

    // Override if budget provided
    if (budget?.currency) {
        currencySymbol = budget.currency;
    }

    const budgetEst = budget ? `${currencySymbol}${budget.amount}` : `${currencySymbol}3500`;

    // Ensure generateDailyItinerary is called with correct types
    const dailyItinerary = generateDailyItinerary(destination, days, currencySymbol);

    // Parse budget amount for snapshot
    const budgetAmount = budget ? (typeof budget.amount === 'string' ? parseInt(budget.amount.replace(/\D/g, '')) || 0 : budget.amount) : undefined;

    return {
        reply: `Here represents a ${days}-day itinerary for ${destination}.`,
        data: {
            responseBlock: {
                type: "ITINERARY" as const,
                summary: `A curated ${days}-day itinerary for ${destination}, balanced for exploration and relaxation.`,
                trip_meta: {
                    destination: destination,
                    duration: `${days} days`,
                    currency: currencySymbol,
                    budget_est: budgetEst
                },
                days: dailyItinerary,
                actions: [
                    { label: "Refine itinerary", action_id: "refine_itinerary", style: "SECONDARY" as const },
                    { label: "Show me flights", action_id: "show_flights", style: "PRIMARY" as const }
                ]
            },
            // Persist the snapshot
            tripSnapshot: {
                destination: destination,
                duration: `${days} days`,
                budget: budgetAmount !== undefined && budget ? { amount: budgetAmount, currency: budget.currency } : undefined,
                dates: undefined,
                travelStyle: "Explorer"
            }
        }
    };
}

// ─── Helper: Generate Daily Itinerary ───
function generateDailyItinerary(destination: string, days: number, currency: string) {
    const itinerary = [];
    for (let i = 1; i <= days; i++) {
        itinerary.push({
            day_index: i,
            title: `Day ${i}: Exploring ${destination}`,
            overview: `Enjoy a full day of activities in ${destination}.`,
            blocks: [
                { kind: "plan" as const, content: "Morning visit to local landmarks." },
                { kind: "plan" as const, content: "Afternoon relaxation or museum tour." },
                { kind: "tip" as const, content: `Try the local street food. Budget around ${currency}20.` },
                { kind: "spend" as const, amount: `${currency}150`, note: "Estimated daily spend", dateStr: "Today" }
            ]
        });
    }
    return itinerary;
}

// ─── Route Handler ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, turnCount = 0, tripSnapshot, action_id } = body;
        console.log("API Request:", message, turnCount);

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Simulate a small delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const response = generateMockResponse(message, turnCount, tripSnapshot, action_id);

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
