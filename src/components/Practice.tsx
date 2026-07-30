import { useEffect, useMemo, useState } from "react";
import { gradeEntry, isDue, normalize, type Entry } from "../lib/storage";
import { IconCheck, IconShuffle, IconSpeaker } from "./icons";

type Mode = "flip" | "type" | "choice";

type Props = {
  entries: Entry[];
  onUpdate: (entry: Entry) => void;
  onSpeak: (text: string) => void;
};

const modes: { id: Mode; label: string; hint: string }[] = [
  { id: "flip", label: "Flashcards", hint: "Recall, then flip" },
  { id: "type", label: "Type it", hint: "Write the French from memory" },
  { id: "choice", label: "Choose it", hint: "Pick the right meaning" },
];

// Fisher-Yates shuffle utility
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function Practice({ entries, onUpdate, onSpeak }: Props) {
  const [mode, setMode] = useState<Mode>("flip");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"idle" | "right" | "wrong">("idle");
  const [session, setSession] = useState({ done: 0, right: 0 });
  const [pendingUpdate, setPendingUpdate] = useState<Entry | null>(null);

  const queue = useMemo(() => {
    const due = entries.filter((entry) => isDue(entry));
    const pool = due.length ? due : entries;
    return [...pool].sort((a, b) => a.box - b.box || a.addedAt - b.addedAt);
  }, [entries]);

  const card = queue[index % Math.max(queue.length, 1)];

  useEffect(() => {
    if (index >= queue.length) setIndex(0);
  }, [queue.length, index]);

  // Generate options only when card changes or mode switches
  const options = useMemo(() => {
    if (!card) return [];
    const distractors = entries
      .filter((entry) => entry.id !== card.id)
      .map((entry) => entry.english);
    
    const uniqueDistractors = Array.from(new Set(distractors));
    const selected = shuffle(uniqueDistractors).slice(0, 3);
    
    return shuffle([card.english, ...selected]);
  }, [card?.id, entries.length]);

  function next() {
    // Commit pending update before moving to next card
    if (pendingUpdate) {
      onUpdate(pendingUpdate);
      setPendingUpdate(null);
    }
    setFlipped(false);
    setAnswer("");
    setResult("idle");
    setIndex((current) => (queue.length ? (current + 1) % queue.length : 0));
  }

  function gradeImmediate(known: boolean) {
    if (!card) return;
    onUpdate(gradeEntry(card, known));
    setSession((current) => ({ done: current.done + 1, right: current.right + (known ? 1 : 0) }));
    setFlipped(false);
    setAnswer("");
    setResult("idle");
    setIndex((current) => (queue.length ? (current + 1) % queue.length : 0));
  }

  function checkTyped() {
    if (!card || result !== "idle") return;
    const known = normalize(answer) === normalize(card.french);
    setResult(known ? "right" : "wrong");
    setPendingUpdate(gradeEntry(card, known));
    setSession((current) => ({ done: current.done + 1, right: current.right + (known ? 1 : 0) }));
  }

  function selectChoice(option: string) {
    if (!card || result !== "idle") return;
    const isRight = option === card.english;
    setAnswer(option);
    setResult(isRight ? "right" : "wrong");
    setPendingUpdate(gradeEntry(card, isRight));
    setSession((current) => ({
      done: current.done + 1,
      right: current.right + (isRight ? 1 : 0),
    }));
  }

  if (!card) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-line bg-card/60 p-12 text-center">
        <p className="font-display text-2xl italic">Rien à pratiquer…</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-mute">
          Add phrases from the library or write your own in the Add tab, then come back here.
        </p>
      </div>
    );
  }

  const dueCount = entries.filter((entry) => isDue(entry)).length;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="segmented">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (pendingUpdate) {
                  onUpdate(pendingUpdate);
                  setPendingUpdate(null);
                }
                setMode(item.id);
                setResult("idle");
                setFlipped(false);
                setAnswer("");
              }}
              data-active={mode === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 text-[13px] text-mute">
          <span>
            <span className="font-semibold text-pine">{dueCount}</span> due · session{" "}
            <span className="font-semibold text-ink">{session.right}</span>/{session.done}
          </span>
          {session.done >= 3 && session.right === session.done && (
            <span
              className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold"
              title="Perfect run — don't blink"
            >
              sans faute
            </span>
          )}
        </p>
      </div>

      <div className="panel rounded-[1.4rem] p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-mute">
          <span>{card.category} · box {card.box}/5</span>
          <span className="normal-case tracking-normal">{modes.find((item) => item.id === mode)?.hint}</span>
        </div>

        {mode === "flip" && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setFlipped((current) => !current)}
              className="min-h-48 w-full rounded-[1.1rem] bg-ink p-6 text-left text-paper transition duration-300 hover:-translate-y-0.5 dark:bg-stone-100 dark:text-slate-950"
            >
              <span className="font-display block text-3xl font-medium italic leading-snug sm:text-4xl">
                {flipped ? card.english : card.french}
              </span>
              {flipped && card.say && (
                <span className="mt-4 block text-sm opacity-70">say it: {card.say}</span>
              )}
              <span className="mt-5 block text-xs uppercase tracking-[0.2em] opacity-50">Tap to flip</span>
            </button>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSpeak(card.french)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-semibold transition hover:border-pine/50 hover:text-pine"
              >
                <IconSpeaker className="h-4 w-4" /> Listen
              </button>
              <button
                type="button"
                onClick={() => gradeImmediate(false)}
                className="h-11 flex-1 rounded-full border border-line text-sm font-semibold text-mute transition hover:border-gold hover:text-gold"
              >
                Still learning
              </button>
              <button
                type="button"
                onClick={() => gradeImmediate(true)}
                className="h-11 flex-1 rounded-full bg-pine text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-pinedeep dark:text-slate-950"
              >
                I knew it
              </button>
            </div>
          </div>
        )}

        {mode === "type" && (
          <div className="space-y-4">
            <p className="font-display text-3xl font-medium italic sm:text-4xl">{card.english}</p>
            <p className="text-sm text-mute">Write it in French — accents are optional.</p>
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (result === "idle") checkTyped();
                  else next();
                }
              }}
              placeholder="Type here…"
              autoFocus
              className="field !rounded-[1rem] !bg-paper text-base dark:!bg-white/[0.03]"
            />
            {result !== "idle" && (
              <div
                className={`animate-soft-in rounded-2xl px-4 py-3 text-sm ${
                  result === "right" ? "bg-pinesoft text-pine" : "bg-danger/10 text-danger"
                }`}
              >
                {result === "right" ? "Correct — très bien !" : `Answer: ${card.french}`}
                {card.say && <span className="block opacity-75">say it: {card.say}</span>}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={result === "idle" ? checkTyped : next}
                className="h-11 flex-1 rounded-full bg-ink text-sm font-semibold text-paper transition hover:-translate-y-0.5 dark:bg-stone-100 dark:text-slate-950"
              >
                {result === "idle" ? "Check answer" : "Next phrase"}
              </button>
              <button
                type="button"
                onClick={() => onSpeak(card.french)}
                className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-pine/50 hover:text-pine"
                aria-label="Listen"
              >
                <IconSpeaker className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {mode === "choice" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <p className="font-display text-3xl font-medium italic sm:text-4xl">{card.french}</p>
              <button
                type="button"
                onClick={() => onSpeak(card.french)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition hover:border-pine/50 hover:text-pine"
                aria-label="Listen"
              >
                <IconSpeaker className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2">
              {options.map((option, idx) => {
                const chosen = answer === option;
                const isRight = option === card.english;
                return (
                  <button
                    key={`${option}-${idx}`}
                    type="button"
                    disabled={result !== "idle"}
                    onClick={() => selectChoice(option)}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition ${
                      result !== "idle" && isRight
                        ? "border-pine bg-pinesoft text-pine"
                        : chosen
                          ? "border-danger/50 bg-danger/10 text-danger"
                          : "border-line bg-card hover:-translate-y-0.5 hover:border-pine/40"
                    }`}
                  >
                    {option}
                    {result !== "idle" && isRight && <IconCheck className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
            {result !== "idle" && (
              <button
                type="button"
                onClick={next}
                className="h-11 w-full rounded-full bg-ink text-sm font-semibold text-paper transition hover:-translate-y-0.5 dark:bg-stone-100 dark:text-slate-950"
              >
                Next phrase
              </button>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (pendingUpdate) {
            onUpdate(pendingUpdate);
            setPendingUpdate(null);
          }
          setIndex(Math.floor(Math.random() * Math.max(queue.length, 1)));
          setFlipped(false);
          setAnswer("");
          setResult("idle");
        }}
        className="inline-flex items-center gap-2 text-sm font-medium text-mute transition hover:text-pine"
      >
        <IconShuffle className="h-4 w-4" /> Shuffle a different card
      </button>
    </div>
  );
}