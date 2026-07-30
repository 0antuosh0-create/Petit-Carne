/**
 * A small, hand-crafted French conjugator.
 * Covers regular -er / -ir / -re verbs plus the most common irregular verbs,
 * in present, passé composé, imparfait, futur simple and présent du conditionnel.
 */

export type Tense = "présent" | "passé composé" | "imparfait" | "futur" | "conditionnel";
export const TENSES: Tense[] = ["présent", "passé composé", "imparfait", "futur", "conditionnel"];

export const PERSONS = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"] as const;
export type Person = (typeof PERSONS)[number];

export type ConjugationTable = Record<Tense, Record<Person, string>>;

export type VerbEntry = {
  infinitive: string;
  english: string;
  group: "-er" | "-ir" | "-re" | "irregular";
  /** être-verbs use être in the passé composé and agree with the subject */
  aux?: "être";
  say: string;
  /** A tiny usage tip shown next to the tables */
  tip: string;
};

/** Small helper for regular -er verbs (parler, aimer, chanter, danser…) */
function regularER(stem: string, participle = `${stem}é`, aux?: "être"): ConjugationTable {
  const passe: Record<Person, string> =
    aux === "être"
      ? {
          je: `suis ${participle}(e)`,
          tu: `es ${participle}(e)`,
          "il/elle": `est ${participle}(e)`,
          nous: `sommes ${participle}(e)s`,
          vous: `êtes ${participle}(e)(s)`,
          "ils/elles": `sont ${participle}(e)s`,
        }
      : {
          je: `ai ${participle}`,
          tu: `as ${participle}`,
          "il/elle": `a ${participle}`,
          nous: `avons ${participle}`,
          vous: `avez ${participle}`,
          "ils/elles": `ont ${participle}`,
        };
  return {
    présent: {
      je: `${stem}e`,
      tu: `${stem}es`,
      "il/elle": `${stem}e`,
      nous: `${stem}ons`,
      vous: `${stem}ez`,
      "ils/elles": `${stem}ent`,
    },
    "passé composé": passe,
    imparfait: {
      je: `${stem}ais`,
      tu: `${stem}ais`,
      "il/elle": `${stem}ait`,
      nous: `${stem}ions`,
      vous: `${stem}iez`,
      "ils/elles": `${stem}aient`,
    },
    futur: {
      je: `${stem}erai`,
      tu: `${stem}eras`,
      "il/elle": `${stem}era`,
      nous: `${stem}erons`,
      vous: `${stem}erez`,
      "ils/elles": `${stem}eront`,
    },
    conditionnel: {
      je: `${stem}erais`,
      tu: `${stem}erais`,
      "il/elle": `${stem}erait`,
      nous: `${stem}erions`,
      vous: `${stem}eriez`,
      "ils/elles": `${stem}eraient`,
    },
  };
}

/** Regular -ir verbs on the finir model (finir, choisir, réussir…) */
function regularIR(stem: string, participle = `${stem}i`): ConjugationTable {
  return {
    présent: {
      je: `${stem}is`,
      tu: `${stem}is`,
      "il/elle": `${stem}it`,
      nous: `${stem}issons`,
      vous: `${stem}issez`,
      "ils/elles": `${stem}issent`,
    },
    "passé composé": {
      je: `ai ${participle}`,
      tu: `as ${participle}`,
      "il/elle": `a ${participle}`,
      nous: `avons ${participle}`,
      vous: `avez ${participle}`,
      "ils/elles": `ont ${participle}`,
    },
    imparfait: {
      je: `${stem}issais`,
      tu: `${stem}issais`,
      "il/elle": `${stem}issait`,
      nous: `${stem}issions`,
      vous: `${stem}issiez`,
      "ils/elles": `${stem}issaient`,
    },
    futur: {
      je: `${stem}irai`,
      tu: `${stem}iras`,
      "il/elle": `${stem}ira`,
      nous: `${stem}irons`,
      vous: `${stem}irez`,
      "ils/elles": `${stem}iront`,
    },
    conditionnel: {
      je: `${stem}irais`,
      tu: `${stem}irais`,
      "il/elle": `${stem}irait`,
      nous: `${stem}irions`,
      vous: `${stem}iriez`,
      "ils/elles": `${stem}iraient`,
    },
  };
}

