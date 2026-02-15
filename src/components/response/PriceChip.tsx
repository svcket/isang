import { cn } from "@/lib/utils";

interface PriceChipProps {
    text: string;
    className?: string;
    variant?: "default" | "highlight" | "outline";
}

export default function PriceChip({ text, className, variant = "default" }: PriceChipProps) {
    if (!text) return null;

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium tracking-tight",
                variant === "default" && "bg-white/90 text-gray-900 shadow-sm backdrop-blur-sm",
                variant === "highlight" && "bg-emerald-100 text-emerald-800",
                variant === "outline" && "border border-border bg-white text-muted-foreground",
                className
            )}
        >
            {text}
        </span>
    );
}
