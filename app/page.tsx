"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/Chip";
import { Toast } from "@/components/Toast";
import {
    addCustomChip,
    addMomentsForDate,
    getCustomChips,
} from "@/lib/storage";

const BASE_MOMENT_CHIPS: string[] = [
    "Got a nice coffee",
    "Sunny day",
    "Got enough rest",
    "Ate something I like",
    "Didn't snooze",
    "Met a cute dog",
    "Soft day",
    "Listened to a song I like",
    "Had a good stretch",
    "Got a kind message",
    "Took a deep breath",
    "Felt proud of myself",
];

const SUCCESS_MESSAGES: string[] = [
    "Kept today’s little moments. Nice.",
    "Saved. Future you will like this.",
    "Little moments tucked away for today.",
    "Noted. Today had something soft.",
    "Stored in your year of little things.",
];

export default function HomePage() {
    const [chips, setChips] = useState<string[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [customInput, setCustomInput] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        const shuffle = <T,>(items: T[]): T[] => {
            const copy = [...items];
            for (let i = copy.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
        };

        const savedCustom = getCustomChips();
        const baseToday = shuffle(BASE_MOMENT_CHIPS).slice(0, 6);
        const merged = new Set<string>([...baseToday, ...savedCustom]);
        setChips(Array.from(merged));
    }, []);

    const toggleChip = (label: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(label)) {
                next.delete(label);
            } else {
                next.add(label);
            }
            return next;
        });
    };

    const handleAddCustom = () => {
        const trimmed = customInput.trim();
        if (!trimmed) return;

        setChips((prev) => {
            if (prev.includes(trimmed)) {
                return prev;
            }
            return [...prev, trimmed];
        });

        addCustomChip(trimmed);
        setSelected((prev) => new Set(prev).add(trimmed));
        setCustomInput("");
    };

    const handleKeepThis = () => {
        const trimmedInput = customInput.trim();

        if (selected.size === 0 && !trimmedInput) {
            setToastMessage("Pick at least one little moment to keep.");
            return;
        }

        const today = new Date();
        const momentsToSave = [...Array.from(selected)];
        if (trimmedInput) {
            momentsToSave.push(trimmedInput);
        }

        addMomentsForDate(today, momentsToSave);
        setSelected(new Set());
        if (trimmedInput) {
            setCustomInput("");
        }
        const randomMessage =
            SUCCESS_MESSAGES[
                Math.floor(Math.random() * SUCCESS_MESSAGES.length)
            ];
        setToastMessage(randomMessage);
    };

    const hasSelection = selected.size > 0 || customInput.trim().length > 0;

    return (
        <>
            <section
                aria-labelledby='home-heading'
                className='flex min-h-0 flex-col'>
                <header className='mb-3'>
                    <h1
                        id='home-heading'
                        className='headingtext'>
                        <img
                            src='/img/nicethings-logo-01.png'
                            alt='NiceThingsToday logo'
                            className='heading-logo'
                        />
                        <span className='heading-copy'>
                            Hi Beau,
                            <br />
                            what felt nice today?
                        </span>
                    </h1>
                </header>

                <div className='flex min-h-0 flex-1 flex-col gap-3'>
                    <div className='flex flex-wrap justify-between gap-2'>
                        {chips.map((chip) => (
                            <Chip
                                key={chip}
                                label={chip}
                                selected={selected.has(chip)}
                                onToggle={() => toggleChip(chip)}
                            />
                        ))}
                    </div>

                    <div className='mt-2'>
                        <label className='block text-xs sm:text-sm md:text-base font-bold text-white'>
                            Add your own....
                            <div className='mt-2 relative'>
                                <input
                                    type='text'
                                    value={customInput}
                                    onChange={(event) =>
                                        setCustomInput(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleAddCustom();
                                        }
                                    }}
                                    className='w-full rounded-[32px] border-0 bg-card px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                                />
                                {customInput.length === 0 && (
                                    <div
                                        className='pointer-events-none absolute inset-0 flex items-end justify-center pb-3'
                                        aria-hidden='true'>
                                        <div className='flex gap-[6px]'>
                                            {Array.from({ length: 16 }).map(
                                                (_, index) => (
                                                    <span
                                                        // eslint-disable-next-line react/no-array-index-key
                                                        key={index}
                                                        className='h-2 w-2 rounded-full bg-orange-500'
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>

                    <div className='mt-auto flex justify-center pt-1'>
                        <button
                            type='button'
                            onClick={handleKeepThis}
                            aria-label='Keep the selected nice moments for today'
                            disabled={!hasSelection}
                            className={[
                                "inline-flex items-center justify-center rounded-full px-5 py-1.5 text-sm font-semibold transition",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                hasSelection
                                    ? "bg-card text-accent shadow-[0_6px_0_rgba(0,0,0,0.14)] hover:translate-y-[1px] hover:shadow-[0_5px_0_rgba(0,0,0,0.12)]"
                                    : "bg-card/60 text-foreground/40 shadow-[0_6px_0_rgba(0,0,0,0.08)] cursor-not-allowed",
                            ].join(" ")}>
                            Keep this
                        </button>
                    </div>
                </div>
            </section>

            <Toast
                message={toastMessage}
                onDismiss={() => setToastMessage(null)}
            />
        </>
    );
}
