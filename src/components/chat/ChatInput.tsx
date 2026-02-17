"use client";

import { useState, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { ArrowUp, Paperclip, Mic, Image as ImageIcon, FileText, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function ChatInput() {
    const [value, setValue] = useState("");
    const [isListening, setIsListening] = useState(false);

    // File inputs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    /* ── Voice Dictation ────────────────────────────────────────────── */
    const handleVoiceInput = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Voice dictation is not supported in this browser.");
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setValue(prev => (prev ? prev + " " + transcript : transcript));
        };

        recognition.start();
    }, []);

    const handleFileSelect = (type: 'image' | 'file') => {
        if (type === 'image') imageInputRef.current?.click();
        else fileInputRef.current?.click();
    };

    const handleSend = useCallback(async () => {
        const trimmed = value.trim();
        if (!trimmed || isLoading || isLocked) return;

        const userMessage = {
            id: generateId(),
            role: "user" as const,
            content: trimmed,
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setValue("");
        setLoading(true);

        // Reset height
        const textarea = document.getElementById("chat-textarea") as HTMLTextAreaElement;
        if (textarea) textarea.style.height = "auto";

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

            const data = await res.json();

            const assistantMessage = {
                id: generateId(),
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
        } catch {
            const errMsg = {
                id: generateId(),
                role: "assistant" as const,
                content: "I'm having trouble connecting right now. Could you try again in a moment?",
                timestamp: new Date(),
            };
            addMessage(errMsg);
        } finally {
            setLoading(false);
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
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-4">
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
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white via-white to-transparent pb-6 pt-10 px-4">
            <div className="max-w-[700px] mx-auto w-full">
                {/* Inputs */}
                <input type="file" ref={imageInputRef} accept="image/*" className="hidden" aria-label="Upload image" />
                <input type="file" ref={fileInputRef} className="hidden" aria-label="Upload file" />

                <div className="relative flex flex-col rounded-[32px] border border-[#E5E5E5] bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all focus-within:border-[1.5px] focus-within:border-black focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                    <textarea
                        id="chat-textarea"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        className="w-full resize-none bg-transparent px-3 text-[16px] leading-relaxed text-neutral-900 placeholder:text-neutral-400/80 focus:outline-none min-h-[24px]"
                        placeholder="Create an itinerary for this trip..."
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto";
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />
                    <div className="mt-3 flex items-center justify-between px-1">
                        <div className="flex gap-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button
                                        aria-label="Attach"
                                        className="text-neutral-400 hover:text-neutral-600 transition-colors data-[state=open]:text-[#FF4405] p-1"
                                    >
                                        <Paperclip className="h-5 w-5" strokeWidth={2} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-48 p-2 rounded-2xl border-none shadow-xl bg-white"
                                    align="start"
                                    sideOffset={8}
                                >
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => handleFileSelect('image')}
                                            className="flex items-center gap-3 w-full p-2.5 rounded-xl text-neutral-900 hover:bg-neutral-50 transition-colors font-medium text-sm text-left"
                                        >
                                            <ImageIcon className="h-5 w-5" strokeWidth={2} />
                                            <span>Photos</span>
                                        </button>
                                        <button
                                            onClick={() => handleFileSelect('file')}
                                            className="flex items-center gap-3 w-full p-2.5 rounded-xl text-neutral-900 hover:bg-neutral-50 transition-colors font-medium text-sm text-left"
                                        >
                                            <FileText className="h-5 w-5" strokeWidth={2} />
                                            <span>Files</span>
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <button
                                aria-label="Voice"
                                onClick={handleVoiceInput}
                                className={cn(
                                    "transition-colors p-1",
                                    isListening ? "text-[#FF4405] animate-pulse" : "text-neutral-400 hover:text-neutral-600"
                                )}
                            >
                                <Mic className="h-5 w-5" strokeWidth={2} />
                            </button>
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!value.trim() || isLoading}
                            aria-label="Send"
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full transition-all bg-[#FF4405] text-white shadow-sm",
                                !value.trim() || isLoading
                                    ? "opacity-40 cursor-not-allowed shadow-none"
                                    : "opacity-100 hover:bg-[#e63d05] hover:scale-105"
                            )}
                        >
                            <ArrowUp className="h-5 w-5" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {isGuest && turnCount > 0 && (
                    <p className="text-[11px] text-muted-foreground/70 text-center mt-3">
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
