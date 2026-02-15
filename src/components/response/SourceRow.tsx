import { MapPin } from "lucide-react";

interface SourceRowProps {
    sources: string[];
}

export default function SourceRow({ sources }: SourceRowProps) {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="flex items-center gap-2 mt-3 mb-1 px-1">
            <span className="text-xs text-blue-500/80 italic hover:underline cursor-pointer transition-all">
                Sources <span className="mx-1">~</span> {sources.join(", ")}
            </span>
        </div>
    );
}
