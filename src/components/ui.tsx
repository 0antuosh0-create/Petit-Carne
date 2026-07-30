import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ──────────────────────────────────────────────────────────
   Shared UI primitives — one source of truth for the app's
   buttons, badges, cards, headings and empty states.
   ────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "accent" | "soft" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  // Solid ink — the strongest action
  primary:
    "bg-ink text-paper shadow-sm shadow-black/10 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 dark:bg-stone-100 dark:text-slate-950",
  // Pine — the "learning" action
  accent:
    "bg-pine text-white shadow-sm shadow-pine/25 hover:-translate-y-0.5 hover:bg-pinedeep active:translate-y-0",
  // Tinted, low emphasis
  soft: "bg-pinesoft text-pine hover:bg-pine/15 active:scale-[0.99]",
  // Bordered, neutral
  outline:
    "border border-line bg-card/85 text-ink hover:-translate-y-0.5 hover:border-pine/45 hover:text-pine active:translate-y-0",
  // No chrome until hover
  ghost: "text-mute hover:bg-ink/[0.05] hover:text-ink dark:hover:bg-white/[0.06]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5 rounded-full",
  md: "h-11 px-5 text-sm gap-2 rounded-full",
  lg: "h-12 px-6 text-sm gap-2 rounded-full",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  full?: boolean;
};

export function Button({
  variant = "outline",
  size = "md",
  icon,
  full,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex shrink-0 items-center justify-center font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-45 ${
        VARIANTS[variant]
      } ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

/** Square icon-only button — keeps tap targets consistent. */
export function IconButton({
  label,
  size = "md",
  variant = "outline",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: "sm" | "md";
  variant?: ButtonVariant;
}) {
  const dim = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={`grid shrink-0 place-items-center rounded-full transition duration-200 disabled:pointer-events-none disabled:opacity-45 ${dim} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

type Tone = "pine" | "gold" | "danger" | "neutral";

const TONES: Record<Tone, string> = {
  pine: "bg-pinesoft text-pine",
  gold: "bg-gold/15 text-gold",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-ink/[0.06] text-mute dark:bg-white/10",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Small uppercase kicker used above section titles. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-pine">
      <span className="h-px w-7 bg-pine/45" />
      {children}
    </span>
  );
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
  action,
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl space-y-2.5">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h1 className="font-display text-[2rem] font-medium leading-[1.1] tracking-tight sm:text-[2.6rem]">
          {title}
        </h1>
        {subtitle && <p className="text-[15px] leading-relaxed text-mute">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-line bg-card/55 px-8 py-14 text-center backdrop-blur-sm">
      <p className="font-display text-2xl italic">{title}</p>
      <p className="mx-auto mt-2.5 max-w-sm text-sm leading-6 text-mute">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function levelTone(level: string): Tone {
  if (level === "A1") return "pine";
  if (level === "A2") return "gold";
  return "danger";
}

export function levelBar(level: string) {
  if (level === "A1") return "bg-pine";
  if (level === "A2") return "bg-gold";
  return "bg-danger";
}
