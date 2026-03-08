"use client";

import { useEffect } from "react";
import { usePanelStore, panelCacheKey } from "@/lib/panel-store";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import SidePanelShell from "./SidePanelShell";
import PanelTopBar from "./PanelTopBar";
import PanelHero from "./PanelHero";
import PanelTabs from "./PanelTabs";
import PanelBlockRenderer from "./PanelBlockRenderer";
import PhotoGalleryModal from "./PhotoGalleryModal";
import { getMockPanelData } from "@/lib/mock-panel-data";
import type { PanelAction } from "@/types/panel";

export default function DetailPanel() {
    const open = usePanelStore((s) => s.open);
    const selected = usePanelStore((s) => s.selected);
    const panelData = usePanelStore((s) => s.panelData);
    const loading = usePanelStore((s) => s.loading);
    const activeTab = usePanelStore((s) => s.activeTab);
    const closePanel = usePanelStore((s) => s.closePanel);
    const hydratePanel = usePanelStore((s) => s.hydratePanel);
    const setActiveTab = usePanelStore((s) => s.setActiveTab);
    const openGallery = usePanelStore((s) => s.openGallery);
    const galleryOpen = usePanelStore((s) => s.galleryOpen);
    const galleryIndex = usePanelStore((s) => s.galleryIndex);
    const closeGallery = usePanelStore((s) => s.closeGallery);

    // App-level state for add/save toggles
    const selectedItems = useAppStore((s) => s.selectedItems);
    const toggleItem = useAppStore((s) => s.toggleItem);

    // ─── Data hydration ────────────────────────────────────────────────
    useEffect(() => {
        if (!selected) return;

        const key = panelCacheKey(selected.entity_type, selected.entity_id);

        // Check cache first
        if (panelData[key]) {
            usePanelStore.setState({
                loading: false,
                activeTab: panelData[key].tabs[0] || "",
            });
            return;
        }

        // Load mock data (Phase 1)
        const mockData = getMockPanelData(selected.entity_type, selected.entity_id, selected.title);
        if (mockData) {
            hydratePanel(key, mockData);
        } else {
            usePanelStore.setState({ loading: false, error: "No data available" });
        }
    }, [selected, panelData, hydratePanel]);

    // ─── Derive current payload ────────────────────────────────────────
    const currentKey = selected
        ? panelCacheKey(selected.entity_type, selected.entity_id)
        : "";
    const payload = panelData[currentKey] || null;

    const isAdded = selected ? selectedItems.includes(selected.entity_id) : false;

    // ─── Conditional column layout ─────────────────────────────────────
    const hasRightColumn = payload?.panel_type === "HOTEL" || payload?.panel_type === "RESTAURANT" || payload?.panel_type === "ACTIVITY";

    // ─── Active section (tab-based filtering) ──────────────────────────
    const activeSection = payload?.sections.find(
        (s) => s.title.toLowerCase() === activeTab.toLowerCase()
    ) || payload?.sections[0] || null;

    // ─── Action handler ────────────────────────────────────────────────
    const handleAction = (action: string, actionPayload?: unknown) => {
        if (!selected) return;

        switch (action) {
            case "ADD_TO_TRIP":
                toggleItem(selected.entity_id);
                break;
            case "TOGGLE_SAVE":
                console.log("Save toggled for", selected.entity_id);
                break;
            case "SHARE":
                console.log("Share", selected.entity_id);
                break;
            case "OPEN_GALLERY":
                openGallery(0);
                break;
            case "OPEN_LINK":
                if (typeof actionPayload === "string") {
                    window.open(actionPayload, "_blank");
                }
                break;
            default:
                console.log("Panel action:", action, actionPayload);
        }
    };

    // ─── QA handler (inject into chat) ─────────────────────────────────
    const handleAskQuestion = (question: string) => {
        // Close panel, then simulate a chat message
        closePanel();
        // Add user message to chat
        const addMessage = useAppStore.getState().addMessage;
        addMessage({
            id: `q-${Date.now()}`,
            role: "user",
            content: question,
            timestamp: new Date(),
        });
    };

    return (
        <>
            <SidePanelShell open={open} onClose={closePanel}>
                {/* Top Bar */}
                <PanelTopBar
                    // title={loading ? "Loading..." : undefined} // Removed to place title in the body
                    actions={payload?.actions || defaultActions}
                    isAdded={isAdded}
                    isSaved={false}
                    onClose={closePanel}
                    onAction={handleAction}
                />

                {/* Header (Title, Rating, Location) placed above the Media */}
                {!loading && payload && (
                    <div className="px-6 pt-5 pb-4">
                        <h1 className="text-2xl sm:text-[26px] leading-[1.1] font-bold text-neutral-900 tracking-tight">
                            {payload.header.title}
                        </h1>
                        {/* Rating + Tags Row */}
                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                            {payload.header.rating && (
                                <span className="text-[14px] font-medium text-neutral-900 flex items-center">
                                    <span className="text-neutral-700 mr-1">★</span> {payload.header.rating}
                                    {payload.header.reviews_count && (
                                        <span className="text-neutral-500 font-normal ml-1">
                                            · {(payload.header.reviews_count / 1000).toFixed(1)}k reviews
                                        </span>
                                    )}
                                </span>
                            )}
                            {(payload.header.subtitle || payload.header.tags) && (
                                <span className="text-neutral-300 mx-1">·</span>
                            )}
                            {payload.header.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[14px] text-neutral-500"
                                >
                                    {tag}
                                </span>
                            ))}
                            {payload.header.subtitle && (
                                <span className="text-[14px] text-neutral-500">
                                    · {payload.header.subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Hero / Media Gallery */}
                {payload && (
                    <div className="px-6 mb-4">
                        <PanelHero
                            images={payload.hero.images}
                            layout={payload.hero.layout}
                            title={payload.header.title}
                            onOpenGallery={() => openGallery(0)}
                        />
                    </div>
                )}

                {/* Content area */}
                <div className="flex flex-col">
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
                        </div>
                    )}

                    {!loading && !payload && (
                        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
                            <p className="text-sm">No details available</p>
                        </div>
                    )}

                    {!loading && payload && (
                        <>
                            {/* Header was here, moved above hero */}

                            {/* Tabs */}
                            <PanelTabs
                                tabs={payload.tabs}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />

                            {/* Blocks for active section */}
                            <div className={cn(
                                "px-6 py-6 pb-24",
                                hasRightColumn ? "md:grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-8" : "max-w-3xl"
                            )}>
                                <div className="min-w-0">
                                    {activeSection && (
                                        <PanelBlockRenderer
                                            blocks={activeSection.blocks}
                                            onAskQuestion={handleAskQuestion}
                                        />
                                    )}
                                </div>

                                {/* Right Column sticky action card */}
                                {hasRightColumn && (
                                    <div className="hidden md:block">
                                        <div className="sticky top-24 border border-neutral-200 rounded-2xl p-6 shadow-sm bg-white">
                                            {payload.panel_type === "HOTEL" && (
                                                <>
                                                    <div className="flex items-end justify-between mb-5">
                                                        <div className="text-2xl font-bold leading-none tracking-tight">
                                                            $297 <span className="text-[15px] font-normal text-neutral-500">per night</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 rounded-xl overflow-hidden mb-5 border border-neutral-200 shadow-sm divide-x divide-y divide-neutral-200">
                                                        <div className="p-3 bg-white">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Check in</div>
                                                            <div className="text-[15px] font-medium">May 22</div>
                                                        </div>
                                                        <div className="p-3 bg-white">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Check out</div>
                                                            <div className="text-[15px] font-medium">May 26</div>
                                                        </div>
                                                        <div className="col-span-2 p-3 bg-white border-t border-neutral-200">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Travelers</div>
                                                            <div className="text-[15px] font-medium">1 adult, 0 children</div>
                                                        </div>
                                                    </div>
                                                    <button className="w-full bg-[#FF4405] text-white rounded-xl py-3.5 text-[15px] font-bold hover:bg-[#e63d05] transition-colors shadow-sm">
                                                        Check availability
                                                    </button>
                                                </>
                                            )}
                                            {payload.panel_type === "RESTAURANT" && (
                                                <>
                                                    <div className="flex items-end justify-between mb-5">
                                                        <div className="text-xl font-bold leading-none tracking-tight text-neutral-900">
                                                            Make a reservation
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4 mb-5">
                                                        <div className="border border-neutral-200 rounded-xl p-3 shadow-sm bg-white">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Date & Time</div>
                                                            <div className="text-[15px] font-medium">Sat, May 24 at 7:30 PM</div>
                                                        </div>
                                                        <div className="border border-neutral-200 rounded-xl p-3 shadow-sm bg-white">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Guests</div>
                                                            <div className="text-[15px] font-medium">2 People</div>
                                                        </div>
                                                    </div>
                                                    <button className="w-full bg-[#FF4405] text-white rounded-xl py-3.5 text-[15px] font-bold hover:bg-[#e63d05] transition-colors shadow-sm">
                                                        Find a table
                                                    </button>
                                                </>
                                            )}
                                            {payload.panel_type === "ACTIVITY" && (
                                                <>
                                                    <div className="flex items-end justify-between mb-5">
                                                        <div className="text-2xl font-bold leading-none tracking-tight text-neutral-900">
                                                            From $45 <span className="text-[15px] font-normal text-neutral-500">per person</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4 mb-5">
                                                        <div className="border border-neutral-200 rounded-xl p-3 shadow-sm bg-white">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Select Date</div>
                                                            <div className="text-[15px] font-medium">May 23</div>
                                                        </div>
                                                        <div className="border border-neutral-200 rounded-xl p-3 shadow-sm bg-white">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">Participants</div>
                                                            <div className="text-[15px] font-medium">2 Adults</div>
                                                        </div>
                                                    </div>
                                                    <button className="w-full bg-[#FF4405] text-white rounded-xl py-3.5 text-[15px] font-bold hover:bg-[#e63d05] transition-colors shadow-sm">
                                                        Get tickets
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </SidePanelShell>

            {/* Gallery Modal (renders outside shell to cover full viewport) */}
            <PhotoGalleryModal
                open={galleryOpen}
                images={payload?.hero.images || []}
                startIndex={galleryIndex}
                onClose={closeGallery}
            />
        </>
    );
}

// Default actions when payload hasn't loaded yet
const defaultActions: PanelAction[] = [
    {
        id: "save",
        label: "Save",
        variant: "secondary",
        icon: "heart",
        action: "TOGGLE_SAVE",
    },
    {
        id: "add",
        label: "+ Add to trip",
        variant: "primary",
        action: "ADD_TO_TRIP",
    },
];
