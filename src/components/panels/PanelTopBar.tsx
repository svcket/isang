"use client";

import { Button } from "@/components/ui/button";
import { X, Heart, Plus, Share2 } from "lucide-react";
import type { PanelAction } from "@/types/panel";
import { cn } from "@/lib/utils";

interface PanelTopBarProps {
    title?: string;
    actions?: PanelAction[];
    isAdded?: boolean;
    isSaved?: boolean;
    onClose: () => void;
    onAction?: (action: string, payload?: unknown) => void;
}

export default function PanelTopBar({
    title,
    actions = [],
    isAdded = false,
    isSaved = false,
    onClose,
    onAction,
}: PanelTopBarProps) {
    const iconMap: Record<string, React.ElementType> = {
        heart: Heart,
        plus: Plus,
        share: Share2,
    };

    return (
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
            {/* Left: Close */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            >
                <X className="w-5 h-5" />
            </Button>

            {/* Center: Title (optional, truncated) */}
            {title && (
                <span className="text-[15px] font-semibold text-neutral-900 truncate max-w-[200px]">
                    {title}
                </span>
            )}

            {/* Right: Action buttons */}
            <div className="flex items-center gap-1">
                {actions.map((action) => {
                    const Icon = iconMap[action.icon || ""] || null;

                    // Special handling for save/add states
                    if (action.action === "TOGGLE_SAVE") {
                        return (
                            <Button
                                key={action.id}
                                variant="ghost"
                                size="icon"
                                onClick={() => onAction?.(action.action, action.payload)}
                                className={cn(
                                    "h-9 w-9 rounded-full",
                                    isSaved
                                        ? "text-rose-500 hover:text-rose-600"
                                        : "text-neutral-500 hover:text-neutral-900"
                                )}
                            >
                                <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                            </Button>
                        );
                    }

                    if (action.action === "ADD_TO_TRIP") {
                        return (
                            <Button
                                key={action.id}
                                variant="outline"
                                size="sm"
                                onClick={() => onAction?.(action.action, action.payload)}
                                className={cn(
                                    "h-9 rounded-full px-3 text-[13px] font-medium border-neutral-200 transition-all",
                                    isAdded
                                        ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800"
                                        : "hover:bg-neutral-50"
                                )}
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                {isAdded ? "Added" : "Add"}
                            </Button>
                        );
                    }

                    // Generic action button
                    return (
                        <Button
                            key={action.id}
                            variant="ghost"
                            size="icon"
                            onClick={() => onAction?.(action.action, action.payload)}
                            className="h-9 w-9 rounded-full text-neutral-500 hover:text-neutral-900"
                        >
                            {Icon ? <Icon className="w-4 h-4" /> : null}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
