import { Utensils } from "lucide-react";
import SectionCard from "../SectionCard";
import ItemCard from "../ItemCard";
import SourceRow from "../SourceRow";
import type { Item } from "@/types";

interface FoodSectionProps {
    items: Item[];
    sources?: string[];
    onSelect?: (id: string) => void;
}

export default function FoodSection({ items, sources, onSelect }: FoodSectionProps) {
    return (
        <SectionCard title="Food & Restaurants" icon={Utensils}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onAdd={onSelect}
                    />
                ))}
            </div>
            {sources && sources.length > 0 && <SourceRow sources={sources} />}
        </SectionCard>
    );
}
