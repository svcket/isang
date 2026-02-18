
import React from "react";
import { ItineraryDay } from "@/types/response-block";
import ItineraryCallout from "./ItineraryCallout";

interface ItineraryDayCardProps {
    day: ItineraryDay;
}

export default function ItineraryDayCard({ day }: ItineraryDayCardProps) {
    return (
        <div className="space-y-4">
            {/* Grey Header Bar */}
            <div className="bg-neutral-100 rounded-lg py-3 px-4">
                <h3 className="text-[15px] font-semibold text-neutral-900">
                    Day {day.day_index}: {day.title}
                </h3>
            </div>

            {/* Content Body */}
            <div className="space-y-5 px-1">
                {/* Main Narrative */}
                <p className="text-[15px] text-neutral-600 leading-relaxed whitespace-pre-wrap">
                    {day.overview}
                </p>

                {/* Callouts */}
                {day.blocks.filter(b => b.kind !== 'plan').map((block, index) => (
                    <ItineraryCallout key={index} block={block} />
                ))}
            </div>
        </div>
    );
}
