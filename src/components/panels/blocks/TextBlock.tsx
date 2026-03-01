"use client";

import { useState } from "react";

interface TextBlockProps {
    content: string;
    maxLines?: number;
}

export default function TextBlock({ content, maxLines: _maxLines = 4 }: TextBlockProps) {
    const [expanded, setExpanded] = useState(false);

    // Approximate: if content is short enough, no need for clamp
    const isLong = content.length > 200;

    return (
        <div>
            <p
                className={
                    expanded || !isLong
                        ? "text-[14px] text-neutral-600 leading-relaxed"
                        : "text-[14px] text-neutral-600 leading-relaxed line-clamp-4"
                }
            >
                {content}
            </p>
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[13px] font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 mt-1"
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
}
