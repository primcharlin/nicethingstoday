"use client";

import { useEffect, useMemo, useState } from "react";
import { DotGrid } from "@/components/DotGrid";
import { OverlayCard } from "@/components/OverlayCard";
import { formatHumanDate, getNthDayOfYear, getYearDays, toISODate } from "@/lib/dates";
import { getAllEntries, type MomentEntries } from "@/lib/storage";

type OverlayState = {
  date: Date;
  iso: string;
  moments: string[];
} | null;

export default function YearPage() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [entries, setEntries] = useState<MomentEntries>({});
  const [overlayState, setOverlayState] = useState<OverlayState>(null);

  useEffect(() => {
    setEntries(getAllEntries());
  }, []);

  const days = useMemo(
    () => getYearDays(year).map((date) => ({ date })),
    [year]
  );

  const activeISO = overlayState?.iso ?? null;

  const handleDayClick = (date: Date, rect: DOMRect) => {
    const iso = toISODate(date);
    const moments = entries[iso] ?? [];

    setOverlayState({
      date,
      iso,
      moments,
    });
  };

  const handleCloseOverlay = () => {
    setOverlayState(null);
  };

  const dayOfYearLabel = overlayState
    ? `${getNthDayOfYear(overlayState.date)}th day of the year`
    : "";

  const dateLabel = overlayState ? formatHumanDate(overlayState.date) : "";

  return (
    <>
      <section aria-labelledby="year-heading">
        <header className="mb-4 flex items-center justify-between gap-3">
          <h1
            id="year-heading"
            className="heading-primary text-xl sm:text-2xl font-black tracking-tight"
          >
            Your year in little moments
          </h1>
          <div className="flex items-center gap-1 rounded-full bg-card/80 px-2 py-1 shadow-sm text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setYear((prev) => prev - 1)}
                aria-label="View previous year"
                className="rounded-full px-2 py-1 text-xs text-foreground/70 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                ←
              </button>
              <span className="px-2 text-xs font-semibold text-foreground/80">
                {year}
              </span>
              <button
                type="button"
                onClick={() => setYear((prev) => prev + 1)}
                aria-label="View next year"
                className="rounded-full px-2 py-1 text-xs text-foreground/70 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                →
              </button>
          </div>
        </header>

        <DotGrid
          days={days}
          entries={entries}
          activeISO={activeISO}
          onDayClick={handleDayClick}
        />
      </section>

      <OverlayCard
        isOpen={Boolean(overlayState)}
        title={overlayState ? dayOfYearLabel : ""}
        subtitle={overlayState ? dateLabel : undefined}
        onClose={handleCloseOverlay}
      >
        {overlayState && overlayState.moments.length > 0 ? (
          <div className="mt-2 rounded-2xl bg-pink-300/90 px-4 py-3 text-xs text-white shadow-inner">
            <ul className="space-y-1.5">
              {overlayState.moments.map((moment) => (
                <li key={moment} className="flex items-center justify-between gap-2">
                  <span className="text-sm">☺︎</span>
                  <span className="flex-1 text-right font-medium">{moment}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-2 text-xs text-emerald-50/90">
            When you keep a few nice things for this date, they&apos;ll show up
            here as a tiny cluster of memories.
          </p>
        )}
      </OverlayCard>
    </>
  );
}

