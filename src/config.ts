/**
 * Configuration centralisée pour OpenPay
 *
 * ⚠️ IMPORTANT: Ne commit JAMAIS tes clés API réelles.
 * Utilise des variables d'environnement (.env) pour la production.
 */

export const config = {
  // API Salaires.dev
  salariesApi: {
    endpoint: "https://salaires.dev/api/salaries",
    cacheDuration: 1000 * 60 * 30, // 30 minutes
  },

  // LLM Configuration (Gemini)
  llm: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
    model: "gemini-1.5-flash", // ou 'gemini-pro'
    maxTokens: 2048,
    temperature: 0.3, // Plus bas = plus déterministe
  },

  // Supabase Configuration
  supabase: {
    enabled: false, // Toggle pour activer/désactiver Supabase
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
    tableName: "salaries",
  },

  // Features Toggles
  features: {
    naturalLanguageSearch: true,
    jobMatcher: true,
    pdfExport: true,
    cameroonSalaries: true,
    aiSummary: true,
  },

  // UI Configuration
  ui: {
    itemsPerPage: 20,
    minDataPointsForStats: 5, // Minimum de salaires pour afficher des stats
    defaultChartHeight: 400,
    mobileBreakpoint: 768, // px
  },

  // Stats Configuration
  stats: {
    experienceBrackets: [
      { min: 0, max: 2, label: "0-2 ans" },
      { min: 3, max: 5, label: "3-5 ans" },
      { min: 6, max: 10, label: "6-10 ans" },
      { min: 11, max: Infinity, label: "10+ ans" },
    ],
  },

  // App Metadata
  app: {
    name: "OpenPay",
    tagline: "Salaires Tech en toute transparence",
    version: "1.0.0",
    author: "Fox",
    repository: "https://github.com/theTigerFox/openpay",
  },
} as const;

// Type helper pour l'autocomplétion
export type Config = typeof config;
