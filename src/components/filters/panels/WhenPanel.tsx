import * as React from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAppStore } from "@/lib/store";
import { DateRangePicker } from "@/components/ui/DateRangePicker";

interface WhenPanelProps {
    onClose: () => void;
}

export function WhenPanel({ onClose }: WhenPanelProps) {
    const filterState = useAppStore((s) => s.filterState);
    const setFilter = useAppStore((s) => s.setFilter);
    const clearFilter = useAppStore((s) => s.clearFilter);

    // Initialize local state from global store
    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        const { start, end } = filterState.dates;
        if (!start) return undefined;
        const parseLocal = (ds: string) => {
            const [y, m, d] = ds.split('-').map(Number);
            return new Date(y!, m! - 1, d);
        };
        return {
            from: parseLocal(start),
            to: end ? parseLocal(end) : undefined
        };
    });

    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate);
        // Sync immediately to global store so pill updates in real-time
        if (!newDate?.from) {
            clearFilter("dates");
        } else {
            setFilter("dates", {
                start: format(newDate.from, "yyyy-MM-dd"),
                end: newDate.to ? format(newDate.to, "yyyy-MM-dd") : null,
            });
        }
    };

    const handleApply = () => {
        onClose();
    };

    const handleClear = () => {
        setDate(undefined);
        clearFilter("dates");
    };

    return (
        <DateRangePicker
            dateRange={date}
            onDateRangeChange={handleDateChange}
            onClear={handleClear}
            onSave={handleApply}
        />
    );
}
