
import React from "react";
import { Button } from "@/components/ui/button";

interface ItineraryFooterActionsProps {
    onEdit?: () => void;
}

export default function ItineraryFooterActions({ onEdit }: ItineraryFooterActionsProps) {
    return (
        <div className="mt-8 mb-2">
            <Button
                variant="outline"
                onClick={onEdit}
                className="w-full sm:w-auto rounded-full border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50"
            >
                Show or edit itinerary
            </Button>
        </div>
    );
}
