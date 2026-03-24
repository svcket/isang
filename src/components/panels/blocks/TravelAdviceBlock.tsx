import React from "react";

interface TravelAdviceBlockProps {
    items: { day?: string; title: string; description: string }[];
}

export default function TravelAdviceBlock({ items }: TravelAdviceBlockProps) {
    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="flex flex-col gap-1 p-4 rounded-xl bg-neutral-50 border border-neutral-100/50"
                >
                    <div className="flex items-center gap-2">
                        {item.day && (
                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                                {item.day}
                            </span>
                        )}
                        <h5 className="text-[14px] font-bold text-neutral-900">
                            {item.title}
                        </h5>
                    </div>
                    <p className="text-[14px] text-neutral-500 leading-relaxed font-medium">
                        {item.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
