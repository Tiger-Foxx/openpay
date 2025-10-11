// src/services/jobMatcher.ts

import {
  UserSkills,
  JobMatchResult,
  JobMatcherResponse,
} from "@/models/jobMatch";
import { matchJobsBySkills } from "./llmService";
import { getCombinedSalaries } from "./supabaseService";
import { filterSalaries } from "./salariesApi";

/**
 * Service pour la fonctionnalité "TROUVER QUEL MÉTIER JE PEUX FAIRE"
 * Orchestre LLM + calculs statistiques de salaires
 */

/**
 * Fonction principale : trouve les métiers compatibles avec le profil utilisateur
 */
export async function findMatchingJobs(
  userSkills: UserSkills
): Promise<JobMatcherResponse> {
  try {
    console.log("[JobMatcher] Recherche de métiers pour profil:", userSkills);

    // 1️⃣ Appel au LLM pour obtenir les métiers correspondants
    const llmMatches = await matchJobsBySkills(userSkills);

    if (llmMatches.length === 0) {
      console.warn("[JobMatcher] Aucun métier trouvé par le LLM");
      return {
        matches: [],
        generatedAt: new Date().toISOString(),
      };
    }

    // 2️⃣ Pour chaque métier, calculer le salaire moyen
    const allSalaries = await getCombinedSalaries();

    const enrichedMatches: JobMatchResult[] = await Promise.all(
      llmMatches.map(async (match) => {
        // Filtrer les salaires pour ce métier
        const jobSalaries = filterSalaries(allSalaries, {
          titles: [match.jobTitle],
        });

        // Calculer salaire moyen
        let averageSalary = 0;
        if (jobSalaries.length > 0) {
          const compensations = jobSalaries.map((s) => s.compensation);
          averageSalary = Math.round(
            compensations.reduce((sum, c) => sum + c, 0) / compensations.length
          );
        }

        return {
          ...match,
          averageSalary,
        };
      })
    );

    // 3️⃣ Trier par score de compatibilité
    enrichedMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    console.log(
      `[JobMatcher] ${enrichedMatches.length} métiers trouvés et enrichis`
    );

    return {
      matches: enrichedMatches.slice(0, 3), // Top 3 max
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[JobMatcher] Erreur findMatchingJobs:", error);
    throw new Error(
      "Impossible de trouver des métiers correspondants. Veuillez réessayer."
    );
  }
}
