"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SidePanelShellProps {
    open: boolean;
    onClose: () => void;
    width?: string;
    children: React.ReactNode;
}

export default function SidePanelShell({
    open,
    onClose,
    width = "w-full sm:w-[480px]",
    children,
}: SidePanelShellProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    // ─── ESC key handler ───────────────────────────────────────────────
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            // Lock body scroll
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, handleKeyDown]);

    // ─── Focus trap (basic) ────────────────────────────────────────────
    useEffect(() => {
        if (open && panelRef.current) {
            panelRef.current.focus();
        }
    }, [open]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                className={cn(
                    "fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-2xl",
                    "transform transition-transform duration-300 ease-out",
                    "outline-none overflow-hidden",
                    width,
                    open
                        ? "translate-x-0"
                        : "translate-x-full"
                )}
            >
                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {children}
                </div>
            </div>
        </>
    );
}
