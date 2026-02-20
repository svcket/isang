import * as React from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BudgetPanelProps {
    onClose: () => void;
}

export function BudgetPanel({ onClose }: BudgetPanelProps) {
    const filterState = useAppStore((s) => s.filterState);
    const setFilter = useAppStore((s) => s.setFilter);
    const clearFilter = useAppStore((s) => s.clearFilter);

    const [amount, setAmount] = React.useState<string>(
        filterState.budget.amount ? filterState.budget.amount.toString() : ""
    );
    const [currency, setCurrency] = React.useState<"USD" | "NGN">(filterState.budget.currency);

    const handleApply = () => {
        const parsed = parseInt(amount.replace(/\D/g, ''), 10);
        if (isNaN(parsed) || parsed <= 0) {
            clearFilter("budget");
        } else {
            setFilter("budget", { amount: parsed, currency });
        }
        onClose();
    };

    const handleClear = () => {
        setAmount("");
        setCurrency("USD");
        clearFilter("budget");
    };

    return (
        <div className="flex flex-col h-full w-full p-4">

            <div className="flex flex-col gap-6 py-4 flex-1">

                {/* Currency Toggle */}
                <div className="flex flex-col gap-2">
                    <span className="font-medium text-neutral-900">Currency</span>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${currency === "USD" ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800" : "hover:bg-neutral-100"}`}
                            onClick={() => setCurrency("USD")}
                        >
                            USD ($)
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${currency === "NGN" ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800" : "hover:bg-neutral-100"}`}
                            onClick={() => setCurrency("NGN")}
                        >
                            NGN (₦)
                        </Badge>
                    </div>
                </div>

                {/* Amount Input */}
                <div className="flex flex-col gap-2">
                    <span className="font-medium text-neutral-900">Maximum Budget</span>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                            {currency === "USD" ? "$" : "₦"}
                        </span>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 5000"
                            className="pl-8 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:border-neutral-300 rounded-lg h-12 text-lg font-medium"
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 pt-4 mt-2 shrink-0 flex items-center justify-between bg-white">
                <Button
                    variant="ghost"
                    onClick={handleClear}
                    disabled={!amount && !filterState.budget.amount}
                    className="text-sm font-medium underline text-neutral-600 hover:text-neutral-900 px-0 hover:bg-transparent disabled:opacity-50 disabled:no-underline"
                >
                    Clear
                </Button>
                <Button
                    onClick={handleApply}
                    className="bg-[#FF4405] text-white rounded-full px-6 hover:bg-[#e63d05]"
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}
