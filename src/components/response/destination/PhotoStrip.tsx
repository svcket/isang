import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoStripProps {
    urls: string[];
    title: string; // for alt text
}

export default function PhotoStrip({ urls, title }: PhotoStripProps) {
    if (!urls || urls.length === 0) return null;

    // Limit to 4 images
    const displayUrls = urls.slice(0, 4);

    return (
        <div className="flex gap-1.5 mt-3 mb-3 overflow-hidden rounded-lg h-24 sm:h-28 w-full">
            {displayUrls.map((url, index) => (
                <div key={index} className="relative flex-1 bg-muted">
                    <Image
                        src={url}
                        alt={`${title} photo ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover hover:opacity-90 transition-opacity"
                        sizes="(max-width: 768px) 25vw, 120px"
                    />
                </div>
            ))}
        </div>
    );
}
