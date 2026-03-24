"use client";

import { X, Heart, Plus, Upload } from "lucide-react";
import type { PanelAction } from "@/types/panel";
import { cn } from "@/lib/utils";
import { IconButton } from "./PanelElements";

interface PanelTopBarProps {
    title?: string;
    actions?: PanelAction[];
    isAdded?: boolean;
    isSaved?: boolean;
    onClose: () => void;
    onAction?: (action: string, payload?: unknown) => void;
    transparent?: boolean;
}

export default function PanelTopBar({
    title,
    actions = [],
    isAdded = false,
    isSaved = false,
    onClose,
    onAction,
    transparent = false,
}: PanelTopBarProps) {
    const iconMap: Record<string, React.ElementType> = {
        heart: Heart,
        plus: Plus,
        share: Upload, // Map 'share' action to 'Upload' icon matching Image 1
    };

    return (
        <div className={cn(
            "flex items-center justify-between px-6 h-[68px] z-50 transition-all",
            transparent ? "absolute top-0 inset-x-0 bg-transparent border-none" : "sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-100/60"
        )}>
            {/* Left: Close (X) button */}
            <IconButton
                icon={X}
                onClick={onClose}
                aria-label="Close panel"
                className="shadow-sm"
            />

            {/* Center: Title (optional) */}
            {!transparent && title && (
                <div className="flex-1 min-w-0 px-4">
                    <span className="text-[17px] font-bold text-neutral-900 truncate block tracking-tight">
                        {title}
                    </span>
                </div>
            )}
            {transparent && <div className="flex-1" />}

            {/* Right: Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
                {actions.map((action) => {
                    const Icon = iconMap[action.icon || ""] || null;

                    // Special handling for Add To Trip
                    if (action.action === "ADD_TO_TRIP") {
                        return (
                            <IconButton
                                key={action.id}
                                icon={Plus}
                                label={isAdded ? "Added" : "Add to trip"}
                                onClick={() => onAction?.(action.action, action.payload)}
                                className={cn(
                                    "h-[38px] px-5",
                                    isAdded
                                        ? "bg-neutral-900 border-neutral-900"
                                        : "bg-white"
                                )}
                                iconClassName={cn(isAdded ? "text-white" : "text-neutral-900", "w-3.5 h-3.5 mr-0.5")}
                            >
                                {isAdded && <style>{`.text-white { color: white !important; }`}</style>}
                                <span className={cn(isAdded ? "text-white" : "text-neutral-900")}>
                                    {isAdded ? "Added" : "Add to trip"}
                                </span>
                            </IconButton>
                        );
                    }

                    // Special handling for Save (Heart)
                    if (action.action === "TOGGLE_SAVE") {
                        return (
                            <IconButton
                                key={action.id}
                                icon={Heart}
                                onClick={() => onAction?.(action.action, action.payload)}
                                className={cn(
                                    "h-[38px] w-[38px]",
                                    isSaved && "text-rose-500"
                                )}
                                iconClassName={cn(isSaved && "fill-current text-rose-500")}
                            />
                        );
                    }

                    // Generic action button (e.g., Share -> Upload icon)
                    return (
                        <IconButton
                            key={action.id}
                            icon={Icon || Upload}
                            onClick={() => onAction?.(action.action, action.payload)}
                            className="h-[38px] w-[38px]"
                        />
                    );
                })}
            </div>
        </div>
    );
}
