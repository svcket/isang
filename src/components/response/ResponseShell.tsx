import SectionCard from "./SectionCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FlightsSection, { type FlightItem } from "./sections/FlightsSection";
import StaysSection from "./sections/StaysSection";
import FoodSection from "./sections/FoodSection";
import ActivitySection from "./sections/ActivitySection";
import ItineraryResponseShell from "./itinerary/ItineraryResponseShell";
import DestinationInfoResponse from "./destination/DestinationInfoResponse";
import DestinationSuggestionCard from "./sections/DestinationSuggestionCard";

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
    onAction?: (actionId: string, payload?: unknown, label?: string) => void;
    className?: string;
    selectedHighlights?: string[];
    onToggleHighlight?: (id: string) => void;
}

export default function ResponseShell({
    data: rawData,
    onItemAdd,
    onAction,
    className,
    selectedHighlights,
    onToggleHighlight
}: ResponseShellProps) {
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
        <div className={cn("w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white p-5 rounded-2xl border border-neutral-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]", className)}>

            {/* 1. Trip Meta Header (Moved to AppHeader) */}

            {/* Intro Text - Restored & Verified */}
            {data.introduction && (
                <div className="px-1">
                    <p className="text-[16px] text-neutral-600 leading-relaxed">
                        {data.introduction}
                    </p>
                </div>
            )}

            {/* 3. Sections (TRIP_PLAN) */}
            <div className="flex flex-col gap-4">
                {/* DESTINATION_INFO Blocks */}
                {data.type === 'DESTINATION_INFO' && data.blocks && (
                    <DestinationInfoResponse
                        blocks={data.blocks}
                        ui_hints={data.ui_hints}
                        suggestions={data.suggestions}
                        onAction={onAction}
                        selectedHighlights={selectedHighlights || []}
                        onToggleHighlight={onToggleHighlight || (() => { })}
                    />
                )}

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

                    if (section.type === 'DESTINATION') {
                        return (
                            <div key={section.id} className="flex flex-col gap-3">
                                <h3 className="text-[15px] font-semibold text-neutral-900 px-1">{section.title}</h3>
                                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {section.items.map((item: any) => (
                                        <DestinationSuggestionCard
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            imageUrl={item.image_url}
                                            meta={item.meta || []}
                                            priceChip={item.price_chip}
                                            onViewPlan={(_id, destination) => onAction?.('view_plan', { destination }, 'View plan')}
                                        />
                                    ))}
                                </div>
                            </div>
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
                            onClick={() => onAction?.(action.action_id, action.payload, action.label)}
                            variant={action.style === 'PRIMARY' ? 'default' : 'outline'}
                            className={cn(
                                "w-full sm:w-auto h-10 rounded-full px-6 text-[14px] font-medium",
                                action.style === 'PRIMARY' && "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm",
                                action.style === 'SECONDARY' && "border-neutral-200 text-neutral-900 bg-background hover:bg-neutral-50 shadow-sm"
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
