"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Clock,
    DollarSign,
    Edit3,
    Trash2,
    RefreshCw,
    Lock,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { ItineraryDay, TimeBlock } from "@/types";

function TimeBlockCard({
    block,
    isBlurred,
}: {
    block: TimeBlock;
    isBlurred: boolean;
}) {
    return (
        <Card
            className={`border-border/40 bg-card/80 ${isBlurred ? "itinerary-blur" : ""
                }`}
        >
            <CardContent className="p-4 flex items-start gap-4">
                {/* Time */}
                <div className="shrink-0 text-center min-w-[56px]">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{block.time}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                        {block.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                        {block.description}
                    </p>
                </div>

                {/* Cost & Actions */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                    {block.costEstimate && (
                        <span className="text-xs font-medium text-primary flex items-center gap-0.5">
                            <DollarSign className="h-3 w-3" />
                            {block.costEstimate}
                        </span>
                    )}
                    {!isBlurred && (
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 rounded hover:bg-muted">
                                <Edit3 className="h-3 w-3 text-muted-foreground" />
                            </button>
                            <button className="p-1 rounded hover:bg-muted">
                                <RefreshCw className="h-3 w-3 text-muted-foreground" />
                            </button>
                            <button className="p-1 rounded hover:bg-destructive/10">
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function DaySection({
    day,
    isBlurred,
}: {
    day: ItineraryDay;
    isBlurred: boolean;
}) {
    const [expanded, setExpanded] = useState(!isBlurred);

    return (
        <div className={`${isBlurred ? "relative" : ""}`}>
            {/* Day Header */}
            <button
                onClick={() => !isBlurred && setExpanded(!expanded)}
                className="w-full flex items-center justify-between py-3 group"
                disabled={isBlurred}
            >
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {day.dayNumber}
                    </div>
                    <div className="text-left">
                        <h3
                            className="text-sm font-semibold text-foreground"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            {day.title}
                        </h3>
                        {day.date && (
                            <p className="text-[11px] text-muted-foreground">{day.date}</p>
                        )}
                    </div>
                </div>
                {!isBlurred && (
                    expanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )
                )}
            </button>

            {/* Time Blocks */}
            {expanded && (
                <div className="space-y-2 pb-4 ml-11">
                    {day.blocks.map((block) => (
                        <TimeBlockCard
                            key={block.id}
                            block={block}
                            isBlurred={isBlurred}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ItineraryView() {
    const itinerary = useAppStore((s) => s.itinerary);
    const isGuest = useAppStore((s) => s.isGuest);
    const setShowAuthModal = useAppStore((s) => s.setShowAuthModal);

    if (!itinerary) return null;

    return (
        <div className="px-4 sm:px-6 py-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-2">
                {/* Itinerary Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2
                            className="text-xl font-bold text-foreground"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Your Itinerary
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {itinerary.tripSnapshot.destination}
                            {itinerary.totalEstimatedCost &&
                                ` · Est. ${itinerary.totalEstimatedCost}`}
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Days */}
                {itinerary.days.map((day, index) => {
                    const isBlurred = isGuest && index > 0;

                    return (
                        <div key={day.dayNumber} className="relative group">
                            <DaySection day={day} isBlurred={isBlurred} />
                            {index < itinerary.days.length - 1 && <Separator />}
                        </div>
                    );
                })}

                {/* Guest CTA Overlay */}
                {isGuest && itinerary.days.length > 1 && (
                    <div className="relative mt-4">
                        <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none" />
                        <div className="text-center py-8 space-y-4 relative z-20">
                            <div className="inline-flex items-center gap-2 text-muted-foreground">
                                <Lock className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                    Full itinerary is locked
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Create a free account to see and edit the complete itinerary
                            </p>
                            <Button
                                onClick={() => setShowAuthModal(true)}
                                className="bg-gradient-to-r from-isang-teal to-primary hover:opacity-90 cta-pulse"
                            >
                                Unlock full itinerary
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
