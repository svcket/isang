"use client";

import type { PanelBlock } from "@/types/panel";
import TextBlock from "./blocks/TextBlock";
import InfoGridBlock from "./blocks/InfoGridBlock";
import ProsConsBlock from "./blocks/ProsConsBlock";
import TravelAdviceBlock from "./blocks/TravelAdviceBlock";
import QAListBlock from "./blocks/QAListBlock";
import CardRailBlock from "./blocks/CardRailBlock";

interface PanelBlockRendererProps {
    blocks: PanelBlock[];
    onAskQuestion?: (question: string) => void;
}

export default function PanelBlockRenderer({ blocks, onAskQuestion }: PanelBlockRendererProps) {
    return (
        <div className="space-y-5">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "text":
                        return <TextBlock key={i} content={block.content} />;

                    case "info_grid":
                        return <InfoGridBlock key={i} items={block.items} />;

                    case "pros_cons":
                        return <ProsConsBlock key={i} pros={block.pros} cons={block.cons} />;

                    case "travel_advice":
                        return <TravelAdviceBlock key={i} items={block.items} />;

                    case "qa_list":
                        return <QAListBlock key={i} items={block.items} onAsk={onAskQuestion} />;

                    case "rail":
                        return <CardRailBlock key={i} title={block.title} items={block.items} />;

                    default:
                        return null;
                }
            })}
        </div>
    );
}
