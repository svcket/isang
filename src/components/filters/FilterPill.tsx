import * as React from "react"
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterPillProps {
    id: "destination" | "dates" | "travelers" | "budget";
    label: string;
    isActive: boolean;
    hasValue: boolean;
    onClick: () => void;
}

export function FilterPill({ id, label, isActive, hasValue, onClick }: FilterPillProps) {
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className={cn(
                "h-8 rounded-full px-3 text-[14px] transition-all",
                hasValue ? "font-semibold text-neutral-900" : "font-medium text-neutral-600",
                isActive ? "bg-neutral-100 ring-1 ring-neutral-200" : "hover:bg-neutral-100"
            )}
        >
            {label}
        </Button>
    )
}
