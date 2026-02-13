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

function ChatBubble({ message }: { message: ChatMessageType }) {
    const isUser = message.role === "user";

    return (
        <div
            className={`message-enter flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"
                }`}
        >
            {/* Avatar */}
            <Avatar
                className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-full ${isUser
                        ? "bg-primary/10 text-primary"
                        : "bg-gradient-to-br from-isang-teal to-isang-mint text-white"
                    }`}
            >
                {isUser ? (
                    <span className="text-xs font-semibold">You</span>
                ) : (
                    <Sparkles className="h-4 w-4" />
                )}
            </Avatar>

            {/* Bubble */}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md shadow-sm"
                    }`}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="message-enter flex gap-3 items-start">
            <Avatar className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-isang-teal to-isang-mint text-white">
                <Sparkles className="h-4 w-4" />
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
            <div className="flex flex-col gap-4 py-6 max-w-2xl mx-auto">
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
