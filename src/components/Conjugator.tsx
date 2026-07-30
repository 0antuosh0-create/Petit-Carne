import { useMemo, useState } from "react";
import { PERSONS, TENSES, VERBS, type Tense } from "../data/verbs";
import { normalize } from "../lib/storage";
import { IconSearch, IconSpeaker, IconX } from "./icons";
import { SectionHeader } from "./ui";

const GROUPS = ["all", "-er", "-ir", "-re", "irregular"] as const;
type Group = (typeof GROUPS)[number];

const GROUP_LABEL: Record<Group, string> = {
  all: "All verbs",
  "-er": "-er group",
  "-ir": "-ir group",
  "-re": "-re group",
  irregular: "Irregular",
};

export default function Conjugator({ onSpeak }: { onSpeak: (text: string) => void }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(VERBS[0].verb.infinitive);
  const [group, setGroup] = useState<Group>("all");
  const [tense, setTense] = useState<Tense>("présent");

  const list = useMemo(() => {
    const search = normalize(query);
    return VERBS.filter(({ verb }) => {
      if (group !== "all" && verb.group !== group) return false;
      if (!search) return true;
      return (
        normalize(verb.infinitive).includes(search) ||
        normalize(verb.english).includes(search)
      );
    });
  }, [query, group]);

  const active =
    VERBS.find((entry) => entry.verb.infinitive === selectedId) ?? list[0] ?? VERBS[0];

  const groupBadge: Record<string, string> = {
    "-er": "bg-pinesoft text-pine",
    "-ir": "bg-gold/15 text-gold",
    "-re": "bg-[color-mix(in_srgb,var(--pine)_18%,transparent)] text-pine",
    irregular: "bg-danger/10 text-danger",
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="Conjugaison"
        title="Verb conjugator"
        subtitle={`${VERBS.length} essential verbs across five tenses. Pick one to see all six forms — every table works offline.`}
      />

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        {/* ── Left column: pick a verb ────────────────────── */}
        <aside className="space-y-3">
          <div className="glass-card rounded-[1.4rem] p-3">
            <label className="relative block">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute">
                <IconSearch className="h-4 w-4" />
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a verb…"
                className="h-11 w-full rounded-full border border-line bg-paper pl-10 pr-10 text-sm outline-none transition placeholder:text-mute/70 focus:border-pine focus:ring-4 focus:ring-pine/15 dark:bg-white/[0.03]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear"
                  className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-mute transition hover:bg-ink/5 hover:text-ink dark:hover:bg-white/10"
                >
                  <IconX className="h-3.5 w-3.5" />
                </button>
              )}
            </label>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {GROUPS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGroup(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    group === item
                      ? "border-transparent bg-ink text-paper shadow-sm dark:bg-stone-100 dark:text-slate-950"
                      : "border-line bg-paper/80 text-mute hover:border-pine/30 hover:text-ink dark:bg-white/[0.03]"
                  }`}
                >
                  {GROUP_LABEL[item]}
                </button>
              ))}
            </div>
          </div>

          <ul className="scroll-soft max-h-[26rem] space-y-1 overflow-y-auto rounded-[1.4rem] border border-line bg-card/90 p-1.5 shadow-sm lg:max-h-[36rem] dark:bg-card">
            {list.length ? (
              list.map(({ verb }) => {
                const isActive = verb.infinitive === selectedId;
                return (
                  <li key={verb.infinitive}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(verb.infinitive)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        isActive
                          ? "bg-pinesoft text-pine shadow-sm shadow-pine/10"
                          : "hover:bg-ink/5 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="font-display block truncate text-lg italic">
                          {verb.infinitive}
                        </span>
                        <span className="block truncate text-xs text-mute">{verb.english}</span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          groupBadge[verb.group]
                        }`}
                      >
                        {verb.group}
                      </span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-6 text-center text-sm text-mute">No verb matches.</li>
            )}
          </ul>
        </aside>

        {/* ── Right column: the verb card ────────────────── */}
        <section className="space-y-4">
          <div className="panel rounded-[1.4rem] p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-5xl font-medium italic tracking-tight sm:text-6xl">
                  {active.verb.infinitive}
                </h2>
                <p className="mt-2 text-lg text-mute">{active.verb.english}</p>
                <p className="mt-1 text-sm font-medium text-pine">say it: {active.verb.say}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    groupBadge[active.verb.group]
                  }`}
                >
                  {active.verb.group}
                </span>
                {active.verb.aux === "être" && (
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
                    auxiliary: être
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onSpeak(active.verb.infinitive)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-pine/50 hover:text-pine"
                >
                  <IconSpeaker className="h-4 w-4" /> Listen
                </button>
              </div>
            </div>
            <p className="mt-4 max-w-2xl border-l-2 border-pine pl-4 text-sm leading-6 text-mute">
              {active.verb.tip}
            </p>
          </div>

          <div className="glass-card inline-flex flex-wrap gap-1.5 rounded-full p-1">
            {TENSES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTense(item)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize transition ${
                  tense === item
                    ? "bg-ink text-paper shadow-sm dark:bg-stone-100 dark:text-slate-950"
                    : "text-mute hover:bg-ink/[0.04] hover:text-ink"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div
            key={`${active.verb.infinitive}-${tense}`}
            className="animate-soft-in grid gap-2 rounded-3xl border border-line bg-card p-3 sm:grid-cols-2"
          >
            {PERSONS.map((person) => {
              const form = active.table[tense][person];
              const full = `${person} ${form}`;
              return (
                <button
                  key={person}
                  type="button"
                  onClick={() => onSpeak(full)}
                  className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-pinesoft/70"
                >
                  <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-mute">
                    {person}
                  </span>
                  <span className="font-display flex-1 truncate text-xl italic">{form}</span>
                  <IconSpeaker className="h-4 w-4 shrink-0 text-mute opacity-0 transition group-hover:text-pine group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
