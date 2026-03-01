import { MessageCircleQuestion } from "lucide-react";

interface QAListBlockProps {
    items: { q: string; action: string; payload?: unknown }[];
    onAsk?: (question: string) => void;
}

export default function QAListBlock({ items, onAsk }: QAListBlockProps) {
    return (
        <div className="space-y-1">
            {items.map((item) => (
                <button
                    key={item.q}
                    onClick={() => onAsk?.(item.q)}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors group"
                >
                    <MessageCircleQuestion className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 flex-shrink-0" />
                    <span className="text-[13px] text-neutral-600 group-hover:text-neutral-900 transition-colors">
                        {item.q}
                    </span>
                </button>
            ))}
        </div>
    );
}
