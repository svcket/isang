"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterNudgeBannerProps {
    text: string;
    focusFilter?: "budget" | "when" | "travelers" | "destination";
    onRefresh?: () => void;
    onFocusFilter?: (filter: string) => void;
}

export default function FilterNudgeBanner({
    text,
    focusFilter,
    onRefresh,
    onFocusFilter,
}: FilterNudgeBannerProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="flex-1 text-amber-800">{text}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
                {focusFilter && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFocusFilter?.(focusFilter)}
                        className="h-7 px-2.5 text-xs font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                    >
                        Open filters
                    </Button>
                )}
                {onRefresh && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="h-7 px-2.5 text-xs font-medium border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Refresh
                    </Button>
                )}
            </div>
        </div>
    );
}
