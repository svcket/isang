"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    LayoutGrid,
    CalendarDays,
    RotateCcw,
} from "lucide-react";
import TripSummaryHeader from "@/components/response/TripSummaryHeader";

export default function AppHeader() {
    const activeView = useAppStore((s) => s.activeView);
    const setActiveView = useAppStore((s) => s.setActiveView);
    const suggestions = useAppStore((s) => s.suggestions);
    const itinerary = useAppStore((s) => s.itinerary);
    const isGuest = useAppStore((s) => s.isGuest);
    const setShowAuthModal = useAppStore((s) => s.setShowAuthModal);
    const reset = useAppStore((s) => s.reset);
    const messages = useAppStore((s) => s.messages);

    const hasSuggestions = suggestions.length > 0;
    const hasItinerary = !!itinerary;
    const isLanding = messages.length === 0;

    /* ── Pre-Auth Landing Header ──────────────────────────────────── */
    /* ── Pre-Auth Landing Header ──────────────────────────────────── */
    // Universal Header
    const activeTripMeta = messages
        .slice()
        .reverse()
        .find((m) => m.role === "assistant" && m.data?.responseBlock?.trip_meta)?.data?.responseBlock?.trip_meta;

    /* ── In-App Nav Header ────────────────────────────────────────── */
    /* ── In-App Nav Header ────────────────────────────────────────── */
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
            <div className="w-full relative">
                <div className="flex items-center justify-between h-16 px-6">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-2.5 shrink-0 z-10">
                        <div className="flex items-center justify-center">
                            <img
                                src="/onboarding/isang-response-avatar.png"
                                alt="Isang"
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold text-neutral-900 tracking-tight">Isang</span>
                    </div>

                    {/* Center: Trip Snapshot Pill (Absolute Center) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex justify-center z-0">
                        {!isLanding && activeTripMeta && (
                            <TripSummaryHeader meta={activeTripMeta} />
                        )}
                    </div>

                    {/* Right: Auth / Actions */}
                    <div className="flex items-center gap-3 shrink-0 z-10 ml-auto">
                        {isGuest ? (
                            <>
                                <Button
                                    variant="ghost"
                                    className="hidden sm:flex rounded-full text-sm font-medium hover:bg-neutral-100 border border-neutral-200 h-12 px-6"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    className="rounded-full bg-black text-white hover:bg-neutral-800 text-sm font-medium px-6 h-12"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    Create account
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-full"
                                onClick={reset}
                                title="New trip"
                            >
                                <RotateCcw className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile nav (unchanged, maybe hide if pill active?) */}
                {!hasItinerary && activeView !== 'chat' && (
                    <div className="flex sm:hidden items-center gap-1 pb-2 overflow-x-auto">
                        {/* Mobile Nav items... keep existing code or verify if needed */}
                        <button
                            onClick={() => setActiveView("chat")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all bg-muted text-muted-foreground"
                        >
                            <MessageCircle className="h-3 w-3" />
                            Chat
                        </button>
                        {/* ... other buttons ... */}
                    </div>
                )}
            </div>
        </header >
    );
}
