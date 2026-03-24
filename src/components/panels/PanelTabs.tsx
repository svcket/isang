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
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
            <div className="flex overflow-x-auto scrollbar-hide px-6 gap-6 h-12">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={cn(
                            "flex-shrink-0 px-0 py-0 text-[14px] font-semibold transition-all whitespace-nowrap relative flex items-center h-full",
                            activeTab === tab
                                ? "text-neutral-900"
                                : "text-neutral-400 hover:text-neutral-600"
                        )}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
