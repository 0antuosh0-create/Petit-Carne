import { useState } from "react";
import { SOUND_GROUPS } from "../data/sounds";
import { IconSpeaker } from "./icons";
import { SectionHeader } from "./ui";

export default function Sounds({ onSpeak }: { onSpeak: (text: string) => void }) {
  const [groupId, setGroupId] = useState(SOUND_GROUPS[0].id);
  const group = SOUND_GROUPS.find((item) => item.id === groupId) ?? SOUND_GROUPS[0];

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="Prononciation"
        title="Sounds of French"
        subtitle="Read the pattern, tap any example to hear it. Five groups cover almost every sound you need."
      />

      <div className="glass-card flex flex-wrap gap-1.5 rounded-[1.25rem] p-2">
        {SOUND_GROUPS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setGroupId(item.id)}
            aria-pressed={groupId === item.id}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              groupId === item.id
                ? "bg-ink text-paper shadow-sm dark:bg-stone-100 dark:text-slate-950"
                : "text-mute hover:bg-ink/[0.05] hover:text-ink dark:hover:bg-white/[0.06]"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <p key={group.id} className="animate-soft-in max-w-2xl leading-7 text-ink/85">
        {group.intro}
      </p>

      <div key={`${group.id}-grid`} className="animate-soft-in grid gap-3 md:grid-cols-2">
        {group.rules.map((rule) => (
          <article
            key={rule.id}
            className="card-lift glass-card rounded-[1.3rem] p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl font-medium italic">{rule.spelling}</h2>
              <span className="rounded-full bg-pinesoft px-3 py-1 text-sm font-semibold text-pine">
                {rule.say}
              </span>
            </div>

            <ul className="mt-4 space-y-1.5">
              {rule.examples.map((example) => (
                <li key={example.fr}>
                  <button
                    type="button"
                    onClick={() => onSpeak(example.fr)}
                    className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-pinesoft/70"
                  >
                    <IconSpeaker className="h-4 w-4 shrink-0 text-mute transition group-hover:text-pine" />
                    <span className="font-medium">{example.fr}</span>
                    <span className="truncate text-sm text-mute">{example.en}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-3 border-t border-line pt-3 text-sm leading-6 text-mute">{rule.tip}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
