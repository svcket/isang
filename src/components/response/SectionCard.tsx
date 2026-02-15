import { Section } from "@/types";
import HorizontalCardRail from "./HorizontalCardRail";
import FlightCard from "./FlightCard";
import SourceRow from "./SourceRow";
import { Plane, Bed, Utensils, MapPin, Sparkles } from "lucide-react";

interface SectionCardProps {
    section: Section;
    onItemAdd?: (id: string) => void;
}

export default function SectionCard({ section, onItemAdd }: SectionCardProps) {
    const Icon = getIconForType(section.type);

    const isFlight = section.type === 'FLIGHT';

    return (
        <div className="py-4 first:pt-0 border-b border-border/40 last:border-0">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="p-1.5 rounded-md bg-gray-50 text-gray-500">
                    <Icon className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                    {section.title}
                </h2>
            </div>

            {/* Content: Vertical Stack for Flights, Rail for others */}
            {isFlight ? (
                <div className="flex gap-3 overflow-x-auto px-1 pb-4 -mx-1 snap-x scrollbar-hide">
                    {section.items.map(item => (
                        <FlightCard key={item.id} item={item} onAdd={onItemAdd} />
                    ))}
                    <div className="w-1 flex-shrink-0" />
                </div>
            ) : (
                <HorizontalCardRail items={section.items} onItemAdd={onItemAdd} />
            )}

            {/* Footer: Sources */}
            {section.sources && <SourceRow sources={section.sources} />}
        </div>
    );
}

function getIconForType(type: Section['type']) {
    switch (type) {
        case 'FLIGHT': return Plane;
        case 'LODGING': return Bed;
        case 'FOOD': return Utensils;
        case 'ACTIVITY': return MapPin;
        case 'HIGHLIGHT': return Sparkles;
        default: return MapPin;
    }
}
