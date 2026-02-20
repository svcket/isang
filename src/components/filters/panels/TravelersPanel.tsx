import * as React from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface TravelersPanelProps {
    onClose: () => void;
}

export function TravelersPanel({ onClose }: TravelersPanelProps) {
    const filterState = useAppStore((s) => s.filterState);
    const setFilter = useAppStore((s) => s.setFilter);
    const clearFilter = useAppStore((s) => s.clearFilter);

    // Local state to prevent committing immediately until "Apply" is pressed
    const [adults, setAdults] = React.useState(filterState.travelers.adults);
    const [children, setChildren] = React.useState(filterState.travelers.children);

    const handleApply = () => {
        setFilter("travelers", { adults, children });
        onClose();
    };

    const handleClear = () => {
        setAdults(1); // Min 1 adult
        setChildren(0);
        clearFilter("travelers");
    };

    const isDirty = adults !== filterState.travelers.adults || children !== filterState.travelers.children;

    return (
        <div className="flex flex-col h-full w-full p-4">

            <div className="flex flex-col gap-6 py-4 px-2 flex-1">
                {/* Adults Stepper */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">Adults</span>
                        <span className="text-sm text-muted-foreground">Ages 13 or above</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-neutral-300 disabled:opacity-30"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-4 text-center tabular-nums font-medium text-neutral-900">{adults}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-neutral-300 disabled:opacity-30"
                            onClick={() => setAdults(Math.min(16, adults + 1))}
                            disabled={adults >= 16}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Children Stepper */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">Children</span>
                        <span className="text-sm text-muted-foreground">Ages 2-12</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-neutral-300 disabled:opacity-30"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-4 text-center tabular-nums font-medium text-neutral-900">{children}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-neutral-300 disabled:opacity-30"
                            onClick={() => setChildren(Math.min(5, children + 1))}
                            disabled={children >= 5}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 pt-4 mt-2 shrink-0 flex items-center justify-between bg-white">
                <Button
                    variant="ghost"
                    onClick={handleClear}
                    disabled={adults === 1 && children === 0 && !isDirty}
                    className="text-sm font-medium underline text-neutral-600 hover:text-neutral-900 px-0 hover:bg-transparent disabled:opacity-50 disabled:no-underline"
                >
                    Clear
                </Button>
                <Button
                    onClick={handleApply}
                    className="bg-[#FF4405] text-white rounded-full px-6 hover:bg-[#e63d05]"
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}
