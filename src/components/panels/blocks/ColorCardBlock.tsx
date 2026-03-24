"use client";

import React from "react";

interface ColorCardBlockProps {
    items: {
        title: string;
        content?: string;
        items?: string[];
        tone?: 'amber' | 'rose' | 'emerald' | 'lime' | 'sky';
    }[];
}

const toneMap = {
    amber: "bg-amber-50 border-amber-200",
    rose: "bg-rose-50 border-rose-200",
    emerald: "bg-emerald-50 border-emerald-200",
    lime: "bg-lime-50 border-lime-200",
    sky: "bg-sky-50 border-sky-200",
};

export default function ColorCardBlock({ items }: ColorCardBlockProps) {
    return (
        <div className="grid grid-cols-2 gap-2.5">
            {items.map((card) => (
                <div 
                    key={card.title} 
                    className={`rounded-[18px] border p-3 ${toneMap[card.tone || 'amber'] || "bg-neutral-50 border-neutral-200"}`}
                >
                    <div className="text-[11px] font-semibold text-neutral-900 leading-tight">
                        {card.title}
                    </div>
                    <div className="mt-2 space-y-1.5">
                        {card.content && (
                            <p className="text-[10px] leading-[1.55] text-neutral-700">
                                {card.content}
                            </p>
                        )}
                        {card.items?.map((item, idx) => (
                            <p key={idx} className="text-[10px] leading-[1.55] text-neutral-700">
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
