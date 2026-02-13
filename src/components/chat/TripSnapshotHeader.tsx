"use client";

import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Wallet, Compass } from "lucide-react";

export default function TripSnapshotHeader() {
    const tripSnapshot = useAppStore((s) => s.tripSnapshot);

    if (!tripSnapshot) return null;

    return (
        <div className="border-b border-border bg-card/60 backdrop-blur-sm px-4 sm:px-6 py-3">
            <div className="max-w-2xl mx-auto flex flex-wrap items-center gap-2">
                {tripSnapshot.destination && (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 text-xs"
                    >
                        <MapPin className="h-3 w-3 text-isang-coral" />
                        {tripSnapshot.destination}
                    </Badge>
                )}
                {tripSnapshot.dates && (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 text-xs"
                    >
                        <Calendar className="h-3 w-3 text-isang-teal" />
                        {tripSnapshot.dates.start}
                        {tripSnapshot.dates.end
                            ? ` – ${tripSnapshot.dates.end}`
                            : ""}
                    </Badge>
                )}
                {tripSnapshot.duration && !tripSnapshot.dates && (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 text-xs"
                    >
                        <Calendar className="h-3 w-3 text-isang-teal" />
                        {tripSnapshot.duration}
                    </Badge>
                )}
                {tripSnapshot.budget && (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 text-xs"
                    >
                        <Wallet className="h-3 w-3 text-isang-mint" />
                        {tripSnapshot.budget.currency}{" "}
                        {tripSnapshot.budget.amount.toLocaleString()}
                    </Badge>
                )}
                {tripSnapshot.travelStyle && (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 text-xs"
                    >
                        <Compass className="h-3 w-3 text-isang-sky" />
                        {tripSnapshot.travelStyle}
                    </Badge>
                )}
            </div>
        </div>
    );
}
