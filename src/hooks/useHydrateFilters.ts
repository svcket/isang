"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";

export function useHydrateFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const filterState = useAppStore((s) => s.filterState);
    const setFilter = useAppStore((s) => s.setFilter);

    // 1. Hydrate Store from URL on Mount
    React.useEffect(() => {
        if (!searchParams) return;

        // Destination
        const dest = searchParams.get("dest");
        if (dest && dest !== filterState.destination) {
            setFilter("destination", dest);
        }

        // Dates
        const start = searchParams.get("start");
        const end = searchParams.get("end");
        if ((start || end) && (start !== filterState.dates.start || end !== filterState.dates.end)) {
            setFilter("dates", { start, end });
        }

        // Travelers
        const adults = searchParams.get("adults");
        const children = searchParams.get("children");
        if (adults || children) {
            const parsedAdults = adults ? parseInt(adults, 10) : filterState.travelers.adults;
            const parsedChildren = children ? parseInt(children, 10) : filterState.travelers.children;
            if (parsedAdults !== filterState.travelers.adults || parsedChildren !== filterState.travelers.children) {
                setFilter("travelers", { adults: Math.max(1, parsedAdults), children: Math.max(0, parsedChildren) });
            }
        }

        // Budget
        const budgetAmount = searchParams.get("budget");
        const currency = searchParams.get("currency") as "USD" | "NGN" | null;
        if (budgetAmount) {
            const parsedAmount = parseInt(budgetAmount, 10);
            if (!isNaN(parsedAmount) && (parsedAmount !== filterState.budget.amount || currency !== filterState.budget.currency)) {
                setFilter("budget", {
                    amount: parsedAmount,
                    currency: currency || filterState.budget.currency
                });
            }
        }
    }, []); // Only run on mount to hydrate

    // 2. Sync Store to URL on Change
    React.useEffect(() => {
        // We defer to the next tick to avoid next.js router complaints during render
        const timeoutId = setTimeout(() => {
            if (!searchParams || !pathname) return;

            const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
            let changed = false;

            const updateParam = (key: string, value: string | null) => {
                if (value && currentParams.get(key) !== value) {
                    currentParams.set(key, value);
                    changed = true;
                } else if (!value && currentParams.has(key)) {
                    currentParams.delete(key);
                    changed = true;
                }
            };

            updateParam("dest", filterState.destination);
            updateParam("start", filterState.dates.start);
            updateParam("end", filterState.dates.end);

            // Only sync travelers if not default
            if (filterState.travelers.adults !== 1 || filterState.travelers.children !== 0) {
                updateParam("adults", filterState.travelers.adults.toString());
                updateParam("children", filterState.travelers.children.toString());
            } else {
                updateParam("adults", null);
                updateParam("children", null);
            }

            if (filterState.budget.amount) {
                updateParam("budget", filterState.budget.amount.toString());
                updateParam("currency", filterState.budget.currency);
            } else {
                updateParam("budget", null);
                updateParam("currency", null);
            }

            if (changed) {
                router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
            }
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [filterState, pathname, router, searchParams]);
}
