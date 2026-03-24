"use client";

import { Clock, Info } from "lucide-react";

interface HotelRulesBlockProps {
    check_in: string;
    check_out: string;
    policies: string[];
}

export default function HotelRulesBlock({ check_in, check_out, policies }: HotelRulesBlockProps) {
    return (
        <div className="space-y-6">
            {/* Check-in/out row */}
            <div className="flex gap-12">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-500">
                        <Clock className="w-4 h-4" />
                        Check-in
                    </div>
                    <div className="text-[20px] font-bold text-neutral-900 leading-tight">
                        {check_in}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-500">
                        <Clock className="w-4 h-4" />
                        Check-out
                    </div>
                    <div className="text-[20px] font-bold text-neutral-900 leading-tight">
                        {check_out}
                    </div>
                </div>
            </div>

            {/* Policies list */}
            {policies.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-500">
                        <Info className="w-4 h-4 text-neutral-400" />
                        Policies
                    </div>
                    <div className="flex flex-col gap-2">
                        {policies.map((policy, i) => (
                            <div key={i} className="flex items-start gap-2 text-[15px] text-neutral-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-2 flex-none" />
                                {policy}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
