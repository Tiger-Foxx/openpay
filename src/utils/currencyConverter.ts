/**
 * Utilitaires de conversion de devises pour OpenPay
 * 
 * Le problème : Les salaires camerounais sont en FCFA (millions) et les salaires
 * français/européens en EUR (milliers). Mélanger les deux fausse tous les graphiques.
 * 
 * La solution : Normaliser tout en EUR pour les calculs/graphiques, mais garder
 * l'affichage original dans les tableaux.
 */

import { CleanedSalary } from "@/models/salary";

// Taux de change fixe (mis à jour: Octobre 2025)
// 1 EUR = 656 FCFA (taux officiel zone CFA)
export const FCFA_TO_EUR_RATE = 656;

/**
 * Convertit un montant FCFA en EUR
 */
export function fcfaToEur(amountFCFA: number): number {
  return Math.round(amountFCFA / FCFA_TO_EUR_RATE);
}

/**
 * Convertit un montant EUR en FCFA
 */
export function eurToFcfa(amountEUR: number): number {
  return Math.round(amountEUR * FCFA_TO_EUR_RATE);
}

/**
 * Normalise un salaire en EUR pour les calculs/statistiques
 * - Si Cameroun (FCFA) : convertit en EUR
 * - Sinon : garde le montant en EUR
 * 
 * IMPORTANT : Cette fonction modifie le salaire pour les CALCULS uniquement,
 * l'affichage original sera préservé dans les tableaux
 */
export function normalizeCompensationToEur(salary: CleanedSalary): number {
  if (salary.country === "Cameroun") {
    return fcfaToEur(salary.compensation);
  }
  return salary.compensation;
}

/**
 * Normalise un tableau de salaires en EUR pour les calculs
 * Retourne un nouveau tableau avec les montants normalisés
 */
export function normalizeSalariesForCalculations(salaries: CleanedSalary[]): CleanedSalary[] {
  return salaries.map(salary => {
    if (salary.country === "Cameroun") {
      return {
        ...salary,
        compensation: fcfaToEur(salary.compensation),
        // Ajouter un flag pour savoir qu'on a converti
        _originalCompensation: salary.compensation,
        _originalCurrency: "FCFA" as const,
      };
    }
    return {
      ...salary,
      _originalCompensation: salary.compensation,
      _originalCurrency: "EUR" as const,
    };
  });
}

/**
 * Formate un montant selon la devise
 */
export function formatCompensation(amount: number, country?: string): string {
  if (country === "Cameroun") {
    // Format FCFA : 12 000 000 FCFA
    return `${amount.toLocaleString("fr-FR")} FCFA`;
  }
  // Format EUR : 45 000 €
  return `${amount.toLocaleString("fr-FR")} €`;
}

/**
 * Obtient le symbole de devise pour un pays
 */
export function getCurrencySymbol(country?: string): string {
  return country === "Cameroun" ? "FCFA" : "€";
}

/**
 * Obtient le code devise pour un pays
 */
export function getCurrencyCode(country?: string): "FCFA" | "EUR" {
  return country === "Cameroun" ? "FCFA" : "EUR";
}
