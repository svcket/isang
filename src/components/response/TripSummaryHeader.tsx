import type { ResponseBlock } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TripSummaryHeaderProps {
    meta: NonNullable<ResponseBlock['trip_meta']>;
}

export default function TripSummaryHeader({ meta }: TripSummaryHeaderProps) {
    return (
        <div className="flex justify-center">
            <div className="inline-flex items-center bg-white border border-neutral-200 rounded-full px-1 py-1 shadow-sm gap-1">
                {/* Destination */}
                <Button
                    variant="ghost"
                    className={`h-8 rounded-full px-3 text-[15px] font-semibold hover:bg-neutral-100 ${meta.destination ? "text-neutral-900" : "text-neutral-600"}`}
                >
                    {meta.destination || "Where"}
                </Button>

                <div className="h-4 w-[1px] bg-neutral-200" />

                {/* Dates */}
                <Button
                    variant="ghost"
                    className={`h-8 rounded-full px-3 text-[14px] font-medium hover:bg-neutral-100 ${meta.dates || meta.startDate ? "text-neutral-900" : "text-neutral-600"}`}
                >
                    {meta.dates || meta.startDate || "When"}
                </Button>

                <div className="h-4 w-[1px] bg-neutral-200" />

                {/* Travelers */}
                <Button
                    variant="ghost"
                    className={`h-8 rounded-full px-3 text-[14px] font-medium hover:bg-neutral-100 ${meta.travelers ? "text-neutral-900" : "text-neutral-600"}`}
                >
                    {meta.travelers || "Travelers"}
                </Button>

                <div className="h-4 w-[1px] bg-neutral-200" />

                {/* Budget */}
                <Button
                    variant="ghost"
                    className={`h-8 rounded-full px-3 text-[14px] font-medium hover:bg-neutral-100 ${meta.budget_est ? "text-neutral-900" : "text-neutral-600"}`}
                >
                    {meta.budget_est || "Budget"}
                </Button>
            </div>
        </div>
    );
}
