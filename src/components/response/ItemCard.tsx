import type { Item } from "@/types";
import { Plus } from "lucide-react";
import Image from "next/image";

interface ItemCardProps {
    item: Item;
    onAdd?: (id: string) => void;
    className?: string;
}

export default function ItemCard({ item, onAdd, className }: ItemCardProps) {
    return (
        <div className={`relative flex-shrink-0 w-full sm:w-full group cursor-pointer ${className}`}>
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
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 px-1 mt-2">
                <h3 className="font-medium text-neutral-900 text-[13px] leading-snug line-clamp-2 group-hover:text-[#FF4405] transition-colors">
                    {item.title}
                </h3>

                {/* Price (New Location) */}
                <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-[14px] font-semibold text-neutral-900">
                        {item.price_chip || item.price}
                    </span>
                    {item.subtext && (
                        <span className="text-[13px] text-neutral-500 truncate">
                            {item.subtext}
                        </span>
                    )}
                </div>

                {/* Meta Row (Optional) */}
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
