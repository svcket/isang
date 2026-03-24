"use client";

import React, { type ReactNode } from "react";
import { usePanelStore } from "@/lib/panel-store";

interface EntityTextProps {
    content: string;
}

// A comprehensive dictionary of supported mock entities for testing
const COUNTRY_ENTITIES = new Set([
    "nigeria", "ethiopia", "japan", "france", "italy", "spain", "usa", "united states", 
    "uk", "united kingdom", "brazil", "kenya", "south africa", "morocco", "egypt", 
    "greece", "thailand", "vietnam", "korea", "west africa"
]);

const PLACE_ENTITIES = new Set([
    "lagos", "addis ababa", "tokyo", "paris", "rome", "madrid", "new york", "london",
    "rio de janeiro", "nairobi", "cape town", "marrakech", "cairo", "athens", "bangkok", 
    "hanoi", "seoul", "barcelona"
]);

const ALL_ENTITIES = [...Array.from(COUNTRY_ENTITIES), ...Array.from(PLACE_ENTITIES)];
const escapedEntities = ALL_ENTITIES.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
// Match entities safely on word boundaries
const entityRegex = new RegExp(`\\b(${escapedEntities.join('|')})\\b`, 'gi');

export default function EntityText({ content }: EntityTextProps) {
    const openPanel = usePanelStore((s) => s.openPanel);

    if (!content) return null;

    // Split text by markdown bold `**...**`
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts = content.split(boldRegex);

    const renderTextNode = (text: string, isBoldContext: boolean, keyPrefix: number): ReactNode => {
        if (!text) return null;

        // If the text is explicitly bolded, check if the WHOLE text is an entity
        const lowerText = text.toLowerCase();
        const isCountry = COUNTRY_ENTITIES.has(lowerText);
        const isPlace = PLACE_ENTITIES.has(lowerText);

        if (isCountry || isPlace) {
            return (
                <span
                    key={`${keyPrefix}-entity-full`}
                    className="font-bold text-neutral-900 cursor-pointer hover:text-[#FF4405] transition-colors underline decoration-neutral-200 underline-offset-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        openPanel({
                            entity_type: isCountry ? "DESTINATION" : "PLACE",
                            entity_id: lowerText.replace(/\s+/g, '-'),
                            title: text,
                        });
                    }}
                >
                    {text}
                </span>
            );
        }

        // If it was bolded via markdown but isn't an entity, render as bold
        if (isBoldContext) {
            return <span key={`${keyPrefix}-bold-plain`} className="font-bold text-neutral-900">{text}</span>;
        }

        // Otherwise (plain text), scan inside it for entity occurrences just in case the LLM didn't bold them
        const plainParts = text.split(entityRegex);
        return plainParts.map((part, index) => {
            const partLower = part.toLowerCase();
            const partIsCountry = COUNTRY_ENTITIES.has(partLower);
            const partIsPlace = PLACE_ENTITIES.has(partLower);

            if (partIsCountry || partIsPlace) {
                return (
                    <span
                        key={`${keyPrefix}-entity-part-${index}`}
                        className="font-bold text-neutral-900 cursor-pointer hover:text-[#FF4405] transition-colors underline decoration-neutral-200 underline-offset-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            openPanel({
                                entity_type: partIsCountry ? "DESTINATION" : "PLACE",
                                entity_id: partLower.replace(/\s+/g, '-'),
                                title: part,
                            });
                        }}
                    >
                        {part}
                    </span>
                );
            }
            return <span key={`${keyPrefix}-plain-${index}`}>{part}</span>;
        });
    };

    return (
        <p className="whitespace-pre-wrap">
            {parts.map((part, i) => {
                // `content.split(boldRegex)` matches result in: [plain, match, plain, match, ...]
                // Even indices are plain text, odd indices are the matched content inside `**`
                const isExplicitlyBold = i % 2 !== 0;
                return renderTextNode(part, isExplicitlyBold, i);
            })}
        </p>
    );
}
