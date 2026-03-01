"use client";

import { cn } from "@/lib/utils";

interface PanelTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function PanelTabs({ tabs, activeTab, onTabChange }: PanelTabsProps) {
    if (tabs.length <= 1) return null;

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-100">
            <div className="flex overflow-x-auto scrollbar-hide px-4 gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={cn(
                            "flex-shrink-0 px-3 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap",
                            "border-b-2 -mb-px",
                            activeTab === tab
                                ? "border-neutral-900 text-neutral-900"
                                : "border-transparent text-neutral-400 hover:text-neutral-600"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
