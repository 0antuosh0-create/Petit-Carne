# À propos de Petit Carne

Petit Carne est un carnet calme et hors‑ligne pour apprendre le français — une vraie phrase à la fois.

## Overview

Un magnifique guide d’apprentissage du français avec **plus de 960 phrases** (57 catégories), **58 verbes réguliers et irréguliers** (5 temps), **des leçons de grammaire complètes**, et **des guides de prononciation**. Le logiciel utilise une technique de répétition espacée (boîtes de Leitner) et une sélection déterministe d’une phrase quotidienne pour encourager une progression mesurée et constante, sans précipitation, tout en maintenant une série de pratique quotidienne.

Toutes les données sont stockées localement — aucune information n’est envoyée, et le logiciel fonctionne sans connexion internet.

## Caractéristiques principales

### 📚 Apprendre (collection de cartes mémoire)
- **Plus de 960 phrases françaises** regroupées en catégories telles que salutations, alimentation, voyage, émotions, langage familier, et bien d’autres
- Chaque carte affiche la phrase avec sa traduction anglaise, un indice de prononciation (`dictée` field), et une note mnémotechnique courte
- Recherche en texte intégral avec gestion des fautes de frappe et des synonymes
- Filtrage par catégorie et niveau de difficulté (A1, A2, B1)

### 🗒️ Votre carnet
- Enregistrez n’importe quelle phrase — de la bibliothèque ou personnalisée — dans un carnet personnel
- Persistance entre les sessions via le stockage local du navigateur — fonctionne hors ligne
- Toutes les données peuvent être exportées (JSON) et réimportées ultérieurement

### 🎯 Pratiquer
- Révision par cartes mémoire en utilisant le système Leitner (boîtes 1‑5)
- Mode d’écriture (montre la phrase française, vous écrivez sa traduction anglaise)
- Mode choix multiple (barrez la bonne réponse ou la bonne prononciation)
- Suivi de série d’exercices et récompenses quotidiennes
- Bosse humoristique : le code Konami fait pleuvoir des croissants !

### 🧵 Grammaire, verbes et sons
- **Grammaire** – huit leçons de grammaire sur les structures essentielles du français quotidien
- **Verbes** – conjugaisons complètes pour tous les 58 verbes les plus courants dans les temps présent, composé, imparfait, futur et conditionnel
- **Sons** – guide pour la phonétique du français et les particularités de prononciation

### 📊 Statistiques + Interface
- Tableau de bord avec informations sur la progression, la série d’exercices et les phrases dues aujourd’hui
- Trois designs attrayants (clair, sombre, automatique)
- Navigation fluide, transitions douces, et design responsive
- Support complet pour le français, l’anglais et le farsi
- Synthèse vocale avec voix françaises authentiques

## Notes techniques

- **Framework :** React 19 + TypeScript 5, construit avec Vite 7
- **Styling :** Tailwind CSS 4 + système de design personnalisé (ombres, coins arrondis, cartes glass-morphism, palettes de couleurs)
- **Stockage :** `localStorage` navigateur, exportation JSON et importation de sauvegarde (algorithme Leitner, détection de doublons)
- **Architecture :** Composants modulaires, fonction hooks, zéro ML externe (détection de similarité avec emplacements basés sur des mots)

## i18n + Accessibilité

L’interface utilisateur supporte complètement trois langues : **anglais (en)**, **français (fr)** et **farsi (fa)** – pour changer de langue, consultez le panneau « À propos ».
- Le farsi utilise un agencement de droite à gauche et des chiffres persans dans les entrées
- Tous les textes sont localisés — onboarding, messages d’erreur, étiquettes d’interface, et messages d’Easter Eggs
- Compatible avec les lecteurs d’écran (ARIA) et navigation clavier

## Pour commencer

```bash
# Cloner le dépôt
cd Petit-Carnet

# Installer les dépendances
npm install

# Lancer l’application
npm run dev
```

L’application s’ouvrira à l’adresse `http://localhost:5173`

### Aide pour développeur
- **Modifications des phrases, verbes, leçons** → exécuter `npm run dev` (chargement à chaud des fichiers)
- **Executer les tests** → vérifier pour Vitest / Playwright (pas encore configuré)
- **Code community** → Prettier + ESLint / Biome recommandé (ajouter un résumé si vous le souhaitez)
- **Mockups UI** → visualiser `src/components/ui.tsx` pour la vision principale des composants et les jetons de design

## FAQ

### Ai-je besoin d’internet ?
Pas du tout — **Petit Carnet fonctionne hors ligne**. Toutes les données sont incorporées dans le logiciel (la bibliothèque de phrases de 963 éléments, le conjugateur de verbes, et votre carnet) et stockées localement.

### Puis-je exporter mes notes ?
Oui. Cliquez sur l’onglet **Sauvegarde** → puis sur « Exporter » → enregistrez le fichier JSON. Pour importer plus tard : chargez le fichier → fusionnez (doublons automatiquement ignorés).

### Les données sont-elles libres ?
Oui — toute la bibliothèque de phrases se trouve dans le code source (`src/data/phrases.ts`). Licence MIT permets son utilisation et copie pour des projets indépendants, bien que le logiciel lui-même ne soit pas entièrement open-source.

### Pourquoi utiliser le farsi ?
Pour que les locuteurs persans puissent apprendre le français sans passer par l’anglais, améliorant ainsi l’accessibilité et la diversité du logiciel.

### Le principe d’une phrase par jour ?
Petit Carnet favorise une pratique douce et régulière. Le système sélectionne la phrase du jour de manière déterministe (une seule fois par jour). Votre série est réinitialisée uniquement après trois jours sans ouverture, ce qui est assez long pour créer une habitude sans trop de pression.

### Boîtes Leitner ?
Un système de répétition espacée. Chaque phrase alternera entre 5 boîtes en fonction de son niveau de connaissance, permettant une meilleure priorité pour les phrases les plus difficiles lors des révisions.

### Je veux plus de fonctionnalités.
Toutes les suggestions passent par les problèmes GitHub. En tant que projet à but pédagogique, les fonctionnalités sont ajoutées lorsque cela correspond à notre objectif de progression constante, sans connexion, et d’utilisation d’une interface élégante.

### Contribution de la communauté ?
Bienvenue ! Soumissions de pull request (PRs). Portes ouvertes : contribution de nouvelles phrases, ajout de verbes (en 5 temps), enrichissement de leçons. Faites vérifier toute contribution manuellement.

## Support

### Licence
MIT — n’hésitez pas à utiliser, copier et contribuer.

### Contact
- Problèmes GitHub : créez un nouveau problème (bug / demande / discussion)
- Pour les demandes de localisation : ajoutez un objet de langue dans `src/components/About.tsx`

---

Fait avec soin. Que le soleil brille longtemps.
