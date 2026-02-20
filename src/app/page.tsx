"use client";

import { useAppStore } from "@/lib/store";
import AppHeader from "@/components/layout/AppHeader";
import LandingPage from "@/components/landing/LandingPage";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import SuggestionsGrid from "@/components/suggestions/SuggestionsGrid";
import SuggestionDetail from "@/components/suggestions/SuggestionDetail";
import ItineraryView from "@/components/itinerary/ItineraryView";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { CalendarPlus, MessageCircle } from "lucide-react";

export default function Home() {
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const suggestions = useAppStore((s) => s.suggestions);
  const itinerary = useAppStore((s) => s.itinerary);
  const messages = useAppStore((s) => s.messages);

  const isLanding = messages.length === 0;

  /* ── Pre-Auth Landing ──────────────────────────────────────────── */
  if (isLanding) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <AppHeader />
        <LandingPage />
        <AuthModal />
      </div>
    );
  }

  /* ── In-App Views ──────────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />

      {/* Chat View */}
      {activeView === "chat" && (
        <div className="flex flex-col flex-1">
          <ChatMessages />

          {/* Floating CTA when suggestions are available */}
          {suggestions.length > 0 && (
            <div className="flex justify-center py-2 bg-background/80 backdrop-blur-sm border-t border-border/50">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setActiveView("suggestions")}
                >
                  View suggestions
                </Button>
                {!itinerary && (
                  <Button
                    size="sm"
                    className="rounded-full text-xs bg-primary text-primary-foreground hover:opacity-90"
                    onClick={() => {
                      const store = useAppStore.getState();
                      const id = Math.random().toString(36).substring(2, 15);
                      store.addMessage({
                        id,
                        role: "user",
                        content: "Generate an itinerary for my trip",
                        timestamp: new Date(),
                      });
                      store.setLoading(true);

                      fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          message: "Generate an itinerary for my trip",
                          turnCount: store.turnCount,
                          isGuest: store.isGuest,
                          tripSnapshot: store.tripSnapshot,
                          filters: store.filterState,
                        }),
                      })
                        .then((r) => r.json())
                        .then((data) => {
                          store.addMessage({
                            id: Math.random().toString(36).substring(2, 15),
                            role: "assistant",
                            content: data.reply,
                            timestamp: new Date(),
                            data: data.data,
                          });
                          if (data.data) store.processAssistantData(data.data);
                          if (store.isGuest) store.incrementTurn();
                        })
                        .finally(() => store.setLoading(false));
                    }}
                  >
                    <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />
                    Generate itinerary
                  </Button>
                )}
                {itinerary && (
                  <Button
                    size="sm"
                    className="rounded-full text-xs bg-primary text-primary-foreground hover:opacity-90"
                    onClick={() => setActiveView("itinerary")}
                  >
                    <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />
                    View itinerary
                  </Button>
                )}
              </div>
            </div>
          )}

          <ChatInput />
        </div>
      )}

      {/* Suggestions View */}
      {activeView === "suggestions" && (
        <div className="flex flex-col flex-1">
          <SuggestionsGrid />
          <SuggestionDetail />

          <div className="sticky bottom-0 flex justify-center gap-2 py-3 bg-background/90 backdrop-blur-sm border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setActiveView("chat")}
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
              Back to chat
            </Button>
            {!itinerary && (
              <Button
                size="sm"
                className="rounded-full text-xs bg-primary text-primary-foreground hover:opacity-90"
                onClick={() => {
                  const store = useAppStore.getState();
                  const id = Math.random().toString(36).substring(2, 15);
                  store.addMessage({
                    id,
                    role: "user",
                    content: "Generate an itinerary for my trip",
                    timestamp: new Date(),
                  });
                  store.setLoading(true);

                  fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      message: "Generate an itinerary for my trip",
                      turnCount: store.turnCount,
                      isGuest: store.isGuest,
                    }),
                  })
                    .then((r) => r.json())
                    .then((data) => {
                      store.addMessage({
                        id: Math.random().toString(36).substring(2, 15),
                        role: "assistant",
                        content: data.reply,
                        timestamp: new Date(),
                        data: data.data,
                      });
                      if (data.data) store.processAssistantData(data.data);
                      if (store.isGuest) store.incrementTurn();
                    })
                    .finally(() => store.setLoading(false));
                }}
              >
                <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />
                Generate itinerary
              </Button>
            )}
            {itinerary && (
              <Button
                size="sm"
                className="rounded-full text-xs bg-primary text-primary-foreground hover:opacity-90"
                onClick={() => setActiveView("itinerary")}
              >
                <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />
                View itinerary
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Itinerary View */}
      {activeView === "itinerary" && (
        <div className="flex flex-col flex-1">
          <ItineraryView />
          <div className="sticky bottom-0 flex justify-center gap-2 py-3 bg-background/90 backdrop-blur-sm border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setActiveView("chat")}
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
              Back to chat
            </Button>
          </div>
        </div>
      )}

      <AuthModal />
    </div>
  );
}
