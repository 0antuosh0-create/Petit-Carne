export type SoundRule = {
  id: string;
  /** The written pattern, e.g. "an / am / en / em" */
  spelling: string;
  /** English-friendly imitation */
  say: string;
  examples: { fr: string; en: string }[];
  tip: string;
};

export type SoundGroup = {
  id: string;
  title: string;
  intro: string;
  rules: SoundRule[];
};

export const SOUND_GROUPS: SoundGroup[] = [
  {
    id: "nasal",
    title: "Nasal vowels",
    intro:
      "The sound that makes French sound French. Let the air escape through your nose and never fully pronounce the n or m — pain is “pahn”, not “pan”.",
    rules: [
      {
        id: "an",
        spelling: "an · am · en · em",
        say: "ahn",
        examples: [
          { fr: "sans", en: "without" },
          { fr: "enfant", en: "child" },
          { fr: "temps", en: "time · weather" },
        ],
        tip: "Open, dark vowel — like the “aw” in “lawn” sent through the nose.",
      },
      {
        id: "on",
        spelling: "on · om",
        say: "ohn",
        examples: [
          { fr: "bon", en: "good" },
          { fr: "nom", en: "name" },
          { fr: "pont", en: "bridge" },
        ],
        tip: "Rounder than “an”. Purse your lips as if to whistle.",
      },
      {
        id: "in",
        spelling: "in · im · ain · aim · ein",
        say: "ang",
        examples: [
          { fr: "vin", en: "wine" },
          { fr: "pain", en: "bread" },
          { fr: "faim", en: "hunger" },
        ],
        tip: "Bright and flat — close to the “a” in “cat”, nasalized.",
      },
      {
        id: "un",
        spelling: "un",
        say: "uhn",
        examples: [
          { fr: "un", en: "one · a" },
          { fr: "brun", en: "brown" },
          { fr: "lundi", en: "Monday" },
        ],
        tip: "Many French speakers now pronounce this exactly like “in”.",
      },
      {
        id: "ien",
        spelling: "ien",
        say: "ee-ang",
        examples: [
          { fr: "bien", en: "well" },
          { fr: "rien", en: "nothing" },
          { fr: "combien", en: "how much" },
        ],
        tip: "A quick y-glide, then the bright nasal “in”.",
      },
    ],
  },
  {
    id: "vowels",
    title: "Vowels & vowel teams",
    intro:
      "French vowels are pure and short — no gliding. Say them crisply and hold the shape of your mouth still.",
    rules: [
      {
        id: "ou",
        spelling: "ou",
        say: "oo",
        examples: [
          { fr: "bonjour", en: "hello" },
          { fr: "vous", en: "you" },
          { fr: "beaucoup", en: "a lot" },
        ],
        tip: "Always “oo” as in “food” — never the English “ow”.",
      },
      {
        id: "u",
        spelling: "u",
        say: "ew",
        examples: [
          { fr: "tu", en: "you" },
          { fr: "rue", en: "street" },
          { fr: "salut", en: "hi" },
        ],
        tip: "Say “ee”, then round your lips without moving your tongue. The hardest French sound.",
      },
      {
        id: "eau",
        spelling: "au · eau · ô",
        say: "oh",
        examples: [
          { fr: "eau", en: "water" },
          { fr: "chaud", en: "hot" },
          { fr: "bateau", en: "boat" },
        ],
        tip: "One clean “oh” — three letters, one sound.",
      },
      {
        id: "ai",
        spelling: "ai · ei · è · ê",
        say: "eh",
        examples: [
          { fr: "mais", en: "but" },
          { fr: "père", en: "father" },
          { fr: "fête", en: "party" },
        ],
        tip: "Open “eh” as in “bed”. The circumflex marks a lost s: fête ← feast.",
      },
      {
        id: "e-acute",
        spelling: "é · er · ez",
        say: "ay",
        examples: [
          { fr: "café", en: "coffee" },
          { fr: "parler", en: "to speak" },
          { fr: "vous avez", en: "you have" },
        ],
        tip: "Closed “ay” with no y-glide at the end. Verb endings -er and -ez sound identical.",
      },
      {
        id: "oi",
        spelling: "oi",
        say: "wah",
        examples: [
          { fr: "moi", en: "me" },
          { fr: "trois", en: "three" },
          { fr: "au revoir", en: "goodbye" },
        ],
        tip: "Always “wah”, never “oy”.",
      },
      {
        id: "eu",
        spelling: "eu · œu",
        say: "uh",
        examples: [
          { fr: "deux", en: "two" },
          { fr: "cœur", en: "heart" },
          { fr: "peur", en: "fear" },
        ],
        tip: "Like the “u” in “fur”, but with rounded lips and no r.",
      },
    ],
  },
  {
    id: "consonants",
    title: "Tricky consonants",
    intro: "A handful of letters behave differently from English. These six cover almost everything.",
    rules: [
      {
        id: "r",
        spelling: "r",
        say: "gargled h",
        examples: [
          { fr: "Paris", en: "Paris" },
          { fr: "merci", en: "thank you" },
          { fr: "rouge", en: "red" },
        ],
        tip: "Made in the throat, not with the tongue tip. Think of a soft gargle or the ch in “loch”.",
      },
      {
        id: "ch",
        spelling: "ch",
        say: "sh",
        examples: [
          { fr: "chat", en: "cat" },
          { fr: "chaud", en: "hot" },
          { fr: "chercher", en: "to look for" },
        ],
        tip: "Never the English “ch” of “church”.",
      },
      {
        id: "j",
        spelling: "j · ge · gi",
        say: "zh",
        examples: [
          { fr: "je", en: "I" },
          { fr: "manger", en: "to eat" },
          { fr: "girafe", en: "giraffe" },
        ],
        tip: "The soft sound in “measure” or “vision”.",
      },
      {
        id: "gn",
        spelling: "gn",
        say: "ny",
        examples: [
          { fr: "montagne", en: "mountain" },
          { fr: "champagne", en: "champagne" },
          { fr: "ligne", en: "line" },
        ],
        tip: "Exactly the ñ in “señor” or the ny in “canyon”.",
      },
      {
        id: "ill",
        spelling: "ill · ille",
        say: "ee-y",
        examples: [
          { fr: "famille", en: "family" },
          { fr: "fille", en: "girl · daughter" },
          { fr: "travailler", en: "to work" },
        ],
        tip: "Exceptions: ville and mille use a plain l sound.",
      },
      {
        id: "h",
        spelling: "h",
        say: "silent",
        examples: [
          { fr: "hôtel", en: "hotel" },
          { fr: "heure", en: "hour" },
          { fr: "homme", en: "man" },
        ],
        tip: "Never pronounced. Most words treat it as if it were a vowel: l'hôtel.",
      },
    ],
  },
  {
    id: "silent",
    title: "Silent endings & liaison",
    intro:
      "French writes far more letters than it says. Learn what to drop — then learn when to bring it back.",
    rules: [
      {
        id: "final",
        spelling: "final d · s · t · x · z · p",
        say: "silent",
        examples: [
          { fr: "petit", en: "small — “puh-TEE”" },
          { fr: "trois", en: "three — “TRWAH”" },
          { fr: "beaucoup", en: "a lot — “bo-KOO”" },
        ],
        tip: "Remember CaReFuL: final c, r, f and l usually ARE pronounced.",
      },
      {
        id: "ent",
        spelling: "verb ending -ent",
        say: "silent",
        examples: [
          { fr: "ils parlent", en: "they speak — sounds like “il parl”" },
          { fr: "elles mangent", en: "they eat — “el monzh”" },
        ],
        tip: "je parle, tu parles, il parle and ils parlent all sound identical.",
      },
      {
        id: "liaison",
        spelling: "liaison",
        say: "link the silent letter",
        examples: [
          { fr: "vous avez", en: "you have — “voo-za-VAY”" },
          { fr: "les enfants", en: "the children — “lay-zon-FON”" },
          { fr: "on a faim", en: "we're hungry — “on-na FAN”" },
        ],
        tip: "A silent final consonant wakes up before a vowel. s and x link as “z”, d links as “t”.",
      },
      {
        id: "elision",
        spelling: "elision (l' · j' · d' · n')",
        say: "squeeze together",
        examples: [
          { fr: "j'ai", en: "I have — je + ai" },
          { fr: "l'ami", en: "the friend — le + ami" },
          { fr: "je n'ai pas", en: "I don't have" },
        ],
        tip: "French hates two vowels colliding, so the first one drops out.",
      },
    ],
  },
  {
    id: "rhythm",
    title: "Rhythm & melody",
    intro: "Even with perfect sounds, English rhythm gives you away. Three habits fix most of it.",
    rules: [
      {
        id: "stress",
        spelling: "stress the last syllable",
        say: "even, then a lift at the end",
        examples: [
          { fr: "restaurant", en: "res-tau-RANT, not RES-taurant" },
          { fr: "important", en: "im-por-TANT" },
        ],
        tip: "French gives every syllable roughly equal weight, with a gentle push on the last one.",
      },
      {
        id: "group",
        spelling: "words blend into groups",
        say: "one long word",
        examples: [
          { fr: "Je ne sais pas", en: "often said “shpah”" },
          { fr: "Il y a", en: "often said “ya”" },
        ],
        tip: "Native speakers group whole phrases, then stress only the final syllable of the group.",
      },
      {
        id: "intonation",
        spelling: "keep statements flat",
        say: "no rising ending",
        examples: [
          { fr: "Je vais à Paris.", en: "Falls at the end — it's a statement." },
          { fr: "Tu viens ?", en: "Rises at the end — that's the question." },
        ],
        tip: "In French, rising pitch turns a statement into a question, so keep statements level.",
      },
    ],
  },
];
