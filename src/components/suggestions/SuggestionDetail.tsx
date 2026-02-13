"use client";

import { useAppStore } from "@/lib/store";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Hotel,
    UtensilsCrossed,
    Activity,
    Plane,
    Shield,
    Plus,
    Bookmark,
    CalendarPlus,
    ArrowRight,
} from "lucide-react";
import type { SuggestionCategory, SuggestionItem } from "@/types";

const categoryIcons: Record<SuggestionCategory, React.ElementType> = {
    stays: Hotel,
    restaurants: UtensilsCrossed,
    activities: Activity,
    flights: Plane,
    entry_requirements: Shield,
};

export default function SuggestionDetail() {
    const selectedId = useAppStore((s) => s.selectedSuggestionId);
    const setSelected = useAppStore((s) => s.setSelectedSuggestion);
    const suggestions = useAppStore((s) => s.suggestions);
    const isGuest = useAppStore((s) => s.isGuest);
    const setShowAuthModal = useAppStore((s) => s.setShowAuthModal);

    // Find the item across all sections
    let item: SuggestionItem | null = null;
    for (const section of suggestions) {
        const found = section.items.find((i) => i.id === selectedId);
        if (found) {
            item = found;
            break;
        }
    }

    const Icon = item ? categoryIcons[item.category] : Hotel;

    return (
        <Sheet open={!!selectedId} onOpenChange={() => setSelected(null)}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
                {item && (
                    <>
                        {/* Hero Image */}
                        <div className="relative h-56 bg-muted">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: item.imageUrl
                                        ? `url(${item.imageUrl})`
                                        : undefined,
                                    backgroundColor: item.imageUrl
                                        ? undefined
                                        : "oklch(0.90 0.03 220)",
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <Badge className="bg-white/90 text-foreground backdrop-blur-sm mb-2 text-[10px]">
                                    <Icon className="h-3 w-3 mr-1" />
                                    {item.category.replace("_", " ").replace(/\b\w/g, (l) =>
                                        l.toUpperCase()
                                    )}
                                </Badge>
                                <h2
                                    className="text-xl font-bold text-white"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    {item.name}
                                </h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5">
                            <SheetHeader className="p-0 space-y-0">
                                <SheetTitle className="sr-only">{item.name}</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Details about {item.name}
                                </SheetDescription>
                            </SheetHeader>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-primary">
                                    {item.priceHint}
                                </span>
                            </div>

                            <Separator />

                            {/* Description */}
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>

                            {/* Category-specific metadata */}
                            {item.meta && Object.keys(item.meta).length > 0 && (
                                <>
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(item.meta).map(([key, value]) => (
                                            <div key={key}>
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                                                    {key.replace(/_/g, " ")}
                                                </p>
                                                <p className="text-sm font-medium text-foreground">
                                                    {value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <Separator />

                            {/* Actions */}
                            <div className="space-y-2">
                                {isGuest ? (
                                    <>
                                        <Button
                                            className="w-full bg-gradient-to-r from-isang-teal to-primary hover:opacity-90"
                                            onClick={() => setShowAuthModal(true)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Sign up to add to trip
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setShowAuthModal(true)}
                                        >
                                            <Bookmark className="h-4 w-4 mr-2" />
                                            Save for later
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button className="w-full bg-gradient-to-r from-isang-teal to-primary hover:opacity-90">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add to trip
                                        </Button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm">
                                                <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />
                                                Use for itinerary
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                                                Save for later
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
