"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DayHours {
    day: string;
    hours: string;
}

interface OpeningHoursProps {
    hours: DayHours[];
}

export default function OpeningHours({ hours }: OpeningHoursProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Basic logic to determine if current time is within some open window
    const getStatus = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const now = new Date();
        const dayIndex = now.getDay();
        const currentDayStr = days[dayIndex] || "";
        const todayHours = hours.find(h => h.day.startsWith(currentDayStr));

        if (!todayHours || todayHours.hours.toLowerCase().includes("closed")) {
            return { label: "Closed now", color: "text-red-500" };
        }
        
        // Very basic time parsing for "10 AM – 7 PM"
        const matches = todayHours.hours.match(/(\d+)\s*(AM|PM)\s*–\s*(\d+)\s*(AM|PM)/i);
        if (matches && matches[1] && matches[2] && matches[3] && matches[4]) {
            const startHour = parseInt(matches[1]);
            const startAmPm = matches[2].toUpperCase();
            const endHour = parseInt(matches[3]);
            const endAmPm = matches[4].toUpperCase();

            const startTotal = (startHour % 12) + (startAmPm === "PM" ? 12 : 0);
            const endTotal = (endHour % 12) + (endAmPm === "PM" ? 12 : 0);
            
            const currentHour = now.getHours();
            if (currentHour >= startTotal && currentHour < endTotal) {
                return { label: "Open now", color: "text-emerald-500" };
            }
        }

        return { label: "Closed now", color: "text-red-500" };
    };

    const status = getStatus();

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-neutral-900 group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex flex-col">
                    <span className="text-[14px] font-bold">Hours of operation</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={cn("text-[14px]", status.color)}>{status.label}</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-2 space-y-1 pl-0">
                    {hours.map((h) => (
                        <div key={h.day} className="flex justify-between text-[13px] text-neutral-600 gap-8">
                            <span className="w-8">{h.day}</span>
                            <span className="flex-1 text-right">{h.hours}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
