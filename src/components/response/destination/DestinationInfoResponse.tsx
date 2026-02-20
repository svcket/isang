import { DestinationBlock, Action } from "@/types";
import DestinationIntroBlock from "./DestinationIntroBlock";
import CostSnapshotBlock from "./CostSnapshotBlock";
import HighlightCard from "./HighlightCard";
import SectionCard from "../SectionCard";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import FilterNudgeRow from "./FilterNudgeRow";
import SuggestionChipsRow, { SuggestionChip } from "./SuggestionChipsRow";

interface DestinationInfoResponseProps {
    blocks: DestinationBlock[];
    ui_hints?: {
        show_filter_nudge: boolean;
        filter_nudge_text?: string;
        focus_filter?: "budget" | "when" | "travelers" | "destination";
    };
    suggestions?: SuggestionChip[];
    onAction?: (actionId: string, payload?: unknown, label?: string) => void;
    selectedHighlights: string[];
    onToggleHighlight: (id: string) => void;
}

export default function DestinationInfoResponse({
    blocks,
    ui_hints,
    suggestions,
    onAction,
    selectedHighlights,
    onToggleHighlight
}: DestinationInfoResponseProps) {

    return (
        <div className="flex flex-col gap-4 w-full animate-in fade-in duration-500 pb-4">
            {blocks.map((block, index) => {
                switch (block.kind) {
                    case "intro":
                        return (
                            <div key={index} className="flex flex-col gap-3">
                                <DestinationIntroBlock text={block.text} />
                                {ui_hints?.show_filter_nudge && (
                                    <FilterNudgeRow
                                        text={ui_hints.filter_nudge_text}
                                        onOpenFilters={() => {
                                            const missing = ui_hints.focus_filter || "budget";
                                            // Action passed up to parent (ResponseShell -> ChatMessages)
                                            onAction?.("focus_filter", { filterParams: missing });
                                        }}
                                    />
                                )}
                            </div>
                        );

                    case "cost_snapshot":
                        return (
                            <CostSnapshotBlock
                                key={index}
                                currency={block.currency}
                                tiers={block.tiers}
                                typicals={block.typicals}
                                actions={block.actions}
                                onAction={(id) => onAction?.(id)}
                            />
                        );

                    case "highlights":
                        return (
                            <SectionCard key={index} title="Highlights" icon={Sparkles}>
                                <div className="flex flex-col gap-6">
                                    {block.items.map((item, i) => (
                                        <div key={item.id} className={i !== block.items.length - 1 ? "pb-6 border-b border-neutral-100" : ""}>
                                            <HighlightCard
                                                item={item}
                                                isAdded={selectedHighlights.includes(item.id)}
                                                onToggleAdd={onToggleHighlight}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        );

                    case "cta_group":
                        return (
                            <div key={index} className="flex flex-col gap-3">
                                <p className="text-[15px] font-medium text-neutral-900">
                                    What should I do for you next?
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={() => onAction?.(block.primary.action_id, block.primary.payload, block.primary.label)}
                                        variant="default"
                                        className="w-full sm:w-auto h-10 rounded-full px-6 text-[14px] font-medium bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm justify-start sm:justify-center"
                                    >
                                        {block.primary.label}
                                    </Button>

                                    {block.secondary && (
                                        <Button
                                            onClick={() => onAction?.(block.secondary!.action_id, block.secondary!.payload, block.secondary!.label)}
                                            variant="outline"
                                            className="w-full sm:w-auto h-10 rounded-full px-6 text-[14px] font-medium border-neutral-200 text-neutral-900 bg-background hover:bg-neutral-50 shadow-sm justify-start sm:justify-center"
                                        >
                                            {block.secondary.label}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );

                    default:
                        return null;
                }
            })}

            {suggestions && suggestions.length > 0 && (
                <SuggestionChipsRow
                    suggestions={suggestions}
                    onAction={(action, payload, label) => {
                        onAction?.(action, payload, label);
                    }}
                />
            )}
        </div>
    );
}
