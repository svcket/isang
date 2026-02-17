import { Plane } from "lucide-react";
import SectionCard from "../SectionCard";
import FlightCard from "../FlightCard";
import SourceRow from "../SourceRow";

export type FlightItem = {
    id: string;
    airlineName: string;
    fromCity: string;
    toCity: string;
    priceText: string;      // "$319"
    priceSuffix?: string;   // "+VAT"
    tripTypeText: string;   // "Round trip"
    stopsText?: string;     // "2 stops" (optional)
    logoSrc?: string;       // optional
}

interface FlightsSectionProps {
    items: FlightItem[];
    sources?: string[];
    onSelect?: (id: string) => void;
}

export default function FlightsSection({ items, sources, onSelect }: FlightsSectionProps) {
    return (
        <SectionCard title="Flights" icon={Plane}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {items.map((item) => (
                    <FlightCard
                        key={item.id}
                        id={item.id}
                        airlineName={item.airlineName}
                        fromCity={item.fromCity}
                        toCity={item.toCity}
                        priceText={item.priceText}
                        priceSuffix={item.priceSuffix}
                        tripTypeText={item.tripTypeText}
                        stopsText={item.stopsText}
                        logoSrc={item.logoSrc}
                        onAdd={onSelect}
                    />
                ))}
            </div>
            {sources && sources.length > 0 && <SourceRow sources={sources} />}
        </SectionCard>
    );
}
