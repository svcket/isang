import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToTripButtonProps {
    isAdded: boolean;
    onToggle: () => void;
}

export default function AddToTripButton({ isAdded, onToggle }: AddToTripButtonProps) {
    return (
        <Button
            variant={isAdded ? "secondary" : "outline"}
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            className={cn(
                "gap-1.5 transition-all",
                isAdded
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent"
                    : "text-primary border-primary/20 hover:bg-primary/5 hover:text-primary"
            )}
        >
            {isAdded ? (
                <>
                    <Check className="w-4 h-4" />
                    Added
                </>
            ) : (
                <>
                    <Plus className="w-4 h-4" />
                    Add to trip
                </>
            )}
        </Button>
    );
}
