import { useRef } from "react";
import { Item } from "@/types";
import ItemCard from "./ItemCard";
import { ChevronRight } from "lucide-react";

interface HorizontalCardRailProps {
    items: Item[];
    onItemAdd?: (id: string) => void;
}

export default function HorizontalCardRail({ items, onItemAdd }: HorizontalCardRailProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!items || items.length === 0) return null;

    return (
        <div className="relative group/rail -mx-4 sm:mx-0">
            <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto px-4 sm:px-0 pb-4 pt-1 snap-x scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onAdd={onItemAdd}
                    />
                ))}

                {/* Padding kicker for end of list */}
                <div className="w-1 flex-shrink-0" />
            </div>

            {/* Fade indicators (optional, for polish) */}
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
        </div>
    );
}
