import { useEffect, useId, useMemo, useRef, useState } from "react";
import { IconCheck, IconChevron, IconSearch, IconX } from "./icons";
import { normalize } from "../lib/storage";

export type MenuOption = {
  value: string;
  label: string;
  count?: number;
  hint?: string;
};

type Props = {
  value: string;
  options: MenuOption[];
  onChange: (value: string) => void;
  label: string;
  align?: "left" | "right";
  searchable?: boolean;
  placeholder?: string;
  className?: string;
};

export default function Menu({
  value,
  options,
  onChange,
  label,
  align = "left",
  searchable,
  placeholder = "Filter…",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const selected = options.find((option) => option.value === value) ?? options[0];
  const shouldSearch = searchable ?? options.length > 10;

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return options;
    return options.filter((option) => {
      const hay = normalize(`${option.label} ${option.hint ?? ""} ${option.value}`);
      return hay.includes(q);
    });
  }, [options, query]);

  useEffect(() => {
    if (!open) return;

    const onDoc = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        setQuery("");
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = Math.max(
      0,
      filtered.findIndex((option) => option.value === value),
    );
    setActiveIndex(selectedIndex === -1 ? 0 : selectedIndex);
    requestAnimationFrame(() => {
      if (shouldSearch) searchRef.current?.focus();
      else listRef.current?.focus();
    });
  }, [open, filtered, value, shouldSearch]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
    setQuery("");
    buttonRef.current?.focus();
  }

  function onListKeyDown(event: React.KeyboardEvent) {
    if (!filtered.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % filtered.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + filtered.length) % filtered.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(filtered.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) choose(option.value);
    }
  }

  const isActive = open || value !== options[0]?.value;

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={`menu-trigger inline-flex h-11 min-w-[9.5rem] items-center gap-2.5 rounded-full border px-4 text-sm font-medium transition ${
          isActive
            ? "border-pine/45 bg-pinesoft text-pine shadow-sm shadow-pine/10"
            : "border-line bg-card/90 text-ink hover:border-pine/35 hover:bg-card"
        }`}
      >
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] opacity-55 sm:inline">
          {label}
        </span>
        <span className="max-w-40 truncate font-semibold">{selected?.label ?? "Select"}</span>
        <IconChevron
          className={`ml-auto h-4 w-4 shrink-0 opacity-60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`menu-panel animate-soft-in absolute top-[calc(100%+0.5rem)] z-40 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[1.25rem] border border-line shadow-2xl shadow-black/15 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {shouldSearch && (
            <div className="border-b border-line p-2.5">
              <label className="relative block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute">
                  <IconSearch className="h-4 w-4" />
                </span>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onListKeyDown}
                  placeholder={placeholder}
                  className="h-10 w-full rounded-xl border border-line bg-paper pl-9 pr-9 text-sm outline-none transition placeholder:text-mute/60 focus:border-pine focus:ring-4 focus:ring-pine/12 dark:bg-white/[0.03]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveIndex(0);
                      searchRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-mute transition hover:bg-ink/5 hover:text-ink"
                    aria-label="Clear filter"
                  >
                    <IconX className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>
            </div>
          )}

          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={shouldSearch ? -1 : 0}
            aria-label={label}
            aria-activedescendant={
              filtered[activeIndex] ? `${listboxId}-${filtered[activeIndex].value}` : undefined
            }
            onKeyDown={onListKeyDown}
            className="scroll-soft max-h-72 overflow-y-auto overscroll-contain p-1.5 outline-none"
          >
            {filtered.length ? (
              filtered.map((option, index) => {
                const active = option.value === value;
                const focused = index === activeIndex;
                return (
                  <button
                    key={option.value}
                    id={`${listboxId}-${option.value}`}
                    type="button"
                    role="option"
                    data-index={index}
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option.value)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "bg-pinesoft font-semibold text-pine"
                        : focused
                          ? "bg-ink/[0.05] text-ink dark:bg-white/[0.07]"
                          : "text-ink hover:bg-ink/[0.04] dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate">{option.label}</span>
                      {option.hint && (
                        <span className="mt-0.5 block truncate text-xs font-normal text-mute">
                          {option.hint}
                        </span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {option.count !== undefined && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            active ? "bg-pine/15 text-pine" : "bg-ink/5 text-mute dark:bg-white/10"
                          }`}
                        >
                          {option.count}
                        </span>
                      )}
                      {active && <IconCheck className="h-4 w-4" />}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-8 text-center text-sm text-mute">
                No matches for “{query}”
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
