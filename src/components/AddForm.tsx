import { useMemo, useRef, useState, type FormEvent } from "react";
import { CATEGORIES, type Level } from "../data/phrases";
import { normalize, uid, type Entry } from "../lib/storage";
import Menu from "./Menu";
import { IconCheck, IconPlus, IconSpeaker, IconStar } from "./icons";

type Props = {
  entries: Entry[];
  onAdd: (entry: Entry) => void;
  onSpeak: (text: string) => void;
};

const LEVELS: Level[] = ["A1", "A2", "B1"];
const ACCENTS = ["é", "è", "ê", "à", "â", "ç", "î", "ô", "ù", "û", "œ"];

const emptyDraft = {
  french: "",
  english: "",
  say: "",
  note: "",
  category: "My words",
  level: "A1" as Level,
  favorite: false,
};

/** Recognises "bonjour = hello" / "bonjour — hello" pasted into the French field. */
function splitPair(value: string) {
  const match = value.match(/^(.{2,}?)\s*(?:=|—|–|\s-\s)\s*(.{2,})$/);
  return match ? { french: match[1].trim(), english: match[2].trim() } : null;
}

const TIPS = [
  "Good cards are short and true. “J’ai acheté une baguette rue Cler — 1,30 €” beats a perfect textbook sentence.",
  "Note the gender with nouns: «le pain», «la table». It saves you pain later.",
  "Add where you heard it — context is the strongest memory hook you have.",
  "One phrase a day builds fluency faster than a cramming session.",
];

