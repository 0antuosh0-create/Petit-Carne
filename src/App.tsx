import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, PHRASES, pickDaily, type Level, type Phrase } from "./data/phrases";

import {
  entryFromPhrase,
  isDue,
  loadEntries,
  loadSettings,
  normalize,
  saveEntries,
  saveSettings,
  tickStreak,
  type Entry,
  type Settings,
} from "./lib/storage";
import { speak } from "./lib/speech";
import About from "./components/About";
import {
  FOOTER_QUIPS,
  MILESTONES,
  SAVE_QUIPS,
  onKonami,
  pick,
  pickForToday,
  streakQuip,
} from "./lib/fun";
import Menu from "./components/Menu";
import Logo from "./components/Logo";
import { Badge, Button, IconButton, levelBar, levelTone } from "./components/ui";
import Backdrop from "./components/Backdrop";
import Highlight from "./components/Highlight";
import Reveal from "./components/Reveal";
import Grammar from "./components/Grammar";
import Sounds from "./components/Sounds";
import Conjugator from "./components/Conjugator";
import Practice from "./components/Practice";
import AddForm from "./components/AddForm";
import DataPanel from "./components/DataPanel";
import {
  IconArchive,
  IconBook,
  IconCheck,
  IconConjugate,
  IconMoon,
  IconNote,
  IconPlus,
  IconRepeat,
  IconSearch,
  IconSpeaker,
  IconSpark,
  IconStar,
  IconStructure,
  IconSun,
  IconTrash,
  IconX,
} from "./components/icons";

type Tab = "learn" | "notebook" | "practice" | "grammar" | "verbs" | "sounds" | "add" | "data";

const TABS: { id: Tab; label: string; icon: (props: { className?: string }) => React.ReactElement }[] = [
  { id: "learn", label: "Learn", icon: IconBook },
  { id: "notebook", label: "Notebook", icon: IconNote },
  { id: "practice", label: "Practice", icon: IconRepeat },
  { id: "grammar", label: "Grammar", icon: IconStructure },
  { id: "verbs", label: "Verbs", icon: IconConjugate },
  { id: "sounds", label: "Sounds", icon: IconSpeaker },
  { id: "add", label: "Add", icon: IconPlus },
  { id: "data", label: "Backup", icon: IconArchive },
];

const LEVELS: ("All" | Level)[] = ["All", "A1", "A2", "B1"];
const PAGE_SIZE = 30;

