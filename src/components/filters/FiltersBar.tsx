"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FilterPill } from "./FilterPill";
import { DestinationPanel } from "./panels/DestinationPanel";
import { WhenPanel } from "./panels/WhenPanel";
import { TravelersPanel } from "./panels/TravelersPanel";
import { BudgetPanel } from "./panels/BudgetPanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Simple custom hook to detect mobile vs desktop
function useMediaQuery(query: string) {
    const [matches, setMatches] = React.useState(false);

    React.useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
}

/**
 * The main container for the top filter bar.
 * Renders the 4 filter pills and manages which panel is currently open.
 */
export function FiltersBar() {
    const filterState = useAppStore((s) => s.filterState);
    const activePanel = useAppStore((s) => s.activeFilterPanel);
    const setActivePanel = useAppStore((s) => s.setActiveFilterPanel);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleClose = () => setActivePanel(null);

    // Formatters for pills
    const getDatesLabel = () => {
        const { start, end } = filterState.dates;
        if (!start) return "When";
        // Convert yyyy-MM-dd to MMM d
        const formatShort = (ds: string) => {
            const d = new Date(ds);
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
        if (start && end) return `${formatShort(start)} – ${formatShort(end)}`;
        return formatShort(start);
    };

    const getTravelersLabel = () => {
        const total = filterState.travelers.adults + filterState.travelers.children;
        if (total === 1 && filterState.travelers.adults === 1 && filterState.travelers.children === 0) return "Travelers"; // Default state
        return `${total} traveler${total > 1 ? "s" : ""}`;
    };

    const getBudgetLabel = () => {
        if (!filterState.budget.amount) return "Budget";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: filterState.budget.currency,
            maximumFractionDigits: 0,
        }).format(filterState.budget.amount);
    };

    const togglePanel = (panel: "destination" | "dates" | "travelers" | "budget") => {
        setActivePanel(activePanel === panel ? null : panel);
    };

    const renderPanelContent = () => {
        switch (activePanel) {
            case "destination": return <DestinationPanel onClose={handleClose} />;
            case "dates": return <WhenPanel onClose={handleClose} />;
            case "travelers": return <TravelersPanel onClose={handleClose} />;
            case "budget": return <BudgetPanel onClose={handleClose} />;
            default: return null;
        }
    };

    const PillGroup = (
        <div className="relative inline-flex items-center bg-white border border-neutral-200 rounded-full px-1 py-1 shadow-sm gap-1">

            {/* 1. Destination */}
            <FilterPill
                id="destination"
                label={filterState.destination || "Where"}
                isActive={activePanel === "destination"}
                hasValue={!!filterState.destination}
                onClick={() => togglePanel("destination")}
            />

            <div className="h-4 w-[1px] bg-neutral-200" />

            {/* 2. Dates */}
            <FilterPill
                id="dates"
                label={getDatesLabel()}
                isActive={activePanel === "dates"}
                hasValue={!!filterState.dates.start}
                onClick={() => togglePanel("dates")}
            />

            <div className="h-4 w-[1px] bg-neutral-200" />

            {/* 3. Travelers */}
            <FilterPill
                id="travelers"
                label={getTravelersLabel()}
                isActive={activePanel === "travelers"}
                hasValue={filterState.travelers.adults > 1 || filterState.travelers.children > 0}
                onClick={() => togglePanel("travelers")}
            />

            <div className="h-4 w-[1px] bg-neutral-200" />

            {/* 4. Budget */}
            <FilterPill
                id="budget"
                label={getBudgetLabel()}
                isActive={activePanel === "budget"}
                hasValue={!!filterState.budget.amount}
                onClick={() => togglePanel("budget")}
            />
        </div>
    );

    if (isDesktop) {
        return (
            <div className="flex justify-center">
                <Popover open={activePanel !== null} onOpenChange={(open) => !open && handleClose()}>
                    <PopoverTrigger asChild>
                        {/* We wrap PillGroup in a div just to anchor the popover to the whole bar */}
                        <div>{PillGroup}</div>
                    </PopoverTrigger>
                    <PopoverContent
                        className={cn(
                            "p-0 rounded-2xl shadow-xl border-border/50 overflow-hidden",
                            activePanel === "dates" ? "w-auto" : "w-[360px]"
                        )}
                        align="center"
                        sideOffset={12}
                    >
                        {renderPanelContent()}
                    </PopoverContent>
                </Popover>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            {PillGroup}

            <Sheet open={activePanel !== null} onOpenChange={(open) => !open && handleClose()}>
                <SheetContent side="bottom" className="p-0 h-[80vh] flex flex-col rounded-t-2xl">
                    <SheetHeader className="p-4 border-b text-left">
                        <SheetTitle className="capitalize text-lg">
                            {activePanel === "dates" ? "When" : activePanel}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-hidden">
                        {renderPanelContent()}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
