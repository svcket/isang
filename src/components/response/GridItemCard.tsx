import type { Item } from "@/types";
import Image from "next/image";
import { usePanelStore } from "@/lib/panel-store";
import type { EntityType } from "@/types/panel";
import { Heart, Plus } from "lucide-react";

interface GridItemCardProps {
    item: Item;
    className?: string;
}

export default function GridItemCard({ item, className = "" }: GridItemCardProps) {
    const openPanel = usePanelStore((s) => s.openPanel);

    const handleClick = () => {
        openPanel({
            entity_type: (item.entity_type as EntityType) || "HOTEL",
            entity_id: item.entity_id || item.id,
            title: item.title,
        });
    };

    return (
        <div
            className={`relative w-full group cursor-pointer ${className}`}
            onClick={handleClick}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 mb-3">
                <Image
                    src={item.image_url || "/placeholder-image.jpg"}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button 
                        className="w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center hover:bg-neutral-100 transition shadow-sm pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); /* Add to saved */ }}
                        aria-label="Save item"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                    <button 
                        className="w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center hover:bg-neutral-100 transition shadow-sm pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); /* Add to trip */ }}
                        aria-label="Add to trip"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Mock Image Pagination Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-100 shadow-sm" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60 shadow-sm" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60 shadow-sm" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60 shadow-sm" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60 shadow-sm" />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 px-0.5">
                <h3 className="font-semibold text-neutral-900 text-[15px] leading-snug line-clamp-1 group-hover:text-[#FF4405] transition-colors">
                    {item.title}
                </h3>

                {/* Meta Row (e.g. Hotel • ★ 4.8 (637k)) */}
                {item.meta && item.meta.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[14px] text-neutral-500 overflow-hidden">
                        <span>{item.meta[0]}</span>
                        {item.meta[1] && (
                            <>
                                <span className="text-neutral-400">•</span>
                                <span className="truncate text-neutral-600">{item.meta[1]}</span>
                            </>
                        )}
                    </div>
                )}

                {/* Optional Subtext (e.g. Barcelona, Catalonia) */}
                {item.subtext && (
                    <span className="text-[14px] text-neutral-500 truncate mb-1">
                        {item.subtext}
                    </span>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-[14px] font-semibold text-neutral-900">
                        {item.price_chip || item.price}
                    </span>
                </div>
            </div>
        </div>
    );
}
