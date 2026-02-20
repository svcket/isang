interface DestinationIntroBlockProps {
    text: string;
}

export default function DestinationIntroBlock({ text }: DestinationIntroBlockProps) {
    return (
        <div className="text-[15px] text-neutral-600 leading-relaxed">
            <p className="m-0">{text}</p>
        </div>
    );
}
