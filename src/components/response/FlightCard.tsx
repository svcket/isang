import { Item } from "@/types";
import { MoveRight, Plus } from "lucide-react";
import Image from "next/image";

interface FlightCardProps {
    item: Item;
    onAdd?: (id: string) => void;
}

export default function FlightCard({ item, onAdd }: FlightCardProps) {
    // Expected meta format for flights:
    // [Origin, Destination, TripType (e.g. "Round trip"), Stops (e.g. "2 stops")]
    const origin = item.meta?.[0] || "Origin";
    const destination = item.meta?.[1] || "Dest";
    const tripDetails = item.meta?.slice(2).join(", "); // "Round trip, 2 stops"

    return (
        <div className="relative flex-shrink-0 w-[240px] flex flex-col p-4 rounded-xl border border-neutral-100 bg-white hover:shadow-md hover:border-neutral-200 gap-4 transition-all group snap-start">
            {/* Header: Airline info & Price */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                        {item.image_url ? (
                            <Image
                                src={item.image_url}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-200" />
                        )}
                    </div>
                    <span className="font-medium text-neutral-600 text-sm">
                        {item.title}
                    </span>
                </div>

                {/* Add Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd?.(item.id);
                    }}
                    className="p-1.5 rounded-full bg-neutral-100 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF4405] hover:text-white"
                    aria-label="Add flight"
                >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
            </div>

            {/* Route Visual */}
            <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-900">{origin}</span>
                </div>

                <div className="flex-1 px-4 flex items-center justify-center">
                    <div className="h-[1.5px] w-full bg-[#FF4405]/20 relative flex items-center justify-center">
                        <div className="bg-[#FF4405] p-1 rounded-full">
                            <MoveRight className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-neutral-900">{destination}</span>
                </div>
            </div>

            {/* Footer: Price & Details */}
            <div className="flex items-end justify-between mt-1">
                <div className="flex flex-col">
                    <div className="text-2xl font-bold text-neutral-900 tracking-tight">
                        {item.price_chip?.split(' ')[0]}
                        <span className="text-xs font-medium text-emerald-600 ml-1.5 align-top mt-1 inline-block">
                            {item.price_chip?.split(' ').slice(1).join(' ')}
                        </span>
                    </div>
                    {tripDetails && (
                        <span className="text-xs text-neutral-400 font-medium mt-1">
                            {tripDetails}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
