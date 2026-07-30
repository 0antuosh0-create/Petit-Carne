import { useRef, useState } from "react";
import { PHRASES } from "../data/phrases";
import {
  makeBackup,
  mergeEntries,
  parseBackup,
  type Entry,
  type Settings,
} from "../lib/storage";
import { useFrenchVoices } from "../lib/speech";
import Menu from "./Menu";
import { IconDownload, IconSpeaker, IconUpload } from "./icons";
import { SectionHeader } from "./ui";

type Props = {
  entries: Entry[];
  settings: Settings;
  onSettings: (settings: Settings) => void;
  onReplace: (entries: Entry[]) => void;
  onSpeak: (text: string) => void;
};

const importMode = { current: "merge" as "merge" | "replace" };

export default function DataPanel({ entries, settings, onSettings, onReplace, onSpeak }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);
  const { supported, frenchVoices } = useFrenchVoices();

  function downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    downloadBlob(
      new Blob([JSON.stringify(makeBackup(entries), null, 2)], { type: "application/json" }),
      `petit-carnet-${new Date().toISOString().slice(0, 10)}.json`,
    );
    setStatus({ tone: "ok", text: `Exported ${entries.length} phrases as a JSON backup.` });
  }

  function exportCsv() {
    const rows = [
      ["french", "english", "pronunciation", "category", "level", "note"],
      ...entries.map((entry) => [
        entry.french,
        entry.english,
        entry.say,
        entry.category,
        entry.level,
        entry.note,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv" }), "petit-carnet.csv");
    setStatus({ tone: "ok", text: "Exported a CSV copy for spreadsheets." });
  }

  async function importFile(file: File, mode: "merge" | "replace") {
    try {
      const incoming = parseBackup(await file.text());

      if (mode === "replace") {
        onReplace(incoming);
        setStatus({ tone: "ok", text: `Replaced your notebook with ${incoming.length} phrases.` });
        return;
      }

      const merged = mergeEntries(entries, incoming);
      onReplace(merged.entries);
      setStatus({
        tone: "ok",
        text: `Imported ${merged.added} new phrases — ${merged.skipped} duplicates skipped.`,
      });
    } catch (error) {
      setStatus({ tone: "bad", text: error instanceof Error ? error.message : "Could not read that file." });
    }
  }

  const card = "panel rounded-[1.4rem] p-6 sm:p-7";
  const ghostButton =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-card px-5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-pine/50 hover:text-pine";

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="Sauvegarde"
        title="Backup & settings"
        subtitle="Your notebook lives only in this browser. Keep a copy, restore it anywhere, and tune the pronunciation voice."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={card}>
          <h2 className="text-lg font-semibold tracking-tight">Backup</h2>
          <p className="mt-1 text-sm text-mute">
            Export a file to keep a safe copy or move your notebook to another device.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportJson}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-paper transition hover:-translate-y-0.5 dark:bg-stone-100 dark:text-slate-950"
            >
              <IconDownload className="h-4 w-4" /> Export JSON
            </button>
            <button type="button" onClick={exportCsv} className={ghostButton}>
              <IconDownload className="h-4 w-4" /> Export CSV
            </button>
          </div>
          <p className="mt-4 text-xs text-mute">
            {entries.length} phrase{entries.length === 1 ? "" : "s"} · every change is saved automatically
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-semibold tracking-tight">Import</h2>
          <p className="mt-1 text-sm text-mute">
            Restore a JSON backup. Merging keeps what you have and skips duplicates.
          </p>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importFile(file, importMode.current);
              event.target.value = "";
            }}
          />
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                importMode.current = "merge";
                fileInput.current?.click();
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-pinedeep dark:text-slate-950"
            >
              <IconUpload className="h-4 w-4" /> Merge backup
            </button>
            <button
              type="button"
              onClick={() => {
                importMode.current = "replace";
                fileInput.current?.click();
              }}
              className={ghostButton}
            >
              <IconUpload className="h-4 w-4" /> Replace all
            </button>
          </div>
          {status && (
            <p
              className={`animate-soft-in mt-4 rounded-2xl px-4 py-3 text-sm ${
                status.tone === "ok" ? "bg-pinesoft text-pine" : "bg-danger/10 text-danger"
              }`}
            >
              {status.text}
            </p>
          )}
        </section>

        <section className={card}>
          <h2 className="text-lg font-semibold tracking-tight">Pronunciation voice</h2>
          <p className="mt-1 text-sm text-mute">
            {supported
              ? "Uses the French voices already on your device — no internet needed."
              : "This browser has no speech engine, so rely on the written “say it” hints."}
          </p>

          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <span className="text-sm font-semibold">Voice</span>
              <Menu
                value={settings.voiceURI ?? "auto"}
                onChange={(value) => onSettings({ ...settings, voiceURI: value === "auto" ? null : value })}
                label="Voice"
                searchable={frenchVoices.length > 6}
                placeholder="Search voices…"
                className="w-full [&>button]:w-full [&>button]:justify-between"
                options={[
                  { value: "auto", label: "Automatic French voice", hint: "Best available on this device" },
                  ...frenchVoices.map((voice) => ({
                    value: voice.voiceURI,
                    label: voice.name,
                    hint: voice.lang,
                  })),
                ]}
              />
            </div>

            <label className="block space-y-2">
              <span className="flex items-center justify-between text-sm font-semibold">
                Speed <span className="font-normal text-mute">{settings.rate.toFixed(1)}×</span>
              </span>
              <input
                type="range"
                min={0.5}
                max={1.3}
                step={0.1}
                value={settings.rate}
                onChange={(event) => onSettings({ ...settings, rate: Number(event.target.value) })}
                className="w-full accent-[var(--pine)]"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={settings.autoSpeak}
                onChange={(event) => onSettings({ ...settings, autoSpeak: event.target.checked })}
                className="h-4 w-4 accent-[var(--pine)]"
              />
              Speak new phrases automatically when saved
            </label>

            <button
              type="button"
              onClick={() => onSpeak("Bonjour ! Je suis la voix de votre carnet.")}
              className={ghostButton}
            >
              <IconSpeaker className="h-4 w-4" /> Test the voice
            </button>
          </div>
        </section>

        <section className={card}>
          <h2 className="text-lg font-semibold tracking-tight">Offline & privacy</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-mute">
            <li>All {PHRASES.length} built-in phrases ship inside the app — nothing is fetched.</li>
            <li>Your notebook and settings are stored only in this browser.</li>
            <li>Nothing is uploaded, tracked or synced to any server.</li>
            <li>Clearing browser data deletes the notebook, so export a backup now and then.</li>
          </ul>
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete every saved phrase? This cannot be undone.")) {
                onReplace([]);
                setStatus({ tone: "ok", text: "Notebook cleared." });
              }
            }}
            className="mt-5 text-sm font-semibold text-danger transition hover:opacity-75"
          >
            Clear my notebook
          </button>
        </section>
      </div>
    </div>
  );
}
