import { useRef } from "react";
import type { Item } from "@/types";
import ItemCard from "./ItemCard";

interface HorizontalCardRailProps {
    items?: Item[];
    onItemAdd?: (id: string) => void;
    children?: React.ReactNode;
}

export default function HorizontalCardRail({ items, onItemAdd, children }: HorizontalCardRailProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // If explicit children, render them
    if (children) {
        return (
            <div className="relative group/rail -mx-4 sm:mx-0">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto px-4 sm:px-0 pb-4 pt-1 snap-x scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {children}
                    {/* Padding kicker for end of list */}
                    <div className="w-1 flex-shrink-0" />
                </div>
                {/* Fade indicators */}
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
            </div>
        );
    }

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
