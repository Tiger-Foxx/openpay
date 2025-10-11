<div align="center">

# 💰 OpenPay

<img src="./public/logo-open.png" alt="OpenPay Logo" width="200"/>

### Enfin Savoir Combien Tu Vaux (ou pas) sur le Marché Tech

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)

[🚀 Démo Live](https://openpay-cameroon.vercel.app/) | [📖 Documentation](#documentation) | [🤝 Contribuer](#-contribuer)

<img src="./src/assets/logos/logo-fox-dark.png" alt="The Fox Logo" width="120"/>

**Créé par [The Fox](https://the-fox.tech) - Computer Engineering Scientist**

---

</div>

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Problème & Solution](#-problème--solution)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Cas d'Usage](#-cas-dusage)
- [Système de Devises](#-système-de-devises)
- [API & Services](#-api--services)
- [Contribuer](#-contribuer)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Crédits](#-crédits)

---

## 🎯 À Propos

**OpenPay** est une application web open source qui apporte la **transparence totale** sur les salaires du secteur tech (développement, data science, DevOps, cybersécurité, etc.). Plus besoin de stalker LinkedIn pendant 3 heures pour savoir si tu es sous-payé.

### Ce qui rend OpenPay Unique

- 🗣️ **Recherche en langage naturel** : Tape "développeur React 3 ans" et obtiens des résultats pertinents
- 📊 **Statistiques complètes** : Médiane, moyenne, min/max, distribution par expérience et localisation
- 🤖 **IA intégrée (Gemini)** : Analyse tes résultats et propose des roadmaps de carrière personnalisées
- 🌍 **Multi-pays** : Gère plusieurs devises (EUR, FCFA) avec normalisation automatique
- 🔓 **100% gratuit** : Zéro paywall, zéro inscription obligatoire
- 🌐 **Open source** : Code accessible, contributions bienvenues
- 🤝 **Communautaire** : Contribue ton salaire anonymement pour aider les autres

---

## 🚨 Problème & Solution

### Le Problème

Les salaires dans la tech, c'est le **Far West** :
- ❌ Personne ne parle ouvertement de son salaire
- ❌ Les sites de salaires sont payants ou obsolètes
- ❌ LinkedIn teasing : "Salaire compétitif" = sous-payé
- ❌ Négociation à l'aveugle = regrets 6 mois plus tard
- ❌ Juniors arnaqués, seniors exploités par l'opacité

### La Solution OpenPay

✅ **Données publiques et gratuites** issues de [salaires.dev](https://salaires.dev) + contributions communautaires  
✅ **Recherche intelligente** avec IA pour comprendre tes requêtes naturelles  
✅ **Stats précises** : salaires réels, graphiques, comparaisons par pays/expérience  
✅ **Conseils de carrière** : roadmaps personnalisées via roadmap.sh  
✅ **Anonymat garanti** : contribue sans donner ton nom ni ton email  

---

## ✨ Fonctionnalités

### 🔍 Recherche Intelligente

- **Langage naturel** : "DevOps senior Paris", "Data scientist junior Cameroun", ou même "je veux bosser dans l'IA"
- **IA Gemini** : Comprend le contexte et extrait les mots-clés pertinents
- **Matching avancé** : Trouve les postes correspondants dans une base de 10 000+ salaires

### 📊 Visualisations & Stats

- **Cartes de statistiques** : Médiane, moyenne, min, max, nombre de résultats
- **Graphiques interactifs** (Recharts) :
  - Distribution des salaires par années d'expérience
  - Répartition par statut de télétravail (Full remote, Hybride, Sur site)
  - Salaire médian par niveau d'expérience
- **Tableaux détaillés** : Liste complète avec poste, salaire, expérience, localisation, et télétravail
- **Export PDF** : Génère un rapport complet de ta recherche avec toutes les stats

### 🤖 IA & Roadmaps

- **Analyse contextuelle** : Gemini AI analyse tes résultats de recherche
- **Conseils de carrière** : Recommandations personnalisées basées sur ton profil
- **Roadmaps intégrées** : Suggestions de parcours depuis roadmap.sh (67 roadmaps disponibles)
  - Rôles : Frontend, Backend, DevOps, Data Analyst, Cybersecurity, etc.
  - Skills : Python, React, TypeScript, Docker, Kubernetes, etc.
- **Statistiques séparées** : Analyse différenciée France vs Cameroun (EUR vs FCFA)

### 🌍 Multi-Devises

- **Support FCFA et EUR** : Gestion des salaires camerounais (FCFA) et français/européens (EUR)
- **Normalisation automatique** : Conversion intelligente pour les calculs (1 EUR = 656 FCFA)
- **Affichage original** : Conserve la devise d'origine dans les tableaux (transparence)
- **Indicateurs visuels** : Drapeaux 🇨🇲 / 🇫🇷 pour identifier les pays

### 🤝 Contribution Communautaire

- **Formulaire anonyme** : Ajoute ton salaire sans donner ton identité
- **Validation des données** : Vérification automatique des montants (cohérence EUR/FCFA)
- **Base Supabase** : Stockage sécurisé avec Row Level Security (RLS)
- **Impact immédiat** : Tes données enrichissent les stats en temps réel

### 📱 Responsive & Moderne

- **Mobile-first** : Interface optimisée pour smartphones
- **Mode sombre** : Design élégant avec thème sombre par défaut
- **Animations fluides** : Lottie animations pour l'UX
- **Performance** : Chargement rapide avec Vite et React 18

---

## 🛠️ Stack Technique

### Frontend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **React** | 18.2 | Framework UI principal |
| **TypeScript** | 5.0 | Typage statique (strict mode) |
| **Vite** | 5.0 | Build tool ultra-rapide |
| **TailwindCSS** | 3.4 | Styling utility-first |
| **Recharts** | 2.10 | Graphiques interactifs |
| **React Router** | 6.20 | Routing SPA |
| **Lottie React** | 2.4 | Animations JSON |
| **jsPDF** | 2.5 | Export PDF des résultats |

### Backend & Services

| Service | Utilisation |
|---------|-------------|
| **Supabase** | Base de données PostgreSQL + RLS |
| **salaires.dev API** | Source principale de données (France) |
| **Google Gemini AI** | NLP et analyse de recherche (2.5 Flash) |
| **Vercel** | Hosting et déploiement continu |

### Outils de Développement

- **ESLint** : Linting avec config TypeScript strict
- **PostCSS** : Optimisation CSS
- **Git** : Versioning et collaboration

---

## 🏗️ Architecture

### Structure du Projet

```
openpay/
├── public/                    # Assets statiques
│   ├── logo-open.png         # Logo OpenPay
│   └── logo-pay.png
├── src/
│   ├── assets/               # Images, logos, animations Lottie
│   │   ├── logos/
│   │   └── lotties/
│   ├── components/           # Composants React
│   │   ├── Charts/          # Graphiques Recharts
│   │   │   ├── ExperienceChart.tsx
│   │   │   ├── RemoteChart.tsx
│   │   │   └── SalaryDistribution.tsx
│   │   ├── Layout/          # Header, Footer, Layout
│   │   ├── SearchBar/       # Recherche NLP
│   │   │   ├── SearchBar.tsx
│   │   │   ├── NaturalLanguageInput.tsx
│   │   │   └── AutoSuggest.tsx
│   │   ├── Stats/           # Cartes statistiques
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatsOverview.tsx
│   │   │   └── ExperienceBreakdown.tsx
│   │   ├── Table/           # Tableaux de données
│   │   │   ├── SalaryTable.tsx
│   │   │   └── SalaryTableMobile.tsx
│   │   └── UI/              # Composants UI réutilisables
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Loader.tsx
│   ├── models/              # Types TypeScript
│   │   ├── salary.ts
│   │   ├── statistics.ts
│   │   └── jobMatch.ts
│   ├── pages/               # Pages principales
│   │   ├── Home.tsx
│   │   ├── Results.tsx
│   │   ├── AddSalary.tsx
│   │   └── CameroonSalaries.tsx
│   ├── services/            # Services API
│   │   ├── salariesApi.ts       # API salaires.dev
│   │   ├── supabaseService.ts   # Supabase client
│   │   ├── llmService.ts        # Google Gemini AI
│   │   └── jobMatcher.ts        # Algorithme de matching
│   ├── utils/               # Utilitaires
│   │   ├── dataCleanup.ts       # Validation données
│   │   ├── dataFormatter.ts     # Formatage
│   │   ├── statsCalculator.ts   # Calculs statistiques
│   │   ├── currencyConverter.ts # Conversion devises
│   │   ├── pdfExporter.ts       # Export PDF
│   │   └── localStorage.ts      # Cache local
│   ├── config.ts            # Configuration (roadmaps)
│   ├── App.tsx              # Composant racine
│   └── main.tsx             # Point d'entrée
├── supabase-setup.sql       # Script SQL pour Supabase
├── SUPABASE_SETUP.md        # Guide configuration
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

### Flux de Données

```
┌─────────────────┐
│  User Interface │
│   (React App)   │
└────────┬────────┘
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
┌──────────────────┐                ┌──────────────────┐
│  salaires.dev    │                │    Supabase      │
│   (API France)   │                │ (Contributions)  │
└────────┬─────────┘                └────────┬─────────┘
         │                                    │
         └──────────────┬─────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Data Aggregation │
              │  & Normalization  │
              │  (EUR conversion) │
              └────────┬───────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌────────┐   ┌─────────┐   ┌──────────┐
    │ Tables │   │ Graphes │   │ Gemini AI│
    │ (orig) │   │ (norm)  │   │ Analysis │
    └────────┘   └─────────┘   └──────────┘
```

### Système de Normalisation des Devises

**Problème :** Mixer des salaires en EUR (France, 35k€-80k€) et FCFA (Cameroun, 3M-50M FCFA) détruit les graphiques.

**Solution :**
1. **Taux fixe** : 1 EUR = 656 FCFA (taux officiel XAF)
2. **Double flux** :
   - `matchedSalaries` : données originales (pour tableaux)
   - `normalizedSalaries` : tout converti en EUR (pour graphiques/stats)
3. **Validation** : Rejette les salaires FCFA < 1M ou EUR < 15k (incohérents)
4. **Affichage** : Conserve la devise d'origine + indicateur pays (🇨🇲 / 🇫🇷)

```typescript
// Exemple de normalisation
const FCFA_TO_EUR_RATE = 656;

function normalizeSalary(amount: number, country: string): number {
  if (country === "Cameroun") {
    return amount / FCFA_TO_EUR_RATE; // FCFA → EUR
  }
  return amount; // Déjà en EUR
}
```

---

## 🚀 Installation

### Prérequis

- **Node.js** >= 18.x
- **npm** ou **yarn** ou **pnpm**
- **Git**
- Compte **Supabase** (gratuit)
- Clé API **Google Gemini** (gratuite via AI Studio)

### 1. Cloner le Repo

```bash
git clone https://github.com/Tiger-Foxx/openpay.git
cd openpay
```

### 2. Installer les Dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configuration des Variables d'Environnement

Crée un fichier `.env` à la racine :

```env
# Supabase
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ta-cle-anon-publique

# Google Gemini AI
VITE_GEMINI_API_KEY=ta-cle-api-gemini
```

**⚠️ Important :** Ne commit **JAMAIS** ton fichier `.env` ! Il est déjà dans `.gitignore`.

### 4. Configuration Supabase

Suis le guide complet dans [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) ou exécute le script SQL :

```bash
# Dans le SQL Editor de Supabase, copie-colle le contenu de :
cat supabase-setup.sql
```

Le script créera :
- Table `salaries` avec les colonnes appropriées
- Policies RLS pour lecture publique + insertion anonyme
- Indexes pour performance

**Schema de la table Supabase :**

```sql
create table public.salaries (
  id text not null,
  company text null,
  title text null,
  location text null,
  compensation double precision null,
  date date null,
  level text null,
  company_xp real null,
  total_xp integer null,
  remote json null,
  source text null default 'supabase'::text,
  country text null,
  constraint salaries_pkey primary key (id)
) tablespace pg_default;
```

### 5. Lancer en Dev

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

### 6. Build de Production

```bash
npm run build
npm run preview  # Prévisualiser le build
```

---

## ⚙️ Configuration

### Configuration Google Gemini AI

1. Va sur [Google AI Studio](https://aistudio.google.com/)
2. Crée un compte (gratuit)
3. Génère une clé API
4. Ajoute-la dans `.env` : `VITE_GEMINI_API_KEY=ta-cle`

**Quota gratuit :** 60 requêtes/minute, largement suffisant.

### Configuration Supabase

**Option 1 : Via l'interface Supabase**
1. Crée un nouveau projet sur [Supabase](https://supabase.com/)
2. Va dans SQL Editor
3. Copie-colle le contenu de `supabase-setup.sql`
4. Exécute le script
5. Récupère ton URL et ta clé anon dans Settings → API

**Option 2 : Via CLI**
```bash
supabase init
supabase link --project-ref ton-projet-id
supabase db push
```

### Roadmaps Personnalisées

Les roadmaps sont configurées dans `src/config.ts` :

```typescript
export const config = {
  roadmaps: [
    { id: 'frontend', name: 'Frontend Developer', url: 'https://roadmap.sh/frontend' },
    { id: 'backend', name: 'Backend Developer', url: 'https://roadmap.sh/backend' },
    // ... +65 autres roadmaps
  ]
};
```

Tu peux ajouter/modifier les roadmaps selon tes besoins.

---

## 📖 Utilisation

### 1. Recherche Simple

1. Tape ta recherche dans la barre : "développeur React 3 ans"
2. Clique sur "Rechercher" ou appuie sur Entrée
3. Consulte les résultats, graphiques et analyses IA

### 2. Recherche Avancée (NLP)

L'IA comprend les requêtes naturelles :
- ✅ "DevOps senior avec 5 ans d'expérience"
- ✅ "Data scientist junior au Cameroun"
- ✅ "Je veux travailler dans la cybersécurité"
- ✅ "Salaire développeur fullstack Paris télétravail"

### 3. Interpréter les Résultats

**Statistiques :**
- **Médiane** : Salaire du milieu (50% gagnent moins, 50% plus)
- **Moyenne** : Salaire moyen arithmétique
- **Min/Max** : Fourchette basse et haute

**Graphiques :**
- **Par expérience** : Voir l'évolution salariale selon les années
- **Par télétravail** : Comparer remote vs hybride vs sur site
- **Distribution** : Visualiser la répartition des salaires

**Analyse IA :**
- Synthèse des résultats
- Comparaison par pays (si données FCFA et EUR)
- Recommandations de roadmaps pour progresser

### 4. Exporter en PDF

Clique sur "Exporter en PDF" pour télécharger un rapport complet avec :
- Titre de ta recherche
- Toutes les statistiques
- Graphiques (images intégrées)
- Tableau détaillé des salaires
- Analyse IA

### 5. Contribuer ton Salaire

1. Va sur "Ajouter mon salaire"
2. Remplis le formulaire (100% anonyme) :
   - Poste (ex: "Développeur React")
   - Salaire annuel brut (ex: 42000 pour EUR, 28000000 pour FCFA)
   - Expérience (en années)
   - Pays (France / Cameroun / Autre)
   - Localisation (ville)
   - Télétravail (Full remote / Hybride / Sur site)
3. Clique sur "Soumettre"
4. Tes données enrichissent immédiatement la base

**Note :** Aucun nom, aucun email, aucune donnée personnelle n'est collectée.

---

## 💡 Cas d'Usage

### 1. Négocier ton Salaire en Entretien

**Contexte :** Tu as un entretien demain, tu ne sais pas combien demander.

**Solution :**
1. Cherche ton poste + expérience sur OpenPay : "développeur fullstack 2 ans Paris"
2. Note la médiane (ex: 42k€) et la fourchette (38k-48k€)
3. Demande 45k€ en entretien, négocie à 43k€
4. Profit : tu sais exactement où tu te situes

### 2. Changer de Poste ou de Pays

**Contexte :** Tu veux passer de frontend à DevOps, ou comparer France vs Cameroun.

**Solution :**
1. Compare les salaires : "frontend developer" vs "DevOps engineer"
2. Regarde les différences par pays (EUR vs FCFA)
3. Analyse les roadmaps IA pour le upskilling nécessaire
4. Prends ta décision en connaissance de cause

**Exemple :** DevOps Cameroun = 8-15M FCFA/an (~12k-23k€), France = 45k€.

### 3. Piloter ta Progression de Carrière

**Contexte :** Tu es junior et tu te demandes quoi apprendre pour monter en salaire.

**Solution :**
1. Cherche ton poste actuel : "développeur junior"
2. Consulte les roadmaps suggérées par l'IA
3. Checke les salaires des niveaux supérieurs (mid, senior)
4. Follow la roadmap et réévalue dans 1-2 ans

**Exemple :** Data Analyst junior → Python + SQL + Tableau → Data Scientist (+30% salaire).

### 4. Aider les Juniors et la Communauté

**Contexte :** Tu veux contribuer à la transparence salariale.

**Solution :**
1. Ajoute ton salaire anonymement sur OpenPay
2. Partage l'outil avec tes pairs
3. Plus de données = stats plus fiables pour tout le monde
4. Impact collectif : moins de juniors arnaqués

---

## 💱 Système de Devises

### Devises Supportées

| Devise | Code ISO | Pays | Symbole | Fourchette Typique |
|--------|----------|------|---------|-------------------|
| **Euro** | EUR | France, Europe | € | 30k€ - 100k€ |
| **Franc CFA** | XAF | Cameroun | FCFA | 3M - 50M FCFA |

### Taux de Conversion

**Taux fixe utilisé :** `1 EUR = 656 FCFA` (taux officiel XAF du franc CFA d'Afrique centrale)

**Pourquoi un taux fixe ?**
- Le FCFA est arrimé à l'euro (parité fixe depuis 1999)
- Variation minimale (<2% sur 20 ans)
- Simplifie les calculs sans affecter la précision

### Normalisation pour les Calculs

**Problème initial :**
```
❌ Salaire 1 : 42 000 (EUR, France)
❌ Salaire 2 : 28 000 000 (FCFA, Cameroun)
❌ Moyenne : 14 021 000 → Incohérent !
```

**Solution avec normalisation :**
```typescript
// Conversion FCFA → EUR pour les calculs
Salaire 1 : 42 000 EUR (France)
Salaire 2 : 28 000 000 FCFA → 42 683 EUR (Cameroun)
Moyenne : 42 341 EUR ✅

// Affichage : conserve la devise d'origine
France : 42 000€
Cameroun : 28 000 000 FCFA 🇨🇲
```

### Code de Conversion

```typescript
// src/utils/currencyConverter.ts
export const FCFA_TO_EUR_RATE = 656;

export function fcfaToEur(fcfa: number): number {
  return fcfa / FCFA_TO_EUR_RATE;
}

export function eurToFcfa(eur: number): number {
  return eur * FCFA_TO_EUR_RATE;
}

export function formatCompensation(
  amount: number, 
  currency: 'EUR' | 'XAF'
): string {
  if (currency === 'XAF') {
    return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  }
  return `${amount.toLocaleString('fr-FR')} €`;
}
```

### Validation des Données

Pour éviter les données aberrantes :

```typescript
// src/utils/dataCleanup.ts
function isValidSalary(amount: number, country: string): boolean {
  if (country === "Cameroun") {
    // FCFA : entre 1M et 100M
    return amount >= 1_000_000 && amount <= 100_000_000;
  } else {
    // EUR : entre 15k et 500k
    return amount >= 15_000 && amount <= 500_000;
  }
}
```

---

## 🔌 API & Services

### 1. salaires.dev API

**URL :** `https://salaires.dev/api/salaries`

**Données :**
- ~10 000 salaires du secteur tech français
- Champs : title, compensation, location, remote, experience
- Mise à jour : communauté salaires.dev

**Exemple de requête :**
```typescript
const response = await fetch('https://salaires.dev/api/salaries');
const data = await response.json();
```

### 2. Supabase (Contributions)

**Table :** `salaries`

**RLS Policies :**
- ✅ Lecture publique : `SELECT` autorisé pour tous
- ✅ Insertion anonyme : `INSERT` autorisé sans authentification
- ❌ Modification/suppression : Interdites (protection des données)

**Exemple de requête :**
```typescript
import { supabase } from './supabaseService';

const { data, error } = await supabase
  .from('salaries')
  .select('*')
  .order('created_at', { ascending: false });
```

### 3. Google Gemini AI

**Modèle :** `gemini-2.5-flash-latest`

**Utilisation :**
1. **Parsing de recherche** : Extrait les mots-clés de la requête naturelle
2. **Matching de jobs** : Trouve les titres de postes correspondants
3. **Analyse de résultats** : Génère un résumé intelligent des statistiques
4. **Recommandations de roadmaps** : Propose des parcours d'apprentissage

### 4. roadmap.sh

**Roadmaps intégrées :** 67 parcours d'apprentissage

**Catégories :**
- **Rôles** : Frontend, Backend, DevOps, Data Scientist, etc.
- **Skills** : Python, React, TypeScript, Docker, Kubernetes, etc.
- **Domaines** : Cybersecurity, Machine Learning, Blockchain, etc.

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment participer :

### 1. Fork & Clone

```bash
git clone https://github.com/ton-username/openpay.git
cd openpay
```

### 2. Crée une Branche

```bash
git checkout -b feature/ma-super-feature
```

### 3. Fais tes Modifications

- Code propre et typé (TypeScript strict)
- Respecte les conventions ESLint
- Ajoute des commentaires si nécessaire
- Teste tes changements

### 4. Commit & Push

```bash
git add .
git commit -m "feat: ajout de ma super feature"
git push origin feature/ma-super-feature
```

### 5. Ouvre une Pull Request

### Types de Contributions

- 🐛 **Bug fixes** : Corrections de bugs
- ✨ **Features** : Nouvelles fonctionnalités
- 📝 **Documentation** : Amélioration du README, guides
- 🎨 **UI/UX** : Design, animations, responsive
- 🌍 **i18n** : Traductions (anglais, espagnol, etc.)
- 📊 **Data** : Nouveaux pays, devises, sources de données
- 🧪 **Tests** : Ajout de tests unitaires/e2e

---

## 🗺️ Roadmap

### Version Actuelle : 1.0.0

✅ Recherche en langage naturel  
✅ Stats & graphiques complets  
✅ Support multi-devises (EUR/FCFA)  
✅ IA Gemini intégrée  
✅ Roadmaps personnalisées  
✅ Export PDF  
✅ Contribution anonyme  

### Version 1.1 (Q1 2026)

- 🔄 Mode comparaison (comparer 2 postes côte à côte)
- 🌍 Ajout de nouveaux pays (Sénégal, Côte d'Ivoire, Belgique)
- 📈 Graphiques d'évolution temporelle (salaires sur 5 ans)
- 🔔 Alertes salaires
- 🌐 i18n : Traduction anglais/espagnol

### Version 2.0 (Q3 2026)

- 🤖 Chatbot IA intégré
- 📊 Dashboard personnel
- 🏢 Mode entreprise (grilles salariales publiques)
- 🎓 Parcours de carrière
- 🔗 API publique OpenPay

---

## 📄 License

Ce projet est sous license **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 🙏 Crédits

### Créateur

<div align="center">

<img src="./src/assets/logos/logo-fox-dark.png" alt="The Fox" width="100"/>

**[The Fox](https://the-fox.tech)**  
*Computer Engineering Scientist*

[![GitHub](https://img.shields.io/badge/GitHub-Tiger--Foxx-181717?logo=github)](https://github.com/Tiger-Foxx)
[![Website](https://img.shields.io/badge/Website-the--fox.tech-blue)](https://the-fox.tech)

</div>

### Sources de Données

- **[salaires.dev](https://salaires.dev)** : API des salaires tech français
- **Contributeurs OpenPay** : Tous ceux qui ont partagé leur salaire anonymement

### Technologies & Outils

- **[React](https://reactjs.org/)** - **[Vite](https://vitejs.dev/)** - **[Supabase](https://supabase.com/)**
- **[Google Gemini](https://ai.google.dev/)** - **[roadmap.sh](https://roadmap.sh/)**
- **[Recharts](https://recharts.org/)** - **[TailwindCSS](https://tailwindcss.com/)**

---

<div align="center">

### ⭐ Si OpenPay t'a aidé, lâche une étoile sur GitHub !

**Fait avec ❤️ et beaucoup de ☕ par [The Fox](https://the-fox.tech)**

*Parce qu'au final, la transparence salariale, c'est un droit.*

---

[![Star on GitHub](https://img.shields.io/github/stars/Tiger-Foxx/openpay?style=social)](https://github.com/Tiger-Foxx/openpay)
[![Fork on GitHub](https://img.shields.io/github/forks/Tiger-Foxx/openpay?style=social)](https://github.com/Tiger-Foxx/openpay/fork)
[![Follow @Tiger-Foxx](https://img.shields.io/github/followers/Tiger-Foxx?label=Follow&style=social)](https://github.com/Tiger-Foxx)

</div>
