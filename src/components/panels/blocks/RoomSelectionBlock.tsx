"use client";

import Image from "next/image";
import HorizontalCardRail from "@/components/response/HorizontalCardRail";
import type { RoomItem } from "@/types/panel";
import { Button } from "@/components/ui/button";
import { Bed, Plus } from "lucide-react";

interface RoomSelectionBlockProps {
    title?: string;
    rooms: RoomItem[];
    layout?: 'rail' | 'list' | 'grid';
}

export default function RoomSelectionBlock({ title, rooms, layout = 'rail' }: RoomSelectionBlockProps) {
    const renderGridCard = (room: RoomItem) => (
        <div
            key={room.id}
            className="flex flex-col border border-neutral-200 rounded-[20px] overflow-hidden bg-white shadow-sm hover:border-neutral-300 transition-colors group/room h-full"
        >
            {/* Image area */}
            <div className="relative aspect-[16/11] w-full overflow-hidden">
                <Image
                    src={room.images[0]?.url || ""}
                    alt={room.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover/room:scale-105"
                    sizes="(max-width: 640px) 100vw, 400px"
                />
                {/* Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                    <Bed className="w-3.5 h-3.5 text-neutral-900 fill-current" />
                    <span className="text-[11px] font-bold text-neutral-900 tracking-wider">STAY</span>
                </div>
            </div>

            {/* Content area */}
            <div className="p-4 flex flex-col flex-grow">
                <h5 className="text-[17px] font-bold text-neutral-900 leading-tight mb-1">
                    {room.name}
                </h5>
                
                {(room.beds || room.capacity) && (
                    <div className="text-[13px] font-medium text-neutral-500 mb-4 whitespace-pre-line">
                        {[room.beds, room.capacity].filter(Boolean).join(" • ")}
                    </div>
                )}

                <div className="mt-auto flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                        <div className="text-[16px] font-bold text-neutral-900">
                            {room.price}
                        </div>
                        {room.price_unit && (
                            <div className="text-[11px] font-medium text-neutral-400 -mt-0.5">
                                / {room.price_unit}
                            </div>
                        )}
                    </div>
                    
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 px-4 rounded-full font-bold text-[12px] border-none flex items-center gap-1.5 transition-all active:scale-95"
                    >
                        Add <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </Button>
                </div>
            </div>
        </div>
    );

    if (layout === 'grid') {
        return (
            <div className="space-y-4">
                {title && <h4 className="text-[18px] font-bold text-neutral-900 tracking-tight">{title}</h4>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rooms.map(renderGridCard)}
                </div>
            </div>
        );
    }

    if (layout === 'list') {
        return (
            <div className="space-y-4">
                {title && <h4 className="text-[20px] font-bold text-neutral-900 tracking-tight">{title}</h4>}
                <div className="flex flex-col gap-4">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="flex flex-col sm:flex-row border border-neutral-200 rounded-[20px] overflow-hidden bg-white shadow-sm hover:border-neutral-300 transition-colors group/room"
                        >
                            {/* Image side */}
                            <div className="relative aspect-[16/10] sm:aspect-square sm:w-[180px] flex-none overflow-hidden">
                                <Image
                                    src={room.images[0]?.url || ""}
                                    alt={room.name}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-700 group-hover/room:scale-105"
                                    sizes="180px"
                                />
                            </div>

                            {/* Content side */}
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="text-[18px] font-bold text-neutral-900 leading-snug">
                                        {room.name}
                                    </h5>
                                    <div className="text-[18px] font-bold text-neutral-900">
                                        {room.price}
                                    </div>
                                </div>
                                
                                {(room.beds || room.capacity) && (
                                    <div className="text-[13px] font-medium text-neutral-500 mb-4 whitespace-pre-line">
                                        {[room.beds, room.capacity].filter(Boolean).join(" • ")}
                                    </div>
                                )}

                                <div className="mt-auto flex justify-end">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-neutral-900 text-white hover:bg-neutral-800 h-9 px-6 rounded-xl font-bold text-[13px] border-none"
                                    >
                                        Add to trip
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {title && <h4 className="text-[18px] font-bold text-neutral-900 tracking-tight">{title}</h4>}
            <HorizontalCardRail>
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="flex-none w-[240px] sm:w-[280px] snap-start border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm group/room transition-all hover:border-neutral-300"
                    >
                        {/* Image area */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                                src={room.images[0]?.url || ""}
                                alt={room.name}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-500 group-hover/room:scale-105"
                                sizes="(max-width: 640px) 240px, 280px"
                            />
                        </div>

                        {/* Content area */}
                        <div className="p-4 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-2">
                                <h5 className="text-[15px] font-bold text-neutral-900 leading-tight">
                                    {room.name}
                                </h5>
                                <div className="text-[15px] font-bold text-neutral-900">
                                    {room.price}
                                </div>
                            </div>

                            {(room.beds || room.capacity) && (
                                <div className="text-[12px] font-medium text-neutral-500 mb-2">
                                    {[room.beds, room.capacity].filter(Boolean).join(" • ")}
                                </div>
                            )}

                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full mt-auto bg-neutral-900 text-white hover:bg-neutral-800 h-9 rounded-xl font-bold text-[13px] border-none"
                            >
                                Add +
                            </Button>
                        </div>
                    </div>
                ))}
            </HorizontalCardRail>
        </div>
    );
}
