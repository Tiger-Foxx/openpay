import { Salary, CleanedSalary } from "@/models/salary";

/**
 * Nettoie et valide les données de salaires
 */

/**
 * Filtre les salaires invalides en tenant compte de la devise
 * - Cameroun (FCFA) : salaires en millions (1M - 100M FCFA ≈ 1.5k - 150k EUR)
 * - France/Autre (EUR) : salaires en milliers (15k - 500k EUR)
 */
export function filterValidSalaries(salaries: Salary[]): Salary[] {
  return salaries.filter((salary) => {
    // Company et location obligatoires
    if (!salary.company || !salary.location) {
      return false;
    }

    // Validation du salaire selon le pays/devise
    if (!salary.compensation || salary.compensation <= 0) {
      return false;
    }

    const country = salary.country || "France";
    
    // Pour le Cameroun (FCFA) : accepter les montants entre 1M et 100M FCFA
    if (country === "Cameroun") {
      // Salaire typique au Cameroun : 3M - 50M FCFA (junior à senior)
      // On accepte 1M - 100M pour être tolérant avec les très hauts salaires
      if (salary.compensation < 100000 || salary.compensation > 1000000000) {
        console.warn(`[DataCleanup] Salaire Cameroun hors limites rejeté: ${salary.compensation} FCFA`);
        return false;
      }
    } else {
      // Pour France/Autre (EUR) : accepter les montants entre 15k et 500k EUR
      if (salary.compensation < 1500 || salary.compensation > 50000000) {
        console.warn(`[DataCleanup] Salaire EUR hors limites rejeté: ${salary.compensation}€`);
        return false;
      }
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
 * Gère la casse : "DevOps" et "devops" sont considérés comme identiques
 */
export function extractUniqueTitles(salaries: Salary[]): string[] {
  const titles = salaries
    .map((s) => s.title)
    .filter((title): title is string => title !== null && title.trim() !== "");

  // Dédupliquer en ignorant la casse
  const uniqueTitlesMap = new Map<string, string>();

  titles.forEach((title) => {
    const normalized = normalizeTitle(title);
    // Garde la première occurrence (ou celle avec la meilleure casse)
    if (!uniqueTitlesMap.has(normalized)) {
      uniqueTitlesMap.set(normalized, title);
    } else {
      // Préférer les titres avec majuscules appropriées (ex: "DevOps" plutôt que "devops")
      const existing = uniqueTitlesMap.get(normalized)!;
      const hasMoreUpperCase =
        (title.match(/[A-Z]/g) || []).length >
        (existing.match(/[A-Z]/g) || []).length;
      if (hasMoreUpperCase) {
        uniqueTitlesMap.set(normalized, title);
      }
    }
  });

  // Retourner les titres uniques triés
  return Array.from(uniqueTitlesMap.values()).sort();
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
