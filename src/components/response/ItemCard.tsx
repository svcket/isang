import { Item } from "@/types";
import { Plus } from "lucide-react";
import PriceChip from "./PriceChip";
import Image from "next/image";

interface ItemCardProps {
    item: Item;
    onAdd?: (id: string) => void;
    className?: string;
}

export default function ItemCard({ item, onAdd, className }: ItemCardProps) {
    return (
        <div className={`relative flex-shrink-0 w-[200px] sm:w-[220px] snap-start group cursor-pointer ${className}`}>
            {/* Image Container */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-2.5">
                <Image
                    src={item.image_url || "/placeholder-image.jpg"} // Fallback needed
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="220px"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

                {/* Price Chip (Bottom Right) */}
                {item.price_chip && (
                    <div className="absolute bottom-2 right-2">
                        <PriceChip text={item.price_chip} />
                    </div>
                )}

                {/* Add Button (Top Right) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd?.(item.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                    aria-label="Add to trip"
                >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
            </div>

            {/* Content */}
            <div className="space-y-0.5 px-1">
                <h3 className="font-semibold text-gray-900 text-[15px] leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                </h3>

                {/* Meta Row */}
                {item.meta && item.meta.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-hidden">
                        <span>{item.meta[0]}</span>
                        {item.meta[1] && (
                            <>
                                <span className="text-gray-300">•</span>
                                <span className="truncate">{item.meta[1]}</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
