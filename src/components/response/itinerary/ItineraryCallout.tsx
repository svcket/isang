
import React from "react";
import { cn } from "@/lib/utils";
import { ItineraryBlock } from "@/types/response-block";

interface ItineraryCalloutProps {
    block: ItineraryBlock;
}

export default function ItineraryCallout({ block }: ItineraryCalloutProps) {
    if (block.kind === "tip") {
        return (
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white border border-blue-100 mb-3 shadow-sm">
                    <span className="text-[11px] font-medium text-blue-900 tracking-wide">
                        Relaxation Tips
                    </span>
                </div>
                <p className="text-[14px] text-blue-900/90 leading-relaxed font-medium">
                    {block.content}
                </p>
            </div>
        );
    }

    if (block.kind === "spend") {
        return (
            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100/50">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white border border-purple-100 mb-3 shadow-sm">
                    <span className="text-[11px] font-medium text-purple-900 tracking-wide">
                        Estimated Spend as of {block.dateStr || "Today"}
                    </span>
                </div>
                <p className="text-[14px] text-purple-900/90 leading-relaxed">
                    <span className="font-bold">{block.amount}</span> — {block.note}
                </p>
            </div>
        );
    }

    return null;
}
