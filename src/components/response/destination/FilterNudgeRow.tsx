import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface FilterNudgeRowProps {
    text?: string;
    onOpenFilters: () => void;
}

export default function FilterNudgeRow({
    text = "Set your dates, travelers, and budget up top to get accurate costs.",
    onOpenFilters
}: FilterNudgeRowProps) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-neutral-50/80 border border-neutral-100 rounded-2xl md:rounded-full">
            <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[#FF4405] shrink-0" />
                <span className="text-[13px] text-neutral-600 font-medium leading-snug">
                    {text}
                </span>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={onOpenFilters}
                className="h-8 text-xs rounded-full whitespace-nowrap border-neutral-200 text-neutral-700 hover:text-neutral-900 bg-white shadow-sm shrink-0"
            >
                Open filters
            </Button>
        </div>
    );
}
