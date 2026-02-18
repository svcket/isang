import SectionCard from "./SectionCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FlightsSection, { type FlightItem } from "./sections/FlightsSection";
import StaysSection from "./sections/StaysSection";
import FoodSection from "./sections/FoodSection";
import ActivitySection from "./sections/ActivitySection";
import ItineraryResponseShell from "./itinerary/ItineraryResponseShell";

// Helper to map generic Item to FlightItem
function mapToFlightItems(items: any[]): FlightItem[] {
    return items.map(item => ({
        id: item.id,
        airlineName: item.title,
        fromCity: item.meta?.[0] || "Origin",
        toCity: item.meta?.[1] || "Dest",
        priceText: item.price_chip?.split(' ')[0] || "",
        priceSuffix: item.price_chip?.split(' ').slice(1).join(' ') || "",
        tripTypeText: item.meta?.[2]?.split(',')[0]?.trim() || "Round trip",
        stopsText: item.meta?.[2]?.split(',')[1]?.trim() || item.meta?.[3] || "",
        logoSrc: item.image_url
    }));
}

interface ResponseShellProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    onItemAdd?: (id: string) => void;
    onAction?: (actionId: string, payload?: unknown) => void;
    className?: string;
}

export default function ResponseShell({ data: rawData, onItemAdd, onAction, className }: ResponseShellProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = rawData as any;

    // ─── ITINERARY VIEW ───────────────────────────────────────────────
    if (data.type === 'ITINERARY') {
        return (
            <ItineraryResponseShell
                days={data.days || []}
                actions={data.actions}
                onAction={onAction}
            />
        );
    }

    // ─── STANDARD VIEW (Plan / Info / Edit) ───────────────────────────
    return (
        <div className={cn("w-full space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white p-5 rounded-2xl border border-neutral-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]", className)}>

            {/* 1. Trip Meta Header (Moved to AppHeader) */}

            {/* Intro Text - Restored & Verified */}
            {data.introduction && (
                <div className="px-1">
                    <p className="text-[16px] text-neutral-600 leading-relaxed">
                        {data.introduction}
                    </p>
                </div>
            )}

            {/* 3. Sections */}
            <div className="space-y-6">
                {/* Sections */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {data.sections?.map((section: any) => {
                    if (section.type === 'FLIGHT') {
                        return (
                            <FlightsSection
                                key={section.id}
                                items={mapToFlightItems(section.items)}
                                sources={section.sources}
                                onSelect={onItemAdd}
                            />
                        );
                    }
                    if (section.type === 'LODGING') {
                        return (
                            <StaysSection
                                key={section.id}
                                items={section.items}
                                sources={section.sources}
                                onSelect={onItemAdd}
                            />
                        );
                    }
                    if (section.type === 'FOOD') {
                        return (
                            <FoodSection
                                key={section.id}
                                items={section.items}
                                sources={section.sources}
                                onSelect={onItemAdd}
                            />
                        );
                    }
                    if (section.type === 'ACTIVITY') {
                        return (
                            <ActivitySection
                                key={section.id}
                                items={section.items}
                                sources={section.sources}
                                onSelect={onItemAdd}
                            />
                        );
                    }

                    if (section.type === 'HIGHLIGHT' && false) {
                        return (
                            <SectionCard
                                key={section.id}
                                section={section}
                                onItemAdd={onItemAdd}
                            />
                        );
                    }

                    return null;
                })}
            </div>

            {/* Closing / Outro Text (Before CTA) */}
            {data.closing && (
                <div className="px-1">
                    <p className="text-[16px] text-neutral-600 leading-relaxed">
                        {data.closing}
                    </p>
                </div>
            )}

            {/* Actions */}
            {data.actions && data.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {data.actions.map((action: any) => (
                        <Button
                            key={action.action_id}
                            onClick={() => onAction?.(action.action_id, action.payload)}
                            variant={action.style === 'PRIMARY' ? 'default' : 'outline'}
                            className={cn(
                                "w-full sm:w-auto",
                                action.style === 'PRIMARY' && "bg-neutral-900 text-white hover:bg-neutral-800 shadow-md",
                                action.style === 'SECONDARY' && "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
