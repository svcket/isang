
import React from "react";
import { ItineraryDay, Action } from "@/types/response-block";
import ItineraryDayCard from "./ItineraryDayCard";
import ItineraryFooterActions from "./ItineraryFooterActions";

import { useAppStore } from "@/lib/store";

interface ItineraryResponseShellProps {
    days: ItineraryDay[];
    actions?: Action[];
    onAction?: (actionId: string, payload?: unknown) => void;
}

export default function ItineraryResponseShell({ days, actions, onAction }: ItineraryResponseShellProps) {
    const isGuest = useAppStore((s) => s.isGuest);
    const setShowAuthModal = useAppStore((s) => s.setShowAuthModal);

    return (
        <div className="w-full bg-white p-6 rounded-3xl border border-neutral-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Days Stack */}
            <div className="space-y-10">
                {days.map((day) => (
                    <ItineraryDayCard key={day.day_index} day={day} />
                ))}
            </div>

            {/* Footer Action */}
            <ItineraryFooterActions onEdit={() => {
                if (isGuest) {
                    setShowAuthModal(true);
                } else {
                    onAction?.('edit_itinerary');
                }
            }} />
        </div>
    );
}
