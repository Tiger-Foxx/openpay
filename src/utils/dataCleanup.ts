import { Salary, CleanedSalary } from "@/models/salary";

/**
 * Nettoie et valide les données de salaires
 */

/**
 * Filtre les salaires invalides
 */
export function filterValidSalaries(salaries: Salary[]): Salary[] {
  return salaries.filter((salary) => {
    // Compensation doit être > 0 et réaliste (entre 15k et 500k)
    if (
      !salary.compensation ||
      salary.compensation < 15000 ||
      salary.compensation > 500000
    ) {
      return false;
    }

    // Company et location obligatoires
    if (!salary.company || !salary.location) {
      return false;
    }

    return true;
  });
}

/**
 * Remplit les champs manquants avec des valeurs par défaut
 */
export function cleanSalary(salary: Salary): CleanedSalary {
  return {
    ...salary,
    title: salary.title || "Poste non spécifié",
    total_xp: salary.total_xp ?? salary.company_xp ?? 0, // Fallback sur company_xp ou 0
    level: salary.level || estimateLevel(salary.total_xp),
    country: salary.country || "France", // Par défaut France (salaires.dev)
    source: salary.source || "salaires.dev",
  };
}

/**
 * Estime le niveau (Junior/Mid/Senior) en fonction de l'XP
 */
function estimateLevel(xp: number | null): "Junior" | "Mid" | "Senior" | null {
  if (xp === null) return null;
  if (xp <= 2) return "Junior";
  if (xp <= 5) return "Mid";
  return "Senior";
}

/**
 * Nettoie un tableau de salaires complet
 */
export function cleanSalaries(salaries: Salary[]): CleanedSalary[] {
  return filterValidSalaries(salaries).map(cleanSalary);
}

/**
 * Extrait les titres de poste uniques (pour autosuggest)
 */
export function extractUniqueTitles(salaries: Salary[]): string[] {
  const titles = salaries
    .map((s) => s.title)
    .filter((title): title is string => title !== null && title.trim() !== "");

  // Dédupliquer et trier alphabétiquement
  return Array.from(new Set(titles)).sort();
}

/**
 * Normalise un titre de poste (lowercase, trim, accents)
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Supprime les accents
}
