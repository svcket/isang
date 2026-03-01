"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ImageRef } from "@/types/panel";

interface PhotoGalleryModalProps {
    open: boolean;
    images: ImageRef[];
    startIndex?: number;
    onClose: () => void;
}

export default function PhotoGalleryModal({
    open,
    images,
    startIndex = 0,
    onClose,
}: PhotoGalleryModalProps) {
    const [current, setCurrent] = useState(startIndex);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") setCurrent((c) => Math.min(c + 1, images.length - 1));
            if (e.key === "ArrowLeft") setCurrent((c) => Math.max(c - 1, 0));
        },
        [onClose, images.length]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, handleKeyDown]);

    if (!open || images.length === 0) return null;

    const img = images[current]!;

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-white/60">
                    {current + 1} / {images.length}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-9 w-9 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Main image */}
            <div className="flex-1 relative flex items-center justify-center px-16">
                <div className="relative w-full max-w-3xl aspect-[4/3]">
                    <Image
                        src={img.url}
                        alt={`Photo ${current + 1}`}
                        fill
                        unoptimized
                        className="object-contain"
                        sizes="800px"
                    />
                </div>

                {/* Navigation arrows */}
                {current > 0 && (
                    <button
                        onClick={() => setCurrent((c) => c - 1)}
                        aria-label="Previous photo"
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                {current < images.length - 1 && (
                    <button
                        onClick={() => setCurrent((c) => c + 1)}
                        aria-label="Next photo"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="flex justify-center gap-1.5 px-4 py-3 overflow-x-auto">
                    {images.map((thumb, i) => (
                        <button
                            key={thumb.id}
                            onClick={() => setCurrent(i)}
                            aria-label={`View photo ${i + 1}`}
                            className={`relative w-14 h-10 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${i === current
                                ? "border-white opacity-100"
                                : "border-transparent opacity-50 hover:opacity-80"
                                }`}
                        >
                            <Image
                                src={thumb.url}
                                alt={`Thumb ${i + 1}`}
                                fill
                                unoptimized
                                className="object-cover"
                                sizes="56px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Attribution */}
            {img.attribution && (
                <p className="text-center text-xs text-white/40 pb-2">
                    {img.attribution}
                </p>
            )}
        </div>
    );
}
