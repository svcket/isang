"use client";

import React from "react";

interface ProsConsBlockProps {
    pros: { title: string; description: string }[];
    cons: { title: string; description: string }[];
}

export default function ProsConsBlock({ pros, cons }: ProsConsBlockProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* Pros Card */}
            <div className="bg-[#F1F9F1] border border-[#D1EAD1] rounded-[24px] p-6 space-y-6">
                <div className="flex items-center gap-2.5 text-[14px] font-bold text-neutral-900 tracking-tight">
                    <span className="text-[16px]">👍</span>
                    <span className="uppercase tracking-wide">PROS</span>
                </div>
                <div className="space-y-5">
                    {pros.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="text-[14px] font-bold text-neutral-950">
                                {item.title}
                            </div>
                            <div className="text-[13px] leading-[1.6] text-neutral-500 font-medium">
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cons Card */}
            <div className="bg-[#FFF1F1] border border-[#FAD1D1] rounded-[24px] p-6 space-y-6">
                <div className="flex items-center gap-2.5 text-[14px] font-bold text-neutral-900 tracking-tight">
                    <span className="text-[16px]">👎</span>
                    <span className="uppercase tracking-wide">CONS</span>
                </div>
                <div className="space-y-5">
                    {cons.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="text-[14px] font-bold text-neutral-950">
                                {item.title}
                            </div>
                            <div className="text-[13px] leading-[1.6] text-neutral-500 font-medium">
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
