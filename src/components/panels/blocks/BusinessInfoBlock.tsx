"use client";

import React from "react";
import { MapPin, Globe, Phone, ChevronRight } from "lucide-react";
import OpeningHours from "./OpeningHours";
import type { DayHours } from "@/types/panel";
import { cn } from "@/lib/utils";

interface BusinessInfoBlockProps {
    mode: "horizontal" | "vertical";
    address?: string;
    website?: string;
    phone?: string;
    hours?: DayHours[];
}

export default function BusinessInfoBlock({ mode, address, website, phone, hours }: BusinessInfoBlockProps) {
    const isHorizontal = mode === "horizontal";

    return (
        <div className={cn(
            "grid gap-8 border-t border-neutral-100 pt-8 mt-4",
            isHorizontal ? "grid-cols-3" : "grid-cols-1"
        )}>
            {/* Address */}
            {address && (
                <div className="space-y-1.5">
                    <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-neutral-900 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                            <span className="text-[14px] font-bold text-neutral-900 block">Address</span>
                            <p className="text-[14px] text-neutral-600 leading-tight whitespace-pre-line">
                                {address}
                            </p>
                            <button className="flex items-center gap-1 text-[13px] font-medium text-neutral-900 hover:underline mt-1">
                                Get directions
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Website & Phone Container */}
            {(website || phone) && (
                <div className="space-y-6">
                    {website && (
                        <div className="flex items-start gap-2.5">
                            <Globe className="w-4 h-4 text-neutral-900 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <span className="text-[14px] font-bold text-neutral-900 block">Website</span>
                                <a 
                                    href={website.startsWith('http') ? website : `https://${website}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[14px] text-neutral-600 hover:underline truncate block max-w-[200px]"
                                >
                                    {website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-start gap-2.5">
                            <Phone className="w-4 h-4 text-neutral-900 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <span className="text-[14px] font-bold text-neutral-900 block">Phone</span>
                                <p className="text-[14px] text-neutral-600">
                                    {phone}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Hours */}
            {hours && (
                <div className="flex items-start gap-2.5">
                    <OpeningHours hours={hours} />
                </div>
            )}
        </div>
    );
}
