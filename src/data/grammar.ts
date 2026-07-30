export type GrammarPart =
  | { kind: "p"; text: string }
  | { kind: "ex"; fr: string; en: string }
  | { kind: "table"; caption?: string; headers: string[]; rows: string[][] };

export type GrammarSection = {
  id: string;
  title: string;
  subtitle: string;
  parts: GrammarPart[];
};

export const GRAMMAR: GrammarSection[] = [
  {
    id: "sentence",
    title: "The shape of a French sentence",
    subtitle: "Subject + verb + object, with the adverb right after the verb.",
    parts: [
      { kind: "p", text: "French follows the same order as English: subject, verb, object. Short adverbs like souvent, bien and beaucoup usually sit immediately after the verb." },
      { kind: "ex", fr: "Je parle français.", en: "I speak French." },
      { kind: "ex", fr: "Elle regarde souvent la télé.", en: "She often watches TV. — souvent follows the verb." },
      { kind: "p", text: "Negation wraps around the verb like a sandwich: ne … pas." },
      { kind: "ex", fr: "Je ne parle pas japonais.", en: "I don't speak Japanese." },
    ],
  },
  {
    id: "articles",
    title: "Articles: le, la, les…",
    subtitle: "The small words that always come with a noun.",
    parts: [
      {
        kind: "table",
        headers: ["", "masculine", "feminine", "plural"],
        rows: [
          ["definite (the)", "le / l'", "la / l'", "les"],
          ["indefinite (a)", "un", "une", "des"],
          ["partitive (some)", "du", "de la", "des"],
        ],
      },
      { kind: "p", text: "l' replaces le or la before a vowel or silent h." },
      { kind: "ex", fr: "l'école · l'homme", en: "the school · the man" },
      { kind: "p", text: "Two mergers happen with à and de: à + le → au, à + les → aux, de + le → du." },
      { kind: "ex", fr: "Je vais au café.", en: "I'm going to the café. — not “à le café”." },
    ],
  },
  {
    id: "gender",
    title: "Nouns, gender & plurals",
    subtitle: "Every noun has a gender — learn it together with the article.",
    parts: [
      { kind: "p", text: "Learn each noun with its article: le pain, la table. There is no perfect rule, but endings like -tion, -té and -ure are usually feminine." },
      { kind: "p", text: "The plural is usually a silent -s. Words in -eau take -x, words in -al take -aux." },
      { kind: "ex", fr: "un gâteau → des gâteaux · un journal → des journaux", en: "a cake → cakes · a newspaper → newspapers" },
      { kind: "p", text: "Adjectives agree with the noun: add -e for feminine, -s for plural." },
      { kind: "ex", fr: "un petit café · une petite table", en: "a small café · a small table" },
    ],
  },
  {
    id: "etre-avoir",
    title: "être & avoir",
    subtitle: "The two verbs everything else is built on.",
    parts: [
      {
        kind: "table",
        caption: "être — to be",
        headers: ["person", "form"],
        rows: [
          ["je", "suis"],
          ["tu", "es"],
          ["il / elle", "est"],
          ["nous", "sommes"],
          ["vous", "êtes"],
          ["ils / elles", "sont"],
        ],
      },
      {
        kind: "table",
        caption: "avoir — to have",
        headers: ["person", "form"],
        rows: [
          ["j'", "ai"],
          ["tu", "as"],
          ["il / elle", "a"],
          ["nous", "avons"],
          ["vous", "avez"],
          ["ils / elles", "ont"],
        ],
      },
      { kind: "p", text: "French uses avoir where English uses “to be” for age and feelings." },
      { kind: "ex", fr: "J'ai vingt-cinq ans. · J'ai soif.", en: "I am 25. · I am thirsty. — literally “I have thirst”." },
    ],
  },
  {
    id: "present",
    title: "Present tense of -er verbs",
    subtitle: "One pattern unlocks hundreds of verbs: parler, manger, aimer, travailler…",
    parts: [
      { kind: "p", text: "Drop -er and add: e, es, e, ons, ez, ent. The endings -e, -es and -ent all sound identical — the spoken verb is mostly just the stem." },
      {
        kind: "table",
        caption: "parler — to speak",
        headers: ["person", "form"],
        rows: [
          ["je", "parle"],
          ["tu", "parles"],
          ["il / elle", "parle"],
          ["nous", "parlons"],
          ["vous", "parlez"],
          ["ils / elles", "parlent"],
        ],
      },
      { kind: "p", text: "A few very common verbs are irregular: aller (je vais), faire (je fais), être, avoir, prendre, venir." },
      { kind: "ex", fr: "Nous mangeons à midi.", en: "We eat at noon. — note the extra e in nous mangeons." },
    ],
  },
  {
    id: "negation",
    title: "Saying no: ne … pas and friends",
    subtitle: "The second word changes the flavour of the negation.",
    parts: [
      {
        kind: "table",
        headers: ["pair", "means"],
        rows: [
          ["ne … pas", "not"],
          ["ne … jamais", "never"],
          ["ne … plus", "no more"],
          ["ne … rien", "nothing"],
        ],
      },
      { kind: "ex", fr: "Je ne comprends rien.", en: "I understand nothing." },
      { kind: "ex", fr: "Il ne fume plus.", en: "He doesn't smoke anymore." },
      { kind: "p", text: "Before a vowel, ne shortens to n': je n'aime pas." },
    ],
  },
  {
    id: "questions",
    title: "Asking questions, three ways",
    subtitle: "Same question, three registers: casual, neutral, formal.",
    parts: [
      { kind: "ex", fr: "Tu viens ?", en: "You coming? — casual: just raise your voice." },
      { kind: "ex", fr: "Est-ce que tu viens ?", en: "Are you coming? — neutral: add est-ce que." },
      { kind: "ex", fr: "Viens-tu ?", en: "Are you coming? — formal: flip verb and subject." },
      {
        kind: "table",
        caption: "Question words",
        headers: ["French", "English"],
        rows: [
          ["qui", "who"],
          ["que / quoi", "what"],
          ["où", "where"],
          ["quand", "when"],
          ["pourquoi", "why"],
          ["comment", "how"],
          ["combien", "how much"],
          ["quel / quelle", "which"],
        ],
      },
    ],
  },
  {
    id: "adjectives",
    title: "Adjectives: agreement & placement",
    subtitle: "Most go after the noun — a small famous group goes before.",
    parts: [
      { kind: "p", text: "The default position is after the noun, and the adjective agrees in gender and number." },
      { kind: "ex", fr: "un café chaud · une maison blanche", en: "a hot coffee · a white house" },
      { kind: "p", text: "Short common adjectives go before the noun. Remember BANGS: Beauty, Age, Number, Goodness, Size." },
      { kind: "ex", fr: "une belle maison · un petit chien · un bon croissant", en: "a beautiful house · a small dog · a good croissant" },
    ],
  },
  {
    id: "past-future",
    title: "Talking about past & future",
    subtitle: "Two compact formulas cover most daily conversation.",
    parts: [
      { kind: "p", text: "Near future = aller + infinitive. You already know aller, so you already know the future." },
      { kind: "ex", fr: "Je vais manger.", en: "I'm going to eat." },
      { kind: "p", text: "The everyday past (passé composé) = avoir + past participle. For -er verbs the participle ends in -é." },
      { kind: "ex", fr: "J'ai parlé. · Nous avons mangé.", en: "I spoke. · We ate." },
      { kind: "p", text: "A set of movement verbs uses être instead, and the participle agrees: je suis allé, elle est allée. The classic list is DR & MRS VANDERTRAMP." },
    ],
  },
  {
    id: "pronouns",
    title: "Pronouns & possessives",
    subtitle: "Who is doing what, and whose is whose.",
    parts: [
      {
        kind: "table",
        caption: "Subject pronouns",
        headers: ["French", "English"],
        rows: [
          ["je", "I"],
          ["tu", "you (informal)"],
          ["il / elle / on", "he / she / one"],
          ["nous", "we"],
          ["vous", "you (formal or plural)"],
          ["ils / elles", "they"],
        ],
      },
      {
        kind: "table",
        caption: "Possessives",
        headers: ["French", "English"],
        rows: [
          ["mon / ma / mes", "my"],
          ["ton / ta / tes", "your"],
          ["son / sa / ses", "his / her"],
          ["notre / nos", "our"],
          ["votre / vos", "your"],
          ["leur / leurs", "their"],
        ],
      },
      { kind: "p", text: "mon before masculine, ma before feminine, mes before plural — but a feminine word starting with a vowel still takes mon: mon amie." },
    ],
  },
  {
    id: "places",
    title: "à, en, au, aux with places",
    subtitle: "One tiny choice of preposition per place.",
    parts: [
      { kind: "p", text: "Cities take à. Feminine countries take en, masculine countries take au, plural countries take aux." },
      { kind: "ex", fr: "à Paris · en France · au Canada · aux États-Unis", en: "in Paris · in France · in Canada · in the USA" },
      { kind: "p", text: "Remember the mergers: au = à + le, aux = à + les. Most countries ending in -e are feminine." },
      { kind: "ex", fr: "Je vais en ville.", en: "I'm going into town." },
    ],
  },
  {
    id: "tu-vous",
    title: "Tu or vous?",
    subtitle: "French has two ways to say “you”.",
    parts: [
      { kind: "p", text: "tu is for friends, family and children. vous is for strangers, elders, shops — and for any group of people. When unsure, start with vous; people will invite you to switch." },
      { kind: "ex", fr: "Comment allez-vous ? · Comment vas-tu ?", en: "How are you? (formal) · How are you? (informal)" },
      { kind: "p", text: "In speech, on often replaces nous: On y va ! — Let's go!" },
    ],
  },
  {
    id: "numbers-logic",
    title: "The logic of 70, 80, 90",
    subtitle: "French counts a little like a market trader.",
    parts: [
      { kind: "p", text: "70 = 60 + 10, 80 = 4 × 20, 90 = 4 × 20 + 10. Learn 60–79 as soixante-… and 80–99 as quatre-vingt-… and the pattern does the rest." },
      {
        kind: "table",
        headers: ["number", "French"],
        rows: [
          ["70", "soixante-dix"],
          ["75", "soixante-quinze"],
          ["80", "quatre-vingts"],
          ["90", "quatre-vingt-dix"],
          ["99", "quatre-vingt-dix-neuf"],
        ],
      },
      { kind: "p", text: "In Belgium and Switzerland people say septante and nonante — simpler, and understood everywhere." },
    ],
  },
  {
    id: "clock",
    title: "Clock & calendar",
    subtitle: "Time, days and the parts of the day.",
    parts: [
      { kind: "p", text: "Tell time with il est + number + heures, plus et demie (half past) or moins le quart (quarter to). Days and months are written lowercase, with no “on”." },
      { kind: "ex", fr: "Il est neuf heures et demie.", en: "It's 9:30." },
      { kind: "ex", fr: "Je travaille lundi.", en: "I work on Monday." },
      {
        kind: "table",
        headers: ["French", "English"],
        rows: [
          ["le matin", "the morning"],
          ["midi", "noon"],
          ["l'après-midi", "the afternoon"],
          ["le soir", "the evening"],
          ["minuit", "midnight"],
        ],
      },
    ],
  },
  {
    id: "connectors",
    title: "Linking words that make you fluent",
    subtitle: "Glue words turn isolated sentences into real speech.",
    parts: [
      {
        kind: "table",
        headers: ["French", "English"],
        rows: [
          ["et", "and"],
          ["mais", "but"],
          ["ou", "or"],
          ["donc", "so"],
          ["parce que", "because"],
          ["alors", "so / then"],
          ["puis / ensuite", "then / next"],
          ["aussi", "also"],
        ],
      },
      { kind: "ex", fr: "Je suis fatigué parce que je travaille beaucoup.", en: "I'm tired because I work a lot." },
      { kind: "p", text: "Try joining two phrases from your notebook with parce que or mais — one link makes a sentence feel French." },
    ],
  },
];
