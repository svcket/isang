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
    Lock,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { ItineraryDay, TimeBlock } from "@/types";

function TimeBlockCard({
    dayNumber,
    block,
    isBlurred,
}: {
    dayNumber: number;
    block: TimeBlock;
    isBlurred: boolean;
}) {
    const deleteBlock = useAppStore((s) => s.deleteItineraryBlock);
    const updateBlock = useAppStore((s) => s.updateItineraryBlock);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: block.name, time: block.time });

    const handleSave = () => {
        updateBlock(dayNumber, block.id, editData);
        setIsEditing(false);
    };

    return (
        <Card
            className={`group border-border/40 bg-card/80 transition-all hover:bg-card hover:border-border/60 ${isBlurred ? "itinerary-blur" : ""
                }`}
        >
            <CardContent className="p-4 flex items-start gap-4">
                {/* Time */}
                <div className="shrink-0 text-center min-w-[56px]">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editData.time}
                            onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                            className="w-full text-xs font-medium bg-transparent border-b border-primary/50 focus:outline-none"
                            placeholder="Time"
                            aria-label="Activity Time"
                        />
                    ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{block.time}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full text-sm font-semibold bg-transparent border-b border-primary/50 focus:outline-none"
                            autoFocus
                            placeholder="Activity Name"
                            aria-label="Activity Name"
                        />
                    ) : (
                        <h4 className="text-sm font-semibold text-foreground truncate">
                            {block.name}
                        </h4>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                        {block.description}
                    </p>
                    {isEditing && (
                        <div className="flex gap-2 mt-2">
                            <Button size="xs" onClick={handleSave} className="h-6 text-[10px] px-2 bg-primary text-white">Save</Button>
                            <Button size="xs" variant="ghost" onClick={() => setIsEditing(false)} className="h-6 text-[10px] px-2 text-muted-foreground">Cancel</Button>
                        </div>
                    )}
                </div>

                {/* Cost & Actions */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                    {block.costEstimate && (
                        <span className="text-xs font-medium text-primary flex items-center gap-0.5">
                            <DollarSign className="h-3 w-3" />
                            {block.costEstimate}
                        </span>
                    )}
                    {!isBlurred && !isEditing && (
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1 rounded hover:bg-muted"
                                title="Edit block"
                            >
                                <Edit3 className="h-3 w-3 text-muted-foreground" />
                            </button>
                            <button
                                onClick={() => deleteBlock(dayNumber, block.id)}
                                className="p-1 rounded hover:bg-destructive/10"
                                title="Delete block"
                            >
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
    const addBlock = useAppStore((s) => s.addItineraryBlock);

    const handleAddStep = () => {
        const newBlock: TimeBlock = {
            id: Math.random().toString(36).substring(2, 9),
            time: "12:00 PM",
            name: "New Activity",
            description: "Click edit to add details.",
            category: "activities"
        };
        addBlock(day.dayNumber, newBlock);
    };

    return (
        <div className={`${isBlurred ? "relative" : ""}`}>
            {/* Day Header */}
            <div className="flex items-center justify-between group">
                <button
                    onClick={() => !isBlurred && setExpanded(!expanded)}
                    className="flex-1 flex items-center gap-3 py-3"
                    disabled={isBlurred}
                >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {day.dayNumber}
                    </div>
                    <div className="text-left">
                        <h3 className="font-heading text-sm font-semibold text-foreground">
                            {day.title}
                        </h3>
                        {day.date && (
                            <p className="text-[11px] text-muted-foreground">{day.date}</p>
                        )}
                    </div>
                </button>
                {!isBlurred && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[10px] text-muted-foreground hover:text-primary"
                            onClick={handleAddStep}
                        >
                            + Add Step
                        </Button>
                        <button onClick={() => setExpanded(!expanded)} className="p-1">
                            {expanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Time Blocks */}
            {expanded && (
                <div className="space-y-2 pb-4 ml-11">
                    {day.blocks.map((block) => (
                        <TimeBlockCard
                            key={block.id}
                            dayNumber={day.dayNumber}
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
                        <h2 className="font-heading text-xl font-bold text-foreground">
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
                            {index < itinerary.days.length - 1 && (
                                <div className="ml-11 border-l border-border/40 h-4" />
                            )}
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
