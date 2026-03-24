"use client";

import type { PanelBlock } from "@/types/panel";
import TextBlock from "./blocks/TextBlock";
import InfoGridBlock from "./blocks/InfoGridBlock";
import ProsConsBlock from "./blocks/ProsConsBlock";
import TravelAdviceBlock from "./blocks/TravelAdviceBlock";
import QAListBlock from "./blocks/QAListBlock";
import CardRailBlock from "./blocks/CardRailBlock";
import RoomSelectionBlock from "./blocks/RoomSelectionBlock";
import ColorCardBlock from "./blocks/ColorCardBlock";
import BookingCardBlock from "./blocks/BookingCardBlock";
import VisitPeriodBlock from "./blocks/VisitPeriodBlock";
import BusinessInfoBlock from "./blocks/BusinessInfoBlock";
import HotelRulesBlock from "./blocks/HotelRulesBlock";

interface PanelBlockRendererProps {
    blocks: PanelBlock[];
    onAskQuestion?: (question: string) => void;
}

export default function PanelBlockRenderer({ blocks, onAskQuestion }: PanelBlockRendererProps) {
    return (
        <div className="space-y-4">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "text":
                        return <TextBlock key={i} content={block.content} variant={block.variant} />;

                    case "info_grid":
                        return <InfoGridBlock key={i} items={block.items} />;

                    case "hotel_rules":
                        return <HotelRulesBlock key={i} check_in={block.check_in} check_out={block.check_out} policies={block.policies} />;

                    case "pros_cons":
                        return <ProsConsBlock key={i} pros={block.pros} cons={block.cons} />;

                    case "travel_advice":
                        return <TravelAdviceBlock key={i} items={block.items} />;

                    case "qa_list":
                        return <QAListBlock key={i} items={block.items} onAsk={onAskQuestion} />;

                    case "rail":
                        return <CardRailBlock key={i} title={block.title || ""} items={block.items} layout={block.layout} />;

                    case "room_selection":
                        return <RoomSelectionBlock key={i} title={block.title || ""} rooms={block.rooms} layout={block.layout} />;

                    case "color_cards":
                        return <ColorCardBlock key={i} items={block.items} />;

                    case "visit_period":
                        return <VisitPeriodBlock key={i} items={block.items || []} />;

                    case "booking_card":
                        return <BookingCardBlock key={i} date={block.date} travellers={block.travellers} button_label={block.button_label} />;

                    case "business_info":
                        return <BusinessInfoBlock key={i} mode={block.mode || 'vertical'} address={block.address} website={block.website} phone={block.phone} hours={block.hours} />;

                    default:
                        return null;
                }
            })}
        </div>
    );
}
