"use client";

import { format, differenceInDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    onClear: () => void;
    onSave: () => void;
    className?: string;
}

export function DateRangePicker({
    dateRange,
    onDateRangeChange,
    onClear,
    onSave,
    className
}: DateRangePickerProps) {
    const from = dateRange?.from;
    const to = dateRange?.to;

    let duration: string | undefined;
    if (from && to) {
        const days = differenceInDays(to, from) + 1; // Inclusive
        if (days > 0) duration = days.toString();
    }

    return (
        <div className={cn("bg-white flex flex-col h-full", className)}>
            <div className="p-6 flex-1 overflow-y-auto">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={onDateRangeChange}
                    numberOfMonths={2}
                    autoFocus
                    defaultMonth={from}
                    pagedNavigation
                    fixedWeeks
                    showOutsideDays
                    className="rounded-md"
                    classNames={{
                        // v9 classNames
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-12 sm:space-y-0",
                        month: "space-y-6 text-center select-none",
                        month_caption: "flex justify-center pt-1 relative items-center mb-4",
                        caption_label: "text-lg font-medium text-neutral-800",
                        nav: "absolute inset-x-0 top-0 flex items-center justify-between px-2 z-20",
                        button_previous: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer inline-flex items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors",
                        button_next: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer inline-flex items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors",
                        month_grid: "w-full border-collapse space-y-1 mx-auto",
                        weekdays: "flex mb-2",
                        weekday: "text-neutral-400 rounded-md w-11 font-medium text-[0.8rem] uppercase tracking-wide",
                        week: "flex w-full mt-2",

                        // Cell and day button
                        day: "relative w-11 h-11 text-center p-0",
                        day_button: "w-11 h-11 rounded-lg hover:bg-neutral-100 font-normal cursor-pointer transition-colors inline-flex items-center justify-center text-sm",

                        // Primary selected day
                        selected: "!bg-[#FF4405] !rounded-lg",
                        today: "font-semibold text-[#FF4405]",

                        // Range styling — Isang orange theme
                        range_start: "!bg-[#FF4405] !text-white !rounded-l-lg !rounded-r-none hover:!bg-[#FF4405] z-10 relative",
                        range_end: "!bg-[#FF4405] !text-white !rounded-r-lg !rounded-l-none hover:!bg-[#FF4405] z-10 relative",
                        range_middle: "!bg-[#FFE0D1] !text-neutral-900 !rounded-none hover:!bg-[#FFE0D1] [&>button]:!text-neutral-900",

                        outside: "text-neutral-300 opacity-50",
                        disabled: "text-neutral-300 opacity-50",
                        hidden: "invisible",
                    }}
                    styles={{
                        range_middle: { borderRadius: 0 },
                        months: { position: "relative" },
                    }}
                />
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 bg-white px-6 py-4 shrink-0">
                <span className="text-sm font-medium text-neutral-600">
                    {duration ? `${duration} days ` : "Select dates"}
                    {from && `· ${format(from, "MMM d")}`}
                    {to && ` – ${format(from!, "MMM") === format(to, "MMM") ? format(to, "d") : format(to, "MMM d")}`}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={onClear}
                        className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                        disabled={!dateRange}
                    >
                        Clear
                    </button>
                    <button
                        onClick={onSave}
                        className="rounded-full bg-[#FF4405] px-4 py-2 text-sm font-bold text-white hover:bg-[#e63d05] transition-colors shadow-sm"
                    >
                        Save date
                    </button>
                </div>
            </div>
        </div>
    );
}
