"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import type { ChatMessage, AssistantResponse } from "@/types";
import { Paperclip, Mic, ArrowUp, Image as ImageIcon, FileText } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { DestinationInput } from "./DestinationInput";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type DateRange } from "react-day-picker";

/* ── Auto-Resizing Input Component ──────────────────────────────────── */
function AutoInput({
    value,
    onChange,
    placeholder,
    type = "text",
    className = "",
    prefix = "",
    suffix = "",
    minWidth = "min-w-[1px]",
    inputMode,
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    type?: string;
    className?: string;
    prefix?: string;
    suffix?: string;
    minWidth?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
    // Hide native spinners applied globally in globals.css now
    return (
        <span className={cn("relative inline-block align-bottom mx-1 border-b border-transparent hover:border-neutral-200 focus-within:border-neutral-900 transition-colors pr-3", className)}>
            {/* Invisible span to reserve width */}
            <span
                className={`opacity-0 whitespace-pre font-semibold pointer-events-none ${minWidth}`}
                aria-hidden="true"
            >
                {prefix}{value || placeholder}{suffix}
            </span>
            {/* Absolute input to overlay */}
            <input
                type={type}
                inputMode={inputMode}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "absolute inset-0 w-full h-full bg-transparent outline-none p-0 m-0 border-none font-semibold placeholder:text-neutral-300 focus:placeholder:text-neutral-200",
                    "text-neutral-900", // Default text color
                    value && "text-[#FF9C66]" // Override if value exists
                )}
            />
        </span>
    );
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function LandingPage() {
    const [destination, setDestination] = useState("");

    // Switch to DateRange
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    // Duration is now derived/auto-calculated
    const [duration, setDuration] = useState("");

    const [budget, setBudget] = useState("");
    const [bottomValue, setBottomValue] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // File inputs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        setFilter,
    } = useAppStore();

    // Auto-calculate duration when date range changes
    // Clears duration if range is undefined
    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            const days = differenceInDays(dateRange.to, dateRange.from) + 1; // Inclusive
            if (days > 0) {
                setDuration(days.toString());
            } else {
                setDuration("");
            }
        } else {
            setDuration("");
        }
    }, [dateRange]);

    /* ── Budget Formatter ───────────────────────────────────────────── */
    const handleBudgetChange = (val: string) => {
        // Remove commas and non-digits to get raw value
        const raw = val.replace(/\D/g, "");
        if (!raw) {
            setBudget("");
            return;
        }
        // Format with commas
        const formatted = new Intl.NumberFormat("en-US").format(parseInt(raw, 10));
        setBudget(formatted);
    };

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
            setBottomValue(prev => (prev ? prev + " " + transcript : transcript));
        };

        recognition.start();
    }, []);

    const handleFileSelect = (type: 'image' | 'file') => {
        if (type === 'image') imageInputRef.current?.click();
        else fileInputRef.current?.click();
    };

    /* ── Common logic to send message ───────────────────────────────── */
    // Defined BEFORE usage in handlers to avoid hoisting issues with const/let
    const processMessage = async (content: string) => {
        setLoading(true);
        const userMessage: ChatMessage = {
            id: generateId(),
            role: "user",
            content,
            timestamp: new Date(),
        };
        addMessage(userMessage);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content,
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
    };

    /* ── Mad Libs Handler ───────────────────────────────────────────── */
    const handleMadLibsSubmit = useCallback(async () => {
        // Format: "starting Aug 18", or "starting Aug 18 - 21"
        let dateText = "soon";
        if (dateRange?.from) {
            if (dateRange.to) {
                dateText = `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`;
            } else {
                dateText = format(dateRange.from, "MMM d");
            }
        }

        // Send raw budget value (strip commas)
        const rawBudget = budget ? budget.replace(/,/g, "") : "undecided";

        const location = destination || "somewhere";
        const dur = duration || "a few";

        // Sync to global filterState so FiltersBar reflects the input!
        if (destination) setFilter("destination", destination);
        if (dateRange?.from) {
            setFilter("dates", {
                start: format(dateRange.from, "yyyy-MM-dd"),
                end: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : null
            });
        }
        if (rawBudget !== "undecided") {
            const num = parseInt(rawBudget, 10);
            if (!isNaN(num)) setFilter("budget", { amount: num, currency: "USD" });
        }

        const prompt = `I'm headed to ${location} starting ${dateText}, for ${dur} days with a budget of ${rawBudget !== "undecided" ? "$" + rawBudget : "undecided"}`;

        await processMessage(prompt);
    }, [destination, dateRange, duration, budget, isLoading, processMessage, setFilter]);

    /* ── Bottom Input Handler ───────────────────────────────────────── */
    const handleBottomSubmit = useCallback(async () => {
        const trimmed = bottomValue.trim();
        if (!trimmed || isLoading) return;
        await processMessage(trimmed);
        setBottomValue("");
    }, [bottomValue, isLoading]);

    // Determine if "Let's Go" should be active via strict acceptance criteria
    const hasDestination = destination.trim().length > 0;
    const hasDates = Boolean(dateRange?.from);
    const hasDays = Number(duration) > 0;
    const hasBudget = Number(budget.replace(/,/g, "")) > 0;

    const canStart = hasDestination || hasDates || hasDays || hasBudget;

    return (
        <div className="relative min-h-[100svh] bg-white text-neutral-900 font-sans">
            {/* Hidden Inputs */}
            <input type="file" ref={imageInputRef} accept="image/*" className="hidden" aria-label="Upload image" />
            <input type="file" ref={fileInputRef} className="hidden" aria-label="Upload file" />



            {/* Center content */}
            <div className="mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6">
                {/* Headline block */}
                <div className="text-center">
                    <h1 className="text-[44px] leading-[1.15] tracking-[-0.02em] font-semibold text-neutral-900 md:text-[56px]">
                        I’m headed to{" "}
                        <DestinationInput
                            value={destination}
                            onChange={setDestination}
                            placeholder="destination"
                        />
                        <br />
                        starting{" "}
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "relative inline-block align-bottom mx-1 border-b border-transparent hover:border-neutral-200 focus-within:border-neutral-900 transition-colors pr-3.5 font-semibold outline-none",
                                        dateRange?.from ? "text-[#FF9C66]" : "text-neutral-300"
                                    )}
                                >
                                    {dateRange?.from
                                        ? format(dateRange.from, "dd/MM")
                                        : "dd/mm"}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="center">
                                <DateRangePicker
                                    dateRange={dateRange}
                                    onDateRangeChange={setDateRange}
                                    onClear={() => setDateRange(undefined)}
                                    onSave={() => setIsCalendarOpen(false)}
                                />
                            </PopoverContent>
                        </Popover>
                        , for{" "}
                        <AutoInput
                            value={duration}
                            onChange={setDuration}
                            placeholder="x"
                        />
                        days
                        <br />
                        with{" "}
                        <span className="font-semibold text-neutral-900">$</span>
                        <AutoInput
                            value={budget}
                            onChange={handleBudgetChange} // NEW: Use formatter handler
                            placeholder="budget"
                            type="text" // NEW: Changed to text to allow commas
                            inputMode="numeric" // NEW: Mobile numeric keyboard
                            className="pr-3.5"
                        />
                    </h1>

                    <button
                        onClick={handleMadLibsSubmit}
                        disabled={!canStart || isLoading}
                        className={cn(
                            "mt-10 h-12 rounded-full px-10 text-sm font-medium transition-all bg-neutral-900 text-white",
                            canStart
                                ? "opacity-100 hover:bg-neutral-800 cursor-pointer shadow-sm"
                                : "opacity-40 cursor-not-allowed"
                        )}
                    >
                        Let’s go
                    </button>
                </div>

                {/* Bottom input redesigned card style */}
                <div className="mt-24 w-full max-w-[700px]">
                    <div className="relative flex flex-col rounded-[32px] border border-[#E5E5E5] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all focus-within:border-[1.5px] focus-within:border-black focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                        <textarea
                            value={bottomValue}
                            onChange={(e) => setBottomValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleBottomSubmit();
                                }
                            }}
                            className="w-full resize-none bg-transparent px-2 text-[16px] leading-relaxed text-neutral-900 placeholder:text-neutral-400/80 focus:outline-none min-h-[28px]"
                            placeholder="What’s the plan, buddy? Tell me anything..."
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                        <div className="mt-6 flex items-center justify-between px-1">
                            <div className="flex gap-5">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            aria-label="Attach"
                                            className="text-neutral-900 hover:text-neutral-600 transition-colors data-[state=open]:text-[#FF4405]"
                                        >
                                            <Paperclip className="h-[22px] w-[22px]" strokeWidth={2} />
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
                                        "transition-colors",
                                        isListening ? "text-[#FF4405] animate-pulse" : "text-neutral-900 hover:text-neutral-600"
                                    )}
                                >
                                    <Mic className="h-[22px] w-[22px]" strokeWidth={2} />
                                </button>
                            </div>
                            <button
                                onClick={handleBottomSubmit}
                                disabled={!bottomValue.trim() || isLoading}
                                aria-label="Send"
                                className={cn(
                                    "flex h-11 w-11 items-center justify-center rounded-xl transition-all bg-[#FF4405] text-white shadow-sm",
                                    !bottomValue.trim() || isLoading
                                        ? "opacity-40 cursor-not-allowed shadow-none"
                                        : "opacity-100 hover:bg-[#e63d05] hover:scale-105"
                                )}
                            >
                                <ArrowUp className="h-6 w-6" strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
