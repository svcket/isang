import Image from "next/image";
import type { ImageRef } from "@/types/panel";
import { IconButton } from "./PanelElements";
import { Grid2X2 } from "lucide-react";


interface PanelHeroProps {
    images: ImageRef[];
    layout: "single" | "grid" | "none";
    title?: string;
    subtitle?: string;
    onOpenGallery?: () => void;
}

export default function PanelHero({
    images,
    layout,
    title,
    subtitle,
    onOpenGallery,
}: PanelHeroProps) {
    if (layout === "none" || images.length === 0) return null;

    // ─── Single: Full-bleed hero carousel ──────────────────────────────
    if (layout === "single") {
        return (
            <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] overflow-hidden group/hero shadow-sm rounded-[24px]">
                <div className="absolute inset-0 flex items-center overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {images.map((img) => (
                        <div key={img.id} className="relative flex-none w-full h-full snap-center bg-neutral-100">
                            <Image
                                src={img.url}
                                alt={title || "Hero"}
                                fill
                                unoptimized
                                className="object-cover"
                                sizes="520px"
                            />
                        </div>
                    ))}
                </div>

                {/* High-Fidelity Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-6 pb-6 pt-24 flex flex-col justify-end pointer-events-none">
                    <div className="text-[26px] font-bold text-white tracking-tight leading-tight">{title}</div>
                    {subtitle && <div className="text-[14px] font-medium text-white/90 mt-1">{subtitle}</div>}
                </div>

                {/* Gallery CTA overlay */}
                {images.length > 1 && onOpenGallery && (
                    <div className="absolute bottom-5 right-5 flex gap-2">
                        <IconButton
                            icon={Grid2X2}
                            label="Show all photos"
                            onClick={onOpenGallery}
                            className="pointer-events-auto shadow-lg"
                        />
                    </div>
                )}
            </div>
        );
    }

    // ─── Grid: 1 large + 4 small ───────────────────────────────────────
    const [hero, ...rest] = images;

    return (
        <div className="relative w-full h-[320px] group overflow-hidden rounded-[24px]">
            <div className="grid grid-cols-[1.8fr_1fr_1fr] gap-2 h-full">
                {/* Main Hero Image */}
                <div className="relative h-full overflow-hidden bg-neutral-200">
                    {hero ? (
                        <Image
                            src={hero.url}
                            alt={title || "Main"}
                            fill
                            className="object-cover"
                            unoptimized
                            sizes="(max-width: 420px) 100vw, 420px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                            <span className="text-[10px] text-neutral-400">No Image</span>
                        </div>
                    )}
                </div>

                {/* Column 2: Stacked Images */}
                <div className="grid grid-rows-2 gap-2 h-full">
                    {[rest[0], rest[1]].map((img, i) => (
                        <div key={img?.id || `c2-${i}`} className="relative overflow-hidden bg-neutral-100">
                            {img ? (
                                <Image
                                    src={img.url}
                                    alt={`${title || "Place"} gallery ${i + 2}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    sizes="200px"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-50" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Column 3: Stacked Images */}
                <div className="grid grid-rows-2 gap-2 h-full">
                    {[rest[2], rest[3]].map((img, i) => (
                        <div key={img?.id || `c3-${i}`} className="relative overflow-hidden bg-neutral-100">
                            {img ? (
                                <Image
                                    src={img.url}
                                    alt={`${title || "Place"} gallery ${i + 4}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    sizes="200px"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-50" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Gallery CTA overlay */}
            {onOpenGallery && images.length > 1 && (
                <div className="absolute bottom-5 right-5 flex gap-2">
                    <IconButton
                        icon={Grid2X2}
                        label="Show all photos"
                        onClick={onOpenGallery}
                        className="pointer-events-auto shadow-xl"
                    />
                </div>
            )}
        </div>
    );
}
