import { NextResponse, type NextRequest } from "next/server";
import type {
    ResponseBlock,
    DestinationBlock,
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
    action_id?: string,
    filters?: any,
    action_payload?: any
): { reply: string; data?: AssistantResponse } {
    const lower = message.toLowerCase();

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
                    dates: dateInfo ? { start: dateInfo, end: "" } : { start: "2024-06-15", end: "2024-06-21" }, // Mock dates
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
                                    title: airline1,
                                    image_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(airline1)}&background=0D47A1&color=fff&size=64&bold=true&format=png`,
                                    meta: ["Lagos", destination.split(",")[0] || destination, "Round trip", "Direct"],
                                    price_chip: `${currencySymbol}1,250`,
                                    price: `${currencySymbol}1,250`,
                                    subtext: "Economy • 14h 20m"
                                },
                                {
                                    id: "f2",
                                    title: airline2,
                                    image_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(airline2)}&background=7B1FA2&color=fff&size=64&bold=true&format=png`,
                                    meta: ["Lagos", destination, "Round trip", "1 stop"],
                                    price_chip: `${currencySymbol}1,850`,
                                    price: `${currencySymbol}1,850`,
                                    subtext: "Economy • 12h 10m"
                                },
                                {
                                    id: "f3",
                                    title: airline3,
                                    image_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(airline3)}&background=1B5E20&color=fff&size=64&bold=true&format=png`,
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

    // Pattern 1: "Aug 6-12", "Feb 22 - Feb 27"
    const rangeMatch = lower.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}(?:st|nd|rd|th)?)\s*(?:-|to)\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+)?(\d{1,2}(?:st|nd|rd|th)?)/i);
    // Pattern 2: "starting Aug 6", "on Aug 6"
    const startMatch = lower.match(/(?:starting|from|on)\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}(?:st|nd|rd|th)?)/i);
    // Pattern 3: "in August"
    const monthMatch = lower.match(/in\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/i);

    if (rangeMatch) {
        const startMonth = rangeMatch[1]!.charAt(0).toUpperCase() + rangeMatch[1]!.slice(1, 3); // Aug
        const startDay = rangeMatch[2]!.replace(/(st|nd|rd|th)/, '');

        let endMonth = startMonth;
        let endDay = rangeMatch[4]!.replace(/(st|nd|rd|th)/, '');

        // If second month is present (Group 3)
        if (rangeMatch[3]) {
            endMonth = rangeMatch[3]!.charAt(0).toUpperCase() + rangeMatch[3]!.slice(1, 3);
        }

        if (startMonth === endMonth) {
            dateInfo = `${startMonth} ${startDay}-${endDay}`;
        } else {
            dateInfo = `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
        }
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
        const dest = filters?.destination || snapshot?.destination || detectedDest?.dest || "Cape Town";
        let days = 3;

        // Try to parse days from prompt first
        if (durationMatch) {
            days = parseInt(durationMatch[1]!);
        }
        // Then try filters.dates (calculate duration)
        else if (filters?.dates?.start && filters?.dates?.end) {
            const d1 = new Date(filters.dates.start);
            const d2 = new Date(filters.dates.end);
            const diffDays = Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            days = diffDays;
        }
        // Fallback to snapshot duration
        else if (snapshot?.duration) {
            const snapDays = parseInt(snapshot.duration);
            if (!isNaN(snapDays)) days = snapDays;
        }

        // Cap at 7 for demo
        if (days > 7) days = 7;
        if (days < 1) days = 3;

        const combinedBudget = filters?.budget?.amount ? { amount: filters.budget.amount, currency: filters.budget.currency === "USD" ? "$" : "₦" } : snapshot?.budget;
        const combinedDates = filters?.dates?.start ? (filters.dates.end ? `${filters.dates.start} - ${filters.dates.end}` : filters.dates.start) : (snapshot?.dates || dateInfo);

        return generateItineraryResponse(dest, days, combinedBudget, combinedDates);
    }

    // ─── 4b. VIEW_PLAN (from Budget-Only card click) ────────────────────
    if (action_id === 'view_plan') {
        const dest = action_payload?.destination || filters?.destination || 'Cape Town';
        const viewCurrency = destinations.find(d => d.names.some(n => dest.toLowerCase().includes(n)))?.currency || '$';
        return generateTripResponse(dest, '4 days', '', '', '', viewCurrency);
    }

    // ─── 3. TRIP_EDIT (Pattern C) ───────────────────────────────────────
    // Rule: Context exists + refinement
    if (snapshot && (lower.includes("cheap") || lower.includes("stay") || lower.includes("hotel"))) {
        const dest = filters?.destination || snapshot.destination || "Target City";
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

    // ─── 2b. BUDGET_ONLY (Pattern D — budget with no destination) ────────
    if (budget && !detectedDest) {
        // Check that no destination was set via another route
        const filterDest = filters?.destination;
        if (!filterDest) {
            return generateBudgetOnlyResponse(budget, filters);
        }
    }

    // ─── 2. Classification & Generation ──────────────────────────────────

    // ─── Case A: TRIP_PLAN (Pattern A) or Default Fallback ──────────────────
    // If we have a detected strict destination OR if the input is short enough to be a destination query

    let targetDest = filters?.destination || (detectedDest ? detectedDest.dest : null);
    const targetCurrency = detectedDest ? detectedDest.currency : "$";

    // Fallback: Attempt to extract destination from "Trip to X" or just treat the whole string as dest if short
    if (!targetDest) {
        // Regex to catch "Trip to [Dest]" or "I'm headed to [Dest]"
        // Matches: "headed to [Dest] starting" OR "trip to [Dest] starting" OR just "headed to [Dest]" at end
        const tripToMatch = lower.match(/(?:trip|headed) to (.+?)(?: starting| for| with|$)/i);

        // Match explicit conversational phrases like "tell me about [Dest]" or "explore [Dest]"
        const conversationalMatch = lower.match(/(?:tell me about|what about|explore|visit|show me|going to) (.+?)(?: starting| for| with|$)/i);

        if (tripToMatch && tripToMatch[1]) {
            // Capitalize first letter of each word
            targetDest = tripToMatch[1].replace(/\b\w/g, (l) => l.toUpperCase());
        } else if (conversationalMatch && conversationalMatch[1]) {
            targetDest = conversationalMatch[1].replace(/\b\w/g, (l) => l.toUpperCase());
        } else if (message.length < 50 && !lower.includes("help") && !lower.includes("hello")) {
            // Assume the whole message might be a place name if it's short, strip some very common simple prefixes
            let cleaned = message.replace(/^(how about|what about|go to|visit)\s+/i, '');
            targetDest = cleaned.replace(/\b\w/g, (l) => l.toUpperCase());
        }
    }

    if (targetDest) {
        const title = targetDest;

        // Ensure travelers string formats correctly
        const formatTravelers = (adults: number, children: number) => {
            const total = adults + children;
            return total === 1 ? '1 Traveler' : `${total} Travelers`;
        };

        // Extracted values (nullable) defaults to filters before regex
        const durationStr = durationMatch ? `${durationMatch[1]} days` : (hasDuration ? "5 days" : undefined);
        const budgetStr = filters?.budget?.amount ? `${filters.budget.currency === "USD" ? "$" : "₦"}${filters.budget.amount}` : budget;
        const dateStr = filters?.dates?.start ? (filters.dates.end ? `${filters.dates.start} - ${filters.dates.end}` : filters.dates.start) : (dateInfo || undefined);
        const travelersStr = (filters?.travelers && (filters.travelers.adults !== 1 || filters.travelers.children > 0)) ? formatTravelers(filters.travelers.adults, filters.travelers.children) : travelers;

        // Classify Intent
        // TRIP_PLAN requires explicit intent keywords OR specific details (dates/duration/budget)
        // OR if we have a clear destination with no other intent

        const isCostQuestion = lower.includes("how much") || lower.includes("cost") || lower.includes("price") || lower.includes("expensive") || lower.includes("budget for");

        let isTripPlan = lower.includes("plan") ||
            lower.includes("itinerary") ||
            lower.includes("guide") ||
            !!durationStr ||
            !!budgetStr ||
            !!dateStr ||
            !!travelersStr;

        // If it's a cost question, force Info unless they strictly said "plan" or gave a budget amount
        if (isCostQuestion && !lower.includes("plan") && !lower.includes("itinerary") && !budgetStr) {
            isTripPlan = false;
        }

        if (isTripPlan) {
            // Determine currency to use: if budget has a symbol, use it; else destination currency; else $
            const currencyStr = (budgetStr && budgetStr.toString().match(/[$€£¥₦]/))
                ? budgetStr.toString().match(/[$€£¥₦]/)![0]
                : (filters?.budget?.currency === "NGN" ? "₦" : targetCurrency);

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
            // DESTINATION_INFO logic (Highlights Feed)
            const currency = targetCurrency;

            // Construct Blocks
            const blocks: DestinationBlock[] = [];

            // 1. Intro
            blocks.push({
                kind: "intro",
                text: `${title} is a ${title === 'Paris' ? 'dreamy' : 'vibrant'} destination known for its ${title === 'Japan' ? 'culture' : 'atmosphere'}. Here is a snapshot of what to expect.`
            });

            // Evaluate missing filters for nudge
            let missingFilter: "budget" | "when" | "travelers" | "destination" | undefined;
            if (!filters?.budget?.amount) missingFilter = "budget";
            else if (!filters?.dates?.start) missingFilter = "when";
            else if (filters?.travelers?.adults === 1 && filters?.travelers?.children === 0) missingFilter = "travelers";

            const ui_hints = {
                show_filter_nudge: !!missingFilter,
                filter_nudge_text: "Travel buddy tip: set dates + budget in the top filter for accurate prices.",
                focus_filter: missingFilter
            };

            // 2. Highlights
            const highlights = getHighlights(title);

            blocks.push({
                kind: "highlights",
                items: highlights
            });

            const suggestions = [
                { label: "Budget-friendly highlights", action: "send" as const, payload: "Show me budget-friendly highlights" },
                { label: "3-day itinerary", action: "send" as const, payload: "Create a 3-day itinerary" },
                { label: "Food + culture", action: "send" as const, payload: "Show me food and culture spots" },
                { label: "Romantic weekend", action: "send" as const, payload: "Plan a romantic weekend" }
            ];

            const responseBlock: ResponseBlock = {
                type: "DESTINATION_INFO",
                summary: `${title} is a vibrant city known for its unique blend of modern and historical architecture, rich culture, and lively atmosphere.`,
                trip_meta: {
                    destination: title,
                    currency: targetCurrency,
                },
                blocks: blocks,
                actions: [], // Required by ResponseBlock type
                ui_hints,
                suggestions
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

// ─── Helper: Get Highlights ──────────────────────────────────────────
function getHighlights(destination: string) {
    const lower = destination.toLowerCase();

    // Specific: Paris
    if (lower.includes("paris")) {
        return [
            {
                id: "h1",
                title: "Eiffel Tower:",
                description: "The iconic iron lattice tower on the Champ de Mars, offering stunning panoramic views of the city.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h2",
                title: "Louvre Museum:",
                description: "The world's largest art museum and a historic monument in Paris, home to the Mona Lisa and Venus de Milo.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1585651549242-23b02bc9b12d?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1564399579960-0db398d285ac?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1504183817711-08924b7ee147?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h3",
                title: "Montmartre:",
                description: "A large hill in Paris known for its artistic history and the white-domed Basilica of the Sacré-Cœur.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1551634979-2b11f8c218da?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1550340499-a6c60da8c697?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1571684068498-8e7e37b2303c?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=400&h=300&fit=crop"
                ],
                actions: []
            }
        ];
    }

    // Specific: Barcelona
    if (lower.includes("barcelona")) {
        return [
            {
                id: "h1",
                title: "Picasso Museum:",
                description: "Explore an extensive collection of works by the famous artist Pablo Picasso. The museum occupies five adjoining medieval palaces in Barcelona's La Ribera.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1561482602-7f65f1fa39a5?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h2",
                title: "Sagrada Família:",
                description: "This iconic basilica designed by Antoni Gaudí is a must-visit. It's a masterpiece of modernist architecture and is still under construction after more than a century.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1583779457094-ab6f9164a1ae?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h3",
                title: "Gothic Quarter:",
                description: "Wander through the narrow medieval streets filled with trendy bars, clubs, and Catalan restaurants. This area is rich in history and culture.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1570698473651-b2de99bae12f?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h4",
                title: "Park Güell:",
                description: "A public park system composed of gardens and architectonic elements located on Carmel Hill, another major work of Gaudí.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h5",
                title: "Casa Batlló:",
                description: "A renowned building in the center of Barcelona. It was designed by Antoni Gaudí, and is considered one of his masterpieces.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1560913210-72c567e8a452?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h6",
                title: "Camp Nou:",
                description: "The home stadium of FC Barcelona. A must-visit for football fans, offering tours of the stadium and museum.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop"
                ],
                actions: []
            }
        ];
    }

    // Specific: Tokyo
    if (lower.includes("tokyo")) {
        return [
            {
                id: "h1",
                title: "Senso-ji Temple:",
                description: "Tokyo's oldest temple, offering a colorful insight into Japanese culture and history.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1583167789591-53b0c5cb55d5?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h2",
                title: "Shibuya Crossing:",
                description: "The world's busiest pedestrian crossing, a symbol of Tokyo's vibrant energy.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1554797589-7241bb691973?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h3",
                title: "Meiji Shrine:",
                description: "A serene forest oasis in the heart of the city, dedicated to Emperor Meiji.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h4",
                title: "Tokyo Skytree:",
                description: "The tallest tower in the world, offering breathtaking panoramic views of the city.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h5",
                title: "Tsukiji Outer Market:",
                description: "A lively market district famous for its fresh seafood, produce, and kitchenware.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop"
                ],
                actions: []
            },
            {
                id: "h6",
                title: "Akihabara:",
                description: "The center of Japan's otaku (diehard fan) culture and a major shopping district for video games, anime, manga, and electronics.",
                photo_urls: [
                    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1549693578-d683be217e58?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1570521462033-3015e76e7432?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=400&h=300&fit=crop"
                ],
                actions: []
            }
        ];
    }

    // Generic fallback with specific-sounding places
    return [
        {
            id: "h1",
            title: `The Grand ${destination} Museum`,
            description: `A stunning collection of art and history that tells the captivating story of ${destination} from ancient times to modern day.`,
            photo_urls: [
                "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1513439339735-b1ff811dfdc0?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop"
            ],
            actions: []
        },
        {
            id: "h2",
            title: `Historic Old Town ${destination}`,
            description: `Wander through the narrow, winding streets of the old town, filled with centuries-old architecture, charming cafes, and hidden courtyards.`,
            photo_urls: [
                "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=400&h=300&fit=crop"
            ],
            actions: []
        },
        {
            id: "h3",
            title: `${destination} Central Market`,
            description: `A bustling hub of local life. Taste authentic street food, buy fresh produce, and experience the pure energy of ${destination}.`,
            photo_urls: [
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop"
            ],
            actions: []
        },
        {
            id: "h4",
            title: `Panoramic ${destination} Tower`,
            description: `Take an elevator to the observation deck for breathtaking, 360-degree views of the entire city skyline and surrounding natural beauty.`,
            photo_urls: [
                "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop"
            ],
            actions: []
        },
        {
            id: "h5",
            title: `The Royal Botanical Gardens`,
            description: `Escape the urban rush in these pristine, beautifully manicured gardens. A perfect spot for a peaceful afternoon stroll.`,
            photo_urls: [
                "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1558293842-c0fd3db86157?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1416169607655-0c2b3ce2e1cc?w=400&h=300&fit=crop"
            ],
            actions: []
        },
        {
            id: "h6",
            title: `${destination} Waterfront Promenade`,
            description: `Walk along the water's edge at sunset. Lined with premium restaurants and boutique shops, it's the premium evening destination.`,
            photo_urls: [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&h=300&fit=crop"
            ],
            actions: []
        },
        {
            id: "h7",
            title: `Cathedral of ${destination}`,
            description: `An architectural masterpiece. The intricate stained glass and towering spires make this historic cathedral a must-visit landmark.`,
            photo_urls: [
                "https://images.unsplash.com/photo-1548585744-4e0e8b62a20d?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1603052875990-1af678d81c08?w=400&h=300&fit=crop"
            ],
            actions: []
        }
    ];
}

// ─── Hyper-Local Itinerary Generator ───────────────────────────────────
// ─── Helper: Generate Budget-Only Response ─────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateBudgetOnlyResponse(budgetStr: string, filters?: any) {
    // Parse budget amount and currency symbol
    const currencyMatch = budgetStr.match(/[$€£¥₦R]/);
    const currencySymbol = currencyMatch ? currencyMatch[0] : "$";
    const amountStr = budgetStr.replace(/[^0-9.k]/gi, '');
    let amount = parseFloat(amountStr) || 3000;
    if (amountStr.toLowerCase().endsWith('k')) {
        amount = parseFloat(amountStr.replace(/k/i, '')) * 1000;
    }

    // Determine if NGN budget (large numbers)
    const isNGN = currencySymbol === "₦" || (filters?.budget?.currency === "NGN") || amount > 50000;
    const displayCurrency = isNGN ? "₦" : currencySymbol;

    // Format helper
    const formatPrice = (val: number) => {
        if (isNGN) {
            if (val >= 1000000) return `${displayCurrency}${(val / 1000000).toFixed(1)}M`;
            return `${displayCurrency}${(val / 1000).toFixed(0)}k`;
        }
        if (val >= 1000) return `${displayCurrency}${(val / 1000).toFixed(1)}k`;
        return `${displayCurrency}${val.toFixed(0)}`;
    };

    // Destination pool with budget tiers
    const destinationPool = [
        {
            id: "cpt", title: "Cape Town", region: "South Africa", duration: "4 days",
            image_url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2071&auto=format&fit=crop",
            baseCostUSD: 1800, baseCostNGN: 1200000
        },
        {
            id: "par", title: "Paris", region: "France", duration: "3 days",
            image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
            baseCostUSD: 2400, baseCostNGN: 1800000
        },
        {
            id: "tok", title: "Tokyo", region: "Japan", duration: "4 days",
            image_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1988&auto=format&fit=crop",
            baseCostUSD: 2800, baseCostNGN: 2100000
        },
        {
            id: "bali", title: "Bali", region: "Indonesia", duration: "5 days",
            image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop",
            baseCostUSD: 1500, baseCostNGN: 1000000
        },
        {
            id: "ldn", title: "London", region: "United Kingdom", duration: "3 days",
            image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop",
            baseCostUSD: 2600, baseCostNGN: 1900000
        },
        {
            id: "bcn", title: "Barcelona", region: "Spain", duration: "4 days",
            image_url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop",
            baseCostUSD: 1600, baseCostNGN: 1100000
        },
        {
            id: "dbi", title: "Dubai", region: "United Arab Emirates", duration: "3 days",
            image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
            baseCostUSD: 2200, baseCostNGN: 1600000
        },
        {
            id: "sntr", title: "Santorini", region: "Greece", duration: "4 days",
            image_url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070&auto=format&fit=crop",
            baseCostUSD: 2000, baseCostNGN: 1400000
        }
    ];

    // Filter destinations that fit the budget, pick up to 6
    const budgetInUSD = isNGN ? amount / 750 : amount; // Rough NGN→USD conversion
    const affordable = destinationPool
        .filter(d => d.baseCostUSD <= budgetInUSD * 1.1) // Allow 10% flex
        .slice(0, 6);

    // If nothing affordable, show cheapest 4 anyway
    const suggestions = affordable.length >= 3 ? affordable : destinationPool.sort((a, b) => a.baseCostUSD - b.baseCostUSD).slice(0, 4);

    const items = suggestions.map(d => ({
        id: d.id,
        title: d.title,
        image_url: d.image_url,
        meta: [d.region, d.duration],
        price_chip: `Est. ${formatPrice(isNGN ? d.baseCostNGN : d.baseCostUSD)}`
    }));

    const formattedBudget = formatPrice(amount);

    return {
        reply: `Here are trips that fit ${formattedBudget}.`,
        data: {
            responseBlock: {
                type: "BUDGET_ONLY" as const,
                summary: `Here are trips that fit ${formattedBudget}.`,
                introduction: `I found ${items.length} destinations that work within your ${formattedBudget} budget. Each estimate covers flights, stays, and daily activities for the suggested duration.`,
                trip_meta: {
                    destination: "",
                    currency: displayCurrency,
                    budget_est: formattedBudget,
                    duration: "3\u20134 days"
                },
                sections: [
                    {
                        id: "destinations",
                        type: "DESTINATION" as const,
                        title: "Where you can go",
                        items: items
                    }
                ],
                actions: [
                    {
                        label: "Set dates to refine",
                        action_id: "open_when_filter",
                        style: "PRIMARY" as const,
                    },
                    {
                        label: "Add origin",
                        action_id: "focus_destination",
                        style: "SECONDARY" as const,
                    }
                ]
            },
            tripSnapshot: {
                destination: "",
                duration: "3-4 days",
                budget: { amount: amount, currency: displayCurrency },
                travelStyle: "Explorer"
            }
        }
    };
}

