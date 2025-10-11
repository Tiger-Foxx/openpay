/**
 * Modèle de données pour un salaire
 * Basé sur l'API salaires.dev + extensions Supabase
 */

export interface RemoteConfig {
  variant: "none" | "partial" | "full";
  dayCount?: number;
  base?: "week" | "month";
  location?: string;
}

export interface Salary {
  id?: string; // ID généré pour Supabase
  company: string;
  title: string | null;
  location: string;
  compensation: number; // Salaire annuel brut en euros
  date: string; // ISO 8601
  level: "Junior" | "Mid" | "Senior" | "Lead" | null;
  company_xp: number | null; // Années d'XP dans l'entreprise
  total_xp: number | null; // Années d'XP totales
  remote: RemoteConfig | null;
  source?: "salaires.dev" | "supabase"; // Source de la donnée
  country?: "France" | "Cameroun" | string; // Pays
}

export interface CleanedSalary extends Salary {
  // Version nettoyée avec champs obligatoires remplis
  title: string; // Titre jamais null après nettoyage
  total_xp: number; // XP estimée si null
}

/**
 * Filtre pour rechercher des salaires
 */
export interface SalaryFilter {
  titles?: string[]; // Liste de titres de poste
  minCompensation?: number;
  maxCompensation?: number;
  minExperience?: number;
  maxExperience?: number;
  locations?: string[];
  levels?: Array<"Junior" | "Mid" | "Senior" | "Lead">;
  remoteVariant?: Array<"none" | "partial" | "full">;
  country?: string;
}
