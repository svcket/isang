import React from "react";
import * as Icons from "lucide-react";

interface InfoGridBlockProps {
    items: { label: string; value?: string; icon?: string }[];
}

export default function InfoGridBlock({ items }: InfoGridBlockProps) {
    return (
        <div className="space-y-4">
            {items.map((item) => {
                const IconComponent = item.icon ? (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.icon] : null;

                return (
                    <div 
                        key={item.label}
                        className="flex items-start gap-2.5"
                    >
                        {IconComponent && <IconComponent className="mt-[2px] h-3.5 w-3.5 text-neutral-700" />}
                        <div>
                            <p className="text-[11px] font-medium text-neutral-900 leading-none">
                                {item.label}
                            </p>
                            {item.value && (
                                <p className="mt-1 text-[10px] text-neutral-500">
                                    {item.value}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
