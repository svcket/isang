import type { Section } from "@/types";
import HorizontalCardRail from "./HorizontalCardRail";
import FlightCard from "./FlightCard";
import SourceRow from "./SourceRow";
import { Plane, Bed, Utensils, MapPin, Sparkles } from "lucide-react";

interface SectionCardProps {
    // Legacy / Smart Mode
    section?: Section;
    onItemAdd?: (id: string) => void;

    // Generic Mode
    title?: string;
    icon?: React.ElementType;
    children?: React.ReactNode;
}

export default function SectionCard({ section, onItemAdd, title, icon, children }: SectionCardProps) {
    if (children) {
        // Generic Mode
        const Icon = icon || (section ? getIconForType(section.type) : MapPin);
        const displayTitle = title || section?.title || "Section";

        return (
            <div className="flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200">
                    <div className="p-1.5 rounded-md bg-gray-50 text-gray-500">
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                        {displayTitle}
                    </h2>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        );
    }

    if (!section) return null;

    // Legacy Mode
    const isFlight = section.type === 'FLIGHT';
    const Icon = getIconForType(section.type);

    return (
        <div className="flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200">
                <div className="p-1.5 rounded-md bg-gray-50 text-gray-500">
                    {/* eslint-disable-next-line react-hooks/static-components */}
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
