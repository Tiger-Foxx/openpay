import type { CleanedSalary } from "@/models/salary";
import type {
  SalaryStatistics,
  ExperienceBreakdownItem,
  RemoteBreakdownItem,
  QuartileData,
  SalaryDistributionBin,
} from "@/models/statistics";
import { config } from "@/config";

/**
 * Calcule les statistiques complètes pour un ensemble de salaires
 */
export function calculateStatistics(
  salaries: CleanedSalary[]
): SalaryStatistics | null {
  if (salaries.length < config.ui.minDataPointsForStats) {
    return null; // Pas assez de données
  }

  const compensations = salaries
    .map((s) => s.compensation)
    .sort((a, b) => a - b);

  const mean = calculateMean(compensations);
  const median = calculateMedian(compensations);
  const stdDev = calculateStdDev(compensations, mean);
  const quartiles = calculateQuartiles(compensations);

  const experienceBreakdown = calculateExperienceBreakdown(salaries);
  const remoteBreakdown = calculateRemoteBreakdown(salaries);

  // Salaires moyens par tranche d'XP
  const leastExperienced = salaries.filter(
    (s) => s.total_xp >= 0 && s.total_xp <= 2
  );
  const mostExperienced = salaries.filter((s) => s.total_xp >= 10);

  const leastExperiencedAvg =
    leastExperienced.length > 0
      ? calculateMean(leastExperienced.map((s) => s.compensation))
      : mean;

  const mostExperiencedAvg =
    mostExperienced.length > 0
      ? calculateMean(mostExperienced.map((s) => s.compensation))
      : mean;

  // Titres agrégés
  const jobTitles = Array.from(new Set(salaries.map((s) => s.title)));

  return {
    count: salaries.length,
    mean,
    median,
    stdDev,
    min: compensations[0],
    max: compensations[compensations.length - 1],
    quartiles,
    experienceBreakdown,
    remoteBreakdown,
    leastExperiencedAvg,
    mostExperiencedAvg,
    calculatedAt: new Date().toISOString(),
    jobTitles,
  };
}

/**
 * Calcule la moyenne
 */
function calculateMean(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calcule la médiane
 */
function calculateMedian(sortedValues: number[]): number {
  const mid = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 0
    ? (sortedValues[mid - 1] + sortedValues[mid]) / 2
    : sortedValues[mid];
}

/**
 * Calcule l'écart-type
 */
function calculateStdDev(values: number[], mean: number): number {
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
}

/**
 * Calcule les quartiles (Q1, Médiane, Q3)
 */
function calculateQuartiles(sortedValues: number[]): QuartileData {
  const q1Index = Math.floor(sortedValues.length * 0.25);
  const q3Index = Math.floor(sortedValues.length * 0.75);

  return {
    q1: sortedValues[q1Index],
    median: calculateMedian(sortedValues),
    q3: sortedValues[q3Index],
  };
}

/**
 * Calcule la distribution par tranche d'expérience
 */
function calculateExperienceBreakdown(
  salaries: CleanedSalary[]
): ExperienceBreakdownItem[] {
  return config.stats.experienceBrackets.map((bracket) => {
    const filtered = salaries.filter(
      (s) => s.total_xp >= bracket.min && s.total_xp <= bracket.max
    );

    const compensations = filtered
      .map((s) => s.compensation)
      .sort((a, b) => a - b);

    return {
      label: bracket.label,
      minXp: bracket.min,
      maxXp: bracket.max,
      count: filtered.length,
      averageSalary: filtered.length > 0 ? calculateMean(compensations) : 0,
      medianSalary: filtered.length > 0 ? calculateMedian(compensations) : 0,
    };
  });
}

/**
 * Calcule la distribution par type de remote
 */
function calculateRemoteBreakdown(
  salaries: CleanedSalary[]
): RemoteBreakdownItem[] {
  const variants: Array<"none" | "partial" | "full"> = [
    "none",
    "partial",
    "full",
  ];

  return variants.map((variant) => {
    const filtered = salaries.filter((s) => s.remote?.variant === variant);
    const compensations = filtered.map((s) => s.compensation);

    return {
      variant,
      count: filtered.length,
      percentage: filtered.length / salaries.length,
      averageSalary: filtered.length > 0 ? calculateMean(compensations) : 0,
    };
  });
}

/**
 * Génère des bins pour un histogramme de distribution
 */
export function generateDistributionBins(
  salaries: CleanedSalary[],
  binCount: number = 10
): SalaryDistributionBin[] {
  if (salaries.length === 0) return [];

  const compensations = salaries
    .map((s) => s.compensation)
    .sort((a, b) => a - b);
  const min = compensations[0];
  const max = compensations[compensations.length - 1];
  const binSize = (max - min) / binCount;

  const bins: SalaryDistributionBin[] = [];

  for (let i = 0; i < binCount; i++) {
    const rangeStart = min + i * binSize;
    const rangeEnd = i === binCount - 1 ? max : rangeStart + binSize;

    const count = compensations.filter(
      (c) => c >= rangeStart && c < rangeEnd
    ).length;

    bins.push({
      rangeStart: Math.round(rangeStart),
      rangeEnd: Math.round(rangeEnd),
      count,
      percentage: count / salaries.length,
    });
  }

  return bins;
}
