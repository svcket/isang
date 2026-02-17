"use client";

import { useAppStore } from "@/lib/store";


export default function TripSnapshotHeader() {
    const tripSnapshot = useAppStore((s) => s.tripSnapshot);

    if (!tripSnapshot) return null;

    // Helper to format data
    const parts = [];
    if (tripSnapshot.destination) parts.push(tripSnapshot.destination.split(",")[0]); // Just City
    if (tripSnapshot.dates) {
        // Simple format: "Aug 18-21"
        parts.push(`${tripSnapshot.dates.start.split('/')[0]}/${tripSnapshot.dates.start.split('/')[1]} - ${tripSnapshot.dates.end?.split('/')[0]}/${tripSnapshot.dates.end?.split('/')[1]}`);
    } else if (tripSnapshot.duration) {
        parts.push(tripSnapshot.duration);
    }

    // Hardcoded for now based on Image 1 reference, usually this comes from state
    parts.push("Travellers");

    if (tripSnapshot.budget) {
        parts.push(`${tripSnapshot.budget.currency} ${tripSnapshot.budget.amount.toLocaleString()}`);
    }

    return (
        <div className="sticky top-14 z-30 flex justify-center py-4 pointer-events-none w-full">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-neutral-200 rounded-full px-5 py-2.5 shadow-sm flex items-center gap-4 text-sm font-medium text-neutral-900 animate-in fade-in slide-in-from-top-4 duration-500">
                {parts.map((part, i) => (
                    <div key={i} className="flex items-center gap-4">
                        {i > 0 && <div className="h-4 w-[1px] bg-neutral-200" />}
                        <span>{part}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