function generateItineraryResponse(destination: string, days: number, budget?: { amount: string | number, currency: string }, dates?: { start: string, end: string } | string) {
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

    // Evaluate dates for meta
    let dateStr: string | undefined;
    if (typeof dates === 'string') {
        dateStr = dates;
    } else if (dates?.start) {
        dateStr = dates.end ? `${dates.start} - ${dates.end}` : dates.start;
    }

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
                    budget_est: budgetEst,
                    dates: dateStr
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
                dates: dates ? (typeof dates === 'string' ? { start: dates, end: "" } : dates) : undefined,
                travelStyle: "Explorer"
            }
        }
    };
}

// ─── Helper: Generate Daily Itinerary ───
function generateDailyItinerary(destination: string, days: number, currency: string) {
    const lower = destination.toLowerCase();
    const city = (destination.split(',')[0] || destination).trim();

    // ─── Cape Town ──────────────
    if (lower.includes("cape town")) {
        const pool = [
            {
                title: "Arrival & Waterfront Welcome",
                overview: "Touch down at Cape Town International and head straight to the V&A Waterfront. The harbour hums with afternoon energy — craft markets, buskers, and the Table Mountain backdrop turning gold in the late sun. End with sundowners at a rooftop bar along Bree Street.",
                beats: [
                    { title: "Morning", content: "Arrive & check into your hotel in the City Bowl or Sea Point area." },
                    { title: "Noon", content: "Explore the V&A Waterfront — Watershed market, Zeitz MOCAA galleries, harbour walks." },
                    { title: "Evening", content: "Dinner on Bree Street; try the Cape Malay bobotie at Gold Restaurant." }
                ],
                tip: { label: "Local Tip", text: "The MyCiTi bus from the airport is R100 one-way and drops you right at the Civic Centre — skip the meter taxis." },
                spend: { amount: `${currency}1,800`, note: "mostly hotel check-in + airport transfer + dinner" }
            },
            {
                title: "Table Mountain & Bo-Kaap Culture",
                overview: "Start with the first cable car rotation up Table Mountain before the crowds roll in. The views from the top stretch from Robben Island to the Hottentots Holland range. Descend into the technicolor streets of Bo-Kaap for a cooking class with a local family.",
                beats: [
                    { title: "Morning", content: "Cable car up Table Mountain — arrive by 8am to beat queues." },
                    { title: "Noon", content: "Walk through Bo-Kaap's cobbled streets; join a Cape Malay cooking class." },
                    { title: "Evening", content: "Sundowners at Signal Hill with panoramic city-and-ocean views." }
                ],
                tip: { label: "Weather Tip", text: "Table Mountain's cable car closes in high wind. Check the webcam at tablemountain.net before heading up — mornings are usually calmer." },
                spend: { amount: `${currency}1,200`, note: "cable car ticket + cooking class + lunch" }
            },
            {
                title: "Cape Peninsula Road Trip",
                overview: "Rent a car and take Chapman's Peak Drive — one of the world's most dramatic coastal roads. Stop at Boulders Beach to visit the penguin colony, then press on to Cape Point where the Atlantic meets the Indian Ocean. The drive back through Simon's Town is pure magic.",
                beats: [
                    { title: "Morning", content: "Drive Chapman's Peak to Boulders Beach — penguins in their tuxedos." },
                    { title: "Noon", content: "Cape Point Nature Reserve — hike to the old lighthouse for endless ocean views." },
                    { title: "Evening", content: "Seafood basket at the Brass Bell in Kalk Bay, waves crashing beneath you." }
                ],
                tip: { label: "Safety Tip", text: "Keep car doors locked and valuables out of sight at parking areas along the peninsula. Most spots are safe but petty theft happens." },
                spend: { amount: `${currency}2,500`, note: "car rental + fuel + park entry fees + seafood dinner" }
            },
            {
                title: "Wine Lands & Franschhoek",
                overview: "Drive 45 minutes east into the Winelands and the world shifts entirely — vineyard-draped valleys, Cape Dutch homesteads, and some of the best Pinotage on Earth. Franschhoek's Huguenot heritage gives it a distinctly French-African character.",
                beats: [
                    { title: "Morning", content: "Wine tram through Franschhoek — hop off at 3–4 estates for tastings." },
                    { title: "Noon", content: "Long lunch at La Petite Colombe or Babel at Babylonstoren." },
                    { title: "Evening", content: "Golden hour drive back through the Helshoogte Pass." }
                ],
                tip: { label: "Food Tip", text: "Book your wine tram ticket online at least 48 hours ahead — it sells out fast, especially on weekends." },
                spend: { amount: `${currency}3,200`, note: "wine tastings + fine dining lunch + transport" }
            },
            {
                title: "Robben Island & City Culture",
                overview: "Take the morning ferry to Robben Island for a tour led by a former political prisoner — the stories will stay with you. Return to the city and wander through the Company's Garden, then lose yourself in the galleries of Woodstock and the street art of Salt River.",
                beats: [
                    { title: "Morning", content: "Robben Island ferry + guided tour of Nelson Mandela's cell." },
                    { title: "Noon", content: "District Six Museum, then explore Woodstock's art galleries and vintage shops." },
                    { title: "Evening", content: "Craft cocktails at The Pot Luck Club in the Old Biscuit Mill." }
                ],
                tip: { label: "Local Tip", text: "Robben Island ferries depart at 9am, 11am, and 1pm from the Nelson Mandela Gateway at the Waterfront. Book online — walk-ups are rare." },
                spend: { amount: `${currency}1,500`, note: "ferry tickets + museum entries + dinner" }
            },
            {
                title: "Camps Bay & Sunset Farewell",
                overview: "Your final morning belongs to the sea. Walk the Sea Point Promenade as joggers and dog-walkers pass, then settle onto the white sands of Camps Bay with the Twelve Apostles towering behind you. A farewell lunch of fresh linefish, and Cape Town sends you off with one last golden sunset.",
                beats: [
                    { title: "Morning", content: "Sea Point Promenade walk, coffee at Bootlegger." },
                    { title: "Noon", content: "Beach time at Camps Bay; browse the boutiques on Victoria Road." },
                    { title: "Evening", content: "Sunset dinner at Paranga or The Roundhouse." }
                ],
                tip: { label: "Relaxation Tips", text: "Camps Bay faces west — arrive by 5pm for the best sunset position. Bring a light jacket; the Atlantic breeze picks up fast." },
                spend: { amount: `${currency}1,800`, note: "beach sundowners + farewell dinner + souvenirs" }
            }
        ];
        return buildItinerary(pool, days, currency);
    }

    // ─── Santorini ──────────────
    if (lower.includes("santorini")) {
        const pool = [
            {
                title: "Arrival & Fira First Impressions",
                overview: "Land on the island and transfer to Fira, the clifftop capital. The first glimpse of the caldera — that impossible blue against whitewashed walls — never gets old. Walk the marble lanes, find a terrace café, and let the Aegean settle you in.",
                beats: [
                    { title: "Morning", content: "Arrive at Thira airport; transfer to Fira and check into your cave hotel." },
                    { title: "Noon", content: "Wander Fira's caldera-edge walkway; stop at the Archaeological Museum." },
                    { title: "Evening", content: "Dinner at Koukoumavlos with caldera views as the sun dips." }
                ],
                tip: { label: "Local Tip", text: "Pre-book your airport transfer — taxis are scarce and prices triple during peak season. Your hotel can usually arrange one for €25–35." },
                spend: { amount: `${currency}180`, note: "airport transfer + hotel check-in + dinner" }
            },
            {
                title: "Oia & the Iconic Sunset",
                overview: "Take the 10km cliffside trail from Fira to Oia — arguably the most beautiful walk in the Mediterranean. Blue-domed churches appear around every bend. Oia's sunset from the castle ruins is legendary for good reason: the whole village gathers, and when the sun disappears, everyone applauds.",
                beats: [
                    { title: "Morning", content: "Hike the Fira–Oia trail (3–4 hours, bring water and sunscreen)." },
                    { title: "Noon", content: "Explore Oia's art galleries and Ammoudi Bay — swim off the rocks below." },
                    { title: "Evening", content: "Claim your sunset spot at the castle ruins by 6pm; dinner at Sunset Ammoudi." }
                ],
                tip: { label: "Weather Tip", text: "Start the Fira–Oia hike before 9am to avoid midday heat. There's zero shade on the trail. Carry at least 1.5L of water per person." },
                spend: { amount: `${currency}120`, note: "lunch + gallery visits + dinner in Oia" }
            },
            {
                title: "Volcanic Hot Springs & Red Beach",
                overview: "Board a catamaran to the volcanic islets in the caldera center. Swim in the sulfur-warm springs (the water turns from deep blue to rust-orange), then sail to Red Beach — a crescent of crimson cliffs and dark volcanic sand that looks like another planet entirely.",
                beats: [
                    { title: "Morning", content: "Catamaran cruise to Nea Kameni; hike the volcanic crater." },
                    { title: "Noon", content: "Swim at the hot springs, then sail to Red Beach for snorkeling." },
                    { title: "Evening", content: "BBQ dinner on the boat as you sail back to Athinios." }
                ],
                tip: { label: "Safety Tip", text: "Wear old shoes for the hot springs — the sulfur stains everything yellow. And the volcanic hike surface is loose gravel; proper shoes matter." },
                spend: { amount: `${currency}200`, note: "catamaran tour + meals on board + equipment" }
            },
            {
                title: "Wine & Village Slow Day",
                overview: "Santorini's volcanic soil produces some of Greece's most distinctive wines. Visit the Venetsanos or Santo wineries carved into the cliff face, taste Assyrtiko with the caldera spread below. Afternoon in Pyrgos — the least touristy village, with medieval castle ruins and total quiet.",
                beats: [
                    { title: "Morning", content: "Wine tasting at Santo Winery; try the Vinsanto dessert wine." },
                    { title: "Noon", content: "Explore Pyrgos village — climb to the Kasteli ruins for 360° views." },
                    { title: "Evening", content: "Farm-to-table dinner at Metaxy Mas in Exo Gonia." }
                ],
                tip: { label: "Food Tip", text: "Order fava (yellow split pea purée) and tomatokeftedes (tomato fritters) — these are Santorini's signature dishes, not just generic Greek food." },
                spend: { amount: `${currency}150`, note: "wine tastings + village lunch + dinner" }
            },
            {
                title: "Black Sand & Departure",
                overview: "Spend your final morning at Perissa or Perivolos — the long black sand beach backed by Mesa Vouno cliffs. The water is warm, the beach bars play low-fi, and there's nowhere else you'd rather be. A final Greek coffee on the harbour, and the Aegean bids you farewell.",
                beats: [
                    { title: "Morning", content: "Beach morning at Perissa; rent a sunbed and swim in the crystal water." },
                    { title: "Noon", content: "Last souvenir shopping in Fira; fresh gyro from Lucky's." },
                    { title: "Evening", content: "Transfer to airport or ferry port for departure." }
                ],
                tip: { label: "Relaxation Tips", text: "Perivolos is the quieter end of the same beach as Perissa — walk south for more space and better bar vibes." },
                spend: { amount: `${currency}100`, note: "beach sunbed rental + lunch + transfer" }
            }
        ];
        return buildItinerary(pool, days, currency);
    }

    // ─── Paris ──────────────
    if (lower.includes("paris")) {
        const pool = [
            {
                title: "Arrival & Left Bank Charm",
                overview: "Check into your hotel in Saint-Germain-des-Prés and step straight into literary Paris. The cafés where Hemingway and de Beauvoir argued ideas still serve espresso on the same terraces. Cross the Seine at Pont des Arts and catch the Eiffel Tower glowing gold at dusk.",
                beats: [
                    { title: "Morning", content: "Arrive at CDG; RER B into the city and check in." },
                    { title: "Noon", content: "Wander Saint-Germain — Café de Flore, Shakespeare & Company bookshop." },
                    { title: "Evening", content: "Dinner at a zinc-counter bistro on Rue de Buci; walk to see the Eiffel Tower light up." }
                ],
                tip: { label: "Local Tip", text: "Buy a carnet of 10 Métro tickets (t+ tickets) at any station — it's 30% cheaper than buying singles." },
                spend: { amount: `${currency}220`, note: "airport transfer + hotel + bistro dinner" }
            },
            {
                title: "Louvre & Marais Deep Dive",
                overview: "Give the Louvre the morning it deserves — skip straight to the Winged Victory, the Vermeer rooms, and the Grande Galerie. Emerge blinking into sunlight and cross into Le Marais for falafel on Rue des Rosiers and concept stores in the Haut Marais.",
                beats: [
                    { title: "Morning", content: "Louvre Museum — enter via the Richelieu wing to skip the pyramid queue." },
                    { title: "Noon", content: "Le Marais: falafel at L'As du Fallafel, then browse Place des Vosges." },
                    { title: "Evening", content: "Cocktails at Candelaria (hidden speakeasy behind a taco shop)." }
                ],
                tip: { label: "Safety Tip", text: "Watch for pickpockets on Métro Line 1 and around the Louvre. Keep bags zipped and in front of you." },
                spend: { amount: `${currency}150`, note: "museum entry + street food + cocktails" }
            },
            {
                title: "Montmartre & Sacré-Cœur",
                overview: "Climb the winding streets of Montmartre as the city unfolds below. Sacré-Cœur's white dome glows against any sky. Sketch artists fill Place du Tertre, and tiny wine bars hide on every corner. This is the Paris that painters came for.",
                beats: [
                    { title: "Morning", content: "Walk up Rue Lepic past the Moulin de la Galette; reach Sacré-Cœur by 10am." },
                    { title: "Noon", content: "Musée de Montmartre and vineyard, then browse Place du Tertre." },
                    { title: "Evening", content: "Dinner at Pink Mamma in the 10th — reservations essential." }
                ],
                tip: { label: "Food Tip", text: "Skip the tourist restaurants lining Place du Tertre. Duck one street behind for half the price and twice the flavour." },
                spend: { amount: `${currency}130`, note: "museum entries + lunch + dinner" }
            },
            {
                title: "Versailles Day Trip",
                overview: "Take the RER C to Versailles and arrive before the palace opens. The Hall of Mirrors, Marie Antoinette's hamlet, and the endless geometric gardens deserve at least half a day. Return to Paris for a twilight stroll along the Canal Saint-Martin.",
                beats: [
                    { title: "Morning", content: "RER C to Versailles-Château; enter at opening to see the Hall of Mirrors empty." },
                    { title: "Noon", content: "Explore the Petit Trianon, Marie Antoinette's hamlet, and the Grand Canal." },
                    { title: "Evening", content: "Back in Paris — dinner on Canal Saint-Martin; try Chez Prune." }
                ],
                tip: { label: "Local Tip", text: "Buy your Versailles ticket online with a timed entry slot. The queue without one can be 2+ hours." },
                spend: { amount: `${currency}180`, note: "train tickets + palace entry + canal-side dinner" }
            },
            {
                title: "Eiffel Tower & Seine Farewell",
                overview: "Save the Eiffel Tower for your last full day — the anticipation makes the view sweeter. Book the summit ticket for late afternoon when the city turns amber. Descend and board a Bateaux Mouches for a sunset Seine cruise. Paris knows how to say goodbye.",
                beats: [
                    { title: "Morning", content: "Trocadéro gardens for the classic Eiffel Tower photo; Champ de Mars picnic." },
                    { title: "Noon", content: "Ascend the Eiffel Tower — summit level for panoramic golden-hour views." },
                    { title: "Evening", content: "Seine river cruise at sunset, then final drinks at a rooftop bar." }
                ],
                tip: { label: "Relaxation Tips", text: "The best Eiffel Tower photo is from Trocadéro at sunrise — almost no one is there and the light is perfect." },
                spend: { amount: `${currency}200`, note: "tower ticket + Seine cruise + farewell dinner" }
            }
        ];
        return buildItinerary(pool, days, currency);
    }

    // ─── Tokyo ──────────────
    if (lower.includes("tokyo")) {
        const pool = [
            {
                title: "Arrival & Shinjuku Neon",
                overview: "Land at Narita or Haneda and take the express into the neon heartbeat of Shinjuku. Step out of the station and Tokyo hits you — layers of sound, light, and movement. Duck into Golden Gai's six-seat bars for whisky highballs with strangers who become friends by closing time.",
                beats: [
                    { title: "Morning", content: "Arrive & Narita Express to Shinjuku; check into your hotel." },
                    { title: "Noon", content: "Explore Shinjuku Gyoen gardens — a pocket of calm in the chaos." },
                    { title: "Evening", content: "Dinner in Omoide Yokocho (Memory Lane); drinks in Golden Gai." }
                ],
                tip: { label: "Local Tip", text: "Get a Suica or Pasmo card at the airport station — it works on all trains, buses, and most konbini (convenience stores)." },
                spend: { amount: `${currency}18,000`, note: "airport express + hotel + izakaya dinner" }
            },
            {
                title: "Senso-ji & East Tokyo Traditions",
                overview: "Rise early for Senso-ji Temple in Asakusa before the tour groups arrive. The incense smoke, the thunder gate, the five-storey pagoda — it's hushed and sacred at 7am. Cross the Sumida River toward Tokyo Skytree for the vertigo-inducing observation deck.",
                beats: [
                    { title: "Morning", content: "Senso-ji Temple at dawn; browse Nakamise-dori for traditional snacks." },
                    { title: "Noon", content: "Tokyo Skytree observation deck — on clear days you can see Mt. Fuji." },
                    { title: "Evening", content: "Monjayaki dinner in Tsukishima; walk along the Sumida River lit up." }
                ],
                tip: { label: "Food Tip", text: "Try melon pan (sweet bread) warm from the vendor near Senso-ji's Kaminarimon gate — crispy outside, fluffy inside, ¥200." },
                spend: { amount: `${currency}12,000`, note: "temple donations + Skytree ticket + dinner" }
            },
            {
                title: "Shibuya, Harajuku & Meiji Shrine",
                overview: "Walk through the towering torii gate into Meiji Shrine's forest and the city disappears. Emerge into Harajuku's Takeshita-dori for the sensory polar opposite — candy colours, crêpes, and teenager fashion. Then the biggest crosswalk on Earth: Shibuya Scramble.",
                beats: [
                    { title: "Morning", content: "Meiji Shrine — walk the forested approach, watch for Shinto ceremonies." },
                    { title: "Noon", content: "Harajuku's Takeshita-dori + Omotesando's architect-designed flagship stores." },
                    { title: "Evening", content: "Shibuya Crossing at night; ramen at Fuunji or Ichiran in Shibuya." }
                ],
                tip: { label: "Local Tip", text: "The Starbucks on the 2nd floor overlooking Shibuya Crossing is the best free viewpoint — grab a window seat." },
                spend: { amount: `${currency}10,000`, note: "shopping + street food + ramen dinner" }
            },
            {
                title: "Tsukiji Market & Akihabara",
                overview: "The outer market at Tsukiji still throbs with food energy — tamago (egg omelette) stands, tuna skewers, fresh uni cups you eat standing up. Afternoon in Akihabara's multi-floor electronics temples and retro game arcades; this is where old and new Tokyo blur.",
                beats: [
                    { title: "Morning", content: "Tsukiji Outer Market: sashimi breakfast, tamagoyaki, matcha soft serve." },
                    { title: "Noon", content: "Akihabara's electronics and anime district; retro arcades and capsule toy hunts." },
                    { title: "Evening", content: "Dinner at an Akihabara themed café, or yakitori under the Yurakucho tracks." }
                ],
                tip: { label: "Food Tip", text: "At Tsukiji, follow the locals — the stalls with the longest Japanese-speaking queues have the freshest fish." },
                spend: { amount: `${currency}14,000`, note: "market grazing + electronics + dinner" }
            },
            {
                title: "Departure & Last Shrine Visit",
                overview: "One final morning ritual: a quiet visit to Zōjō-ji Temple with Tokyo Tower looming behind it. Grab a last convenience store onigiri (the quality will ruin all other convenience stores forever), and bow to the city that runs on precision, beauty, and vending machines.",
                beats: [
                    { title: "Morning", content: "Zōjō-ji Temple & Tokyo Tower views; last konbini run for snacks." },
                    { title: "Noon", content: "Pack up; Narita Express or Skyliner to the airport." },
                    { title: "Evening", content: "Depart Tokyo — sayōnara." }
                ],
                tip: { label: "Relaxation Tips", text: "Pack light souvenirs from the airport's duty-free — they have all the popular Kit Kat flavours and Tokyo Banana at the same prices." },
                spend: { amount: `${currency}8,000`, note: "souvenirs + transport to airport + last meal" }
            }
        ];
        return buildItinerary(pool, days, currency);
    }

    // ─── Generic Fallback (rich, varied) ──────────────
    const genericPool = [
        {
            title: "Arrival & First Impressions",
            overview: `Touch down in ${city} and let the city introduce itself. Drop your bags and head straight into the old town — the architecture, the street sounds, the café culture all set the tone. Find a terrace with a view and settle into the pace of this place.`,
            beats: [
                { title: "Morning", content: `Arrive in ${city}; transfer to your hotel in the city centre.` },
                { title: "Afternoon", content: "Wander the old town district — historic squares, local cafés, street vendors." },
                { title: "Evening", content: "Dinner at a well-reviewed neighbourhood restaurant; try the local signature dish." }
            ],
            tip: { label: "Local Tip", text: `Ask your hotel front desk for their personal favourite restaurant — you'll eat better than any guidebook can promise.` },
            spend: { amount: `${currency}180`, note: "airport transfer + hotel + welcome dinner" }
        },
        {
            title: "Cultural Landmarks & Museums",
            overview: `Today is about the stories this city tells through its buildings and art. Hit the main museum early, then walk through the historic quarter where centuries of architecture stack up side by side. The afternoon belongs to the kind of wandering where you turn corners and find treasures.`,
            beats: [
                { title: "Morning", content: "Visit the city's main museum or gallery — arrive at opening for empty halls." },
                { title: "Afternoon", content: "Walk the historic quarter; photograph architecture and visit a lesser-known chapel or monument." },
                { title: "Evening", content: "Dinner in the arts district; live music at a local jazz or folk venue." }
            ],
            tip: { label: "Safety Tip", text: "Keep a photocopy of your passport in a separate bag from the original. Most embassies can process replacements faster with a copy." },
            spend: { amount: `${currency}120`, note: "museum tickets + lunch + live music cover" }
        },
        {
            title: "Nature & Scenic Escapes",
            overview: `Leave the city grid behind today. Whether it's a coastal path, a mountain viewpoint, or a botanical garden — ${city} has green lungs worth finding. Pack a picnic, hike to the best view you can find, and understand why the locals never want to leave.`,
            beats: [
                { title: "Morning", content: "Head to the nearest natural landmark — park, coastal trail, or mountain lookout." },
                { title: "Afternoon", content: "Picnic lunch with a view; take the scenic route back through a quiet village or suburb." },
                { title: "Evening", content: "Light dinner at a garden restaurant; early rest for tomorrow's market day." }
            ],
            tip: { label: "Weather Tip", text: "Morning light is best for photos and cooler for hiking. Bring layers — altitude and coast can shift temperatures fast." },
            spend: { amount: `${currency}90`, note: "park entry + picnic supplies + light dinner" }
        },
        {
            title: "Markets, Food & Local Life",
            overview: `This is the day you eat like a local. Find the central market where vendors shout prices and the produce glistens. Taste everything you can't pronounce. The afternoon is for the food streets — those narrow lanes where every doorway smells different and portions are generous.`,
            beats: [
                { title: "Morning", content: "Central market visit — fresh produce, spices, street food breakfast." },
                { title: "Afternoon", content: "Cooking class or food tour through the local food streets." },
                { title: "Evening", content: "Rooftop dinner or waterfront restaurant; order the chef's recommendation." }
            ],
            tip: { label: "Food Tip", text: "Markets are cheapest and freshest before 10am. Bring cash in small denominations — vendors rarely have change for large notes." },
            spend: { amount: `${currency}100`, note: "market shopping + cooking class + dinner" }
        },
        {
            title: "Day Trip & Hidden Gems",
            overview: `Some of the best experiences near ${city} are an hour outside it. Take a day trip to a nearby village, vineyard region, or coastal town that the guidebooks barely mention. Travel slow, talk to locals, and find the spots that make you consider extending your trip.`,
            beats: [
                { title: "Morning", content: "Train or bus to a nearby town — vineyards, coastline, or mountain village." },
                { title: "Afternoon", content: "Explore on foot; local lunch at a family-run restaurant." },
                { title: "Evening", content: "Return to the city; relaxed dinner at your favourite spot from earlier in the trip." }
            ],
            tip: { label: "Local Tip", text: "Regional trains are usually cheaper and more scenic than express services. Book at the station, not through third-party apps." },
            spend: { amount: `${currency}140`, note: "transport + day-trip activities + meals" }
        },
        {
            title: "Sunset District & Farewell",
            overview: `Your final day. Morning for the things you missed — that viewpoint, that shop, that café you walked past on day one. Afternoon for souvenirs that actually mean something. And the evening? Find the spot with the best sunset in ${city} and let this trip end the way it deserves.`,
            beats: [
                { title: "Morning", content: "Return to your favourite neighbourhood; revisit the best café for one last coffee." },
                { title: "Afternoon", content: "Souvenir shopping in the artisan quarter; pick up something handmade." },
                { title: "Evening", content: "Farewell dinner at the best-rated restaurant you haven't tried yet." }
            ],
            tip: { label: "Relaxation Tips", text: "Don't over-schedule your last day. Leave room for the unplanned — that's where the best travel memories live." },
            spend: { amount: `${currency}160`, note: "souvenirs + farewell dinner + last transport" }
        }
    ];
    return buildItinerary(genericPool, days, currency);
}

