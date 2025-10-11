/**
 * Gestion du localStorage pour cache et persistance
 */

const CACHE_PREFIX = "openpay_";

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // Durée en ms
}

/**
 * Sauvegarde des données dans le localStorage avec expiration
 */
export function setCache<T>(
  key: string,
  data: T,
  expiresIn: number = 1800000
): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    expiresIn,
  };

  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    console.error("[localStorage] Erreur de sauvegarde:", error);
  }
}

/**
 * Récupère des données du cache si elles ne sont pas expirées
 */
export function getCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const entry: CacheEntry<T> = JSON.parse(item);

    // Vérifier l'expiration
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error("[localStorage] Erreur de lecture:", error);
    return null;
  }
}

/**
 * Supprime une entrée du cache
 */
export function removeCache(key: string): void {
  localStorage.removeItem(CACHE_PREFIX + key);
}

/**
 * Nettoie tout le cache OpenPay
 */
export function clearAllCache(): void {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Sauvegarde l'historique des recherches
 */
export function saveSearchHistory(query: string): void {
  const history = getSearchHistory();
  const updated = [query, ...history.filter((q) => q !== query)].slice(0, 10); // Max 10
  localStorage.setItem(
    CACHE_PREFIX + "search_history",
    JSON.stringify(updated)
  );
}

/**
 * Récupère l'historique des recherches
 */
export function getSearchHistory(): string[] {
  try {
    const history = localStorage.getItem(CACHE_PREFIX + "search_history");
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}
