// src/services/salariesApi.ts

import { Salary, CleanedSalary, SalaryFilter } from "@/models/salary";
import {
  cleanSalaries,
  extractUniqueTitles,
  normalizeTitle,
} from "@/utils/dataCleanup";
import { getCache, setCache } from "@/utils/localStorage";
import { config } from "@/config";

/**
 * Service pour interagir avec l'API salaires.dev
 * Gère le cache, les erreurs, et la fusion avec Supabase
 */

const API_ENDPOINT = config.salariesApi.endpoint;
const CACHE_KEY = "salaries_data";
const TITLES_CACHE_KEY = "unique_titles";

/**
 * Récupère tous les salaires depuis l'API (avec cache intelligent)
 */
export async function fetchAllSalaries(): Promise<CleanedSalary[]> {
  // Vérifier le cache
  const cached = getCache<CleanedSalary[]>(CACHE_KEY);
  if (cached) {
    console.log("[SalariesAPI] Données récupérées du cache");
    return cached;
  }

  try {
    console.log("[SalariesAPI] Fetch depuis salaires.dev...");
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    const rawData: Salary[] = await response.json();

    // Nettoyage et validation avec nos utils
    const cleaned = cleanSalaries(rawData);

    // Mise en cache
    setCache(CACHE_KEY, cleaned, config.salariesApi.cacheDuration);

    console.log(
      `[SalariesAPI] ${cleaned.length} salaires récupérés et nettoyés`
    );
    return cleaned;
  } catch (error) {
    console.error("[SalariesAPI] Erreur lors du fetch:", error);
    throw new Error(
      "Impossible de récupérer les données de salaires. Veuillez réessayer plus tard."
    );
  }
}

/**
 * Récupère la liste des titres uniques pour l'autosuggest
 */
export async function getUniqueTitles(): Promise<string[]> {
  // Vérifier le cache des titres
  const cached = getCache<string[]>(TITLES_CACHE_KEY);
  if (cached) {
    return cached;
  }

  try {
    const salaries = await fetchAllSalaries();
    const titles = extractUniqueTitles(salaries);

    // Cache séparé pour les titres (plus long car ils changent rarement)
    setCache(TITLES_CACHE_KEY, titles, config.salariesApi.cacheDuration * 2);

    return titles;
  } catch (error) {
    console.error("[SalariesAPI] Erreur extraction des titres:", error);
    return [];
  }
}

/**
 * Recherche des salaires par titre (avec correspondance floue)
 */
export async function searchByTitle(query: string): Promise<CleanedSalary[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const allSalaries = await fetchAllSalaries();
    const normalizedQuery = normalizeTitle(query);

    return allSalaries.filter((salary) => {
      const normalizedTitle = normalizeTitle(salary.title);
      return normalizedTitle.includes(normalizedQuery);
    });
  } catch (error) {
    console.error("[SalariesAPI] Erreur recherche par titre:", error);
    return [];
  }
}

/**
 * Filtre les salaires selon des critères avancés
 */
export function filterSalaries(
  salaries: CleanedSalary[],
  filter: SalaryFilter
): CleanedSalary[] {
  return salaries.filter((salary) => {
    // Filtre par titre
    if (filter.titles && filter.titles.length > 0) {
      const normalizedTitle = normalizeTitle(salary.title);
      const matchesTitle = filter.titles.some(
        (title) => normalizedTitle === normalizeTitle(title)
      );
      if (!matchesTitle) return false;
    }

    // Filtre par salaire
    if (
      filter.minCompensation &&
      salary.compensation < filter.minCompensation
    ) {
      return false;
    }
    if (
      filter.maxCompensation &&
      salary.compensation > filter.maxCompensation
    ) {
      return false;
    }

    // Filtre par expérience
    if (filter.minExperience && salary.total_xp < filter.minExperience) {
      return false;
    }
    if (filter.maxExperience && salary.total_xp > filter.maxExperience) {
      return false;
    }

    // Filtre par localisation
    if (filter.locations && filter.locations.length > 0) {
      const matchesLocation = filter.locations.some((loc) =>
        salary.location.toLowerCase().includes(loc.toLowerCase())
      );
      if (!matchesLocation) return false;
    }

    // Filtre par niveau
    if (filter.levels && filter.levels.length > 0) {
      if (!salary.level || !filter.levels.includes(salary.level)) {
        return false;
      }
    }

    // Filtre par remote
    if (filter.remoteVariant && filter.remoteVariant.length > 0) {
      if (
        !salary.remote ||
        !filter.remoteVariant.includes(salary.remote.variant)
      ) {
        return false;
      }
    }

    // Filtre par pays
    if (filter.country) {
      if (salary.country !== filter.country) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Récupère les suggestions d'autosuggest
 */
export async function getAutoSuggestTitles(
  query: string,
  limit: number = 10
): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const allTitles = await getUniqueTitles();
    const normalizedQuery = normalizeTitle(query);

    // Correspondance exacte en premier
    const exactMatches = allTitles.filter((title) =>
      normalizeTitle(title).startsWith(normalizedQuery)
    );

    // Correspondance partielle ensuite
    const partialMatches = allTitles.filter((title) => {
      const normalized = normalizeTitle(title);
      return (
        !normalized.startsWith(normalizedQuery) &&
        normalized.includes(normalizedQuery)
      );
    });

    return [...exactMatches, ...partialMatches].slice(0, limit);
  } catch (error) {
    console.error("[SalariesAPI] Erreur autosuggest:", error);
    return [];
  }
}

/**
 * Force le rafraîchissement du cache
 */
export async function refreshCache(): Promise<void> {
  const { removeCache } = await import("@/utils/localStorage");
  removeCache(CACHE_KEY);
  removeCache(TITLES_CACHE_KEY);
  await fetchAllSalaries();
  console.log("[SalariesAPI] Cache rafraîchi");
}
