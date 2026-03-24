import HorizontalCardRail from "@/components/response/HorizontalCardRail";
import type { Item } from "@/types/response-block";

import ItemCard from "@/components/response/ItemCard";
import GridItemCard from "@/components/response/GridItemCard";

interface CardRailBlockProps {
    title: string;
    items: Item[];
    onCardClick?: (item: Item) => void;
    layout?: 'rail' | 'grid';
}

export default function CardRailBlock({ title, items, layout = 'rail' }: CardRailBlockProps) {
    if (layout === 'grid') {
        return (
            <div className="space-y-4">
                {title && <h4 className="text-[18px] font-bold text-neutral-900 tracking-tight">{title}</h4>}
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                    {items.map((item) => (
                        <GridItemCard key={item.id} item={item} />
                    ))}
                </div>
                {items.length >= 4 && (
                    <div className="flex justify-center mt-6">
                        <button className="px-5 py-2.5 rounded-full border border-neutral-200 text-sm font-semibold hover:bg-neutral-50 transition-colors">
                            Show more
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {title && <h4 className="text-[18px] font-bold text-neutral-900 tracking-tight">{title}</h4>}
            <HorizontalCardRail items={items} />
        </div>
    );
}
