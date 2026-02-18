import type { Item } from "@/types";
import { MoveRight, Plus, Plane } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FlightCardProps {
    // Legacy
    item?: Item;
    onAdd?: (id: string) => void;

    // Explicit props
    id?: string;
    airlineName?: string;
    fromCity?: string;
    toCity?: string;
    priceText?: string;
    priceSuffix?: string;
    tripTypeText?: string;
    stopsText?: string;
    logoSrc?: string;
    className?: string;
}

export default function FlightCard({
    item,
    onAdd,
    id,
    airlineName,
    fromCity,
    toCity,
    priceText,
    priceSuffix,
    tripTypeText,
    stopsText,
    logoSrc,
    className
}: FlightCardProps) {
    // Resolve data sources (Explicit > Item)
    const _id = id || item?.id || "";
    const _title = airlineName || item?.title || "";
    const _origin = fromCity || item?.meta?.[0] || "Origin";
    const _destination = toCity || item?.meta?.[1] || "Dest";

    // Parse item meta for trip details if explicit not provided
    const _tripDetails = (tripTypeText && stopsText)
        ? `${tripTypeText}, ${stopsText}`
        : tripTypeText
            ? tripTypeText
            : item?.meta?.slice(2).join(", ");

    // Price parsing
    const _priceFull = priceText ? `${priceText} ${priceSuffix || ''}` : item?.price_chip || "";
    const [priceMain, ...priceRest] = _priceFull.trim().split(' ');
    const priceSub = priceSuffix || priceRest.join(' ');

    const _image = logoSrc || item?.image_url;

    return (
        <div className={cn("relative flex-shrink-0 w-full flex flex-col rounded-[20px] border border-neutral-200 bg-white hover:border-neutral-300 transition-all group", className)}>
            {/* Header: Logo and Airline Name */}
            <div className="flex flex-col items-start gap-2 px-5 py-4 border-b border-neutral-100">
                <div className="relative w-[30px] h-[30px] flex-shrink-0 rounded-full border border-neutral-100 p-1 bg-white">
                    {_image ? (
                        <Image
                            src={_image}
                            alt={_title}
                            fill
                            className="object-contain p-1"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-100 rounded-full" />
                    )}
                </div>
                <span className="font-normal text-slate-600 text-[13px] tracking-tight ml-0.5">
                    {_title}
                </span>
            </div>

            {/* Content Container */}
            <div className="px-5 pt-4 pb-5 flex flex-col">
                {/* Route Visual */}
                <div className="relative h-[100px] w-full">
                    {/* Top Left: Origin */}
                    <div className="absolute top-0 left-0">
                        <span className="text-[17px] font-medium text-neutral-900 tracking-tight">{_origin}</span>
                    </div>

                    {/* Center: Orange Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="w-5 h-5 bg-[#FF4405] rounded-[4px] flex items-center justify-center shadow-sm">
                            <MoveRight className="w-3 h-3 text-white rotate-[226deg]" strokeWidth={3} />
                        </div>
                    </div>

                    {/* Bottom Right: Destination */}
                    <div className="absolute bottom-1 right-0">
                        <span className="text-[17px] font-medium text-neutral-900 tracking-tight">{_destination}</span>
                    </div>
                </div>

                {/* Footer: Price & Details */}
                <div className="mt-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[16px] font-bold text-neutral-900 tracking-tight">
                            {priceMain}
                        </span>
                        {priceSub && (
                            <span className="text-[14px] font-medium text-[#22C55E]">
                                {priceSub}
                            </span>
                        )}
                    </div>
                    {_tripDetails && (
                        <div className="text-[15px] text-slate-500 font-normal mt-0.5">
                            {_tripDetails}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
