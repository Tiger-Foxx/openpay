/**
 * Modèles pour les statistiques calculées
 */

export interface QuartileData {
  q1: number; // Premier quartile (25%)
  median: number; // Médiane (50%)
  q3: number; // Troisième quartile (75%)
}

export interface ExperienceBreakdownItem {
  label: string; // "0-2 ans"
  minXp: number;
  maxXp: number;
  count: number;
  averageSalary: number;
  medianSalary: number;
}

export interface RemoteBreakdownItem {
  variant: "none" | "partial" | "full";
  count: number;
  percentage: number;
  averageSalary: number;
}

export interface SalaryStatistics {
  count: number; // Nombre de salaires
  mean: number; // Moyenne
  median: number; // Médiane
  stdDev: number; // Écart-type
  min: number;
  max: number;
  quartiles: QuartileData;

  // Statistiques par expérience
  experienceBreakdown: ExperienceBreakdownItem[];

  // Statistiques remote
  remoteBreakdown: RemoteBreakdownItem[];

  // Salary range pour les moins/plus expérimentés
  leastExperiencedAvg: number; // Moyenne des 0-2 ans
  mostExperiencedAvg: number; // Moyenne des 10+ ans

  // Métadonnées
  calculatedAt: string; // ISO timestamp
  jobTitles: string[]; // Titres agrégés
}

/**
 * Distribution des salaires (pour histogramme)
 */
export interface SalaryDistributionBin {
  rangeStart: number;
  rangeEnd: number;
  count: number;
  percentage: number;
}
