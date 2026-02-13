"use client";

import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
    CheckCircle2,
    AlertCircle,
    Clock,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    FileText,
    Wallet,
    MapPin,
} from "lucide-react";
import { useState } from "react";
import type { EntryRequirements, VisaStatus } from "@/types";

const visaStatusConfig: Record<
    VisaStatus,
    { label: string; className: string; icon: React.ElementType }
> = {
    visa_free: {
        label: "Visa Free",
        className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
        icon: CheckCircle2,
    },
    visa_on_arrival: {
        label: "Visa on Arrival",
        className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
        icon: Clock,
    },
    evisa: {
        label: "eVisa Required",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
        icon: FileText,
    },
    embassy_visa: {
        label: "Embassy Visa Required",
        className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
        icon: AlertCircle,
    },
};

export default function EntryRequirementsCard({
    data,
}: {
    data: EntryRequirements;
}) {
    const [showHelpful, setShowHelpful] = useState(false);
    const statusConfig = visaStatusConfig[data.essential.visaStatus];
    const StatusIcon = statusConfig.icon;

    return (
        <div className="space-y-4">
            {/* ─── Essential (Always Visible) ───────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-500" />
                    <h3
                        className="text-base font-semibold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Entry Requirements
                    </h3>
                </div>

                {/* Status Pill */}
                <div className="flex items-center gap-3">
                    <Badge
                        className={`${statusConfig.className} text-xs font-medium px-3 py-1 rounded-full`}
                    >
                        <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                        {statusConfig.label}
                    </Badge>
                </div>

                {/* Summary */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.essential.summary}
                </p>

                {/* Quick Facts */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Passport Validity
                        </p>
                        <p className="text-sm font-medium mt-0.5">
                            {data.essential.passportValidity}
                        </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Allowed Stay
                        </p>
                        <p className="text-sm font-medium mt-0.5">
                            {data.essential.allowedStay}
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Helpful (Expandable) ─────────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                    onClick={() => setShowHelpful(!showHelpful)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                    <span className="text-sm font-medium">
                        Documents & requirements details
                    </span>
                    {showHelpful ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>

                {showHelpful && (
                    <div className="px-4 pb-4 space-y-3">
                        <Separator />
                        {/* Documents */}
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                                Documents Required
                            </p>
                            <div className="space-y-1.5">
                                {data.helpful.documentsRequired.map((doc) => (
                                    <div key={doc} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span>{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {data.helpful.entryFee && (
                            <div className="flex items-center gap-2">
                                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">
                                    Entry fee: <strong>{data.helpful.entryFee}</strong>
                                </span>
                            </div>
                        )}

                        {data.helpful.processingTime && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">
                                    Processing: <strong>{data.helpful.processingTime}</strong>
                                </span>
                            </div>
                        )}

                        {data.helpful.whereToApply && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">
                                    Apply at: <strong>{data.helpful.whereToApply}</strong>
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ─── Actionable ───────────────────────────────────────────── */}
            {data.actionable.length > 0 && (
                <div className="space-y-2">
                    {data.actionable.map((action, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            className="w-full justify-between text-left h-auto py-3"
                        >
                            <div>
                                <p className="text-sm font-medium">{action.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {action.description}
                                </p>
                            </div>
                            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
