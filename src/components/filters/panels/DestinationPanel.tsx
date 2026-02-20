import * as React from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { MOCK_DESTINATIONS } from "@/lib/mock-destinations";

interface DestinationPanelProps {
    onClose: () => void;
}

export function DestinationPanel({ onClose }: DestinationPanelProps) {
    const filterState = useAppStore((s) => s.filterState);
    const setFilter = useAppStore((s) => s.setFilter);
    const clearFilter = useAppStore((s) => s.clearFilter);

    const [search, setSearch] = React.useState("");

    // Simple client-side search against our mock data
    const filteredDestinations = React.useMemo(() => {
        if (!search) return MOCK_DESTINATIONS;
        const lower = search.toLowerCase();
        return MOCK_DESTINATIONS.filter(d =>
            d.name.toLowerCase().includes(lower) ||
            (d.region && d.region.toLowerCase().includes(lower))
        );
    }, [search]);

    const handleSelect = (destName: string) => {
        setFilter("destination", destName);
        onClose(); // Apply behavior: selecting immediately applies and closes
    };

    const handleClear = () => {
        clearFilter("destination");
        setSearch("");
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header / Search */}
            <div className="p-4 border-b border-border/50 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search destinations"
                        className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:border-neutral-300 rounded-full h-10"
                        autoFocus
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 min-h-[250px] max-h-[400px]">
                {filteredDestinations.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No destinations found.
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {filteredDestinations.map((dest) => (
                            <button
                                key={dest.id}
                                onClick={() => handleSelect(dest.name)}
                                className="flex items-center gap-3 w-full p-2 hover:bg-muted/50 rounded-lg text-left transition-colors"
                            >
                                <div className="h-10 w-10 shrink-0 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                                    {dest.image ? (
                                        <img src={dest.image} alt={dest.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-neutral-900">{dest.name}</span>
                                    <span className="text-xs text-muted-foreground">{dest.region}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 shrink-0 flex items-center justify-between bg-white">
                <Button
                    variant="ghost"
                    onClick={handleClear}
                    disabled={!filterState.destination}
                    className="text-sm font-medium underline text-neutral-600 hover:text-neutral-900 px-0 hover:bg-transparent disabled:opacity-50 disabled:no-underline"
                >
                    Clear
                </Button>
                {/* Apply button is mostly for mobile UX consistency, as clicking an item selects it */}
                <Button
                    onClick={onClose}
                    className="bg-[#FF4405] text-white rounded-full px-6 hover:bg-[#e63d05]"
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}
