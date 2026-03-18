type ChipProps = {
    label: string;
    selected: boolean;
    onToggle: () => void;
};

export function Chip({ label, selected, onToggle }: ChipProps) {
    return (
        <button
            type='button'
            onClick={onToggle}
            aria-pressed={selected}
            className={[
                "inline-flex w-[46%] min-h-[130px] md:min-h-[150px] lg:min-h-[180px] items-center justify-center rounded-[32px] border-0 px-4 text-center text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-bold tracking-tight leading-snug transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected ? "bg-accent text-white" : "bg-card text-accent",
            ].join(" ")}>
            {label}
        </button>
    );
}
