import { ResponseBlock } from "./response-block";

export interface TripSnapshot {
  destination: string;
  dates?: { start: string; end: string };
  duration?: string;
  budget?: { amount: number; currency: string };
  travelStyle?: string;
}

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  /** Structured data attached to assistant messages */
  data?: AssistantResponse;
}

// ─── Suggestion Types ──────────────────────────────────────────────────

export type SuggestionCategory =
  | "stays"
  | "restaurants"
  | "activities"
  | "flights"
  | "entry_requirements";

export interface SuggestionItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  priceHint: string;
  category: SuggestionCategory;
  /** Category-specific metadata */
  meta?: Record<string, string>;
  ctaPayload?: string;
}

export interface SuggestionSection {
  category: SuggestionCategory;
  title: string;
  items: SuggestionItem[];
}

// ─── Entry Requirement Types ───────────────────────────────────────────

export type VisaStatus =
  | "visa_free"
  | "visa_on_arrival"
  | "evisa"
  | "embassy_visa";

export interface EntryRequirements {
  essential: {
    passportValidity: string;
    visaStatus: VisaStatus;
    visaStatusLabel: string;
    allowedStay: string;
    summary: string;
  };
  helpful: {
    documentsRequired: string[];
    entryFee?: string;
    processingTime?: string;
    whereToApply?: string;
  };
  actionable: {
    label: string;
    description: string;
    steps?: string[];
  }[];
}

// ─── Itinerary Types ───────────────────────────────────────────────────

export interface TimeBlock {
  id: string;
  time: string;
  name: string;
  description: string;
  costEstimate?: string;
  category?: SuggestionCategory;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  blocks: TimeBlock[];
}

export interface Itinerary {
  id: string;
  tripSnapshot: TripSnapshot;
  days: ItineraryDay[];
  totalEstimatedCost?: string;
}

// ─── Structured AI Response ────────────────────────────────────────────

export interface AssistantResponse {
  summary?: string;
  tripSnapshot?: TripSnapshot;
  sections?: SuggestionSection[];
  entryRequirements?: EntryRequirements;
  cta?: { label: string; action: string; payload?: string };
  itinerary?: Itinerary;
  responseBlock?: ResponseBlock;
}

// ─── Session & Auth ────────────────────────────────────────────────────

export interface GuestSession {
  id: string;
  turnCount: number;
  maxTurns: number;
  messages: ChatMessage[];
  tripSnapshot?: TripSnapshot;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  nationality?: string;
  createdAt: Date;
}

export * from "./response-block";