/** Regular -re verbs on the vendre model (vendre, attendre, entendre…) */
function regularRE(stem: string, participle = `${stem}u`): ConjugationTable {
  return {
    présent: {
      je: `${stem}s`,
      tu: `${stem}s`,
      "il/elle": stem,
      nous: `${stem}ons`,
      vous: `${stem}ez`,
      "ils/elles": `${stem}ent`,
    },
    "passé composé": {
      je: `ai ${participle}`,
      tu: `as ${participle}`,
      "il/elle": `a ${participle}`,
      nous: `avons ${participle}`,
      vous: `avez ${participle}`,
      "ils/elles": `ont ${participle}`,
    },
    imparfait: {
      je: `${stem}ais`,
      tu: `${stem}ais`,
      "il/elle": `${stem}ait`,
      nous: `${stem}ions`,
      vous: `${stem}iez`,
      "ils/elles": `${stem}aient`,
    },
    futur: {
      je: `${stem}rai`,
      tu: `${stem}ras`,
      "il/elle": `${stem}ra`,
      nous: `${stem}rons`,
      vous: `${stem}rez`,
      "ils/elles": `${stem}ront`,
    },
    conditionnel: {
      je: `${stem}rais`,
      tu: `${stem}rais`,
      "il/elle": `${stem}rait`,
      nous: `${stem}rions`,
      vous: `${stem}riez`,
      "ils/elles": `${stem}raient`,
    },
  };
}

type Entry = { verb: VerbEntry; table: ConjugationTable };

