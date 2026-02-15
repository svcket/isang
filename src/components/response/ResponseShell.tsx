import { ResponseBlock } from "@/types";
import SectionCard from "./SectionCard";
import TripSummaryHeader from "./TripSummaryHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResponseShellProps {
    data: ResponseBlock;
    onItemAdd?: (id: string) => void;
    onAction?: (actionId: string, payload?: any) => void;
    className?: string;
}

export default function ResponseShell({ data, onItemAdd, onAction, className }: ResponseShellProps) {
    return (
        <div className={cn("w-full space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white p-5 rounded-2xl border border-neutral-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]", className)}>

            {/* 1. Trip Meta Header (if available) */}
            {data.trip_meta && <TripSummaryHeader meta={data.trip_meta} />}

            {/* 2. Summary Text */}
            {data.summary && (
                <p className="text-[15px] leading-relaxed text-gray-800">
                    {data.summary}
                </p>
            )}

            {/* 3. Sections */}
            <div className="space-y-6">
                {data.sections.map((section) => (
                    <SectionCard
                        key={section.id}
                        section={section}
                        onItemAdd={onItemAdd}
                    />
                ))}
            </div>

            {/* 4. Global Actions */}
            {data.actions && data.actions.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-2">
                    {data.actions.map((action) => (
                        <Button
                            key={action.action_id}
                            onClick={() => onAction?.(action.action_id, action.payload)}
                            variant={action.style === 'PRIMARY' ? 'default' : 'outline'}
                            className={cn(
                                "w-full sm:w-auto",
                                action.style === 'PRIMARY' && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
                                action.style === 'SECONDARY' && "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
