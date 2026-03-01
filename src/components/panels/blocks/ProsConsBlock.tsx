import { Check, X } from "lucide-react";

interface ProsConsBlockProps {
    pros: string[];
    cons: string[];
}

export default function ProsConsBlock({ pros, cons }: ProsConsBlockProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Pros */}
            <div className="space-y-1.5">
                {pros.map((p) => (
                    <div key={p} className="flex items-start gap-1.5 text-[13px] text-green-700">
                        <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>{p}</span>
                    </div>
                ))}
            </div>

            {/* Cons */}
            <div className="space-y-1.5">
                {cons.map((c) => (
                    <div key={c} className="flex items-start gap-1.5 text-[13px] text-red-600">
                        <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>{c}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
