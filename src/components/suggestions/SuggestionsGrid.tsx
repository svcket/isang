"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Hotel,
    UtensilsCrossed,
    Activity,
    Plane,
    Shield,
} from "lucide-react";
import type { SuggestionItem, SuggestionCategory } from "@/types";

const categoryConfig: Record<
    SuggestionCategory,
    { icon: React.ElementType; label: string; color: string }
> = {
    stays: { icon: Hotel, label: "Stays", color: "text-isang-teal" },
    restaurants: {
        icon: UtensilsCrossed,
        label: "Restaurants",
        color: "text-isang-coral",
    },
    activities: { icon: Activity, label: "Activities", color: "text-isang-mint" },
    flights: { icon: Plane, label: "Flights", color: "text-isang-sky" },
    entry_requirements: {
        icon: Shield,
        label: "Entry Requirements",
        color: "text-amber-500",
    },
};

function SuggestionCard({ item }: { item: SuggestionItem }) {
    const setSelectedSuggestion = useAppStore((s) => s.setSelectedSuggestion);
    const config = categoryConfig[item.category];
    const Icon = config.icon;

    return (
        <Card
            className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-card"
            onClick={() => setSelectedSuggestion(item.id)}
        >
            {/* Image */}
            <div className="relative h-40 bg-muted overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{
                        backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
                        backgroundColor: item.imageUrl ? undefined : 'oklch(0.90 0.03 220)',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-white/90 text-foreground backdrop-blur-sm text-[10px] shadow-sm">
                    <Icon className={`h-3 w-3 mr-1 ${config.color}`} />
                    {config.label}
                </Badge>
                <div className="absolute bottom-3 right-3">
                    <span className="text-xs font-semibold text-white bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                        {item.priceHint}
                    </span>
                </div>
            </div>

            <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}>
                    {item.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                </p>
            </CardContent>
        </Card>
    );
}

export function SuggestionCardSkeleton() {
    return (
        <Card className="overflow-hidden border-border/50">
            <Skeleton className="h-40 rounded-none" />
            <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3 mt-1" />
            </CardContent>
        </Card>
    );
}

export default function SuggestionsGrid() {
    const suggestions = useAppStore((s) => s.suggestions);

    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="px-4 sm:px-6 py-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
                {suggestions.map((section) => (
                    <div key={section.category}>
                        {/* Section Header */}
                        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-background/90 backdrop-blur-sm py-2 -my-2 z-10">
                            {(() => {
                                const config = categoryConfig[section.category];
                                const Icon = config.icon;
                                return (
                                    <>
                                        <Icon className={`h-5 w-5 ${config.color}`} />
                                        <h2
                                            className="text-lg font-semibold text-foreground"
                                            style={{ fontFamily: "var(--font-heading)" }}
                                        >
                                            {section.title}
                                        </h2>
                                    </>
                                );
                            })()}
                            <Badge variant="secondary" className="ml-auto text-[10px]">
                                {section.items.length} options
                            </Badge>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.items.map((item) => (
                                <SuggestionCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
