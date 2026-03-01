"use client";

import { useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import type { ChatMessage as ChatMessageType } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Plane,
    Sparkles,
} from "lucide-react";

import ResponseShell from "../response/ResponseShell";
import { ErrorBoundary } from "../ui/error-boundary";

function ChatBubble({ message }: { message: ChatMessageType }) {
    const isUser = message.role === "user";
    const {
        toggleItem,
        addMessage,
        setLoading,
        tripSnapshot,
        turnCount,
        isGuest,
        messages,
        processAssistantData,
        incrementTurn,
        filterState,
        setActiveFilterPanel,
    } = useAppStore();

    const handleAction = async (actionId: string, payload: any, label: string = "Perform action") => {
        // Intercept UI-only actions
        if (actionId === "focus_filter") {
            const panel = payload?.filterParams as "destination" | "dates" | "travelers" | "budget" | null;
            if (panel) setActiveFilterPanel(panel);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (actionId === "open_when_filter") {
            setActiveFilterPanel("dates");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (actionId === "focus_destination") {
            setActiveFilterPanel("destination");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Prevent duplicate submissions if loading
        if (useAppStore.getState().isLoading) return;

        const userMessage = {
            id: Math.random().toString(36).substring(2, 15),
            role: "user" as const,
            content: label, // Use the button label as the message
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: label,
                    action_id: actionId,
                    action_payload: payload,
                    history: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    tripSnapshot,
                    turnCount,
                    isGuest,
                    filters: filterState,
                }),
            });

            if (!res.ok) throw new Error("Failed to get response");

            const data = await res.json();

            const assistantMessage = {
                id: Math.random().toString(36).substring(2, 15),
                role: "assistant" as const,
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
        } catch (error) {
            console.error("Action error:", error);
            const errMsg = {
                id: Math.random().toString(36).substring(2, 15),
                role: "assistant" as const,
                content: "I'm having trouble handling that request right now.",
                timestamp: new Date(),
            };
            addMessage(errMsg);
        } finally {
            setLoading(false);
        }
    };


    // ─── Response Block Rendering ────────────────────────────────────────
    if (!isUser && message.data?.responseBlock) {
        return (
            <div className="message-enter w-full max-w-[790px] mx-auto">
                <ErrorBoundary>
                    <ResponseShell
                        data={message.data.responseBlock}
                        onItemAdd={toggleItem}
                        onAction={handleAction}
                    />
                </ErrorBoundary>
            </div>
        );
    }

    // ─── User Message Rendering ──────────────────────────────────────────
    if (isUser) {
        return (
            <div className="message-enter flex gap-3 flex-row-reverse w-full max-w-[790px] mx-auto">
                <div className="flex flex-col gap-1 items-end max-w-[80%]">
                    <div className="bg-[#FFF5EB] text-[#1a1a1a] px-5 py-3 rounded-[20px] rounded-tr-sm text-[15px] leading-relaxed border border-neutral-100">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Catch-all for other messages (e.g. text-only AI response) ───────
    return (
        <div className="message-enter flex gap-3 flex-row w-full max-w-[790px] mx-auto">
            <Avatar className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-transparent mt-1 overflow-hidden">
                <img src="/onboarding/isang-response-avatar.png" alt="Isang" className="h-full w-full object-contain" />
            </Avatar>
            <div className="flex flex-col gap-1 items-start max-w-[80%]">
                <div className="bg-white border border-neutral-100 px-5 py-3 rounded-[20px] rounded-tl-sm text-[15px] leading-relaxed shadow-sm text-neutral-900">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="message-enter flex gap-3 items-start w-full max-w-[790px] mx-auto">
            <Avatar className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-transparent mt-1 overflow-hidden">
                <img src="/onboarding/isang-response-avatar.png" alt="Isang" className="h-full w-full object-contain" />
            </Avatar>
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
            </div>
        </div>
    );
}

export default function ChatMessages() {
    const messages = useAppStore((s) => s.messages);
    const isLoading = useAppStore((s) => s.isLoading);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <ScrollArea className="flex-1 px-4 sm:px-6" ref={scrollRef}>
            <div className="flex flex-col gap-4 pt-24 pb-96 max-w-[712px] mx-auto">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-isang-teal to-isang-mint flex items-center justify-center shadow-lg">
                            <Plane className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2
                                className="text-xl font-semibold text-foreground"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                Where to next?
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                Tell me about your trip — a destination, budget, dates, or just
                                a vibe. I&apos;ll help you plan it.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                            {[
                                "🏖️ Beach getaway under $2000",
                                "🗼 3 days in Paris",
                                "🎒 Backpacking Southeast Asia",
                                "🍣 Food tour in Tokyo",
                            ].map((hint) => (
                                <Badge
                                    key={hint}
                                    variant="secondary"
                                    className="cursor-pointer px-3 py-1.5 text-xs hover:bg-accent transition-colors"
                                >
                                    {hint}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}

                {isLoading && <TypingIndicator />}
            </div>
        </ScrollArea>
    );
}
