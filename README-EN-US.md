# About Petit Carne

Petit Carne is a calm, offline notebook for learning French — one true phrase at a time.

## Overview

A beautiful French language learning application packed with **963+ phrases** (57 categories), **58 regular + irregular verbs** (5 tenses), **comprehensive grammar lessons**, and **pronunciation guides**. The app uses spaced repetition (Leitner boxes) and one‑sentence‑per‑day recommendations to help you progress steadily, without rushing, and keep streaks of daily practice.

Everything lives on your device — no data is uploaded, no internet required.

## Core Features

### 📚 Learn (Flashcard library)
- **963 French phrases** grouped into categories like Greetings, Food, Travel, Emotions, Slang, and many more
- Each card shows the phrase with its English meaning, a pronunciation hint (`say` field), and a short memory note
- Full‑text search that handles typos and synonyms
- Filter by category and difficulty (A1, A2, B1)

### 🗒️ Your notebook
- Save any phrase (library or custom) into a personal notebook
- Persistent across sessions using browser storage — works offline
- All phrases are backupable (JSON export) and can be imported later

### 🎯 Practice
- Flashcard review with a Leitner system (boxes 1‑5)
- Typing mode (shows French phrase, you type English meaning)
- Multiple choice mode (circle the right meaning or pronunciation)
- Streak tracking and daily feast of practice
- Playful easter egg: the Konami code makes croissants rain!

### 🧵 Grammar, verbs & sounds
- **Grammar** – eight hand‑crafted lessons on the structures that unlock most everyday French
- **Verbs** – full conjugations for all 58 most‑used verbs across: present, passé composé, imparfait, futur, and conditionnel
- **Sounds** – how‑to guide for French phonetics and tricky pronunciation

### 📊 Stats + UI
- Dashboard with progress, streak, and due‑today count
- Three beautiful themes (light, dark, auto)
- Swipeable navigation, smooth transitions, and responsive design
- Supports **English, French, and Farsi** completely localized
- Speech synthesis with authentic French voices

## Technical Notes

- **Framework:** React 19 + TypeScript 5, built with Vite 7
- **Styling:** Tailwind CSS 4 + custom design system (shadows, rounded‑corners, glass‑cards, color palettes)
- **Storage:** Browser `localStorage` with backup export (JSON) and import (Leitner algorithm, duplicate detection)
- **Architecture:** Atomic UI patterns, hooks‑first functions, zero external ML (hit/duplicate detection uses fuzzy‑string matching)

## i18n + Accessibility

The interface fully supports three languages: **English (en)**, **French (fr)**, and **Farsi (fa)** – see the About modal for switching.
- Farsi uses right‑to‑left layout and uses actual Persian digits in inputs
- All text is localized — onboarding, feedback, UI labels, and Easter Egg messages
- Screen‑reader friendly (ARIA labels) and keyboard navigation
- New language contributions welcomed via PRs (just add a `fa.ts`/`en.ts`/`fr.ts` object in `src/components/About.tsx`)

## Getting Started

```bash
# Clone the repo
cd Petit-Carnet

# Install dependencies
npm install

# Run the app
npm run dev
```

The app will open at `http://localhost:5173`

### Development Quick‑Start
- **Changes to phrases/verbs/grammar** → run `npm run dev` (files are hot‑reloaded)
- **Run tests** → Check the project for Vitest / Playwright usage (not yet set up)
- **Code standards** → Prettier + ESLint / Biome recommended (add at top if you want)
- **UI codaware** → Check `src/components/ui.tsx` for the shared component suite and design tokens.

## FAQ

### Do I need an internet connection?
Zero — **Petit Carnet works offline**. All data is embedded in the app (the 963 phrases, 58 verbs, and your notebook) and stored locally.

### Can I export my notes?
Yes. Press the **Backup** tab → press “Export” → save the JSON file. To import later: load file → merge (duplicates skipped).

### Is the data open?
Yes — the complete phrase library is shipped in code (`src/data/phrases.ts`). The MIT‑licensed build allows copy‑pasting for other projects, but the current app is mainly developer‑controlled.

### Why Farsi/Farsi?
Because Persian speakers should be able to learn French without English mediation, plus it improves accessibility and overall diversity.

### One‑sentence‑per‑day?
Petit Carnet loves stable, gentle progress. The daily phrase pulls from the 963‑phrase library with a deterministic pick per day (so you don't see the same phrase twice unless you skip). Your streak resets only if you don’t open the app for three days — enough to build a habit without being unrealistic.

### Leitner boxes, what’s that?
A spaced‑repetition algorithm. Each phrase moves between 5 boxes based on known/not known answers, prioritizing review of harder cards while locking in easy ones.

### I want more features.
All suggestions flow through GitHub issues. Since this is a hobby project, features are added when they align with the goal: steady, offline‑first learning with beautiful UI.

### Community contribution?
Yes! PRs are welcomed. Key areas to watch: new phrase submissions (need proper French/English/pinyin), verb additions (five tenses), and grammar sections. Test every change manually.

## Support

### License
MIT — feel free to use, copy, and contribute.

### Contact
- GitHub Issues: Submit a new issue (bug / request / discussion)
- Localization requests: Add a language object in `src/components/About.tsx`

---

Made with care. Long may the sunshine.
