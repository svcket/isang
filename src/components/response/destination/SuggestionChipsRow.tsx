import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export interface SuggestionChip {
    label: string;
    action: "send" | "focus_filter";
    payload?: unknown;
}

interface SuggestionChipsRowProps {
    text?: string;
    suggestions: SuggestionChip[];
    onAction: (action: "send" | "focus_filter", payload?: unknown, label?: string) => void;
}

export default function SuggestionChipsRow({
    text = "Want this tailored? Set your budget and dates in the top filter.",
    suggestions,
    onAction
}: SuggestionChipsRowProps) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FF4405] opacity-80" />
                <span className="text-[14px] font-medium text-neutral-600">
                    {text}
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((chip, idx) => (
                    <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => onAction(chip.action, chip.payload, chip.label)}
                        className="rounded-full text-[13px] font-medium border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:text-neutral-900 shadow-sm"
                    >
                        {chip.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
