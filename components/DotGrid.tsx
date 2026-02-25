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
    <div className="mt-4" aria-label="Year in little moments">
      <div className="grid grid-cols-14 gap-1.5">
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
                "h-2.5 w-2.5 rounded-full border transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                hasMoments
                  ? "border-transparent bg-accent shadow-[0_0_0_1px_rgba(124,58,237,0.65)]"
                  : "border-transparent bg-white hover:bg-white/90",
                isActive ? "scale-110" : "hover:scale-[1.05]",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}