/** Pick the right number of days from the content pool, assign indices + spend dates */
function buildItinerary(pool: Array<{
    title: string;
    overview: string;
    beats: { title: string; content: string }[];
    tip: { label: string; text: string };
    spend: { amount: string; note: string };
}>, days: number, currency: string) {
    const result = [];
    for (let i = 0; i < days; i++) {
        const dayNum = i + 1;
        const isLast = i === days - 1 && days > 1;

        // Use last-day content if it's the final day; otherwise cycle through pool
        const actualContent = (isLast && i < pool.length - 1) ? pool[pool.length - 1]! : pool[i % pool.length]!;

        result.push({
            day_index: dayNum,
            title: actualContent.title,
            overview: actualContent.overview,
            blocks: [
                // Time beats as plan blocks
                ...actualContent.beats.map(b => ({
                    kind: "plan" as const,
                    title: b.title,
                    content: b.content
                })),
                // Tip block
                {
                    kind: "tip" as const,
                    title: actualContent.tip.label,
                    content: actualContent.tip.text
                },
                // Spend block
                {
                    kind: "spend" as const,
                    amount: actualContent.spend.amount,
                    note: actualContent.spend.note,
                    dateStr: `Day ${dayNum}`
                }
            ]
        });
    }
    return result;
}

// ─── Route Handler ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, turnCount = 0, tripSnapshot, action_id, filters, action_payload } = body;
        console.log("API Request:", message, turnCount, "filters:", filters, "action_id:", action_id);

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Simulate a small delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const response = generateMockResponse(message, turnCount, tripSnapshot, action_id, filters, action_payload);

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
