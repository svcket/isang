import { BudgetTier, TypicalCost, Action } from "@/types";
import { Coins, Coffee, Ticket, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CostSnapshotBlockProps {
    currency: string;
    tiers: BudgetTier[];
    typicals: TypicalCost[];
    actions: Action[];
    onAction?: (id: string) => void;
}

export default function CostSnapshotBlock({ currency, tiers, typicals, actions, onAction }: CostSnapshotBlockProps) {
    return (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                <Coins className="w-4 h-4" />
                <span className="text-sm">Estimated Daily Costs ({currency})</span>
            </div>

            {/* Budget Tiers Grid */}
            <div className="grid grid-cols-3 gap-3">
                {tiers.map((tier) => (
                    <div key={tier.label} className="flex flex-col p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{tier.label}</span>
                        <span className="text-sm font-semibold text-slate-900 mb-0.5">{tier.range}</span>
                        <span className="text-[10px] text-slate-500 leading-tight">{tier.note}</span>
                    </div>
                ))}
            </div>

            {/* Typical Costs Row */}
            <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-200/60">
                {typicals.map((item) => (
                    <div key={item.label} className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                            {getIcon(item.label)}
                            {item.label}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{item.value}</span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            {actions && actions.length > 0 && (
                <div className="pt-2">
                    {actions.map(action => (
                        <Button
                            key={action.action_id}
                            variant="default" // Force primary for visibility in this block
                            size="sm"
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 h-8 text-xs"
                            onClick={() => onAction?.(action.action_id)}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

function getIcon(label: string) {
    const l = label.toLowerCase();
    if (l.includes("coffee")) return <Coffee className="w-3 h-3" />;
    if (l.includes("meal") || l.includes("food")) return <Utensils className="w-3 h-3" />;
    if (l.includes("transit") || l.includes("transport")) return <Ticket className="w-3 h-3" />;
    return <Coins className="w-3 h-3" />;
}
