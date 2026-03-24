"use client";

import React from "react";

interface VisitPeriodBlockProps {
    items: {
        season: string;
        text: string;
        color: 'green' | 'amber' | 'orange' | 'sky';
    }[];
}

const seasonBulletColor = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    orange: "bg-orange-500",
    sky: "bg-sky-500",
};

export default function VisitPeriodBlock({ items }: VisitPeriodBlockProps) {
    return (
        <div className="space-y-3 mt-2">
            {items.map((period) => (
                <div key={period.season} className="flex items-start gap-2.5">
                    <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${seasonBulletColor[period.color]}`} />
                    <div>
                        <div className="text-[11px] font-semibold text-neutral-900">{period.season}</div>
                        <div className="mt-0.5 text-[10px] leading-[1.55] text-neutral-600">{period.text}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
