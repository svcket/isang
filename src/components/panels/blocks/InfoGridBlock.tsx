interface InfoGridBlockProps {
    items: { label: string; value: string; icon?: string }[];
}

export default function InfoGridBlock({ items }: InfoGridBlockProps) {
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {items.map((item) => (
                <div key={item.label}>
                    <span className="text-[12px] text-neutral-400 uppercase tracking-wide">
                        {item.label}
                    </span>
                    <span className="block text-[14px] text-neutral-900 font-medium mt-0.5">
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
