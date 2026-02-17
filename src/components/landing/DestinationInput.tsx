"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin } from "lucide-react";

interface Destination {
    id: string;
    name: string;
    region: string;
    flag: string;
    country: string;
}

interface DestinationInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string; // Additional classes for the trigger
}

// ISO 3166-1 alpha-2 to Emoji Flag
function getCountryFlag(countryCode: string) {
    if (!countryCode) return "";
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export function DestinationInput({
    value,
    onChange,
    placeholder = "destination",
    className,
}: DestinationInputProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const isSelection = useRef(false);

    // Sync internal input state with prop value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Debounced Search Effect
    useEffect(() => {
        if (isSelection.current) {
            isSelection.current = false;
            return;
        }

        if (!inputValue || inputValue.length < 2) {
            setDestinations([]);
            if (open) setOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                        inputValue
                    )}&count=5&language=en&format=json`
                );
                const data = await response.json();

                if (data.results) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const mapped: Destination[] = data.results.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.name,
                        region: [item.admin1, item.country].filter(Boolean).join(", "),
                        country: item.country,
                        flag: getCountryFlag(item.country_code),
                    }));
                    setDestinations(mapped);
                    setOpen(true);
                } else {
                    setDestinations([]);
                }
            } catch (error) {
                console.error("Failed to fetch destinations", error);
                setDestinations([]);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [inputValue, open]);

    const handleSelect = (destination: Destination) => {
        isSelection.current = true;
        setInputValue(destination.name);
        onChange(destination.name);
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setInputValue(newVal);
        onChange(newVal);
        // Don't auto-open here, let the effect handle it after debounce to avoid flickering
    };

    return (
        <Popover open={open && destinations.length > 0} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <span className={cn("relative inline-block align-bottom mx-1 border-b border-transparent hover:border-neutral-200 focus-within:border-neutral-900 transition-colors", className)}>
                    {/* Invisible span to reserve width */}
                    <span
                        className="opacity-0 whitespace-pre font-semibold pointer-events-none min-w-[60px]"
                        aria-hidden="true"
                    >
                        {inputValue || placeholder}
                    </span>
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        className={cn(
                            "absolute inset-0 w-full h-full bg-transparent outline-none p-0 m-0 border-none font-semibold placeholder:text-neutral-300 focus:placeholder:text-neutral-200",
                            "text-neutral-900",
                            inputValue && "text-[#FF9C66]"
                        )}
                        placeholder={placeholder}
                        autoComplete="off"
                    />
                </span>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 w-[300px] border-none shadow-xl rounded-xl overflow-hidden bg-white"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="flex flex-col max-h-[300px] overflow-y-auto">
                    {destinations.map((destination) => (
                        <button
                            key={destination.id}
                            onClick={() => handleSelect(destination)}
                            className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors text-left group"
                        >
                            {/* Icon/Image Placeholder */}
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
                                {/* Using a generic MapPin icon if we don't have a reliable image source for every city in the world */}
                                <MapPin className="h-5 w-5" />
                            </div>

                            {/* Text info */}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-semibold text-neutral-900 group-hover:text-[#FF4405] transition-colors truncate">
                                    {destination.name}
                                </span>
                                <span className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 truncate">
                                    <span className="text-[10px]">{destination.flag}</span>
                                    {destination.region}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
