"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
    Plane,
    MessageCircle,
    LayoutGrid,
    CalendarDays,
    RotateCcw,
} from "lucide-react";

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
    if (isLanding) {
        return (
            <header className="sticky top-0 z-50 bg-white">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                <Plane className="h-3.5 w-3.5 text-white -rotate-45" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900 tracking-tight">
                                Isang
                            </span>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    /* ── In-App Nav Header ────────────────────────────────────────── */
    return (
        <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-isang-teal to-isang-mint flex items-center justify-center">
                            <Plane className="h-4 w-4 text-white" />
                        </div>
                        <span
                            className="text-lg font-bold text-foreground tracking-tight"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            isang
                        </span>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        <button
                            onClick={() => setActiveView("chat")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeView === "chat"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Chat
                        </button>
                        <button
                            onClick={() => hasSuggestions && setActiveView("suggestions")}
                            disabled={!hasSuggestions}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeView === "suggestions"
                                ? "bg-background text-foreground shadow-sm"
                                : hasSuggestions
                                    ? "text-muted-foreground hover:text-foreground"
                                    : "text-muted-foreground/40 cursor-not-allowed"
                                }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            Suggestions
                        </button>
                        <button
                            onClick={() => hasItinerary && setActiveView("itinerary")}
                            disabled={!hasItinerary}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeView === "itinerary"
                                ? "bg-background text-foreground shadow-sm"
                                : hasItinerary
                                    ? "text-muted-foreground hover:text-foreground"
                                    : "text-muted-foreground/40 cursor-not-allowed"
                                }`}
                        >
                            <CalendarDays className="h-3.5 w-3.5" />
                            Itinerary
                        </button>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={reset}
                            title="New trip"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                        {isGuest && (
                            <Button
                                size="sm"
                                className="rounded-lg bg-gradient-to-r from-isang-teal to-primary hover:opacity-90 text-xs h-8 px-3"
                                onClick={() => setShowAuthModal(true)}
                            >
                                Sign up
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile nav */}
                <div className="flex sm:hidden items-center gap-1 pb-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveView("chat")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeView === "chat"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                            }`}
                    >
                        <MessageCircle className="h-3 w-3" />
                        Chat
                    </button>
                    <button
                        onClick={() => hasSuggestions && setActiveView("suggestions")}
                        disabled={!hasSuggestions}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeView === "suggestions"
                            ? "bg-primary text-primary-foreground"
                            : hasSuggestions
                                ? "bg-muted text-muted-foreground"
                                : "bg-muted/30 text-muted-foreground/40"
                            }`}
                    >
                        <LayoutGrid className="h-3 w-3" />
                        Explore
                    </button>
                    <button
                        onClick={() => hasItinerary && setActiveView("itinerary")}
                        disabled={!hasItinerary}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeView === "itinerary"
                            ? "bg-primary text-primary-foreground"
                            : hasItinerary
                                ? "bg-muted text-muted-foreground"
                                : "bg-muted/30 text-muted-foreground/40"
                            }`}
                    >
                        <CalendarDays className="h-3 w-3" />
                        Plan
                    </button>
                </div>
            </div>
        </header>
    );
}
