import { formatHumanDate, getNthDayOfYear, toISODate } from "@/lib/dates";
import type { MomentEntries } from "@/lib/storage";

type DotDay = {
  date: Date;
};

type DotGridProps = {
  days: DotDay[];
  entries: MomentEntries;
  activeISO?: string | null;
  onDayClick: (day: Date, rect: DOMRect) => void;
};

export function DotGrid({ days, entries, activeISO, onDayClick }: DotGridProps) {
  return (
    <div className="mt-[1dvh] flex-1 min-h-0" aria-label="Year in little moments">
      <div className="h-full p-0.5">
        <div className="grid h-full content-start grid-cols-14 gap-[0.55dvh] sm:gap-[0.55dvh] md:gap-[0.7dvh] lg:gap-[0.8dvh]">
        {days.map((day) => {
          const iso = toISODate(day.date);
          const hasMoments = Boolean(entries[iso]?.length);
          const isActive = activeISO === iso;

          const labelParts = [
            `${getNthDayOfYear(day.date)}th day of the year`,
            formatHumanDate(day.date),
            hasMoments ? "has saved moments" : "no saved moments yet",
          ];

          return (
            <button
              key={iso}
              type="button"
              aria-label={labelParts.join(" · ")}
              aria-pressed={isActive}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                onDayClick(day.date, rect);
              }}
              className={[
                "h-[1.05dvh] w-[1.05dvh] min-h-[8px] min-w-[8px] sm:h-[1.05dvh] sm:w-[1.05dvh] md:h-[1.15dvh] md:w-[1.15dvh] lg:h-[1.25dvh] lg:w-[1.25dvh] rounded-full border transition-transform transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                hasMoments
                  ? "border-transparent bg-accent shadow-[0_0_0_1px_rgba(124,58,237,0.65)] hover:bg-accent/90"
                  : "border-transparent bg-white/95 hover:bg-white",
                isActive
                  ? "scale-125 ring-2 ring-purple-300/70 ring-offset-1 ring-offset-transparent"
                  : "hover:scale-110",
              ].join(" ")}
            />
          );
        })}
        </div>
      </div>
    </div>
  );
}

