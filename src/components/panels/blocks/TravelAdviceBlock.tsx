import { Sun, Cloud, Leaf, Snowflake } from "lucide-react";

interface TravelAdviceBlockProps {
    items: { season: string; text: string }[];
}

const seasonIcons: Record<string, React.ElementType> = {
    Spring: Leaf,
    Summer: Sun,
    Fall: Cloud,
    Winter: Snowflake,
};

const seasonColors: Record<string, string> = {
    Spring: "bg-green-50 text-green-700",
    Summer: "bg-amber-50 text-amber-700",
    Fall: "bg-orange-50 text-orange-700",
    Winter: "bg-blue-50 text-blue-700",
};

export default function TravelAdviceBlock({ items }: TravelAdviceBlockProps) {
    return (
        <div className="space-y-2">
            {items.map((item) => {
                const Icon = seasonIcons[item.season] || Sun;
                const colorClass = seasonColors[item.season] || "bg-neutral-50 text-neutral-700";

                return (
                    <div
                        key={item.season}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-50"
                    >
                        <div className={`p-1.5 rounded-md ${colorClass} flex-shrink-0`}>
                            <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[13px] font-semibold text-neutral-900">
                                {item.season}
                            </span>
                            <p className="text-[13px] text-neutral-500 mt-0.5 leading-relaxed">
                                {item.text}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