const SEARCH_ALIASES: Record<string, string[]> = {
  bathroom: ["toilettes", "wc"],
  restroom: ["toilettes", "wc"],
  toilet: ["toilettes", "wc"],
  subway: ["metro", "métro"],
  metro: ["subway", "tram", "rer"],
  check: ["addition", "bill", "facture"],
  bill: ["addition", "facture"],
  receipt: ["recu", "reçu", "facture", "ticket"],
  cab: ["taxi"],
  railway: ["gare", "train", "quai"],
  station: ["gare", "arret"],
  lodging: ["hotel", "hôtel", "chambre", "auberge"],
  hotel: ["hotel", "hôtel", "chambre"],
  cash: ["especes", "espèces", "argent", "monnaie", "billet"],
  money: ["argent", "monnaie", "especes", "prix"],
  cheap: ["cher", "moins cher", "gratuit", "economique"],
  hello: ["bonjour", "salut", "coucou"],
  hi: ["bonjour", "salut", "coucou"],
  goodbye: ["revoir", "bientot", "plus tard", "a plus"],
  thanks: ["merci"],
  please: ["plait", "plaît", "stp", "svp"],
  sorry: ["desole", "désolé", "pardon", "excuse"],
  help: ["aide", "secours", "au secours"],
  doctor: ["medecin", "médecin", "docteur"],
  job: ["emploi", "travail", "metier", "boulot", "poste"],
  work: ["travail", "emploi", "boulot", "bosser"],
  food: ["manger", "nourriture", "repas", "bouffe", "cuisine"],
  drink: ["boire", "boisson", "cafe", "vin", "eau"],
  car: ["voiture", "auto", "bagnole"],
  bike: ["velo", "vélo", "velib"],
  plane: ["avion", "vol", "aeroport"],
  love: ["aime", "amour", "cheri", "coeur"],
  friend: ["ami", "copain", "pote", "copine"],
  pharmacy: ["pharmacie"],
  supermarket: ["supermarche", "supermarché", "courses", "magasin"],
  market: ["marche", "marché", "marche"],
  weather: ["temps", "meteo", "météo", "pluie", "soleil"],
  time: ["heure", "temps", "moment"],
  today: ["aujourdhui", "aujourd'hui"],
  tomorrow: ["demain"],
  yesterday: ["hier"],
  family: ["famille", "parents", "mere", "pere"],
  mother: ["mere", "mère", "maman"],
  father: ["pere", "père", "papa"],
  train: ["train", "gare", "billet", "quai", "sncf"],
  bus: ["bus", "ticket", "arret", "navette"],
  airport: ["aeroport", "aéroport", "vol", "embarquement"],
  beach: ["plage", "mer", "sable", "vacances"],
  sea: ["mer", "plage", "ocean"],
  mountain: ["montagne", "ski", "alpes"],
  winter: ["hiver", "neige", "ski", "froid"],
  summer: ["ete", "été", "plage", "soleil", "vacances"],
  bread: ["pain", "baguette", "croissant"],
  cheese: ["fromage"],
  wine: ["vin", "rouge", "blanc", "rose"],
  water: ["eau"],
  coffee: ["cafe", "café", "expresso"],
  beer: ["biere", "bière", "pression"],
  book: ["livre", "roman", "bibliotheque"],
  house: ["maison", "appartement", "logement"],
  room: ["chambre", "piece", "salle"],
  kitchen: ["cuisine", "four", "frigo"],
  cat: ["chat"],
  dog: ["chien"],
  child: ["enfant", "bebe", "fils", "fille"],
  shop: ["magasin", "boutique", "courses"],
  street: ["rue", "avenue", "boulevard"],
  beautiful: ["beau", "belle", "magnifique", "joli"],
  good: ["bon", "bonne", "bien", "super"],
  big: ["grand", "gros", "large"],
  small: ["petit", "minuscule"],
  fast: ["rapide", "vite"],
  slow: ["lent", "lentement", "doucement"],
  expensive: ["cher", "couteux", "luxe"],
};

/** Score against pre-normalized fields — typo tolerant + synonyms. */
function scoreFields(
  fields: string[],
  tokens: string[] | null,
  groups: string[][],
) {
  let score = 0;
  for (const alts of groups) {
    let best = 0;
    for (const word of alts) {
      for (const field of fields) {
        if (field === word) best = Math.max(best, 7);
        else if (field.startsWith(word)) best = Math.max(best, 5);
        else if (field.includes(` ${word}`)) best = Math.max(best, 4);
        else if (field.includes(word)) best = Math.max(best, 2);
        if (best === 7) break;
      }
      if (best === 7) break;
    }
    if (!best && tokens) {
      for (const word of alts) {
        if (word.length < 4) continue;
        for (const token of tokens) {
          if (token.length >= 4 && within1(token, word)) {
            best = 1;
            break;
          }
        }
        if (best) break;
      }
    }
    if (!best) return 0;
    score += best;
  }
  return score;
}

function queryWords(query: string) {
  const base = normalize(query).split(" ").filter(Boolean);
  return base.map((w) => {
    const syns = (SEARCH_ALIASES[w] ?? []).map(normalize);
    return [w, ...syns];
  });
}

function flatQueryWords(groups: string[][]) {
  return groups.flat();
}

/** Normalized once at startup — search never re-normalizes the library. */
const LIBRARY_INDEX = PHRASES.map((phrase) => ({
  phrase,
  fields: [phrase.french, phrase.english, phrase.category, phrase.note, phrase.say].map(normalize),
  tokens: [phrase.french, phrase.english, phrase.note]
    .map(normalize)
    .flatMap((field) => field.split(" ")),
}));

const LEVEL_ORDER: Record<Level, number> = { A1: 0, A2: 1, B1: 2 };

/** True when the two words differ by at most one edit (typo tolerance). */
function within1(a: string, b: string) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1 || la < 3) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    if ((edits += 1) > 1) return false;
    if (la > lb) i += 1;
    else if (lb > la) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  return edits + (la - i) + (lb - j) <= 1;
}

