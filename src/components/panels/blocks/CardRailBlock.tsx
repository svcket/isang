import HorizontalCardRail from "@/components/response/HorizontalCardRail";
import type { Item } from "@/types/response-block";

interface CardRailBlockProps {
    title: string;
    items: Item[];
    onCardClick?: (item: Item) => void;
}

export default function CardRailBlock({ title, items }: CardRailBlockProps) {
    return (
        <div className="space-y-2">
            <h4 className="text-[14px] font-semibold text-neutral-900">{title}</h4>
            <HorizontalCardRail items={items} />
        </div>
    );
}
