import { create } from "zustand";
import type {
    ChatMessage,
    TripSnapshot,
    SuggestionSection,
    Itinerary,
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
    tripSnapshot: TripSnapshot | null;
    suggestions: SuggestionSection[];
    itinerary: Itinerary | null;

    // UI
    activeView: "chat" | "suggestions" | "itinerary";
    selectedSuggestionId: string | null;
    selectedItems: string[];
    showAuthModal: boolean;

    // Actions
    addMessage: (message: ChatMessage) => void;
    setLoading: (loading: boolean) => void;
    setTripSnapshot: (snapshot: TripSnapshot) => void;
    setSuggestions: (sections: SuggestionSection[]) => void;
    setItinerary: (itinerary: Itinerary) => void;
    setActiveView: (view: "chat" | "suggestions" | "itinerary") => void;
    setSelectedSuggestion: (id: string | null) => void;
    toggleItem: (id: string) => void;
    setShowAuthModal: (show: boolean) => void;
    incrementTurn: () => void;
    processAssistantData: (data: AssistantResponse) => void;
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

    tripSnapshot: null,
    suggestions: [],
    itinerary: null,

    activeView: "chat",
    selectedSuggestionId: null,
    selectedItems: [],
    showAuthModal: false,

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

    setShowAuthModal: (show) => set({ showAuthModal: show }),

    incrementTurn: () =>
        set((state) => ({ turnCount: state.turnCount + 1 })),

    processAssistantData: (data) => {
        const updates: Partial<AppState> = {};
        if (data.tripSnapshot) updates.tripSnapshot = data.tripSnapshot;
        if (data.sections && data.sections.length > 0) {
            updates.suggestions = data.sections;
            updates.activeView = "suggestions";
        }
        if (data.itinerary) {
            updates.itinerary = data.itinerary;
            updates.activeView = "itinerary";
        }
        set(updates);
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
            sessionId: generateId(),
        }),
}));
