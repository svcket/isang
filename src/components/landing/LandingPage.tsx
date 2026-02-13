"use client";

import { useState, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { ArrowUp, Paperclip, Mic } from "lucide-react";
import type { ChatMessage, AssistantResponse } from "@/types";
import Image from "next/image";

const generateId = () => Math.random().toString(36).substring(2, 15);

/* ── Collage images (Unsplash hotlinks for real travel photos) ──────── */
// Collage images removed as we are using the new grid based collage

export default function LandingPage() {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        isLoading,
        addMessage,
        setLoading,
        incrementTurn,
        processAssistantData,
        messages,
        tripSnapshot,
        turnCount,
        isGuest,
    } = useAppStore();

    const handleSend = useCallback(async () => {
        const trimmed = value.trim();
        if (!trimmed || isLoading) return;

        const userMessage: ChatMessage = {
            id: generateId(),
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setValue("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    history: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    tripSnapshot,
                    turnCount,
                    isGuest,
                }),
            });

            if (!res.ok) throw new Error("Failed to get response");

            const data: { reply: string; data?: AssistantResponse } =
                await res.json();

            const assistantMessage: ChatMessage = {
                id: generateId(),
                role: "assistant",
                content: data.reply,
                timestamp: new Date(),
                data: data.data,
            };

            addMessage(assistantMessage);

            if (data.data) {
                processAssistantData(data.data);
            }

            if (isGuest) {
                incrementTurn();
            }
        } catch {
            const errMsg: ChatMessage = {
                id: generateId(),
                role: "assistant",
                content:
                    "I'm having trouble connecting right now. Could you try again in a moment?",
                timestamp: new Date(),
            };
            addMessage(errMsg);
        } finally {
            setLoading(false);
        }
    }, [
        value,
        isLoading,
        addMessage,
        setLoading,
        incrementTurn,
        processAssistantData,
        messages,
        tripSnapshot,
        turnCount,
        isGuest,
    ]);

    /* Auto-resize textarea */
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        const ta = e.target;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    };

    const collage = [
        {
            src: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
            cls: "col-span-2 row-span-2 translate-y-4",
            style: { gridColumn: "span 2", gridRow: "span 2", transform: "translateY(1rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=500&fit=crop",
            cls: "col-span-2 row-span-3 -translate-y-6",
            style: { gridColumn: "span 2", gridRow: "span 3", transform: "translateY(-1.5rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop",
            cls: "col-span-3 row-span-2 translate-y-2",
            style: { gridColumn: "span 3", gridRow: "span 2", transform: "translateY(0.5rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=400&fit=crop",
            cls: "col-span-2 row-span-2 -translate-y-3",
            style: { gridColumn: "span 2", gridRow: "span 2", transform: "translateY(-0.75rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop",
            cls: "col-span-2 row-span-3 translate-y-6",
            style: { gridColumn: "span 2", gridRow: "span 3", transform: "translateY(1.5rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&h=500&fit=crop",
            cls: "col-span-3 row-span-2 -translate-y-2",
            style: { gridColumn: "span 3", gridRow: "span 2", transform: "translateY(-0.5rem)" },
        },

        {
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
            cls: "col-span-2 row-span-2 translate-y-3",
            style: { gridColumn: "span 2", gridRow: "span 2", transform: "translateY(0.75rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=400&fit=crop",
            cls: "col-span-2 row-span-2 -translate-y-4",
            style: { gridColumn: "span 2", gridRow: "span 2", transform: "translateY(-1rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
            cls: "col-span-3 row-span-3 translate-y-5",
            style: { gridColumn: "span 3", gridRow: "span 3", transform: "translateY(1.25rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=500&fit=crop",
            cls: "col-span-2 row-span-2 -translate-y-2",
            style: { gridColumn: "span 2", gridRow: "span 2", transform: "translateY(-0.5rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop",
            cls: "col-span-2 row-span-2 translate-y-2",
            style: { gridColumn: "span 2", gridRow: "span 2", transform: "translateY(0.5rem)" },
        },
        {
            src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop",
            cls: "col-span-3 row-span-2 -translate-y-6",
            style: { gridColumn: "span 3", gridRow: "span 2", transform: "translateY(-1.5rem)" },
        },
    ];

    function Tile({ src, cls, style }: { src: string; cls: string; style?: React.CSSProperties }) {
        return (
            <div className={`relative overflow-hidden rounded-2xl ${cls}`} style={style}>
                <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="w-full max-w-6xl mx-auto px-6">
                {/* ── Photo Collage ─────────────────────────────────────────── */}
                <section className="relative w-full mt-6 h-[320px] overflow-hidden">
                    {/* Optional subtle fade to mimic App Store cleanliness */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />

                    {/* The grid “canvas” */}
                    <div
                        className="grid h-full w-full gap-4 place-items-stretch"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(12, 1fr)",
                            gridTemplateRows: "repeat(6, 1fr)",
                        }}
                    >
                        {collage.map((img, i) => (
                            <Tile key={i} src={img.src} cls={img.cls} style={img.style} />
                        ))}
                    </div>
                </section>

                {/* ── Hero Text ─────────────────────────────────────────────── */}
                <div className="flex flex-col items-center px-4 pb-6 mt-10">
                    <h1
                        className="text-4xl sm:text-5xl font-bold text-center text-gray-900 leading-tight tracking-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Hey buddy!
                        <br />
                        where are we off to?
                    </h1>
                </div>

                {/* ── Input Area ────────────────────────────────────────────── */}
                <div className="flex justify-center px-4 pb-16">
                    <div className="landing-input w-full max-w-[552px]">
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={handleInput}
                            placeholder="Tell me your destination, budget, dates, preference or how long you're staying"
                            disabled={isLoading}
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="landing-textarea"
                        />

                        {/* Bottom bar: icons + send */}
                        <div className="flex items-center justify-between px-4 pb-3 pt-1">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="Attach file"
                                >
                                    <Paperclip className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="Voice input"
                                >
                                    <Mic className="h-5 w-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={!value.trim() || isLoading}
                                className="landing-send-btn"
                                aria-label="Send message"
                            >
                                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
