import { ChevronRight } from "lucide-react";

interface QAListBlockProps {
    items: { question: string; answer: string }[];
    onAsk?: (question: string) => void;
}

export default function QAListBlock({ items, onAsk }: QAListBlockProps) {
    return (
        <div className="divide-y divide-neutral-100 bg-white">
            {items.map((item, i) => (
                <button
                    key={i}
                    onClick={() => onAsk?.(item.question)}
                    className="flex w-full items-center justify-between gap-3 bg-white py-4 text-left hover:bg-neutral-50/50 transition-colors group"
                >
                    <span className="text-[16px] text-neutral-600 group-hover:text-neutral-900 transition-colors font-semibold">
                        {item.question}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                </button>
            ))}
        </div>
    );
}
