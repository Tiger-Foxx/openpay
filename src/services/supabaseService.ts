// src/services/supabaseService.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Salary, CleanedSalary } from "@/models/salary";
import { cleanSalaries } from "@/utils/dataCleanup";
import { config } from "@/config";

/**
 * Service Supabase pour les salaires communautaires
 *
 * 🎓 EXPLICATION POUR FOX :
 * Supabase = Base de données PostgreSQL hébergée avec API REST automatique
 *
 * Comment ça marche :
 * 1. Tu as créé un projet sur supabase.com
 * 2. Tu as obtenu une URL + une clé anonyme (dans ton .env)
 * 3. Tu as créé une table "salaries" avec le schéma fourni
 * 4. Ce code utilise le client Supabase pour faire des INSERT/SELECT/etc.
 *
 * C'est comme faire des requêtes SQL mais via une API simple !
 */

let supabase: SupabaseClient | null = null;

/**
 * Initialise le client Supabase (appelé automatiquement)
 */
function getSupabaseClient(): SupabaseClient {
  if (!config.supabase.enabled) {
    throw new Error("Supabase est désactivé dans la configuration");
  }

  if (!config.supabase.url || !config.supabase.anonKey) {
    throw new Error("Configuration Supabase manquante (URL ou Anon Key)");
  }

  if (!supabase) {
    supabase = createClient(config.supabase.url, config.supabase.anonKey);
    console.log("[Supabase] Client initialisé");
  }

  return supabase;
}

/**
 * Génère un UUID v4 simple (pour les IDs)
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Ajoute un salaire dans Supabase
 */
export async function addSalary(
  salaryData: Omit<Salary, "id">
): Promise<Salary> {
  if (!config.supabase.enabled) {
    throw new Error("Supabase est désactivé. Impossible d'ajouter un salaire.");
  }

  try {
    const client = getSupabaseClient();

    const newSalary: Salary = {
      id: generateUUID(),
      ...salaryData,
      source: "supabase",
      country: salaryData.country || "France",
    };

    const { data, error } = await client
      .from(config.supabase.tableName)
      .insert([newSalary])
      .select()
      .single();

    if (error) {
      console.error("[Supabase] Erreur insertion:", error);
      throw new Error(`Erreur lors de l'ajout du salaire: ${error.message}`);
    }

    console.log("[Supabase] Salaire ajouté avec succès:", data.id);
    return data as Salary;
  } catch (error) {
    console.error("[Supabase] Erreur addSalary:", error);
    throw error;
  }
}

/**
 * Récupère tous les salaires depuis Supabase
 */
export async function getAllSalaries(): Promise<Salary[]> {
  if (!config.supabase.enabled) {
    return [];
  }

  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from(config.supabase.tableName)
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("[Supabase] Erreur récupération:", error);
      return [];
    }

    console.log(`[Supabase] ${data?.length || 0} salaires récupérés`);
    return (data as Salary[]) || [];
  } catch (error) {
    console.error("[Supabase] Erreur getAllSalaries:", error);
    return [];
  }
}

/**
 * Récupère les salaires par pays
 */
export async function getSalariesByCountry(country: string): Promise<Salary[]> {
  if (!config.supabase.enabled) {
    return [];
  }

  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from(config.supabase.tableName)
      .select("*")
      .eq("country", country)
      .order("date", { ascending: false });

    if (error) {
      console.error("[Supabase] Erreur récupération par pays:", error);
      return [];
    }

    console.log(`[Supabase] ${data?.length || 0} salaires pour ${country}`);
    return (data as Salary[]) || [];
  } catch (error) {
    console.error("[Supabase] Erreur getSalariesByCountry:", error);
    return [];
  }
}

/**
 * Fusionne les salaires de salaires.dev + Supabase
 * C'EST LA FONCTION CLÉ pour avoir toutes les données !
 */
export async function getCombinedSalaries(): Promise<CleanedSalary[]> {
  try {
    // Import dynamique pour éviter les dépendances circulaires
    const { fetchAllSalaries } = await import("./salariesApi");

    // Récupère les deux sources
    const salariesDevData = await fetchAllSalaries();
    const supabaseData = config.supabase.enabled ? await getAllSalaries() : [];

    // Nettoie les données Supabase
    const cleanedSupabase = cleanSalaries(supabaseData);

    // Fusionne les deux
    const combined = [...salariesDevData, ...cleanedSupabase];

    console.log(
      `[Supabase] Données combinées: ${salariesDevData.length} (salaires.dev) + ${cleanedSupabase.length} (Supabase) = ${combined.length} total`
    );

    return combined;
  } catch (error) {
    console.error("[Supabase] Erreur getCombinedSalaries:", error);
    // Fallback sur salaires.dev uniquement
    const { fetchAllSalaries } = await import("./salariesApi");
    return fetchAllSalaries();
  }
}

/**
 * Met à jour un salaire existant
 */
export async function updateSalary(
  id: string,
  updates: Partial<Salary>
): Promise<Salary | null> {
  if (!config.supabase.enabled) {
    throw new Error("Supabase est désactivé");
  }

  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from(config.supabase.tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Supabase] Erreur update:", error);
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }

    console.log("[Supabase] Salaire mis à jour:", id);
    return data as Salary;
  } catch (error) {
    console.error("[Supabase] Erreur updateSalary:", error);
    throw error;
  }
}

/**
 * Supprime un salaire
 */
export async function deleteSalary(id: string): Promise<boolean> {
  if (!config.supabase.enabled) {
    throw new Error("Supabase est désactivé");
  }

  try {
    const client = getSupabaseClient();

    const { error } = await client
      .from(config.supabase.tableName)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Supabase] Erreur suppression:", error);
      return false;
    }

    console.log("[Supabase] Salaire supprimé:", id);
    return true;
  } catch (error) {
    console.error("[Supabase] Erreur deleteSalary:", error);
    return false;
  }
}

/**
 * Vérifie si Supabase est configuré et opérationnel
 */
export async function checkSupabaseHealth(): Promise<boolean> {
  if (!config.supabase.enabled) {
    return false;
  }

  try {
    const client = getSupabaseClient();
    const { error } = await client
      .from(config.supabase.tableName)
      .select("id")
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}
