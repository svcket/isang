import { MapPin } from "lucide-react";
import SectionCard from "../SectionCard";
import ItemCard from "../ItemCard";
import SourceRow from "../SourceRow";
import type { Item } from "@/types";

interface ActivitySectionProps {
    items: Item[];
    sources?: string[];
    onSelect?: (id: string) => void;
}

export default function ActivitySection({ items, sources, onSelect }: ActivitySectionProps) {
    return (
        <SectionCard title="Things To Do" icon={MapPin}>
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