const MARQUEE = [
  "bonjour",
  "merci",
  "s'il vous plaît",
  "au revoir",
  "à bientôt",
  "bonsoir",
  "d'accord",
  "bienvenue",
  "voilà",
  "c'est la vie",
  "bon courage",
  "allons-y",
  "chapeau !",
  "salut",
];

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => tickStreak(loadSettings()));
  const [entries, setEntries] = useState<Entry[]>(loadEntries);
  const [tab, setTab] = useState<Tab>("learn");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState<"All" | Level>("All");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [croissants, setCroissants] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(query);
  const footerQuip = useMemo(() => pickForToday(FOOTER_QUIPS), []);

  /* Easter egg: the Konami code rains croissants. */
  useEffect(
    () =>
      onKonami(() => {
        setCroissants(true);
        setToast("↑↑↓↓←→←→BA — il pleut des croissants !");
        window.setTimeout(() => setCroissants(false), 5200);
      }),
    [],
  );

  /* Celebrate streak milestones once, on the day they happen. */
  useEffect(() => {
    const quip = streakQuip(settings.streak);
    if (quip) {
      const timer = window.setTimeout(() => setToast(quip), 900);
      return () => window.clearTimeout(timer);
    }
  }, [settings.streak]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    document.documentElement.style.colorScheme = settings.theme;
    saveSettings(settings);
  }, [settings]);

  useEffect(() => saveEntries(entries), [entries]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (tab !== "learn" && tab !== "notebook") setTab("learn");
        requestAnimationFrame(() => searchRef.current?.focus());
        return;
      }

      if (event.key === "/" && !typing && (tab === "learn" || tab === "notebook")) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab]);

  const say = useCallback(
    (text: string) => {
      const ok = speak(text, {
        voiceURI: settings.voiceURI,
        rate: settings.rate,
        onStart: () => setSpeaking(text),
        onEnd: () => setSpeaking((current) => (current === text ? null : current)),
      });
      if (!ok) setToast("Speech is not available in this browser.");
    },
    [settings.voiceURI, settings.rate],
  );

  const savedKeys = useMemo(() => new Set(entries.map((entry) => normalize(entry.french))), [entries]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const phrase of PHRASES) counts.set(phrase.category, (counts.get(phrase.category) ?? 0) + 1);
    return [
      { value: "All", label: "All categories", count: PHRASES.length },
      ...CATEGORIES.filter((c) => c !== "My words").map((c) => ({
        value: c,
        label: c,
        count: counts.get(c) ?? 0,
      })),
    ];
  }, []);

  const notebookCategoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    return [
      { value: "All", label: "All categories", count: entries.length },
      ...CATEGORIES.map((c) => ({ value: c, label: c, count: counts.get(c) ?? 0 })).filter(
        (option) => (option.count ?? 0) > 0,
      ),
    ];
  }, [entries]);

  const library = useMemo(() => {
    const words = queryWords(deferredQuery);
    return LIBRARY_INDEX.map(({ phrase, fields, tokens }) => ({
      phrase,
      score: words.length ? scoreFields(fields, tokens, words) : 1,
    }))
      .filter(
        ({ phrase, score }) =>
          score > 0 &&
          (category === "All" || phrase.category === category) &&
          (level === "All" || phrase.level === level),
      )
      .sort(
        (a, b) =>
          b.score - a.score ||
          LEVEL_ORDER[a.phrase.level] - LEVEL_ORDER[b.phrase.level] ||
          a.phrase.french.localeCompare(b.phrase.french, "fr"),
      )
      .map(({ phrase }) => phrase);
  }, [deferredQuery, category, level]);

  const notebookIndex = useMemo(
    () =>
      entries.map((entry) => ({
        entry,
        fields: [entry.french, entry.english, entry.category, entry.note, entry.say].map(normalize),
        tokens: [entry.french, entry.english, entry.note]
          .map(normalize)
          .flatMap((field) => field.split(" ")),
      })),
    [entries],
  );

  const notebook = useMemo(() => {
    const words = queryWords(deferredQuery);
    return notebookIndex
      .map(({ entry, fields, tokens }) => ({
        entry,
        score: words.length ? scoreFields(fields, tokens, words) : 1,
      }))
      .filter(({ entry, score }) => {
        if (score <= 0) return false;
        if (category !== "All" && entry.category !== category) return false;
        if (onlyFavorites && !entry.favorite) return false;
        return true;
      })
      .sort(
        (a, b) =>
          b.score - a.score ||
          LEVEL_ORDER[a.entry.level] - LEVEL_ORDER[b.entry.level] ||
          b.entry.addedAt - a.entry.addedAt,
      )
      .map(({ entry }) => entry);
  }, [notebookIndex, deferredQuery, category, onlyFavorites]);

  /* Reset pagination whenever the result set changes shape. */
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [deferredQuery, category, level, tab]);

  /* Land at the top of each newly opened tab. */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const daily = useMemo(() => pickDaily(), []);
  const dueCount = entries.filter((entry) => isDue(entry)).length;
  const mastered = entries.filter((entry) => entry.box >= 4).length;
  const showFilters = tab === "learn" || tab === "notebook";

  function addPhrase(phrase: Phrase) {
    if (savedKeys.has(normalize(phrase.french))) {
      setToast("Already in your notebook.");
      return;
    }
    setEntries((current) => [entryFromPhrase(phrase), ...current]);
    setToast(`Added “${phrase.french}”`);
  }

  function addAllVisible() {
    const fresh = library.filter((phrase) => !savedKeys.has(normalize(phrase.french)));
    if (!fresh.length) return setToast("Every visible phrase is already saved.");
    setEntries((current) => [...fresh.map(entryFromPhrase), ...current]);
    setToast(`Added ${fresh.length} phrase${fresh.length === 1 ? "" : "s"} to your notebook.`);
  }

  function updateEntry(updated: Entry) {
    setEntries((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
  }

  return (
    <div className="min-h-screen bg-transparent text-ink transition-colors duration-500">
      <Backdrop />
      <div className="fixed inset-x-0 top-0 z-50 flex h-1">
        <span className="flex-1 bg-[#40599e]" />
        <span className="flex-1 bg-[#f6f5f0] dark:bg-[#e8e7e0]" />
        <span className="flex-1 bg-[#c5483f]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 pt-7">
          <div className="flex min-w-0 items-center gap-3.5">
            <button
              type="button"
              onClick={() => {
                const hello = pick(["Bonjour !", "Salut !", "Coucou !", "Bonsoir !", "Ça va ?"]);
                say(hello);
              }}
              title="Say hello"
              aria-label="Say hello in French"
              className="shrink-0 rounded-full transition active:scale-95"
            >
              <Logo className="h-11 w-11 sm:h-12 sm:w-12" />
            </button>
            <div className="min-w-0">
              <p className="font-display truncate text-[1.4rem] font-semibold leading-tight tracking-tight sm:text-2xl">
                Petit&nbsp;Carnet
              </p>
              <p className="flex items-center gap-1.5 text-[13px] text-mute">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${online ? "bg-pine" : "bg-gold"}`}
                  title={online ? "Works offline" : "Offline — still working"}
                />
                <span className="truncate">{PHRASES.length} phrases · offline</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="glass-card hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold sm:inline-flex"
              title="Days you've opened Petit Carnet in a row"
            >
              <IconSpark className={`h-3.5 w-3.5 ${settings.streak > 1 ? "text-gold" : "text-mute"}`} />
              <span className={settings.streak > 1 ? "text-ink" : "text-mute"}>
                {settings.streak > 1 ? `${settings.streak} days` : "Day 1"}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setShowAbout(true)}
              aria-label="About this app — English, French, Farsi"
              title="About · EN / FR / فارسی"
              className="glass-card grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-mute transition hover:-translate-y-0.5 hover:text-ink"
            >
              i
            </button>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, theme: settings.theme === "light" ? "dark" : "light" })
              }
              aria-label={settings.theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              title={settings.theme === "light" ? "Dark mode" : "Light mode"}
              className="glass-card grid h-11 w-11 place-items-center rounded-full text-mute transition hover:-translate-y-0.5 hover:text-ink"
            >
              {settings.theme === "light" ? <IconMoon className="h-[18px] w-[18px]" /> : <IconSun className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </header>

        <nav
          className="nav-dock sticky top-2 z-30 mt-6 grid grid-cols-4 gap-1 rounded-[1.3rem] p-1.5 lg:grid-cols-8"
          aria-label="Main navigation"
        >
          {TABS.map((item) => {
            const active = tab === item.id;
            const Icon = item.icon;
            const badge =
              item.id === "practice" && dueCount > 0
                ? dueCount
                : item.id === "notebook" && entries.length > 0
                  ? entries.length
                  : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={active ? "page" : undefined}
                className={`group relative flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center gap-1 rounded-[0.95rem] px-1.5 py-2 text-[11px] font-semibold transition duration-200 sm:text-xs lg:min-h-[2.9rem] lg:flex-row lg:gap-2 lg:text-[13px] ${
                  active
                    ? "bg-ink text-paper shadow-md shadow-black/15 dark:bg-stone-100 dark:text-slate-950"
                    : "text-mute hover:bg-ink/[0.055] hover:text-ink dark:hover:bg-white/[0.07]"
                }`}
              >
                <span className="relative">
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:-translate-y-px lg:h-4 lg:w-4 ${
                      active ? "text-gold" : "text-mute group-hover:text-ink"
                    }`}
                  />
                  {badge !== null && (
                    <span
                      className={`absolute -right-2.5 -top-1.5 min-w-[16px] rounded-full px-1 text-center text-[9px] font-bold leading-[15px] lg:hidden ${
                        active ? "bg-gold text-slate-950" : "bg-pine text-white"
                      }`}
                    >
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </span>
                <span className="w-full truncate text-center lg:w-auto">{item.label}</span>
                {badge !== null && (
                  <span
                    className={`hidden min-w-[18px] rounded-full px-1.5 text-center text-[10px] font-bold leading-[17px] lg:inline-block ${
                      active
                        ? "bg-white/20 text-current dark:bg-black/12"
                        : "bg-pinesoft text-pine"
                    }`}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {showFilters && (
          <div className="panel mt-6 rounded-[1.5rem] p-2.5 sm:p-3">
            <label className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute">
                <IconSearch className="h-[18px] w-[18px]" />
              </span>
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setQuery("");
                }}
                placeholder={
                  tab === "learn" ? "Search phrases, meanings, topics…" : "Search your notebook…"
                }
                className="h-[52px] w-full rounded-[1.1rem] border border-line bg-paper/85 pl-12 pr-24 text-[15px] outline-none transition placeholder:text-mute/65 focus:border-pine focus:ring-4 focus:ring-pine/12 dark:bg-white/[0.035]"
              />
              <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="grid h-8 w-8 place-items-center rounded-full text-mute transition hover:bg-ink/[0.06] hover:text-ink dark:hover:bg-white/10"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="hidden select-none rounded-md border border-line bg-card px-2 py-1 text-[10px] font-semibold text-mute sm:block">
                    ⌘K
                  </kbd>
                )}
              </span>
            </label>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 px-0.5">
              <Menu
                value={category}
                onChange={setCategory}
                label="Category"
                searchable
                placeholder="Search categories…"
                options={tab === "learn" ? categoryOptions : notebookCategoryOptions}
              />

              {tab === "learn" && (
                <div className="segmented" role="group" aria-label="Filter by level">
                  {LEVELS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLevel(item)}
                      data-active={level === item}
                      aria-pressed={level === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              {tab === "notebook" && (
                <button
                  type="button"
                  onClick={() => setOnlyFavorites((current) => !current)}
                  aria-pressed={onlyFavorites}
                  className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                    onlyFavorites
                      ? "border-gold/50 bg-gold/15 text-gold"
                      : "border-line bg-paper/70 text-mute hover:border-pine/35 hover:text-ink dark:bg-white/[0.03]"
                  }`}
                >
                  <IconStar className="h-4 w-4" filled={onlyFavorites} /> Favourites
                </button>
              )}

              {(category !== "All" || level !== "All" || onlyFavorites || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setCategory("All");
                    setLevel("All");
                    setOnlyFavorites(false);
                    setQuery("");
                  }}
                  className="inline-flex h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-mute transition hover:bg-ink/[0.05] hover:text-ink dark:hover:bg-white/[0.06]"
                >
                  <IconX className="h-3.5 w-3.5" /> Reset
                </button>
              )}

              <p className="ml-auto shrink-0 px-2 text-[13px] text-mute">
                <span className="font-semibold text-ink">
                  {tab === "learn" ? library.length : notebook.length}
                </span>
                <span className="opacity-70">
                  {" / "}
                  {tab === "learn" ? PHRASES.length : entries.length}
                </span>
              </p>
            </div>
          </div>
        )}

        <div key={tab} className="animate-soft-in mt-7">
          {tab === "learn" && (
            <div className="space-y-7">
              <section className="panel relative overflow-hidden rounded-[1.6rem] p-6 sm:p-10">
                <span className="pointer-events-none absolute -right-6 -top-20 select-none font-display text-[14rem] italic leading-none text-pine/[0.06]">
                  é
                </span>
                <div className="relative flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-pine">
                    <span className="h-px w-8 bg-pine/50" />
                    La phrase du jour
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge tone="neutral">{daily.category}</Badge>
                    <Badge tone={levelTone(daily.level)}>{daily.level}</Badge>
                  </div>
                </div>

                <p className="font-display relative mt-6 max-w-3xl text-[2.2rem] font-medium italic leading-[1.08] sm:text-5xl">
                  {daily.french}
                </p>
                <p className="relative mt-3 max-w-2xl text-lg text-mute sm:text-xl">{daily.english}</p>
                <p className="relative mt-2.5 flex items-center gap-2 text-sm font-medium text-pine">
                  <span className="h-px w-4 bg-pine/40" />
                  say it: {daily.say}
                </p>
                {daily.note && (
                  <p className="relative mt-4 max-w-2xl text-sm leading-6 text-mute">{daily.note}</p>
                )}

                <div className="relative mt-7 flex flex-wrap gap-2">
                  <Button variant="primary" size="lg" onClick={() => say(daily.french)} icon={<IconSpeaker className="h-4 w-4" />}>
                    Listen
                  </Button>
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => addPhrase(daily)}
                    disabled={savedKeys.has(normalize(daily.french))}
                    icon={
                      savedKeys.has(normalize(daily.french)) ? (
                        <IconCheck className="h-4 w-4" />
                      ) : (
                        <IconPlus className="h-4 w-4" />
                      )
                    }
                  >
                    {savedKeys.has(normalize(daily.french)) ? "In notebook" : "Add to notebook"}
                  </Button>
                </div>
              </section>

              <div className="marquee" aria-hidden="true">
                <div className="marquee-track">
                  {[0, 1].map((copy) => (
                    <span key={copy} className="flex items-center">
                      {MARQUEE.map((item) => (
                        <span key={`${copy}-${item}`} className="font-display flex items-center text-lg italic text-mute">
                          {item}
                          <span className="mx-6 inline-block h-1.5 w-1.5 rounded-full bg-pine/50" />
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>

              <section className="panel flex flex-wrap items-center gap-x-6 gap-y-4 rounded-[1.5rem] px-5 py-5 sm:px-6">
                <ProgressRing value={entries.length ? mastered / entries.length : 0} />
                <div className="flex flex-1 flex-wrap gap-x-7 gap-y-3">
                  <Stat value={entries.length} label="saved" />
                  <Stat value={mastered} label="mastered" />
                  <Stat value={dueCount} label="due today" accent />
                  <Stat value={PHRASES.length} label="in library" />
                </div>
                {library.length > 0 && (
                  <Button variant="outline" onClick={addAllVisible} icon={<IconPlus className="h-4 w-4" />}>
                    Add all visible
                  </Button>
                )}
              </section>

              {library.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {library.slice(0, visible).map((phrase, index) => {
                    const saved = savedKeys.has(normalize(phrase.french));
                    return (
                      <Reveal key={phrase.id} delay={(index % 6) * 45}>
                      <article className="card-lift glass-card group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] p-5">
                        <span
                          className={`absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100 ${levelBar(phrase.level)}`}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mute">
                            {phrase.category}
                          </span>
                          <Badge tone={levelTone(phrase.level)}>{phrase.level}</Badge>
                        </div>

                        <h3 className="font-display mt-3.5 text-[1.55rem] font-medium italic leading-[1.18]">
                          <Highlight text={phrase.french} query={flatQueryWords(queryWords(deferredQuery)).join(" ")} />
                        </h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
                          <Highlight text={phrase.english} query={flatQueryWords(queryWords(deferredQuery)).join(" ")} />
                        </p>

                        <p className="mt-3 flex items-center gap-2 text-[13px] font-medium text-pine">
                          <span className="h-px w-3.5 flex-none bg-pine/40" />
                          {phrase.say}
                        </p>

                        {phrase.note && (
                          <p className="mt-2.5 text-[13px] leading-6 text-mute">{phrase.note}</p>
                        )}

                        <div className="mt-5 flex gap-2 pt-1">
                          <IconButton
                            label={`Listen to ${phrase.french}`}
                            onClick={() => say(phrase.french)}
                          >
                            <IconSpeaker className="h-4 w-4" />
                          </IconButton>
                          <Button
                            variant={saved ? "soft" : "primary"}
                            size="md"
                            full
                            disabled={saved}
                            onClick={() => addPhrase(phrase)}
                            className="h-10 flex-1"
                            icon={saved ? <IconCheck className="h-4 w-4" /> : <IconPlus className="h-4 w-4" />}
                          >
                            {saved ? "Saved" : "Add"}
                          </Button>
                        </div>
                      </article>
                      </Reveal>
                    );
                  })}
                </div>
              ) : (
                <Empty
                  title="Rien du tout"
                  body="No phrase matches that. Try a shorter search, another category — or write your own in the Add tab."
                  actionLabel="Clear search"
                  onAction={() => {
                    setQuery("");
                    setCategory("All");
                    setLevel("All");
                  }}
                />
              )}

              {library.length > visible && (
                <div className="flex flex-col items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisible((current) => current + PAGE_SIZE)}
                  >
                    Show {Math.min(PAGE_SIZE, library.length - visible)} more
                  </Button>
                  <p className="text-xs text-mute">{library.length - visible} remaining</p>
                </div>
              )}
            </div>
          )}

          {tab === "notebook" && (
            <div className="space-y-5">
              <p className="text-sm text-mute">
                <span className="font-semibold text-ink">{entries.length}</span> saved ·{" "}
                <span className="font-semibold text-ink">{mastered}</span> mastered ·{" "}
                <span className="font-semibold text-pine">{dueCount}</span> due
              </p>

              {notebook.length ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {notebook.slice(0, visible).map((entry, index) => (
                    <Reveal key={entry.id} delay={(index % 6) * 40}>
                    <article className="card-lift glass-card flex h-full flex-col rounded-[1.25rem] p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          <span className="truncate text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mute">
                            {entry.category}
                          </span>
                          <Badge tone={levelTone(entry.level)}>{entry.level}</Badge>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateEntry({ ...entry, favorite: !entry.favorite })}
                          className={`-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition hover:scale-110 ${
                            entry.favorite ? "text-gold" : "text-mute/50 hover:text-gold"
                          }`}
                          aria-label={entry.favorite ? "Remove from favourites" : "Add to favourites"}
                        >
                          <IconStar className="h-[18px] w-[18px]" filled={entry.favorite} />
                        </button>
                      </div>

                      <h3 className="font-display mt-3 text-xl font-medium italic leading-snug">
                        <Highlight text={entry.french} query={flatQueryWords(queryWords(deferredQuery)).join(" ")} />
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">
                        <Highlight text={entry.english} query={flatQueryWords(queryWords(deferredQuery)).join(" ")} />
                      </p>
                      {entry.say && (
                        <p className="mt-2.5 flex items-center gap-2 text-[13px] font-medium text-pine">
                          <span className="h-px w-3.5 flex-none bg-pine/40" />
                          {entry.say}
                        </p>
                      )}
                      {entry.note && <p className="mt-2 text-[13px] leading-6 text-mute">{entry.note}</p>}

                      <div className="mt-auto pt-5">
                        <div className="mb-1.5 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute">
                          <span>Memory</span>
                          <span className={entry.box >= 4 ? "text-pine" : ""}>{entry.box}/5</span>
                        </div>
                        <div className="flex items-center gap-1" aria-label={`Memory box ${entry.box} of 5`}>
                          {[1, 2, 3, 4, 5].map((step) => (
                            <span
                              key={step}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                step <= entry.box ? "bg-pine" : "bg-ink/[0.09] dark:bg-white/12"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <IconButton
                          label={`Listen to ${entry.french}`}
                          onClick={() => say(entry.french)}
                        >
                          <IconSpeaker className="h-4 w-4" />
                        </IconButton>
                        <Button
                          variant="outline"
                          size="md"
                          full
                          className="h-10 flex-1"
                          onClick={() =>
                            updateEntry({
                              ...entry,
                              box: entry.box >= 5 ? 1 : entry.box + 1,
                              reviews: entry.reviews + 1,
                              lastReviewed: Date.now(),
                            })
                          }
                        >
                          {entry.box >= 5 ? "Reset" : "Mark reviewed"}
                        </Button>
                        <IconButton
                          label="Delete phrase"
                          variant="outline"
                          className="hover:!border-danger/50 hover:!text-danger"
                          onClick={() => {
                            setEntries((current) => current.filter((item) => item.id !== entry.id));
                            setToast("Phrase removed.");
                          }}
                        >
                          <IconTrash className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </article>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <Empty
                  title={entries.length ? "Nothing matches this filter" : "A blank carnet"}
                  body={
                    entries.length
                      ? "Clear the search or pick another category."
                      : "Every notebook starts empty. Browse the library and save your first phrase."
                  }
                  actionLabel={entries.length ? "Clear search" : "Browse the library"}
                  onAction={() => {
                    if (entries.length) {
                      setQuery("");
                      setCategory("All");
                      setOnlyFavorites(false);
                    } else {
                      setTab("learn");
                    }
                  }}
                />
              )}

              {notebook.length > visible && (
                <div className="flex flex-col items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisible((current) => current + PAGE_SIZE)}
                  >
                    Show {Math.min(PAGE_SIZE, notebook.length - visible)} more
                  </Button>
                  <p className="text-xs text-mute">{notebook.length - visible} remaining</p>
                </div>
              )}
            </div>
          )}

          {tab === "practice" && <Practice entries={entries} onUpdate={updateEntry} onSpeak={say} />}

          {tab === "grammar" && <Grammar />}

          {tab === "sounds" && <Sounds onSpeak={say} />}

          {tab === "verbs" && <Conjugator onSpeak={say} />}

          {tab === "add" && (
            <AddForm
              entries={entries}
              onSpeak={say}
              onAdd={(entry) => {
                setEntries((current) => [entry, ...current]);
                const total = entries.length + 1;
                const milestone = MILESTONES[total];
                setToast(milestone ?? pick(SAVE_QUIPS));
                if (milestone) {
                  setCroissants(true);
                  window.setTimeout(() => setCroissants(false), 4200);
                }
                if (settings.autoSpeak) say(entry.french);
              }}
            />
          )}

          {tab === "data" && (
            <DataPanel
              entries={entries}
              settings={settings}
              onSettings={setSettings}
              onSpeak={say}
              onReplace={setEntries}
            />
          )}
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-6 text-[13px] text-mute">
          <span>
            Petit Carnet · {PHRASES.length} phrases · {CATEGORIES.length} categories · all offline
          </span>
          <div className="flex items-center gap-3 font-display text-sm italic">
            <span title="A new one every day">{footerQuip}</span>
            <span className="opacity-40">·</span>
            <span className="font-sans text-xs font-semibold uppercase not-italic tracking-wider text-pine">
              Long May The Sunshine
            </span>
          </div>
        </footer>
      </div>

      {speaking && (
        <div className="animate-soft-in panel fixed bottom-6 left-5 z-40 flex max-w-[70vw] items-center gap-3 rounded-full py-2.5 pl-4 pr-5">
          <span className="eq" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="truncate text-sm font-medium">
            <span className="text-pine">écouté :</span> {speaking}
          </span>
        </div>
      )}

      {toast && (
        <div className="animate-soft-in panel fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold text-ink">
          {toast}
        </div>
      )}

      {showAbout && <About onClose={() => setShowAbout(false)} />}

      {croissants && (
        <div className="croissant-rain" aria-hidden="true">
          {Array.from({ length: 26 }).map((_, index) => (
            <span
              key={index}
              style={{
                left: `${(index * 3.9 + (index % 5) * 2.4) % 98}%`,
                animationDuration: `${3.1 + ((index * 7) % 22) / 10}s`,
                animationDelay: `${((index * 13) % 20) / 10}s`,
                fontSize: `${1.35 + ((index * 3) % 9) / 10}rem`,
              }}
            >
              {index % 4 === 0 ? "🥐" : index % 4 === 1 ? "🥖" : index % 4 === 2 ? "🧀" : "✨"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
  return (
    <div>
      <p className={`font-display text-3xl font-medium ${accent ? "text-pine" : "text-ink"}`}>
        {value}
      </p>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-mute">{label}</p>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));

  return (
    <div className="relative grid h-16 w-16 shrink-0 place-items-center">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--line)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="var(--pine)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-bold">{Math.round(clamped * 100)}%</span>
    </div>
  );
}

function Empty({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-card/60 p-12 text-center">
      <p className="font-display text-2xl italic">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mute">{body}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex h-11 items-center rounded-full border border-line bg-card px-5 text-sm font-semibold transition hover:border-pine/50 hover:text-pine"
      >
        {actionLabel}
      </button>
    </div>
  );
}
