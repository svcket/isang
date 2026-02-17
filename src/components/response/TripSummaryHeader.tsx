import type { ResponseBlock } from "@/types";


interface TripSummaryHeaderProps {
    meta: NonNullable<ResponseBlock['trip_meta']>;
}

export default function TripSummaryHeader({ meta }: TripSummaryHeaderProps) {
    return (
        <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-lg">
                {meta.destination}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-neutral-500 lowercase">

                {(meta.duration || meta.startDate) && (
                    <span>
                        {meta.startDate ? `${meta.startDate}` : ''}
                        {meta.startDate && meta.duration ? ' • ' : ''}
                        {meta.duration}
                    </span>
                )}

                {meta.budget_est && (
                    <>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>{meta.budget_est}</span>
                    </>
                )}
            </div>
            <div className="flex items-center gap-2 text-[19px] font-medium text-neutral-600">
                <span>{meta.dates}</span>
                <span>•</span>
                <span>{meta.travelers}</span>
            </div>
        </div>
    );
}
