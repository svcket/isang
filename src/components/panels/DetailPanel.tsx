"use client";

import { useEffect } from "react";
import { usePanelStore, panelCacheKey } from "@/lib/panel-store";
import { useAppStore } from "@/lib/store";
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
                    title={loading ? "Loading..." : undefined}
                    actions={payload?.actions || defaultActions}
                    isAdded={isAdded}
                    isSaved={false}
                    onClose={closePanel}
                    onAction={handleAction}
                />

                {/* Hero */}
                {payload && (
                    <PanelHero
                        images={payload.hero.images}
                        layout={payload.hero.layout}
                        title={payload.hero.layout === "single" ? payload.header.title : undefined}
                        subtitle={payload.hero.layout === "single" ? payload.header.subtitle : undefined}
                        onOpenGallery={() => openGallery(0)}
                    />
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
                            {/* Header (for grid/none hero layouts where title isn't overlaid) */}
                            {payload.hero.layout !== "single" && (
                                <div className="px-4 pt-4 pb-2">
                                    <h2 className="text-xl font-bold text-neutral-900">
                                        {payload.header.title}
                                    </h2>
                                    {payload.header.subtitle && (
                                        <p className="text-sm text-neutral-500 mt-0.5">
                                            {payload.header.subtitle}
                                        </p>
                                    )}
                                    {/* Rating + Tags */}
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        {payload.header.rating && (
                                            <span className="text-sm font-medium text-neutral-900">
                                                ★ {payload.header.rating}
                                                {payload.header.reviews_count && (
                                                    <span className="text-neutral-400 font-normal ml-1">
                                                        ({payload.header.reviews_count.toLocaleString()})
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                        {payload.header.tags?.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tabs */}
                            <PanelTabs
                                tabs={payload.tabs}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />

                            {/* Blocks for active section */}
                            <div className="px-4 py-4">
                                {activeSection && (
                                    <PanelBlockRenderer
                                        blocks={activeSection.blocks}
                                        onAskQuestion={handleAskQuestion}
                                    />
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
