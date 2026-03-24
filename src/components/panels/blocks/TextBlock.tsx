"use client";

import { useState } from "react";

interface TextBlockProps {
    content: string;
    maxLines?: number;
    variant?: 'p' | 'h3' | 'h4' | 'breadcrumb';
}

export default function TextBlock({ content, maxLines: _maxLines = 4, variant = 'p' }: TextBlockProps) {
    const [expanded, setExpanded] = useState(false);

    if (variant === 'breadcrumb') {
        return (
            <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 mb-0">
                {content}
            </div>
        );
    }

    if (variant === 'h3') {
        return <h3 className="text-[12px] font-semibold text-neutral-950">{content}</h3>;
    }

    if (variant === 'h4') {
        return <h4 className="text-[11px] font-semibold text-neutral-900 leading-[1.35]">{content}</h4>;
    }

    // Approximate: if content is short enough, no need for clamp
    const isLong = content.length > 200;

    return (
        <div>
            <p
                className={
                    expanded || !isLong
                        ? "text-[14px] leading-[1.65] text-neutral-700 font-medium"
                        : "text-[14px] leading-[1.65] text-neutral-700 font-medium line-clamp-4"
                }
            >
                {content}
            </p>
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full border border-neutral-200 text-[13px] font-semibold text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-[0.98]"
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
}
