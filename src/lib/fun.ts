/**
 * Small delights — French quips, playful toasts and rare easter eggs.
 * Nothing here changes behaviour; it just makes the app smile back.
 */

/** Rotating footer quips, mostly true, occasionally cheeky. */
export const FOOTER_QUIPS = [
  "petit à petit, l'oiseau fait son nid",
  "l'accent grave is just a hat tilted left",
  "no verbs were harmed conjugating this app",
  "97 % of French is confidence and a shrug",
  "bon courage — the subjunctive is watching",
  "made with du beurre, not margarine",
  "your notebook, your rules, your typos",
  "prononciation: fake it until you liaison",
];

/** Playful confirmations shown after saving a phrase. */
export const SAVE_QUIPS = [
  "Saved. Your carnet grows.",
  "Noted — très bien.",
  "In the notebook it goes.",
  "Filed away. Chef's kiss.",
  "Added. The bird builds its nest.",
  "Locked in. Nice one.",
];

/** Milestone celebrations by saved-phrase count. */
export const MILESTONES: Record<number, string> = {
  1: "First phrase saved — it begins!",
  10: "10 phrases. You can order breakfast now.",
  25: "25 saved. A small vocabulary with big ambitions.",
  50: "50 phrases! You could survive a dinner party.",
  100: "100 phrases — you're officially dangerous in a boulangerie.",
  250: "250. Parisians are starting to nod politely.",
  500: "500 phrases. Honestly, showing off at this point.",
  1000: "1000. Sacré bleu. Go outside and speak to someone.",
};

/** Streak encouragements, keyed by how many days in a row. */
export function streakQuip(days: number): string | null {
  if (days === 3) return "3 days in a row — a habit is forming.";
  if (days === 7) return "One week straight. Formidable !";
  if (days === 30) return "30 days. You're basically Parisian now.";
  if (days === 100) return "100 days. The Académie française salutes you.";
  return null;
}

/** Empty-state one-liners so blank screens still feel alive. */
export const EMPTY_LINES = [
  "Nothing here yet — the page is patient.",
  "A blank carnet is just potential.",
  "Rien du tout. For now.",
];

export function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** Deterministic pick so the footer quip is stable for a whole day. */
export function pickForToday<T>(list: T[]): T {
  const now = new Date();
  const seed = now.getFullYear() * 372 + now.getMonth() * 31 + now.getDate();
  return list[seed % list.length];
}

/**
 * Konami code detector. Returns a cleanup function.
 * Fires once the classic sequence is entered.
 */
export function onKonami(callback: () => void) {
  const SEQUENCE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let index = 0;

  const handler = (event: KeyboardEvent) => {
    const expected = SEQUENCE[index];
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === expected) {
      index += 1;
      if (index === SEQUENCE.length) {
        index = 0;
        callback();
      }
    } else {
      index = key === SEQUENCE[0] ? 1 : 0;
    }
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}