export const VERBS: Entry[] = [
  {
    verb: { infinitive: "être", english: "to be", group: "irregular", say: "ETR", tip: "The most important verb — memorise it whole." },
    table: {
      présent: { je: "suis", tu: "es", "il/elle": "est", nous: "sommes", vous: "êtes", "ils/elles": "sont" },
      "passé composé": { je: "ai été", tu: "as été", "il/elle": "a été", nous: "avons été", vous: "avez été", "ils/elles": "ont été" },
      imparfait: { je: "étais", tu: "étais", "il/elle": "était", nous: "étions", vous: "étiez", "ils/elles": "étaient" },
      futur: { je: "serai", tu: "seras", "il/elle": "sera", nous: "serons", vous: "serez", "ils/elles": "seront" },
      conditionnel: { je: "serais", tu: "serais", "il/elle": "serait", nous: "serions", vous: "seriez", "ils/elles": "seraient" },
    },
  },
  {
    verb: { infinitive: "avoir", english: "to have", group: "irregular", say: "a-VWAHR", tip: "Used to form the past tense of most verbs." },
    table: {
      présent: { je: "ai", tu: "as", "il/elle": "a", nous: "avons", vous: "avez", "ils/elles": "ont" },
      "passé composé": { je: "ai eu", tu: "as eu", "il/elle": "a eu", nous: "avons eu", vous: "avez eu", "ils/elles": "ont eu" },
      imparfait: { je: "avais", tu: "avais", "il/elle": "avait", nous: "avions", vous: "aviez", "ils/elles": "avaient" },
      futur: { je: "aurai", tu: "auras", "il/elle": "aura", nous: "aurons", vous: "aurez", "ils/elles": "auront" },
      conditionnel: { je: "aurais", tu: "aurais", "il/elle": "aurait", nous: "aurions", vous: "auriez", "ils/elles": "auraient" },
    },
  },
  {
    verb: { infinitive: "aller", english: "to go", group: "irregular", aux: "être", say: "a-LAY", tip: "Uses être in the past. Je vais + infinitive = near future." },
    table: {
      présent: { je: "vais", tu: "vas", "il/elle": "va", nous: "allons", vous: "allez", "ils/elles": "vont" },
      "passé composé": { je: "suis allé(e)", tu: "es allé(e)", "il/elle": "est allé(e)", nous: "sommes allé(e)s", vous: "êtes allé(e)(s)", "ils/elles": "sont allé(e)s" },
      imparfait: { je: "allais", tu: "allais", "il/elle": "allait", nous: "allions", vous: "alliez", "ils/elles": "allaient" },
      futur: { je: "irai", tu: "iras", "il/elle": "ira", nous: "irons", vous: "irez", "ils/elles": "iront" },
      conditionnel: { je: "irais", tu: "irais", "il/elle": "irait", nous: "irions", vous: "iriez", "ils/elles": "iraient" },
    },
  },
  {
    verb: { infinitive: "faire", english: "to do · to make", group: "irregular", say: "FAIR", tip: "Appears in dozens of expressions — faire du sport, faire attention…" },
    table: {
      présent: { je: "fais", tu: "fais", "il/elle": "fait", nous: "faisons", vous: "faites", "ils/elles": "font" },
      "passé composé": { je: "ai fait", tu: "as fait", "il/elle": "a fait", nous: "avons fait", vous: "avez fait", "ils/elles": "ont fait" },
      imparfait: { je: "faisais", tu: "faisais", "il/elle": "faisait", nous: "faisions", vous: "faisiez", "ils/elles": "faisaient" },
      futur: { je: "ferai", tu: "feras", "il/elle": "fera", nous: "ferons", vous: "ferez", "ils/elles": "feront" },
      conditionnel: { je: "ferais", tu: "ferais", "il/elle": "ferait", nous: "ferions", vous: "feriez", "ils/elles": "feraient" },
    },
  },
  {
    verb: { infinitive: "pouvoir", english: "to be able to", group: "irregular", say: "poo-VWAHR", tip: "Je peux + infinitive = I can do something." },
    table: {
      présent: { je: "peux", tu: "peux", "il/elle": "peut", nous: "pouvons", vous: "pouvez", "ils/elles": "peuvent" },
      "passé composé": { je: "ai pu", tu: "as pu", "il/elle": "a pu", nous: "avons pu", vous: "avez pu", "ils/elles": "ont pu" },
      imparfait: { je: "pouvais", tu: "pouvais", "il/elle": "pouvait", nous: "pouvions", vous: "pouviez", "ils/elles": "pouvaient" },
      futur: { je: "pourrai", tu: "pourras", "il/elle": "pourra", nous: "pourrons", vous: "pourrez", "ils/elles": "pourront" },
      conditionnel: { je: "pourrais", tu: "pourrais", "il/elle": "pourrait", nous: "pourrions", vous: "pourriez", "ils/elles": "pourraient" },
    },
  },
  {
    verb: { infinitive: "vouloir", english: "to want", group: "irregular", say: "voo-LWAHR", tip: "Je voudrais (conditionnel) is the polite request form." },
    table: {
      présent: { je: "veux", tu: "veux", "il/elle": "veut", nous: "voulons", vous: "voulez", "ils/elles": "veulent" },
      "passé composé": { je: "ai voulu", tu: "as voulu", "il/elle": "a voulu", nous: "avons voulu", vous: "avez voulu", "ils/elles": "ont voulu" },
      imparfait: { je: "voulais", tu: "voulais", "il/elle": "voulait", nous: "voulions", vous: "vouliez", "ils/elles": "voulaient" },
      futur: { je: "voudrai", tu: "voudras", "il/elle": "voudra", nous: "voudrons", vous: "voudrez", "ils/elles": "voudront" },
      conditionnel: { je: "voudrais", tu: "voudrais", "il/elle": "voudrait", nous: "voudrions", vous: "voudriez", "ils/elles": "voudraient" },
    },
  },
  {
    verb: { infinitive: "devoir", english: "to have to · to owe", group: "irregular", say: "duh-VWAHR", tip: "Je dois + infinitive = I must / I have to." },
    table: {
      présent: { je: "dois", tu: "dois", "il/elle": "doit", nous: "devons", vous: "devez", "ils/elles": "doivent" },
      "passé composé": { je: "ai dû", tu: "as dû", "il/elle": "a dû", nous: "avons dû", vous: "avez dû", "ils/elles": "ont dû" },
      imparfait: { je: "devais", tu: "devais", "il/elle": "devait", nous: "devions", vous: "deviez", "ils/elles": "devaient" },
      futur: { je: "devrai", tu: "devras", "il/elle": "devra", nous: "devrons", vous: "devrez", "ils/elles": "devront" },
      conditionnel: { je: "devrais", tu: "devrais", "il/elle": "devrait", nous: "devrions", vous: "devriez", "ils/elles": "devraient" },
    },
  },
  {
    verb: { infinitive: "savoir", english: "to know (facts)", group: "irregular", say: "sa-VWAHR", tip: "Use connaître for knowing people or places." },
    table: {
      présent: { je: "sais", tu: "sais", "il/elle": "sait", nous: "savons", vous: "savez", "ils/elles": "savent" },
      "passé composé": { je: "ai su", tu: "as su", "il/elle": "a su", nous: "avons su", vous: "avez su", "ils/elles": "ont su" },
      imparfait: { je: "savais", tu: "savais", "il/elle": "savait", nous: "savions", vous: "saviez", "ils/elles": "savaient" },
      futur: { je: "saurai", tu: "sauras", "il/elle": "saura", nous: "saurons", vous: "saurez", "ils/elles": "sauront" },
      conditionnel: { je: "saurais", tu: "saurais", "il/elle": "saurait", nous: "saurions", vous: "sauriez", "ils/elles": "sauraient" },
    },
  },
  {
    verb: { infinitive: "voir", english: "to see", group: "irregular", say: "VWAHR", tip: "On verra ! = We'll see!" },
    table: {
      présent: { je: "vois", tu: "vois", "il/elle": "voit", nous: "voyons", vous: "voyez", "ils/elles": "voient" },
      "passé composé": { je: "ai vu", tu: "as vu", "il/elle": "a vu", nous: "avons vu", vous: "avez vu", "ils/elles": "ont vu" },
      imparfait: { je: "voyais", tu: "voyais", "il/elle": "voyait", nous: "voyions", vous: "voyiez", "ils/elles": "voyaient" },
      futur: { je: "verrai", tu: "verras", "il/elle": "verra", nous: "verrons", vous: "verrez", "ils/elles": "verront" },
      conditionnel: { je: "verrais", tu: "verrais", "il/elle": "verrait", nous: "verrions", vous: "verriez", "ils/elles": "verraient" },
    },
  },
  {
    verb: { infinitive: "venir", english: "to come", group: "irregular", aux: "être", say: "vuh-NEER", tip: "Uses être in the past. Je viens de + infinitive = I just did something." },
    table: {
      présent: { je: "viens", tu: "viens", "il/elle": "vient", nous: "venons", vous: "venez", "ils/elles": "viennent" },
      "passé composé": { je: "suis venu(e)", tu: "es venu(e)", "il/elle": "est venu(e)", nous: "sommes venu(e)s", vous: "êtes venu(e)(s)", "ils/elles": "sont venu(e)s" },
      imparfait: { je: "venais", tu: "venais", "il/elle": "venait", nous: "venions", vous: "veniez", "ils/elles": "venaient" },
      futur: { je: "viendrai", tu: "viendras", "il/elle": "viendra", nous: "viendrons", vous: "viendrez", "ils/elles": "viendront" },
      conditionnel: { je: "viendrais", tu: "viendrais", "il/elle": "viendrait", nous: "viendrions", vous: "viendriez", "ils/elles": "viendraient" },
    },
  },
  {
    verb: { infinitive: "prendre", english: "to take", group: "irregular", say: "PRONDR", tip: "Also apprendre (learn) and comprendre (understand) follow this pattern." },
    table: {
      présent: { je: "prends", tu: "prends", "il/elle": "prend", nous: "prenons", vous: "prenez", "ils/elles": "prennent" },
      "passé composé": { je: "ai pris", tu: "as pris", "il/elle": "a pris", nous: "avons pris", vous: "avez pris", "ils/elles": "ont pris" },
      imparfait: { je: "prenais", tu: "prenais", "il/elle": "prenait", nous: "prenions", vous: "preniez", "ils/elles": "prenaient" },
      futur: { je: "prendrai", tu: "prendras", "il/elle": "prendra", nous: "prendrons", vous: "prendrez", "ils/elles": "prendront" },
      conditionnel: { je: "prendrais", tu: "prendrais", "il/elle": "prendrait", nous: "prendrions", vous: "prendriez", "ils/elles": "prendraient" },
    },
  },
  {
    verb: { infinitive: "mettre", english: "to put · to wear", group: "irregular", say: "METR", tip: "Je mets un manteau = I put on a coat." },
    table: {
      présent: { je: "mets", tu: "mets", "il/elle": "met", nous: "mettons", vous: "mettez", "ils/elles": "mettent" },
      "passé composé": { je: "ai mis", tu: "as mis", "il/elle": "a mis", nous: "avons mis", vous: "avez mis", "ils/elles": "ont mis" },
      imparfait: { je: "mettais", tu: "mettais", "il/elle": "mettait", nous: "mettions", vous: "mettiez", "ils/elles": "mettaient" },
      futur: { je: "mettrai", tu: "mettras", "il/elle": "mettra", nous: "mettrons", vous: "mettrez", "ils/elles": "mettront" },
      conditionnel: { je: "mettrais", tu: "mettrais", "il/elle": "mettrait", nous: "mettrions", vous: "mettriez", "ils/elles": "mettraient" },
    },
  },
  {
    verb: { infinitive: "dire", english: "to say · to tell", group: "irregular", say: "DEER", tip: "C'est-à-dire = that is to say." },
    table: {
      présent: { je: "dis", tu: "dis", "il/elle": "dit", nous: "disons", vous: "dites", "ils/elles": "disent" },
      "passé composé": { je: "ai dit", tu: "as dit", "il/elle": "a dit", nous: "avons dit", vous: "avez dit", "ils/elles": "ont dit" },
      imparfait: { je: "disais", tu: "disais", "il/elle": "disait", nous: "disions", vous: "disiez", "ils/elles": "disaient" },
      futur: { je: "dirai", tu: "diras", "il/elle": "dira", nous: "dirons", vous: "direz", "ils/elles": "diront" },
      conditionnel: { je: "dirais", tu: "dirais", "il/elle": "dirait", nous: "dirions", vous: "diriez", "ils/elles": "diraient" },
    },
  },
  {
    verb: { infinitive: "boire", english: "to drink", group: "irregular", say: "BWAHR", tip: "Je bois un café." },
    table: {
      présent: { je: "bois", tu: "bois", "il/elle": "boit", nous: "buvons", vous: "buvez", "ils/elles": "boivent" },
      "passé composé": { je: "ai bu", tu: "as bu", "il/elle": "a bu", nous: "avons bu", vous: "avez bu", "ils/elles": "ont bu" },
      imparfait: { je: "buvais", tu: "buvais", "il/elle": "buvait", nous: "buvions", vous: "buviez", "ils/elles": "buvaient" },
      futur: { je: "boirai", tu: "boiras", "il/elle": "boira", nous: "boirons", vous: "boirez", "ils/elles": "boiront" },
      conditionnel: { je: "boirais", tu: "boirais", "il/elle": "boirait", nous: "boirions", vous: "boiriez", "ils/elles": "boiraient" },
    },
  },
  // ─── Regular -er
  { verb: { infinitive: "parler", english: "to speak", group: "-er", say: "par-LAY", tip: "Model verb for every regular -er." }, table: regularER("parl") },
  { verb: { infinitive: "aimer", english: "to like · to love", group: "-er", say: "eh-MAY", tip: "J'aime le café. Je t'aime." }, table: regularER("aim") },
  { verb: { infinitive: "manger", english: "to eat", group: "-er", say: "mon-ZHAY", tip: "Nous mangeons keeps the e to keep the soft g." }, table: regularER("mang", "mangé") },
  { verb: { infinitive: "chanter", english: "to sing", group: "-er", say: "shon-TAY", tip: "Fully regular." }, table: regularER("chant") },
  { verb: { infinitive: "habiter", english: "to live (somewhere)", group: "-er", say: "a-bee-TAY", tip: "J'habite à Paris." }, table: regularER("habit") },
  { verb: { infinitive: "travailler", english: "to work", group: "-er", say: "tra-vye-YAY", tip: "Fully regular despite the double l." }, table: regularER("travaill", "travaillé") },
  { verb: { infinitive: "donner", english: "to give", group: "-er", say: "do-NAY", tip: "Donner à quelqu'un = to give to someone." }, table: regularER("donn") },
  { verb: { infinitive: "écouter", english: "to listen", group: "-er", say: "ay-koo-TAY", tip: "Écouter takes no preposition — écouter la radio." }, table: regularER("écout") },
  { verb: { infinitive: "regarder", english: "to watch · to look at", group: "-er", say: "ruh-gar-DAY", tip: "Same: regarder la télé — no preposition." }, table: regularER("regard") },
  // ─── Regular -ir
  { verb: { infinitive: "finir", english: "to finish", group: "-ir", say: "fee-NEER", tip: "Model for regular -ir verbs." }, table: regularIR("fin") },
  { verb: { infinitive: "choisir", english: "to choose", group: "-ir", say: "shwa-ZEER", tip: "Fully regular -ir." }, table: regularIR("chois") },
  { verb: { infinitive: "réussir", english: "to succeed", group: "-ir", say: "ray-u-SEER", tip: "Réussir à + infinitive = to manage to." }, table: regularIR("réuss") },
  { verb: { infinitive: "grandir", english: "to grow up", group: "-ir", say: "gron-DEER", tip: "For children and hair alike." }, table: regularIR("grand") },
  // ─── Regular -re
  { verb: { infinitive: "vendre", english: "to sell", group: "-re", say: "VONDR", tip: "Model for regular -re verbs." }, table: regularRE("vend") },
  { verb: { infinitive: "attendre", english: "to wait", group: "-re", say: "a-TONDR", tip: "Attends ! = Wait!" }, table: regularRE("attend") },
  { verb: { infinitive: "entendre", english: "to hear", group: "-re", say: "on-TONDR", tip: "Not the same as écouter (to listen)." }, table: regularRE("entend") },
  { verb: { infinitive: "répondre", english: "to answer", group: "-re", say: "ray-PONDR", tip: "Répondre à = to answer to." }, table: regularRE("répond") },
  { verb: { infinitive: "perdre", english: "to lose", group: "-re", say: "PAIRDR", tip: "perdre du temps = to waste time." }, table: regularRE("perd") },
  { verb: { infinitive: "rendre", english: "to return · to give back", group: "-re", say: "RONDR", tip: "se rendre compte = to realise." }, table: regularRE("rend") },
  // ─── Regular -er (with a few être-verbs)
  { verb: { infinitive: "jouer", english: "to play", group: "-er", say: "zhoo-AY", tip: "jouer à for sports, jouer de for instruments." }, table: regularER("jou") },
  { verb: { infinitive: "danser", english: "to dance", group: "-er", say: "don-SAY", tip: "Fully regular." }, table: regularER("dans") },
  { verb: { infinitive: "marcher", english: "to walk · to work", group: "-er", say: "mar-SHAY", tip: "Ça marche ! = That works / sounds good!" }, table: regularER("march") },
  { verb: { infinitive: "laver", english: "to wash", group: "-er", say: "la-VAY", tip: "se laver = to wash oneself." }, table: regularER("lav") },
  { verb: { infinitive: "passer", english: "to pass · to spend (time)", group: "-er", say: "pa-SAY", tip: "passer du temps = to spend time." }, table: regularER("pass") },
  { verb: { infinitive: "rester", english: "to stay", group: "-er", aux: "être", say: "res-TAY", tip: "Uses être in the past: je suis resté(e)." }, table: regularER("rest", "resté", "être") },
  { verb: { infinitive: "trouver", english: "to find", group: "-er", say: "troo-VAY", tip: "trouver que = to think that." }, table: regularER("trouv") },
  { verb: { infinitive: "chercher", english: "to look for", group: "-er", say: "shair-SHAY", tip: "chercher quelqu'un = to look for someone." }, table: regularER("cherch") },
  { verb: { infinitive: "fermer", english: "to close", group: "-er", say: "fair-MAY", tip: "fermer la porte / la boutique." }, table: regularER("ferm") },
  { verb: { infinitive: "monter", english: "to go up · to get in", group: "-er", aux: "être", say: "mon-TAY", tip: "Uses être when it means going up: je suis monté(e)." }, table: regularER("mont", "monté", "être") },
  { verb: { infinitive: "tomber", english: "to fall", group: "-er", aux: "être", say: "ton-BAY", tip: "Uses être: je suis tombé(e)." }, table: regularER("tomb", "tombé", "être") },
  { verb: { infinitive: "arriver", english: "to arrive", group: "-er", aux: "être", say: "a-ree-VAY", tip: "Uses être: elle est arrivée." }, table: regularER("arriv", "arrivé", "être") },
  { verb: { infinitive: "retourner", english: "to return · to go back", group: "-er", aux: "être", say: "ruh-toor-NAY", tip: "Uses être for movement: je suis retourné(e)." }, table: regularER("retourn", "retourné", "être") },
  // ─── Regular -ir
  { verb: { infinitive: "réfléchir", english: "to think · to reflect", group: "-ir", say: "ray-flay-SHEER", tip: "réfléchir à = to think about." }, table: regularIR("réfléch") },
  { verb: { infinitive: "obéir", english: "to obey", group: "-ir", say: "o-bay-EER", tip: "obéir à = to obey." }, table: regularIR("obé") },
  // ─── Hand-written irregulars
  {
    verb: { infinitive: "partir", english: "to leave", group: "irregular", aux: "être", say: "par-TEER", tip: "Uses être in the past. Je pars demain = I leave tomorrow." },
    table: {
      présent: { je: "pars", tu: "pars", "il/elle": "part", nous: "partons", vous: "partez", "ils/elles": "partent" },
      "passé composé": { je: "suis parti(e)", tu: "es parti(e)", "il/elle": "est parti(e)", nous: "sommes parti(e)s", vous: "êtes parti(e)(s)", "ils/elles": "sont parti(e)s" },
      imparfait: { je: "partais", tu: "partais", "il/elle": "partait", nous: "partions", vous: "partiez", "ils/elles": "partaient" },
      futur: { je: "partirai", tu: "partiras", "il/elle": "partira", nous: "partirons", vous: "partirez", "ils/elles": "partiront" },
      conditionnel: { je: "partirais", tu: "partirais", "il/elle": "partirait", nous: "partirions", vous: "partiriez", "ils/elles": "partiraient" },
    },
  },
  {
    verb: { infinitive: "sortir", english: "to go out", group: "irregular", aux: "être", say: "sor-TEER", tip: "Uses être when going out: je suis sorti(e)." },
    table: {
      présent: { je: "sors", tu: "sors", "il/elle": "sort", nous: "sortons", vous: "sortez", "ils/elles": "sortent" },
      "passé composé": { je: "suis sorti(e)", tu: "es sorti(e)", "il/elle": "est sorti(e)", nous: "sommes sorti(e)s", vous: "êtes sorti(e)(s)", "ils/elles": "sont sorti(e)s" },
      imparfait: { je: "sortais", tu: "sortais", "il/elle": "sortait", nous: "sortions", vous: "sortiez", "ils/elles": "sortaient" },
      futur: { je: "sortirai", tu: "sortiras", "il/elle": "sortira", nous: "sortirons", vous: "sortirez", "ils/elles": "sortiront" },
      conditionnel: { je: "sortirais", tu: "sortirais", "il/elle": "sortirait", nous: "sortirions", vous: "sortiriez", "ils/elles": "sortiraient" },
    },
  },
  {
    verb: { infinitive: "dormir", english: "to sleep", group: "irregular", say: "dor-MEER", tip: "Bien dormi ? = Slept well?" },
    table: {
      présent: { je: "dors", tu: "dors", "il/elle": "dort", nous: "dormons", vous: "dormez", "ils/elles": "dorment" },
      "passé composé": { je: "ai dormi", tu: "as dormi", "il/elle": "a dormi", nous: "avons dormi", vous: "avez dormi", "ils/elles": "ont dormi" },
      imparfait: { je: "dormais", tu: "dormais", "il/elle": "dormait", nous: "dormions", vous: "dormiez", "ils/elles": "dormaient" },
      futur: { je: "dormirai", tu: "dormiras", "il/elle": "dormira", nous: "dormirons", vous: "dormirez", "ils/elles": "dormiront" },
      conditionnel: { je: "dormirais", tu: "dormirais", "il/elle": "dormirait", nous: "dormirions", vous: "dormiriez", "ils/elles": "dormiraient" },
    },
  },
  {
    verb: { infinitive: "lire", english: "to read", group: "irregular", say: "LEER", tip: "lire un livre / le journal." },
    table: {
      présent: { je: "lis", tu: "lis", "il/elle": "lit", nous: "lisons", vous: "lisez", "ils/elles": "lisent" },
      "passé composé": { je: "ai lu", tu: "as lu", "il/elle": "a lu", nous: "avons lu", vous: "avez lu", "ils/elles": "ont lu" },
      imparfait: { je: "lisais", tu: "lisais", "il/elle": "lisait", nous: "lisions", vous: "lisiez", "ils/elles": "lisaient" },
      futur: { je: "lirai", tu: "liras", "il/elle": "lira", nous: "lirons", vous: "lirez", "ils/elles": "liront" },
      conditionnel: { je: "lirais", tu: "lirais", "il/elle": "lirait", nous: "lirions", vous: "liriez", "ils/elles": "liraient" },
    },
  },
  {
    verb: { infinitive: "écrire", english: "to write", group: "irregular", say: "ay-KREER", tip: "écrire à quelqu'un = to write to someone." },
    table: {
      présent: { je: "écris", tu: "écris", "il/elle": "écrit", nous: "écrivons", vous: "écrivez", "ils/elles": "écrivent" },
      "passé composé": { je: "ai écrit", tu: "as écrit", "il/elle": "a écrit", nous: "avons écrit", vous: "avez écrit", "ils/elles": "ont écrit" },
      imparfait: { je: "écrivais", tu: "écrivais", "il/elle": "écrivait", nous: "écrivions", vous: "écriviez", "ils/elles": "écrivaient" },
      futur: { je: "écrirai", tu: "écriras", "il/elle": "écrira", nous: "écrirons", vous: "écrirez", "ils/elles": "écriront" },
      conditionnel: { je: "écrirais", tu: "écrirais", "il/elle": "écrirait", nous: "écririons", vous: "écririez", "ils/elles": "écriraient" },
    },
  },
  {
    verb: { infinitive: "connaître", english: "to know (people · places)", group: "irregular", say: "ko-NETR", tip: "For facts and skills, use savoir instead." },
    table: {
      présent: { je: "connais", tu: "connais", "il/elle": "connaît", nous: "connaissons", vous: "connaissez", "ils/elles": "connaissent" },
      "passé composé": { je: "ai connu", tu: "as connu", "il/elle": "a connu", nous: "avons connu", vous: "avez connu", "ils/elles": "ont connu" },
      imparfait: { je: "connaissais", tu: "connaissais", "il/elle": "connaissait", nous: "connaissions", vous: "connaissiez", "ils/elles": "connaissaient" },
      futur: { je: "connaîtrai", tu: "connaîtras", "il/elle": "connaîtra", nous: "connaîtrons", vous: "connaîtrez", "ils/elles": "connaîtront" },
      conditionnel: { je: "connaîtrais", tu: "connaîtrais", "il/elle": "connaîtrait", nous: "connaîtrions", vous: "connaîtriez", "ils/elles": "connaîtraient" },
    },
  },
  {
    verb: { infinitive: "vivre", english: "to live", group: "irregular", say: "VEEVR", tip: "vivre à Paris / vivre de sa musique." },
    table: {
      présent: { je: "vis", tu: "vis", "il/elle": "vit", nous: "vivons", vous: "vivez", "ils/elles": "vivent" },
      "passé composé": { je: "ai vécu", tu: "as vécu", "il/elle": "a vécu", nous: "avons vécu", vous: "avez vécu", "ils/elles": "ont vécu" },
      imparfait: { je: "vivais", tu: "vivais", "il/elle": "vivait", nous: "vivions", vous: "viviez", "ils/elles": "vivaient" },
      futur: { je: "vivrai", tu: "vivras", "il/elle": "vivra", nous: "vivrons", vous: "vivrez", "ils/elles": "vivront" },
      conditionnel: { je: "vivrais", tu: "vivrais", "il/elle": "vivrait", nous: "vivrions", vous: "vivriez", "ils/elles": "vivraient" },
    },
  },
  {
    verb: { infinitive: "courir", english: "to run", group: "irregular", say: "koo-REER", tip: "Note the double r in the future: je courrai." },
    table: {
      présent: { je: "cours", tu: "cours", "il/elle": "court", nous: "courons", vous: "courez", "ils/elles": "courent" },
      "passé composé": { je: "ai couru", tu: "as couru", "il/elle": "a couru", nous: "avons couru", vous: "avez couru", "ils/elles": "ont couru" },
      imparfait: { je: "courais", tu: "courais", "il/elle": "courait", nous: "courions", vous: "couriez", "ils/elles": "couraient" },
      futur: { je: "courrai", tu: "courras", "il/elle": "courra", nous: "courrons", vous: "courrez", "ils/elles": "courront" },
      conditionnel: { je: "courrais", tu: "courrais", "il/elle": "courrait", nous: "courrions", vous: "courriez", "ils/elles": "courraient" },
    },
  },
  {
    verb: { infinitive: "croire", english: "to believe", group: "irregular", say: "KRWAHR", tip: "croire que + sentence. Je crois que oui." },
    table: {
      présent: { je: "crois", tu: "crois", "il/elle": "croit", nous: "croyons", vous: "croyez", "ils/elles": "croient" },
      "passé composé": { je: "ai cru", tu: "as cru", "il/elle": "a cru", nous: "avons cru", vous: "avez cru", "ils/elles": "ont cru" },
      imparfait: { je: "croyais", tu: "croyais", "il/elle": "croyait", nous: "croyions", vous: "croyiez", "ils/elles": "croyaient" },
      futur: { je: "croirai", tu: "croiras", "il/elle": "croira", nous: "croirons", vous: "croirez", "ils/elles": "croiront" },
      conditionnel: { je: "croirais", tu: "croirais", "il/elle": "croirait", nous: "croirions", vous: "croiriez", "ils/elles": "croiraient" },
    },
  },
  {
    verb: { infinitive: "suivre", english: "to follow", group: "irregular", say: "SWEEVR", tip: "suivre un cours = to take a course." },
    table: {
      présent: { je: "suis", tu: "suis", "il/elle": "suit", nous: "suivons", vous: "suivez", "ils/elles": "suivent" },
      "passé composé": { je: "ai suivi", tu: "as suivi", "il/elle": "a suivi", nous: "avons suivi", vous: "avez suivi", "ils/elles": "ont suivi" },
      imparfait: { je: "suivais", tu: "suivais", "il/elle": "suivait", nous: "suivions", vous: "suiviez", "ils/elles": "suivaient" },
      futur: { je: "suivrai", tu: "suivras", "il/elle": "suivra", nous: "suivrons", vous: "suivrez", "ils/elles": "suivront" },
      conditionnel: { je: "suivrais", tu: "suivrais", "il/elle": "suivrait", nous: "suivrions", vous: "suivriez", "ils/elles": "suivraient" },
    },
  },
];
