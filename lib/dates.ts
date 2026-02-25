import {
  eachDayOfInterval,
  endOfYear,
  format,
  getDayOfYear,
  startOfYear,
} from "date-fns";

export const ISO_DATE_FORMAT = "yyyy-MM-dd";

export function toISODate(date: Date): string {
  return format(date, ISO_DATE_FORMAT);
}

export function getTodayISO(): string {
  return toISODate(new Date());
}

export function getYearDays(year: number): Date[] {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));

  return eachDayOfInterval({ start, end });
}

export function getNthDayOfYear(date: Date): number {
  return getDayOfYear(date);
}

export function formatHumanDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

