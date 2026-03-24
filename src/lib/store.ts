import { create } from "zustand";
import type {
    ChatMessage,
    TripSnapshot,
    SuggestionSection,
    Itinerary,
    TimeBlock,
    AssistantResponse,
} from "@/types";

// ─── Application State ─────────────────────────────────────────────────

interface AppState {
    // Session
    isGuest: boolean;
    turnCount: number;
    maxGuestTurns: number;
    sessionId: string;

    // Chat
    messages: ChatMessage[];
    isLoading: boolean;

    // Trip
    tripId: string | null;
    tripSnapshot: TripSnapshot | null;
    suggestions: SuggestionSection[];
    itinerary: Itinerary | null;

    // UI
    activeView: "chat" | "suggestions" | "itinerary";
    selectedSuggestionId: string | null;
    selectedItems: string[]; // For plan items
    selectedHighlights: string[]; // For destination highlights
    showAuthModal: boolean;

    // Filters
    filterState: {
        destination: string | null;
        dates: { start: string | null; end: string | null };
        travelers: { adults: number; children: number };
        budget: { amount: number | null; currency: "USD" | "NGN" };
    };
    activeFilterPanel: "destination" | "dates" | "travelers" | "budget" | null;

    // Actions
    addMessage: (message: ChatMessage) => void;
    setLoading: (loading: boolean) => void;
    setTripSnapshot: (snapshot: TripSnapshot) => void;
    setSuggestions: (sections: SuggestionSection[]) => void;
    setItinerary: (itinerary: Itinerary) => void;
    setActiveView: (view: "chat" | "suggestions" | "itinerary") => void;
    setSelectedSuggestion: (id: string | null) => void;
    toggleItem: (id: string) => void;
    toggleHighlight: (id: string) => void;
    setShowAuthModal: (show: boolean) => void;
    incrementTurn: () => void;
    processAssistantData: (data: AssistantResponse) => void;
    setFilter: <K extends keyof AppState['filterState']>(key: K, value: AppState['filterState'][K]) => void;
    clearFilter: (key: keyof AppState['filterState']) => void;
    clearAllFilters: () => void;
    setActiveFilterPanel: (panel: "destination" | "dates" | "travelers" | "budget" | null) => void;
    // Itinerary CRUD
    deleteItineraryBlock: (dayNumber: number, blockId: string) => Promise<void>;
    updateItineraryBlock: (dayNumber: number, blockId: string, updates: Partial<TimeBlock>) => Promise<void>;
    addItineraryBlock: (dayNumber: number, block: TimeBlock) => Promise<void>;
    saveTrip: () => Promise<void>;
    reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useAppStore = create<AppState>((set) => ({
    // Defaults
    isGuest: true,
    turnCount: 0,
    maxGuestTurns: 3,
    sessionId: generateId(),

    messages: [],
    isLoading: false,

    tripId: null,
    tripSnapshot: null,
    suggestions: [],
    itinerary: null,

    activeView: "chat",
    selectedSuggestionId: null,
    selectedItems: [],
    selectedHighlights: [],
    showAuthModal: false,

    filterState: {
        destination: null,
        dates: { start: null, end: null },
        travelers: { adults: 1, children: 0 },
        budget: { amount: null, currency: "USD" },
    },
    activeFilterPanel: null,

    // Actions
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

    setLoading: (loading) => set({ isLoading: loading }),

    setTripSnapshot: (snapshot) => set({ tripSnapshot: snapshot }),

    setSuggestions: (sections) =>
        set({ suggestions: sections, activeView: "suggestions" }),

    setItinerary: (itinerary) =>
        set({ itinerary, activeView: "itinerary" }),

    setActiveView: (view) => set({ activeView: view }),

    setSelectedSuggestion: (id) => set({ selectedSuggestionId: id }),

    toggleItem: (id) =>
        set((state) => {
            const exists = state.selectedItems.includes(id);
            return {
                selectedItems: exists
                    ? state.selectedItems.filter((i) => i !== id)
                    : [...state.selectedItems, id],
            };
        }),

    toggleHighlight: (id) =>
        set((state) => {
            const exists = state.selectedHighlights.includes(id);
            return {
                selectedHighlights: exists
                    ? state.selectedHighlights.filter((i) => i !== id)
                    : [...state.selectedHighlights, id],
            };
        }),

    setShowAuthModal: (show) => set({ showAuthModal: show }),

    incrementTurn: () =>
        set((state) => ({ turnCount: state.turnCount + 1 })),

    processAssistantData: (data) => set((state) => {
        const updates: Partial<AppState> = {};
        if (data.tripSnapshot) {
            updates.tripSnapshot = data.tripSnapshot;
            // Auto-sync the destination to the filter pill if the AI detected a new region
            if (data.tripSnapshot.destination && data.tripSnapshot.destination !== state.filterState.destination) {
                updates.filterState = {
                    ...state.filterState,
                    destination: data.tripSnapshot.destination
                };
            }
        }
        if (data.sections && data.sections.length > 0) {
            updates.suggestions = data.sections;
            updates.activeView = "suggestions";
        }
        if (data.itinerary) {
            updates.itinerary = data.itinerary;
            updates.activeView = "itinerary";
        }
        return updates;
    }),

    setFilter: (key, value) => set((state) => ({
        filterState: {
            ...state.filterState,
            [key]: value
        }
    })),

    clearFilter: (key) => set((state) => {
        const defaults = {
            destination: null,
            dates: { start: null, end: null },
            travelers: { adults: 1, children: 0 },
            budget: { amount: null, currency: "USD" as const },
        };
        return {
            filterState: {
                ...state.filterState,
                [key]: defaults[key]
            }
        };
    }),

    clearAllFilters: () => set({
        filterState: {
            destination: null,
            dates: { start: null, end: null },
            travelers: { adults: 1, children: 0 },
            budget: { amount: null, currency: "USD" },
        }
    }),

    setActiveFilterPanel: (panel) => set({ activeFilterPanel: panel }),

    deleteItineraryBlock: async (dayNumber, blockId) => set((state) => {
        if (!state.itinerary) return state;
        const newDays = state.itinerary.days.map(day => {
            if (day.dayNumber === dayNumber) {
                return { ...day, blocks: day.blocks.filter(b => b.id !== blockId) };
            }
            return day;
        });
        // TODO: Sync with Supabase if state.tripId exists
        return { itinerary: { ...state.itinerary, days: newDays } };
    }),

    updateItineraryBlock: async (dayNumber, blockId, updates) => set((state) => {
        if (!state.itinerary) return state;
        const newDays = state.itinerary.days.map(day => {
            if (day.dayNumber === dayNumber) {
                const newBlocks = day.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b);
                return { ...day, blocks: newBlocks };
            }
            return day;
        });
        // TODO: Sync with Supabase if state.tripId exists
        return { itinerary: { ...state.itinerary, days: newDays } };
    }),

    addItineraryBlock: async (dayNumber, block) => set((state) => {
        if (!state.itinerary) return state;
        const newDays = state.itinerary.days.map(day => {
            if (day.dayNumber === dayNumber) {
                return { ...day, blocks: [...day.blocks, block] };
            }
            return day;
        });
        // TODO: Sync with Supabase if state.tripId exists
        return { itinerary: { ...state.itinerary, days: newDays } };
    }),

    saveTrip: async () => {
        const state = useAppStore.getState();
        if (!state.tripSnapshot || !state.itinerary) return;

        // In Phase 16, this will use createClient().from('trips').upsert(...)
        console.log("Saving trip to Supabase...", state.tripSnapshot);
        // set({ tripId: someId });
    },

    reset: () =>
        set({
            messages: [],
            turnCount: 0,
            tripSnapshot: null,
            suggestions: [],
            itinerary: null,
            activeView: "chat",
            selectedSuggestionId: null,
            selectedItems: [],
            selectedHighlights: [],
            filterState: {
                destination: null,
                dates: { start: null, end: null },
                travelers: { adults: 1, children: 0 },
                budget: { amount: null, currency: "USD" },
            },
            activeFilterPanel: null,
            sessionId: generateId(),
        }),
}));
