import { useState } from "react";
import { GRAMMAR } from "../data/grammar";
import { IconChevron } from "./icons";
import { SectionHeader } from "./ui";

export default function Grammar() {
  const [openId, setOpenId] = useState<string | null>(GRAMMAR[0].id);

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="Grammaire"
        title="Base grammar"
        subtitle="The few structures that unlock most everyday French. Read one, then find a phrase in your notebook that uses it."
      />

      <div className="space-y-2.5">
        {GRAMMAR.map((section, index) => {
          const open = openId === section.id;
          return (
            <section
              key={section.id}
              className={`glass-card overflow-hidden rounded-[1.3rem] transition-all duration-300 ${
                open ? "border-pine/35" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : section.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-ink/[0.03] dark:hover:bg-white/[0.04]"
              >
                <span
                  className={`font-display w-9 shrink-0 text-lg italic ${open ? "text-pine" : "text-mute"}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold tracking-tight">{section.title}</span>
                  {!open && (
                    <span className="mt-0.5 block truncate text-sm text-mute">{section.subtitle}</span>
                  )}
                </span>
                <IconChevron
                  className={`h-5 w-5 shrink-0 text-mute transition-transform duration-300 ${open ? "rotate-180 text-pine" : ""}`}
                />
              </button>

              {open && (
                <div className="animate-soft-in space-y-4 border-t border-line px-5 pb-6 pt-5 sm:px-9">
                  <p className="text-sm font-medium text-pine">{section.subtitle}</p>
                  {section.parts.map((part, partIndex) => {
                    if (part.kind === "p") {
                      return (
                        <p key={partIndex} className="max-w-2xl leading-7 text-ink/90 dark:text-ink/85">
                          {part.text}
                        </p>
                      );
                    }
                    if (part.kind === "ex") {
                      return (
                        <div
                          key={partIndex}
                          className="rounded-xl border-l-2 border-pine bg-pinesoft/60 py-3 pl-4 pr-4"
                        >
                          <p className="font-display text-lg italic">{part.fr}</p>
                          <p className="mt-0.5 text-sm text-mute">{part.en}</p>
                        </div>
                      );
                    }
                    return (
                      <div key={partIndex} className="overflow-hidden rounded-xl border border-line">
                        {part.caption && (
                          <p className="border-b border-line bg-ink/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mute dark:bg-white/[0.04]">
                            {part.caption}
                          </p>
                        )}
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-mute">
                              {part.headers.map((header) => (
                                <th key={header} className="px-4 py-2.5 font-medium">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {part.rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-t border-line">
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className={`px-4 py-2.5 ${
                                      cellIndex === row.length - 1 && row.length > 1
                                        ? "text-mute"
                                        : "font-medium"
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
