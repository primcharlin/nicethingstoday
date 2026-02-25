import { toISODate } from "./dates";

type MomentEntries = Record<string, string[]>;

const ENTRIES_KEY = "nicethings.entries.v1";
const CUSTOM_CHIPS_KEY = "nicethings.custom-chips.v1";

const isBrowser = () => typeof window !== "undefined";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readEntries(): MomentEntries {
  if (!isBrowser()) return {};
  const raw = window.localStorage.getItem(ENTRIES_KEY);
  return safeParse<MomentEntries>(raw, {});
}

function writeEntries(entries: MomentEntries): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function getAllEntries(): MomentEntries {
  return readEntries();
}

export function getMomentsForDate(date: Date): string[] {
  const iso = toISODate(date);
  const entries = readEntries();
  return entries[iso] ?? [];
}

export function addMomentsForDate(date: Date, moments: string[]): void {
  if (!isBrowser()) return;

  const iso = toISODate(date);
  const entries = readEntries();
  const existing = new Set(entries[iso] ?? []);

  for (const moment of moments) {
    const trimmed = moment.trim();
    if (trimmed) {
      existing.add(trimmed);
    }
  }

  if (existing.size === 0) {
    delete entries[iso];
  } else {
    entries[iso] = Array.from(existing);
  }

  writeEntries(entries);
}

export function getCustomChips(): string[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(CUSTOM_CHIPS_KEY);
  const list = safeParse<string[]>(raw, []);
  return Array.from(
    new Set(
      list
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    )
  );
}

export function addCustomChip(label: string): void {
  if (!isBrowser()) return;

  const trimmed = label.trim();
  if (!trimmed) return;

  const existing = getCustomChips();
  if (existing.includes(trimmed)) return;

  const updated = [...existing, trimmed];
  window.localStorage.setItem(CUSTOM_CHIPS_KEY, JSON.stringify(updated));
}

export type { MomentEntries };

