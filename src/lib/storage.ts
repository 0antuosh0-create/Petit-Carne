import type { Level, Phrase } from "../data/phrases";

export type Entry = {
  id: string;
  french: string;
  english: string;
  say: string;
  note: string;
  category: string;
  level: Level;
  addedAt: number;
  /** Leitner box 1..5 */
  box: number;
  reviews: number;
  correct: number;
  lastReviewed: number | null;
  favorite: boolean;
  source: "library" | "custom";
};

export type Settings = {
  theme: "light" | "dark";
  voiceURI: string | null;
  rate: number;
  autoSpeak: boolean;
  lastDay: string | null;
  streak: number;
};

export const ENTRIES_KEY = "carnet.entries.v2";
export const SETTINGS_KEY = "carnet.settings.v2";

export const defaultSettings: Settings = {
  theme: "light",
  voiceURI: null,
  rate: 0.9,
  autoSpeak: false,
  lastDay: null,
  streak: 0,
};

function localDay(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

/** Increments (or resets) the daily streak. Safe to call on every load. */
export function tickStreak(settings: Settings): Settings {
  const today = new Date();
  const todayKey = localDay(today);
  if (settings.lastDay === todayKey) return settings;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const streak = settings.lastDay === localDay(yesterday) ? settings.streak + 1 : 1;

  return { ...settings, lastDay: todayKey, streak };
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function entryFromPhrase(phrase: Phrase): Entry {
  return {
    id: uid(),
    french: phrase.french,
    english: phrase.english,
    say: phrase.say,
    note: phrase.note,
    category: phrase.category,
    level: phrase.level,
    addedAt: Date.now(),
    box: 1,
    reviews: 0,
    correct: 0,
    lastReviewed: null,
    favorite: false,
    source: "library",
  };
}

function sanitize(raw: unknown): Entry | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<Entry>;
  if (typeof item.french !== "string" || typeof item.english !== "string") return null;
  if (!item.french.trim() || !item.english.trim()) return null;

  return {
    id: typeof item.id === "string" ? item.id : uid(),
    french: item.french.trim(),
    english: item.english.trim(),
    say: typeof item.say === "string" ? item.say : "",
    note: typeof item.note === "string" ? item.note : "",
    category: typeof item.category === "string" ? item.category : "My words",
    level: item.level === "A2" || item.level === "B1" ? item.level : "A1",
    addedAt: typeof item.addedAt === "number" ? item.addedAt : Date.now(),
    box: typeof item.box === "number" ? Math.min(5, Math.max(1, item.box)) : 1,
    reviews: typeof item.reviews === "number" ? item.reviews : 0,
    correct: typeof item.correct === "number" ? item.correct : 0,
    lastReviewed: typeof item.lastReviewed === "number" ? item.lastReviewed : null,
    favorite: Boolean(item.favorite),
    source: item.source === "custom" ? "custom" : "library",
  };
}

export function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitize).filter((item): item is Entry => item !== null);
  } catch {
    return [];
  }
}

export function saveEntries(entries: Entry[]) {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    /* storage full or unavailable */
  }
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const base: Settings = { ...defaultSettings, theme: prefersDark ? "dark" : "light" };
    if (!raw) return base;
    return { ...base, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

export type BackupFile = {
  app: "petit-carnet";
  version: 2;
  exportedAt: string;
  count: number;
  entries: Entry[];
};

export function makeBackup(entries: Entry[]): BackupFile {
  return {
    app: "petit-carnet",
    version: 2,
    exportedAt: new Date().toISOString(),
    count: entries.length,
    entries,
  };
}

export function parseBackup(text: string): Entry[] {
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed?.entries;
  if (!Array.isArray(list)) throw new Error("This file does not contain a Petit Carnet backup.");
  const entries = list.map(sanitize).filter((item): item is Entry => item !== null);
  if (!entries.length) throw new Error("No valid phrases found in that file.");
  return entries;
}

export function mergeEntries(current: Entry[], incoming: Entry[]) {
  const seen = new Map(current.map((entry) => [normalize(entry.french), entry]));
  let added = 0;
  let skipped = 0;

  for (const entry of incoming) {
    const key = normalize(entry.french);
    if (seen.has(key)) {
      skipped += 1;
      continue;
    }
    seen.set(key, { ...entry, id: uid() });
    added += 1;
  }

  return { entries: [...seen.values()].sort((a, b) => b.addedAt - a.addedAt), added, skipped };
}

/** Leitner intervals in days per box. */
const INTERVALS = [0, 1, 2, 4, 8, 16];

export function isDue(entry: Entry, now = Date.now()) {
  if (entry.lastReviewed === null) return true;
  const days = INTERVALS[Math.min(entry.box, 5)];
  return now - entry.lastReviewed >= days * 24 * 60 * 60 * 1000;
}

export function gradeEntry(entry: Entry, known: boolean): Entry {
  return {
    ...entry,
    box: known ? Math.min(5, entry.box + 1) : 1,
    reviews: entry.reviews + 1,
    correct: entry.correct + (known ? 1 : 0),
    lastReviewed: Date.now(),
  };
}
