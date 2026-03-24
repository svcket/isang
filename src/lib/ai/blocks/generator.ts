import type { ResponseBlock } from "@/types/response-block";
import { type Vibe, getVibe } from "../vibes";

export class SyntheticGenerator {
  private destination: string;
  private vibe: Vibe;

  constructor(destination: string) {
    this.destination = destination;
    this.vibe = getVibe(destination);
  }

  public generateTripPlan(duration: string = "5 days", budget: string = "flexible"): ResponseBlock {
    const city = this.destination.split(",")[0] || this.destination;
    
    return {
      type: "TRIP_PLAN",
      summary: `I've curated a ${this.vibe.tone.toLowerCase()} experience for your ${duration} stay in ${city}.`,
      trip_meta: {
        destination: this.destination,
        duration,
        budget_est: budget,
        currency: "$",
      },
      introduction: `Experience the ${(this.vibe.adjectives[0] || "unique").toLowerCase()} side of ${city}. This itinerary focuses on its ${this.vibe.tone.toLowerCase()} essence.`,
      sections: [
        this.generateFlightSection(city),
        this.generateLodgingSection(city),
        this.generateActivitySection(city),
      ],
      closing: `This ${this.vibe.style} approach ensures you catch the ${(this.vibe.adjectives[1] || "best").toLowerCase()} highlights of ${city}. Should we dive deeper into specific dates?`,
      actions: [
        {
          action_id: "create_itinerary",
          label: `Generate ${duration} itinerary`,
          style: "SECONDARY",
        },
      ],
    };
  }

  private generateFlightSection(city: string) {
    const accent = (this.vibe.accent_color || "#18181b").replace("#", "");
    return {
      id: "flights",
      type: "FLIGHT" as const,
      title: "Recommended Flights",
      sources: ["Direct Selection"],
      items: [
        {
          id: "f1",
          title: "Regional Carrier",
          image_url: `https://ui-avatars.com/api/?name=RC&background=${accent}&color=fff`,
          meta: ["Lagos", city, "Round trip", "Direct"],
          price_chip: "$1,200",
          subtext: "Economy • 7h 30m",
        },
        {
          id: "f2",
          title: "Global Airways",
          image_url: `https://ui-avatars.com/api/?name=GA&background=1d4ed8&color=fff`,
          meta: ["Lagos", city, "Round trip", "1 stop"],
          price_chip: "$1,450",
          subtext: "Premium • 9h 15m",
        },
        {
          id: "f3",
          title: "SkyLink Connect",
          image_url: `https://ui-avatars.com/api/?name=SL&background=059669&color=fff`,
          meta: ["Lagos", city, "Round trip", "Direct"],
          price_chip: "$1,150",
          subtext: "Value • 7h 45m",
        },
      ],
    };
  }

  private generateLodgingSection(city: string) {
    return {
      id: "stays",
      type: "LODGING" as const,
      title: "Featured Stays",
      sources: ["Local Favorites"],
      items: [
        {
          id: "l1",
          title: `The ${city} ${this.vibe.adjectives[2] || "Boutique"} Hotel`,
          image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop",
          meta: ["4.9 ★", "Prime Location"],
          price_chip: "From $350 / night",
        },
        {
          id: "l2",
          title: `Grand ${city} Palace`,
          image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop",
          meta: ["5.0 ★", "Heritage Building"],
          price_chip: "From $580 / night",
        },
        {
          id: "l3",
          title: `${city} Riverside Suites`,
          image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=450&fit=crop",
          meta: ["4.7 ★", "Modern Design"],
          price_chip: "From $290 / night",
        },
      ],
    };
  }

  private generateActivitySection(city: string) {
    return {
      id: "activities",
      type: "ACTIVITY" as const,
      title: "Must-Do Experiences",
      items: [
        {
          id: "a1",
          title: `${this.vibe.adjectives[0] || "Signature"} Walking Tour of ${city}`,
          image_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=450&fit=crop",
          meta: ["2 Hours", "Authentic"],
          price_chip: "Free",
        },
        {
          id: "a2",
          title: `${city} Culinary Adventure`,
          image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=450&fit=crop",
          meta: ["4 Hours", "Local Food"],
          price_chip: "From $65",
        },
        {
          id: "a3",
          title: `${city} Night Skyline Cruise`,
          image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=450&fit=crop",
          meta: ["1.5 Hours", "Stunning Views"],
          price_chip: "From $45",
        },
      ],
    };
  }
}
