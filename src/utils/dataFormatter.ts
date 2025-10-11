/**
 * Fonctions de formatage pour l'affichage
 */

/**
 * Formate un salaire avec la devise appropriée
 * @example formatSalary(65000, "EUR") => "65 000 €"
 * @example formatSalary(12000000, "XAF") => "12 000 000 FCFA"
 */
export function formatSalary(
  amount: number,
  currency: "EUR" | "XAF" = "EUR"
): string {
  if (currency === "XAF") {
    // Franc CFA - Formatage personnalisé
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  }

  // Euro - Formatage standard
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formate un nombre avec séparateurs de milliers
 * @example formatNumber(1234567) => "1 234 567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("fr-FR").format(num);
}

/**
 * Formate une date ISO en format lisible
 * @example formatDate("2025-10-05T00:00:00.000Z") => "5 octobre 2025"
 */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

/**
 * Formate une date en format court
 * @example formatDateShort("2025-10-05T00:00:00.000Z") => "05/10/2025"
 */
export function formatDateShort(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-FR").format(new Date(isoDate));
}

/**
 * Formate le remote en texte lisible
 */
export function formatRemote(
  remote: { variant: string; dayCount?: number; base?: string } | null
): string {
  if (!remote) return "Non renseigné";

  switch (remote.variant) {
    case "none":
      return "Présentiel";
    case "full":
      return "100% Remote";
    case "partial":
      if (remote.dayCount && remote.base) {
        return `${remote.dayCount}j/${
          remote.base === "week" ? "semaine" : "mois"
        } remote`;
      }
      return "Hybride";
    default:
      return "Non spécifié";
  }
}

/**
 * Formate les années d'expérience
 */
export function formatExperience(years: number | null): string {
  if (years === null || years === 0) return "Débutant";
  if (years === 1) return "1 an";
  return `${years} ans`;
}

/**
 * Raccourcit un texte avec ellipse
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Formate un pourcentage
 * @example formatPercentage(0.7532) => "75.3%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
