import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DestinationSuggestionCardProps {
    id: string;
    title: string;
    imageUrl: string;
    meta: string[];
    priceChip?: string;
    onViewPlan?: (id: string, destination: string) => void;
    onFavorite?: (id: string) => void;
}

export default function DestinationSuggestionCard({
    id,
    title,
    imageUrl,
    meta,
    priceChip,
    onViewPlan,
    onFavorite,
}: DestinationSuggestionCardProps) {
    return (
        <div className="flex-shrink-0 w-[260px] bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-200">
            {/* Image */}
            <div className="relative w-full h-[150px] bg-neutral-100">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    unoptimized
                />
                {/* Heart icon */}
                <button
                    onClick={() => onFavorite?.(id)}
                    aria-label={`Save ${title}`}
                    className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                    <Heart className="w-4 h-4 text-neutral-500" />
                </button>
                {/* Price chip */}
                {priceChip && (
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-[#FF4405] text-white text-[12px] font-semibold rounded-full shadow-sm">
                        {priceChip}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3.5 flex flex-col gap-2">
                <h4 className="text-[15px] font-semibold text-neutral-900 leading-tight">
                    {title}
                </h4>
                {meta.length > 0 && (
                    <p className="text-[13px] text-neutral-500 leading-snug">
                        {meta.join(" · ")}
                    </p>
                )}
                <Button
                    onClick={() => onViewPlan?.(id, title)}
                    className="w-full mt-1 h-9 bg-neutral-900 text-white rounded-full text-[13px] font-medium hover:bg-neutral-800"
                >
                    View plan
                </Button>
            </div>
        </div>
    );
}
