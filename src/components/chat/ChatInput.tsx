"use client";

import { useState, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Lock } from "lucide-react";
import type { ChatMessage, AssistantResponse } from "@/types";

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function ChatInput() {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        isGuest,
        turnCount,
        maxGuestTurns,
        isLoading,
        addMessage,
        setLoading,
        incrementTurn,
        processAssistantData,
        setShowAuthModal,
        messages,
        tripSnapshot,
    } = useAppStore();

    const isLocked = isGuest && turnCount >= maxGuestTurns;
    const remainingTurns = maxGuestTurns - turnCount;

    const handleSend = useCallback(async () => {
        const trimmed = value.trim();
        if (!trimmed || isLoading || isLocked) return;

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
            inputRef.current?.focus();
        }
    }, [
        value,
        isLoading,
        isLocked,
        addMessage,
        setLoading,
        incrementTurn,
        processAssistantData,
        messages,
        tripSnapshot,
        turnCount,
        isGuest,
    ]);

    if (isLocked) {
        return (
            <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-4">
                <div className="max-w-2xl mx-auto flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Lock className="h-4 w-4" />
                        <span>You&apos;ve used all 3 preview turns</span>
                    </div>
                    <Button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-gradient-to-r from-isang-teal to-primary hover:opacity-90 transition-opacity cta-pulse"
                    >
                        Create a free account to continue
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        Save your trips • Full itineraries • Unlimited chat
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-3">
            <div className="max-w-2xl mx-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2 items-center"
                >
                    <Input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Describe your ideal trip…"
                        disabled={isLoading}
                        className="flex-1 rounded-xl border-border/60 bg-background/60 placeholder:text-muted-foreground/60 focus-visible:ring-primary/30"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!value.trim() || isLoading}
                        className="rounded-xl bg-primary hover:bg-primary/90 shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>

                {isGuest && turnCount > 0 && (
                    <p className="text-[11px] text-muted-foreground/70 text-center mt-2">
                        Preview mode · {remainingTurns} turn{remainingTurns !== 1 ? "s" : ""}{" "}
                        remaining ·{" "}
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="underline hover:text-primary transition-colors"
                        >
                            Create account to save your trip
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}
