
import React from "react";
import { ItineraryDay } from "@/types/response-block";
import ItineraryCallout from "./ItineraryCallout";

interface ItineraryDayCardProps {
    day: ItineraryDay;
}

export default function ItineraryDayCard({ day }: ItineraryDayCardProps) {
    // Separate plan blocks (beats) from callout blocks (tip/spend)
    const beats = day.blocks.filter(b => b.kind === 'plan');
    const callouts = day.blocks.filter(b => b.kind !== 'plan');

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

                {/* Time Beats */}
                {beats.length > 0 && (
                    <div className="space-y-2.5">
                        {beats.map((beat, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <span className="text-[13px] font-semibold text-neutral-400 uppercase tracking-wide w-[72px] flex-shrink-0 pt-0.5">
                                    {beat.title || ""}
                                </span>
                                <span className="text-[14px] text-neutral-700 leading-snug">
                                    {beat.content}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Callouts (Tip + Spend) */}
                {callouts.map((block, index) => (
                    <ItineraryCallout key={index} block={block} />
                ))}
            </div>
        </div>
    );
}