export default function AddForm({ entries, onAdd, onSpeak }: Props) {
  const [draft, setDraft] = useState(emptyDraft);
  const [showExtras, setShowExtras] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const frenchRef = useRef<HTMLTextAreaElement>(null);

  const categoryOptions = useMemo(
    () => CATEGORIES.map((c) => ({ value: c, label: c })),
    [],
  );

  const duplicate = useMemo(() => {
    if (!draft.french.trim()) return null;
    return entries.find((e) => normalize(e.french) === normalize(draft.french)) ?? null;
  }, [draft.french, entries]);

  function update<K extends keyof typeof emptyDraft>(key: K, value: (typeof emptyDraft)[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
    setSaved(null);
  }

  function updateFrench(value: string) {
    const pair = splitPair(value);
    if (pair && !draft.english.trim()) {
      setDraft((current) => ({ ...current, ...pair }));
      setError(null);
      setSaved(null);
      return;
    }
    update("french", value.slice(0, 120));
  }

  function insertAccent(character: string) {
    const input = frenchRef.current;
    if (!input) return update("french", draft.french + character);
    const start = input.selectionStart ?? draft.french.length;
    const end = input.selectionEnd ?? draft.french.length;
    update("french", draft.french.slice(0, start) + character + draft.french.slice(end));
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + character.length, start + character.length);
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.french.trim()) return setError("Add the French phrase.");
    if (!draft.english.trim()) return setError("Add the English meaning.");
    if (duplicate) return setError("This phrase is already in your notebook.");

    const french = draft.french.trim();
    onAdd({
      id: uid(),
      french,
      english: draft.english.trim(),
      say: draft.say.trim(),
      note: draft.note.trim(),
      category: draft.category,
      level: draft.level,
      addedAt: Date.now(),
      box: 1,
      reviews: 0,
      correct: 0,
      lastReviewed: null,
      favorite: draft.favorite,
      source: "custom",
    });

    // Keep filing choices for fast batch entry.
    setDraft({ ...emptyDraft, category: draft.category, level: draft.level });
    setShowExtras(false);
    setError(null);
    setSaved(french);
    requestAnimationFrame(() => frenchRef.current?.focus());
  }

  const ready = Boolean(draft.french.trim() && draft.english.trim() && !duplicate);

  return (
    <div className="mx-auto max-w-5xl">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-9">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-pine">
          <span className="h-px w-8 bg-pine/50" />
          Nouvelle page
        </p>
        <h1 className="font-display mt-4 text-[2.6rem] font-medium leading-[1.05] tracking-tight sm:text-[3.4rem]">
          Add what you <em className="italic">learned</em>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mute">
          A line from a song, a sign on the street, a mistake you want to remember. Your carnet
          grows one true sentence at a time.
        </p>
      </div>

      <form onSubmit={submit} className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── Left: writing panel ──────────────────────────── */}
        <div>
          <section className="panel rounded-[1.5rem] p-6 sm:p-7">
            {/* French */}
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="text-sm font-bold text-ink">French phrase</span>
              <span className="text-xs tabular-nums text-mute">{draft.french.length}/120</span>
            </div>
            <textarea
              ref={frenchRef}
              value={draft.french}
              onChange={(e) => updateFrench(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Je voudrais un croissant"
              rows={3}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className="w-full resize-none rounded-2xl border border-line bg-ink/[0.04] px-4 py-3.5 text-[17px] leading-relaxed text-ink outline-none transition placeholder:text-mute/50 focus:border-pine focus:ring-4 focus:ring-pine/12 dark:bg-black/25"
            />

            {/* Accents */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs text-mute">Accents:</span>
              {ACCENTS.map((character) => (
                <button
                  key={character}
                  type="button"
                  onClick={() => insertAccent(character)}
                  tabIndex={-1}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-sm text-ink/80 transition hover:-translate-y-px hover:border-pine/50 hover:text-pine"
                >
                  {character}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => draft.french.trim() && onSpeak(draft.french)}
              disabled={!draft.french.trim()}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-mute transition hover:border-pine/45 hover:text-pine disabled:opacity-35"
            >
              <IconSpeaker className="h-4 w-4" />
              Hear
            </button>

            {/* English */}
            <div className="mb-2.5 mt-7 text-sm font-bold text-ink">English meaning</div>
            <input
              value={draft.english}
              onChange={(e) => update("english", e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="I would like a croissant"
              autoComplete="off"
              className="w-full rounded-2xl border border-line bg-ink/[0.04] px-4 py-3.5 text-[17px] text-ink outline-none transition placeholder:text-mute/50 focus:border-pine focus:ring-4 focus:ring-pine/12 dark:bg-black/25"
            />

            {/* Extras toggle */}
            <button
              type="button"
              onClick={() => setShowExtras((v) => !v)}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-pine transition hover:text-pinedeep"
            >
              {showExtras ? "Hide pronunciation, note, tags" : "Add pronunciation, note, tags"} →
            </button>

            {showExtras && (
              <div className="animate-soft-in mt-5 space-y-5 border-t border-line pt-5">
                <div>
                  <span className="mb-2 block text-sm font-bold text-ink">Pronunciation</span>
                  <input
                    value={draft.say}
                    onChange={(e) => update("say", e.target.value)}
                    placeholder="zhuh voo-DREH un krwa-SON"
                    autoComplete="off"
                    className="w-full rounded-2xl border border-line bg-ink/[0.04] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-mute/50 focus:border-pine focus:ring-4 focus:ring-pine/12 dark:bg-black/25"
                  />
                </div>
                <div>
                  <span className="mb-2 block text-sm font-bold text-ink">Note</span>
                  <textarea
                    value={draft.note}
                    onChange={(e) => update("note", e.target.value)}
                    placeholder="Heard at the bakery near Bastille."
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-line bg-ink/[0.04] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-mute/50 focus:border-pine focus:ring-4 focus:ring-pine/12 dark:bg-black/25"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <span className="mb-2 block text-sm font-bold text-ink">Category</span>
                    <Menu
                      value={draft.category}
                      onChange={(v) => update("category", v)}
                      label="In"
                      searchable
                      placeholder="Search categories…"
                      options={categoryOptions}
                      className="w-full [&>button]:w-full [&>button]:justify-between"
                    />
                  </div>
                  <div>
                    <span className="mb-2 block text-sm font-bold text-ink">Level</span>
                    <div className="segmented" role="group" aria-label="Level">
                      {LEVELS.map((lv) => (
                        <button
                          key={lv}
                          type="button"
                          onClick={() => update("level", lv)}
                          data-active={draft.level === lv}
                        >
                          {lv}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update("favorite", !draft.favorite)}
                  aria-pressed={draft.favorite}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    draft.favorite
                      ? "border-gold/45 bg-gold/10 text-gold"
                      : "border-line text-mute hover:border-gold/35 hover:text-gold"
                  }`}
                >
                  <IconStar className="h-4 w-4" filled={draft.favorite} />
                  {draft.favorite ? "Favourited" : "Mark as favourite"}
                </button>
              </div>
            )}

            {/* Feedback */}
            {duplicate && (
              <p className="animate-soft-in mt-4 text-sm font-medium text-gold">
                Already saved as “{duplicate.french}”.
              </p>
            )}
            {error && (
              <p className="animate-soft-in mt-4 text-sm font-medium text-danger">{error}</p>
            )}
            {saved && !error && (
              <p className="animate-soft-in mt-4 flex items-center gap-2 text-sm font-semibold text-pine">
                <IconCheck className="h-4 w-4" /> Saved “{saved}” — ready for another.
              </p>
            )}
          </section>

          {/* Save */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={!ready}
              className="inline-flex h-[52px] items-center gap-2.5 rounded-full bg-pine px-7 text-[15px] font-semibold text-white shadow-lg shadow-pine/20 transition hover:-translate-y-0.5 hover:bg-pinedeep disabled:pointer-events-none disabled:bg-ink/30 disabled:shadow-none dark:disabled:bg-white/15"
            >
              <IconPlus className="h-4 w-4" />
              Save to notebook
            </button>
            <span className="hidden text-xs text-mute sm:inline">⌘ Enter</span>
          </div>
        </div>

        {/* ── Right: live preview + tip ────────────────────── */}
        <aside className="space-y-5 lg:sticky lg:top-[5.5rem]">
          <section className="panel relative overflow-hidden rounded-[1.5rem] p-6 sm:p-7">
            <div className="relative mb-7 flex items-start justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-mute">
                Preview — your page
              </span>
              <span className="shrink-0 rounded-full bg-pinesoft px-3 py-1 text-[11px] font-semibold text-pine">
                {draft.category} · {draft.level}
              </span>
            </div>

            <div className="relative">
              <p className="font-display text-[2rem] font-medium italic leading-[1.15] text-ink sm:text-[2.4rem]">
                {draft.french || "Votre phrase ici"}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-mute">
                {draft.english || "Your English meaning will appear here."}
              </p>
              {draft.say && (
                <p className="mt-3 text-sm font-medium text-pine">say it: {draft.say}</p>
              )}
              {draft.note && (
                <p className="mt-3 text-sm leading-6 text-mute">{draft.note}</p>
              )}
            </div>

            <div className="relative mt-8 flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-bold text-paper">
                é
              </span>
              <span className="text-[13px] text-mute">Petit Carnet · handwritten · offline</span>
            </div>

            <span className="pointer-events-none absolute -bottom-14 -right-3 select-none font-display text-[10rem] italic leading-none text-pine/[0.05]">
              é
            </span>
          </section>

          <section className="rounded-[1.5rem] border border-dashed border-line/90 bg-card/40 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mute">Tip</p>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">{tip}</p>
          </section>
        </aside>
      </form>
    </div>
  );
}
