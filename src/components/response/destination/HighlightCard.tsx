import type { HighlightItem } from "@/types";
import PhotoStrip from "./PhotoStrip";
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { usePanelStore } from "@/lib/panel-store";
import type { EntityType } from "@/types/panel";

interface HighlightCardProps {
    item: HighlightItem;
    isAdded: boolean;
    onToggleAdd: (id: string) => void;
}

export default function HighlightCard({ item, isAdded, onToggleAdd }: HighlightCardProps) {
    const isGuest = useAppStore((s) => s.isGuest);
    const setShowAuthModal = useAppStore((s) => s.setShowAuthModal);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        if (isGuest) {
            setShowAuthModal(true);
            return;
        }
        action();
    };

    const openPanel = usePanelStore((s) => s.openPanel);

    const handleCardClick = () => {
        openPanel({
            entity_type: (item.entity_type as EntityType) || "PLACE",
            entity_id: item.entity_id || item.id,
            title: item.title.replace(/:$/, ""), // strip trailing colon
        });
    };

    return (
        <div
            className="bg-white rounded-2xl p-0 space-y-3 pb-2 cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Header: Title */}
            <div>
                <h3 className="text-[17px] font-bold text-neutral-900 leading-tight">
                    {item.title}
                </h3>
            </div>

            {/* Description */}
            <p className="text-[15px] text-neutral-600 leading-relaxed">
                {item.description}
            </p>

            {/* Photos */}
            <div className="py-1">
                <PhotoStrip urls={item.photo_urls} title={item.title} />
            </div>

            {/* Link */}
            <div className="pb-2">
                <button className="text-[13px] font-medium text-neutral-700 underline decoration-neutral-400 underline-offset-4 hover:text-black">
                    Photo highlights of {item.title}
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleAction(e, () => onToggleAdd(item.id))}
                    className={cn(
                        "h-9 rounded-full px-4 text-[14px] font-medium border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 transition-all",
                        isAdded && "bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900"
                    )}
                >
                    <Plus className="w-4 h-4 mr-1.5" />
                    {isAdded ? "Added" : "Add to trip"}
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => handleAction(e, () => { })}
                    className="h-9 w-9 rounded-full border-neutral-200 text-neutral-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                >
                    <Heart className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
