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
    width = "w-full sm:w-[600px] md:w-[720px] lg:w-[840px]",
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
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, handleKeyDown]);

    // ─── Focus trap (basic) ────────────────────────────────────────────
    useEffect(() => {
        if (open && panelRef.current) {
            panelRef.current.focus();
        }
    }, [open]);

    return (
        <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className={cn(
                "fixed top-0 bottom-0 right-0 z-[101] flex flex-col bg-white border-l border-neutral-100 shadow-[-8px_0_24px_rgba(0,0,0,0.02)]",
                "transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
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
    );
}
