"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePanelStore, panelCacheKey } from "@/lib/panel-store";
import { useAppStore } from "@/lib/store";
import SidePanelShell from "./SidePanelShell";
import PanelTopBar from "./PanelTopBar";
import PanelHero from "./PanelHero";
import PanelTabs from "./PanelTabs";
import PanelBlockRenderer from "./PanelBlockRenderer";
import TextBlock from "./blocks/TextBlock";
import PhotoGalleryModal from "./PhotoGalleryModal";
import { getMockPanelData } from "@/lib/mock-panel-data";
import type { PanelAction } from "@/types/panel";
import { MapPin, Star, Landmark } from "lucide-react";
import { PanelHeading, PanelDivider } from "./PanelElements";

// Helper for Dynamic Titles
const getDynamicTitle = (id: string, original: string, entityName: string) => {
    switch (id) {
        case 'knowledge': return `Things to know about ${entityName}`;
        case 'stays': return `Stays near ${entityName}`;
        case 'restaurants': return `Restaurants near ${entityName}`;
        case 'attractions': return `Activities in ${entityName}`;
        default: return original;
    }
};

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
                {/* Content area */}
                <div className="w-full min-h-full bg-white flex flex-col relative">
                    {loading && (
                        <div className="flex items-center justify-center py-16 flex-1">
                            <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
                        </div>
                    )}

                    {!loading && !payload && (
                        <div className="flex flex-col items-center justify-center py-16 text-neutral-400 flex-1">
                            <p className="text-sm">No details available</p>
                        </div>
                    )}

                    {!loading && payload && (
                        <>
                            {/* Header Actions - Normal */}
                            {payload.hero.layout !== "single" && (
                                <PanelTopBar
                                    actions={payload.actions || defaultActions}
                                    isSaved={false}
                                    isAdded={isAdded}
                                    onClose={closePanel}
                                    onAction={handleAction}
                                />
                            )}

                            {/* Content Scroll Area */}
                            <div className="flex-1 overflow-y-auto w-full relative scroll-smooth rounded-b-[24px]">
                                {/* Header Actions - Transparent (Floating over Hero) */}
                                {payload.hero.layout === "single" && (
                                    <div className="absolute top-0 inset-x-0 z-30 pt-1">
                                        <PanelTopBar
                                            actions={payload.actions || defaultActions}
                                            isSaved={false}
                                            isAdded={isAdded}
                                            onClose={closePanel}
                                            onAction={handleAction}
                                            transparent={true}
                                        />
                                    </div>
                                )}

                                <div className="w-full min-h-full bg-white flex flex-col pb-safe pb-8">
                                    {/* Section 0: Title & Breadcrumbs */}
                                    <div className="px-6 pt-4 pb-4">
                                        {/* Breadcrumb if available */}
                                        {payload.sections[0]?.blocks.find(b => b.type === 'text' && (b as { variant?: string }).variant === 'breadcrumb') && (
                                            <div className="mb-2">
                                                <TextBlock
                                                    content={(payload.sections[0].blocks.find(b => b.type === 'text' && (b as { variant?: string }).variant === 'breadcrumb') as { content: string }).content}
                                                    variant="breadcrumb"
                                                />
                                            </div>
                                        )}
                                        <h1 className="text-[28px] leading-[1.1] font-bold text-neutral-900 tracking-[-0.03em]">
                                            {payload.header.title}
                                        </h1>
                                        
                                        {/* Meta Information */}
                                        <div className="flex flex-col gap-2 mt-3">
                                            <div className="flex items-center gap-2 text-[14px] text-neutral-500">
                                                {payload.header.location && (
                                                    <>
                                                        <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                                                        <span className="truncate font-medium">{payload.header.location}</span>
                                                    </>
                                                )}
                                                
                                                {payload.header.location && (payload.header.rating || payload.header.reviews_count_formatted) && (
                                                    <span className="text-neutral-200 mx-0.5">•</span>
                                                )}
                                                
                                                {(payload.header.rating || payload.header.reviews_count_formatted) && (
                                                    <div className="flex items-center shrink-0">
                                                        <Star className="w-3.5 h-3.5 text-neutral-900 fill-neutral-900 mr-1.5" />
                                                        <span className="font-bold text-neutral-900 mr-1">{payload.header.rating}</span>
                                                        {payload.header.reviews_count_formatted && (
                                                            <span className="text-neutral-400 font-medium">
                                                                ({payload.header.reviews_count_formatted})
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {payload.header.category && (
                                                <div className="flex items-center gap-2 text-[14px] text-neutral-500">
                                                    <Landmark className="w-3.5 h-3.5 text-neutral-400 shrink-0 stroke-[2.2]" />
                                                    <span className="font-medium">{payload.header.category}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Section 1: Hero */}
                                    <div className="px-6 pt-6">
                                        <PanelHero
                                            images={payload.hero.images}
                                            layout={payload.hero.layout || 'single'}
                                            onOpenGallery={() => openGallery(0)}
                                        />
                                    </div>

                                    {/* Section 2: Tabs */}
                                    <div className="mt-4">
                                        <PanelTabs
                                            tabs={payload.tabs}
                                            activeTab={activeTab}
                                            onTabChange={(tab) => {
                                                setActiveTab(tab);
                                                const id = tab.toLowerCase().replace(/\s+/g, '-');
                                                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }}
                                        />
                                    </div>

                                    {/* Sections flow */}
                                    <div className="px-6 py-6 pb-32">
                                        <div className="space-y-10">
                                            {payload.sections.map((section, idx) => (
                                                <div key={section.id} id={section.id} className="relative">
                                                    {idx > 0 && <PanelDivider />}
                                                    
                                                    {section.id !== "overview" && (
                                                        <PanelHeading className="mb-5">
                                                            {getDynamicTitle(section.id, section.title, payload.header.title)}
                                                        </PanelHeading>
                                                    )}
                                                    
                                                    {/* Special handling for Overview side-by-side grid */}
                                                    {section.id === 'overview' ? (
                                                        <div className={cn(
                                                            "grid items-start gap-12",
                                                            section.is_booking_required !== false ? "grid-cols-[1fr_312px]" : "grid-cols-1"
                                                        )}>
                                                            <div className="space-y-10">
                                                                <div className="space-y-5">
                                                                    <PanelBlockRenderer
                                                                        blocks={section.blocks.filter(b => {
                                                                            const vb = b as { variant?: string };
                                                                            return vb.variant !== 'breadcrumb' && b.type !== 'booking_card' && b.type !== 'qa_list';
                                                                        })}
                                                                        onAskQuestion={handleAskQuestion}
                                                                    />
                                                                </div>

                                                                {/* FAQ Section inside column */}
                                                                {section.blocks.some(b => b.type === 'qa_list') && (
                                                                    <div className="space-y-8 pt-4">
                                                                        <div className="h-px w-full bg-neutral-100/60" />
                                                                        <div className="space-y-6">
                                                                            <PanelHeading>Frequently asked questions</PanelHeading>
                                                                            <PanelBlockRenderer
                                                                                blocks={section.blocks.filter(b => b.type === 'qa_list')}
                                                                                onAskQuestion={handleAskQuestion}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {section.is_booking_required !== false && section.blocks.find(b => b.type === 'booking_card') && (
                                                                <div className="sticky top-24">
                                                                    <PanelBlockRenderer 
                                                                        blocks={[section.blocks.find(b => b.type === 'booking_card')!]} 
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="mt-4">
                                                            <PanelBlockRenderer
                                                                blocks={section.blocks}
                                                                onAskQuestion={handleAskQuestion}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right Column sticky action card */}
                                        {hasRightColumn && (
                                            <div className="hidden md:block">
                                                <div className="sticky top-24 border border-neutral-200 rounded-3xl p-7 shadow-xl bg-white">
                                                    {payload.panel_type === "HOTEL" && (
                                                        <>
                                                            <div className="flex items-end justify-between mb-6">
                                                                <div className="text-[28px] font-bold leading-none tracking-tight">
                                                                    $450 <span className="text-[15px] font-normal text-neutral-500 font-medium">/ night</span>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 rounded-2xl overflow-hidden mb-6 border border-neutral-200 shadow-sm divide-x divide-neutral-200 bg-neutral-50">
                                                                <div className="p-4">
                                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Check in</div>
                                                                    <div className="text-[15px] font-bold">Aug 24</div>
                                                                </div>
                                                                <div className="p-4">
                                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Check out</div>
                                                                    <div className="text-[15px] font-bold">Aug 31</div>
                                                                </div>
                                                                <div className="col-span-2 p-4 border-t border-neutral-200">
                                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Guests</div>
                                                                    <div className="text-[15px] font-bold">2 adults</div>
                                                                </div>
                                                            </div>
                                                            <button className="w-full bg-[#FF4405] text-white rounded-2xl py-4 text-[16px] font-bold hover:bg-[#e63d05] transition-all shadow-lg active:scale-[0.98]">
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
                                </div>
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
