"use client";

import Image from "next/image";
import type { ImageRef } from "@/types/panel";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

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

    // ─── Single: Full-bleed hero with overlay title ────────────────────
    if (layout === "single") {
        const hero = images[0]!;
        return (
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-100">
                <Image
                    src={hero.url}
                    alt={title || "Hero"}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="480px"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Title overlay */}
                {title && (
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h2 className="text-xl font-bold leading-tight">{title}</h2>
                        {subtitle && (
                            <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
                        )}
                    </div>
                )}

                {/* Gallery CTA */}
                {onOpenGallery && images.length > 1 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenGallery}
                        className="absolute bottom-4 right-4 h-8 rounded-full px-3 text-xs font-medium bg-white/90 text-neutral-900 border-0 hover:bg-white shadow-lg"
                    >
                        <Camera className="w-3.5 h-3.5 mr-1.5" />
                        Show all photos
                    </Button>
                )}
            </div>
        );
    }

    // ─── Grid: 1 large + up to 4 small ─────────────────────────────────
    const [main, ...rest] = images;
    const gridImages = rest.slice(0, 4);

    return (
        <div className="relative w-full">
            <div className="grid grid-cols-4 grid-rows-2 gap-1 h-[240px] overflow-hidden rounded-none">
                {/* Main image */}
                <div className="col-span-2 row-span-2 relative bg-neutral-100">
                    <Image
                        src={main!.url}
                        alt={title || "Main"}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="240px"
                    />
                </div>

                {/* Small images */}
                {gridImages.map((img, i) => (
                    <div key={img.id} className="relative bg-neutral-100">
                        <Image
                            src={img.url}
                            alt={`Photo ${i + 2}`}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="120px"
                        />
                    </div>
                ))}

                {/* Fill empty slots */}
                {Array.from({ length: Math.max(0, 4 - gridImages.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-neutral-50" />
                ))}
            </div>

            {/* Gallery CTA overlay */}
            {onOpenGallery && images.length > 3 && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenGallery}
                    className="absolute bottom-3 right-3 h-8 rounded-full px-3 text-xs font-medium bg-white/90 text-neutral-900 border-0 hover:bg-white shadow-lg"
                >
                    <Camera className="w-3.5 h-3.5 mr-1.5" />
                    Show all photos
                </Button>
            )}
        </div>
    );
}
