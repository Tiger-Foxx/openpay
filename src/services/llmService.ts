// src/services/llmService.ts

import { GoogleGenAI } from "@google/genai";
import { SalaryStatistics } from "@/models/statistics";
import { UserSkills, JobMatchResult } from "@/models/jobMatch";
import { config } from "@/config";

/**
 * Service LLM (Google Gemini) pour :
 * - Mapping sémantique des métiers
 * - Génération de résumés statistiques en langage naturel
 * - Parsing de descriptions de métiers
 * - Job matching basé sur compétences
 * - Gestion automatique du fallback entre clés API
 */

let genAI: GoogleGenAI | null = null;
let currentApiKey: "primary" | "fallback" = "primary";
let primaryKeyFailures = 0;

/**
 * Initialise le client Gemini (nouvelle API @google/genai)
 */
function getGenAI(useFallback: boolean = false): GoogleGenAI {
  const apiKey = useFallback ? config.llm.apiKeyFallback : config.llm.apiKey;

  if (!apiKey) {
    const keyType = useFallback
      ? "fallback (VITE_GEMINI_API_KEY_2)"
      : "primary (VITE_GEMINI_API_KEY)";
    console.error(`[LLM] ❌ ERREUR: Clé API Gemini ${keyType} manquante!`);
    console.error("[LLM] 💡 Assure-toi que les clés sont dans ton .env");
    throw new Error(
      `Clé API Gemini ${keyType} manquante dans la configuration`
    );
  }

  // Réinitialiser le client si on change de clé
  if (
    !genAI ||
    (useFallback && currentApiKey === "primary") ||
    (!useFallback && currentApiKey === "fallback")
  ) {
    genAI = new GoogleGenAI({ apiKey });
    currentApiKey = useFallback ? "fallback" : "primary";
    console.log(
      `[LLM] ✅ Client Gemini initialisé avec clé ${currentApiKey} (nouvelle API @google/genai)`
    );
    console.log(
      "[LLM] 🔑 Clé API (premiers 10 chars):",
      apiKey.substring(0, 10) + "..."
    );
    console.log("[LLM] 🤖 Modèle utilisé:", config.llm.model);
  }

  return genAI;
}

/**
 * Parse le JSON depuis une réponse LLM (robuste)
 */
function parseJSONFromLLM(response: string): Record<string, unknown> {
  console.log("[LLM] 🔍 Début parsing JSON...");

  let cleaned = response.trim();

  if (!cleaned) {
    console.error("[LLM] ❌ Réponse vide pour le parsing");
    throw new Error("Réponse vide");
  }

  // Enlever les markdown code blocks
  cleaned = cleaned.replace(/```json\s*/gi, "").replace(/```\s*/g, "");

  // Enlever tout texte avant le premier {
  const startIndex = cleaned.indexOf("{");
  if (startIndex === -1) {
    console.error(
      "[LLM] ❌ Aucun JSON trouvé dans la réponse:",
      cleaned.substring(0, 300)
    );
    throw new Error("Aucun JSON trouvé");
  }

  if (startIndex > 0) {
    console.log(
      "[LLM] 🧹 Texte avant JSON supprimé:",
      cleaned.substring(0, startIndex)
    );
    cleaned = cleaned.substring(startIndex);
  }

  // Enlever tout texte après le dernier }
  const endIndex = cleaned.lastIndexOf("}");
  if (endIndex === -1) {
    console.error("[LLM] ❌ Pas de fermeture } trouvée");
    throw new Error("JSON incomplet");
  }

  if (endIndex < cleaned.length - 1) {
    console.log(
      "[LLM] 🧹 Texte après JSON supprimé:",
      cleaned.substring(endIndex + 1)
    );
    cleaned = cleaned.substring(0, endIndex + 1);
  }

  console.log(
    "[LLM] 📄 JSON nettoyé (premiers 300 chars):",
    cleaned.substring(0, 300)
  );

  const parsed = JSON.parse(cleaned);
  console.log("[LLM] ✅ JSON parsé avec succès:", Object.keys(parsed));

  return parsed;
}

/**
 * Fonction utilitaire pour appeler le LLM avec gestion d'erreurs et fallback automatique
 * Utilise la nouvelle API @google/genai avec switch automatique vers clé fallback si quotas épuisés
 */
async function callLLM(
  prompt: string,
  retryWithFallback: boolean = true
): Promise<string> {
  const useFallback = currentApiKey === "fallback";

  try {
    const ai = getGenAI(useFallback);

    console.log(
      `[LLM] 📤 Envoi prompt avec clé ${currentApiKey} (premiers 200 chars):`,
      prompt.substring(0, 200)
    );

    // Nouvelle syntaxe API @google/genai
    const response = await ai.models.generateContent({
      model: config.llm.model,
      contents: prompt,
      config: {
        temperature: config.llm.temperature,
        maxOutputTokens: config.llm.maxTokens,
      },
    });

    console.log("[LLM] 🔍 Réponse API complète:", response);

    const text = response.text || "";

    if (!text || text.trim().length === 0) {
      console.error("[LLM] ⚠️ Réponse vide du LLM!");
      console.error(
        "[LLM] 📋 Debug - response:",
        JSON.stringify(response, null, 2)
      );
      throw new Error("Réponse vide du LLM");
    }

    console.log(
      "[LLM] 📥 Réponse brute (premiers 500 chars):",
      text.substring(0, 500)
    );
    console.log(
      "[LLM] 📏 Longueur totale de la réponse:",
      text.length,
      "caractères"
    );

    // Réinitialiser le compteur d'échecs si succès
    if (currentApiKey === "primary") {
      primaryKeyFailures = 0;
    }

    return text;
  } catch (error) {
    console.error(
      `[LLM] ❌ Erreur lors de l'appel avec clé ${currentApiKey}:`,
      error
    );
    console.error(
      "[LLM] 💡 Détails:",
      error instanceof Error ? error.message : String(error)
    );

    // Vérifier si c'est une erreur de quota et si on peut switcher
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isQuotaIssue =
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.toLowerCase().includes("too many requests") ||
      errorMessage.toLowerCase().includes("resource_exhausted") ||
      errorMessage.includes("429");

    // Si erreur de quota et clé primaire, essayer le fallback
    if (
      isQuotaIssue &&
      currentApiKey === "primary" &&
      retryWithFallback &&
      config.llm.apiKeyFallback
    ) {
      console.warn(
        "[LLM] ⚠️ Quota épuisé sur clé primaire, basculement vers clé fallback..."
      );
      primaryKeyFailures++;

      // Forcer le switch vers la clé fallback
      genAI = null; // Réinitialiser pour forcer la création d'un nouveau client
      currentApiKey = "fallback";

      // Réessayer avec la clé fallback
      return callLLM(prompt, false); // false pour éviter boucle infinie
    }

    // Si déjà sur fallback ou pas de fallback disponible
    if (currentApiKey === "fallback" || !config.llm.apiKeyFallback) {
      console.error(
        "[LLM] ❌ Aucune clé API disponible, impossible de continuer"
      );
    }

    throw new Error(
      "Erreur lors de la communication avec l'IA. Veuillez réessayer."
    );
  }
}

/**
 * 1️⃣ Mappe l'entrée utilisateur vers des titres exacts de la DB
 *
 * Exemple:
 * Input: "java dev"
 * Output: ["Java Developer", "Développeur Java", "Java Software Engineer"]
 */
export async function mapJobTitlesToDatabase(
  userInput: string,
  allTitles: string[]
): Promise<string[]> {
  if (!config.features.naturalLanguageSearch) {
    // Fallback: recherche simple par inclusion de string
    const normalized = userInput.toLowerCase();
    return allTitles.filter((title) =>
      title.toLowerCase().includes(normalized)
    );
  }

  try {
    console.log("[LLM] 🔍 mapJobTitlesToDatabase - Input:", userInput);
    console.log("[LLM] 📊 Nombre de titres disponibles:", allTitles.length);

    // ⚠️ LIMITE: Réduire à 850 titres pour éviter de dépasser le contexte Gemini
    const limitedTitles = allTitles.slice(0, 850);
    console.log("[LLM] 📋 Titres limités à:", limitedTitles.length);
    if (allTitles.length > 850) {
      console.warn(
        `[LLM] ⚠️ ${
          allTitles.length - 850
        } titres ignorés pour rester sous la limite de tokens`
      );
    }

    const prompt = `Tu es FOX, expert senior en classification de métiers tech avec 15 ans d'expérience dans l'analyse salariale et l'orientation de carrière. Tu maîtrises parfaitement les nuances entre métiers similaires, les évolutions de titres dans l'industrie, et les équivalences internationales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MISSION CRITIQUE - MATCHING PRÉCIS DE MÉTIERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifier UNIQUEMENT les titres de poste qui correspondent RÉELLEMENT au même métier que l'entrée utilisateur. ÉVITE les matchs trop larges qui nuisent à la pertinence.

📥 ENTRÉE UTILISATEUR : "${userInput}"

📋 BASE DE DONNÉES (Titres disponibles) :
${limitedTitles.map((title, idx) => `${idx + 1}. ${title}`).join("\n")}

⚙️ RÈGLES STRICTES DE MATCHING :
1. Retourne UNIQUEMENT des titres EXACTS présents dans la liste ci-dessus
2. Considère les variantes linguistiques et orthographiques du MÊME métier :
   • "dev" = "developer" = "développeur" = "software engineer"
   • "Fullstack" = "Full Stack" = "Full-Stack"
3. Gère les niveaux d'expérience intelligemment :
   • Si "senior/lead/principal" dans l'input → priorise ces titres
   • Si "junior/débutant" → priorise ces titres
   • Si pas de niveau spécifié → inclus TOUS les niveaux

🚨 RÈGLES D'EXCLUSION CRITIQUE (détail important !) :
❌ NE MATCHE PAS des métiers différents même s'ils sont dans le même domaine par exemple :
   • "CloudOps" ≠ "Administrateur Système" (responsabilités différentes)
   • "CloudOps" ≠ "Architecte Infra" (niveau et scope différents)
   • "DevOps" ≠ "SRE" (métiers distincts malgré similarités)
   • "Data Scientist" ≠ "Data Engineer" (métiers très différents)
   • "Backend Developer" ≠ "Full Stack Developer" (spécialisations différentes)
   • "Mobile Developer" ≠ "Frontend Developer" (plateformes différentes)

✅ MATCHE UNIQUEMENT :
   • Variantes orthographiques EXACTES du même poste
   • Traductions FR/EN du même poste
   • Abréviations communes du même poste
   • Les sous categories de postes , par exemple , dev et dev python , si l'utilisateur entre "dev"
   • Niveaux différents du MÊME métier (si niveau non spécifié)
   • Metier vraiment pareil mais moins precis , par exemple : Dev FullStack et devFullStack JS c'est pareil c'est dev full stack


📊 EXEMPLES DE MATCHING CORRECT :
   Input: "CloudOps" → Match: "Cloud Ops", "Cloud Operations Engineer", "CloudOps Engineer"
   Input: "CloudOps" → ❌ PAS: "Administrateur Système", "DevOps", "Architecte Infra"
   
   Input: "Data Scientist" → Match: "Data Scientist", "Scientist Data", "Senior Data Scientist" et match aussi tout ce que data scientist englobe , par exemple les sous categories
   
   Input: "Backend Developer" → Match: "Backend Developer", "Développeur Backend", "Backend Engineer"
   Input: "Backend Developer" → ❌ PAS: "Full Stack Developer", "DevOps Engineer"

🎯 FORMAT DE RÉPONSE (JSON STRICT - PAS D'AUTRE TEXTE) :
{
  "matches": ["Titre Exact 1", "Titre Exact 2", "Titre Exact N"],
  "reasoning": "Explication ultra-brève de ton matching strict (1 phrase max)"
}

⚠️ IMPÉRATIF : Réponds UNIQUEMENT avec le JSON valide. Aucun markdown, aucun commentaire. SOIS STRICT dans les correspondances pour éviter les faux positifs.`;

    const response = await callLLM(prompt);

    try {
      const parsed = parseJSONFromLLM(response);
      const matches = (parsed.matches as string[]) || [];
      console.log("[LLM] ✅ Matches trouvés:", matches.length, "titres");
      return matches;
    } catch (parseError) {
      console.error("[LLM] ❌ Erreur parsing JSON:", parseError);
      console.error("[LLM] 📄 Réponse complète:", response);
      // Fallback: recherche simple
      console.log("[LLM] 🔄 Fallback: recherche locale simple");
      const normalized = userInput.toLowerCase();
      const fallbackResults = allTitles
        .filter((title) => title.toLowerCase().includes(normalized))
        .slice(0, 10);
      console.log("[LLM] 🔄 Fallback résultats:", fallbackResults.length);
      return fallbackResults;
    }
  } catch (error) {
    console.error("[LLM] Erreur mapJobTitlesToDatabase:", error);
    // Fallback sur recherche simple
    const normalized = userInput.toLowerCase();
    return allTitles
      .filter((title) => title.toLowerCase().includes(normalized))
      .slice(0, 10);
  }
}

/**
 * 2️⃣ Génère un résumé statistique en langage naturel
 * Maintenant avec support de stats séparées Cameroun vs Autres pays
 */
export async function generateStatsSummary(
  stats: SalaryStatistics,
  jobTitles?: string[],
  statsCameroon?: SalaryStatistics,
  statsOther?: SalaryStatistics
): Promise<string> {
  if (!config.features.aiSummary) {
    return `Salaire moyen de ${Math.round(stats.mean)}€ sur ${
      stats.count
    } salaires analysés.`;
  }

  try {
    // Préparer la liste complète des roadmaps disponibles
    const availableRoadmaps = {
      roles: config.roadmaps.roles.map((r) => `${r.name} → ${r.url}`).join("\n"),
      skills: config.roadmaps.skills.map((s) => `${s.name} → ${s.url}`).join("\n"),
    };

    // Préparer le contexte des titres
    const titlesContext =
      jobTitles && jobTitles.length > 0
        ? `\n📋 POSTES CONCERNÉS : ${jobTitles.slice(0, 5).join(", ")}${
            jobTitles.length > 5 ? ` et ${jobTitles.length - 5} autres` : ""
          }`
        : "";

    // Construire les sections de stats par pays si disponibles
    const cameroonStatsSection = statsCameroon ? `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇨🇲 DONNÉES CAMEROUN (${statsCameroon.count} salaires en FCFA) :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Salaire médian : ${Math.round(statsCameroon.median).toLocaleString()} FCFA/an
• Fourchette : ${Math.round(statsCameroon.min).toLocaleString()} → ${Math.round(statsCameroon.max).toLocaleString()} FCFA
• Juniors (0-2 ans) : ${Math.round(statsCameroon.leastExperiencedAvg).toLocaleString()} FCFA
• Seniors (10+ ans) : ${Math.round(statsCameroon.mostExperiencedAvg).toLocaleString()} FCFA
${statsCameroon.juniorMaxSalary ? `• 🏆 Meilleur junior CM : ${Math.round(statsCameroon.juniorMaxSalary).toLocaleString()} FCFA - ${statsCameroon.juniorMaxDetails}` : ""}
${statsCameroon.seniorMaxSalary ? `• 🏆 Meilleur senior CM : ${Math.round(statsCameroon.seniorMaxSalary).toLocaleString()} FCFA - ${statsCameroon.seniorMaxDetails}` : ""}
` : "";

    const otherStatsSection = statsOther ? `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇫🇷 DONNÉES FRANCE/EUROPE (${statsOther.count} salaires en EUR) :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Salaire médian : ${Math.round(statsOther.median).toLocaleString()}€/an
• Fourchette : ${Math.round(statsOther.min).toLocaleString()}€ → ${Math.round(statsOther.max).toLocaleString()}€
• Juniors (0-2 ans) : ${Math.round(statsOther.leastExperiencedAvg).toLocaleString()}€
• Seniors (10+ ans) : ${Math.round(statsOther.mostExperiencedAvg).toLocaleString()}€
${statsOther.juniorMaxSalary ? `• 🏆 Meilleur junior EU : ${Math.round(statsOther.juniorMaxSalary).toLocaleString()}€ - ${statsOther.juniorMaxDetails}` : ""}
${statsOther.seniorMaxSalary ? `• 🏆 Meilleur senior EU : ${Math.round(statsOther.seniorMaxSalary).toLocaleString()}€ - ${statsOther.seniorMaxDetails}` : ""}
` : "";

    const prompt = `Tu es Fox, expert en salaires tech. Rédige un résumé ULTRA-CLAIR, organisé en POINTS COURTS, adapté mobile (pas de colonnes, pas de phrases trop longues).${titlesContext}

📊 DONNÉES GLOBALES (${stats.count} salaires analysés) :
• Salaire médian (typique) : ${Math.round(stats.median).toLocaleString()}€/an
• Fourchette globale : ${Math.round(stats.min).toLocaleString()}€ → ${Math.round(stats.max).toLocaleString()}€
• 50% gagnent PLUS de ${Math.round(stats.quartiles.median).toLocaleString()}€
• 25% gagnent MOINS de ${Math.round(stats.quartiles.q1).toLocaleString()}€

💼 ÉVOLUTION AVEC L'EXPÉRIENCE (global) :
• Juniors (0-2 ans) : ${Math.round(stats.leastExperiencedAvg).toLocaleString()}€ en moyenne
${
  stats.juniorMaxSalary
    ? `• 🏆 Meilleur junior : ${Math.round(stats.juniorMaxSalary).toLocaleString()}€ - ${
        stats.juniorMaxDetails
      }`
    : ""
}
• Seniors (10+ ans) : ${Math.round(stats.mostExperiencedAvg).toLocaleString()}€ en moyenne
${
  stats.seniorMaxSalary
    ? `• 🏆 Meilleur senior : ${Math.round(stats.seniorMaxSalary).toLocaleString()}€ - ${
        stats.seniorMaxDetails
      }`
    : ""
}
${cameroonStatsSection}${otherStatsSection}

🎯 STRUCTURE OBLIGATOIRE (phrases courtes, claires, mobile-first) :
${
  jobTitles && jobTitles.length > 1
    ? `0. Une phrase mentionnant les postes concernés avec "OU" entre eux : "Pour X, Y ou Z" (PAS "et", mais "OU" car ce sont des variantes du même métier)`
    : jobTitles && jobTitles.length === 1
    ? `0. Une phrase mentionnant le poste concerné : "${jobTitles[0]}"`
    : ""
}
1. Une phrase sur le salaire typique global (médiane)
${statsCameroon ? `2. 🇨🇲 OBLIGATOIRE : 2-3 phrases DÉDIÉES aux salaires camerounais en FCFA (médiane, junior, senior) - Ne PAS oublier cette section !` : ""}
${statsOther ? `3. 🇪🇺 OBLIGATOIRE : 2-3 phrases DÉDIÉES aux salaires France/Europe en EUR (médiane, junior, senior)` : ""}
${statsCameroon || statsOther ? `4. Une phrase mentionnant les meilleurs profils si disponibles` : `2. Une phrase sur l'évolution junior → senior avec les moyennes`}
${statsCameroon || statsOther ? `5. Une phrase d'encouragement ou conseil actionnable` : `3. Une phrase mentionnant le meilleur profil junior si disponible
4. Une phrase mentionnant le meilleur profil senior si disponible
5. Une phrase d'encouragement ou conseil actionnable`}

✍️ RÈGLES D'OR :
• PHRASES COURTES (15-20 mots max chacune)
• AUCUN jargon technique (pas "quartile", "écart-type", etc.)
• REFORMULE simplement : "50% gagnent plus de X€" au lieu de "médiane"
• TON conversationnel et encourageant
• MOBILE-FIRST : pas de mise en page complexe, juste des phrases qui se lisent facilement

🌍 STATS PAR PAYS (CRITIQUE - NE PAS IGNORER) :
${statsCameroon ? `
🚨 ATTENTION 🇨🇲 : Des stats CAMEROUN sont disponibles !
• Tu DOIS ABSOLUMENT créer une section spécifique pour le Cameroun dans ton résumé
• Format attendu : "Au Cameroun, le salaire médian est de ${Math.round(statsCameroon.median).toLocaleString()} FCFA. Les juniors démarrent à ${Math.round(statsCameroon.leastExperiencedAvg).toLocaleString()} FCFA. Les seniors atteignent ${Math.round(statsCameroon.mostExperiencedAvg).toLocaleString()} FCFA."
• NE PAS oublier de mentionner "Au Cameroun" ou "🇨🇲" pour séparer visuellement
• OBLIGATOIRE : Toujours préciser "FCFA" après chaque montant camerounais
` : ""}
${statsOther ? `
🚨 ATTENTION 🇪🇺 : Des stats FRANCE/EUROPE sont disponibles !
• Tu DOIS ABSOLUMENT créer une section spécifique pour l'Europe dans ton résumé
• Format attendu : "En France et Europe, le salaire médian est de ${Math.round(statsOther.median).toLocaleString()}€. Les juniors démarrent à ${Math.round(statsOther.leastExperiencedAvg).toLocaleString()}€. Les seniors atteignent ${Math.round(statsOther.mostExperiencedAvg).toLocaleString()}€."
• OBLIGATOIRE : Toujours préciser "€" après chaque montant européen
` : ""}
${statsCameroon && statsOther ? `
⚠️ DOUBLE CONTEXTE : Tu as à la fois des stats Cameroun ET Europe !
• Ton résumé DOIT avoir deux sections distinctes et claires
• Utilise des séparateurs visuels : "Au Cameroun 🇨🇲" puis "En France et Europe 🇪🇺"
• JAMAIS mélanger FCFA et EUR dans la même phrase
` : ""}
• RÈGLE D'OR : Si statsCameroon existe, le Cameroun DOIT apparaître dans le résumé final

❌ INTERDICTIONS ABSOLUES :
• Markdown, JSON, titres
• Phrases de plus de 25 mots
• Formulations techniques ou corporate
• Oublier de mentionner les meilleurs profils junior/senior
• Mélanger FCFA et EUR dans la même phrase sans préciser
• 🚨 CRITIQUE : Ignorer les stats Cameroun si elles sont fournies dans statsCameroon
• 🚨 CRITIQUE : Ne pas créer de section séparée pour le Cameroun quand des stats sont disponibles

✅ EXEMPLE (ton attendu avec stats séparées) :
"Pour DevOps Engineer, le salaire global médian est de 50k€. Au Cameroun, la médiane est de 18M FCFA avec des juniors à 8M et des seniors à 35M FCFA. En France et Europe, la médiane est de 52k€. Les juniors européens démarrent à 38k€ et les seniors atteignent 70k€. Le meilleur junior camerounais gagne 12M FCFA chez Orange à Douala. Le meilleur senior européen atteint 120k€ chez Google à Paris. Pour viser le haut, spécialise-toi en cloud et DevOps ! Plus bas, des roadmaps de formation vous attendent."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ ROADMAPS DISPONIBLES (roadmap.sh) - LISTE COMPLÈTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 ROADMAPS PAR RÔLE :
${availableRoadmaps.roles}

🔧 ROADMAPS PAR COMPÉTENCE :
${availableRoadmaps.skills}

⚠️ IMPORTANT : 
• Utilise "OU" entre les postes (DevOps, Devops OU Ingénieur DevOps), JAMAIS "ET" !
• Termine TOUJOURS par une phrase mentionnant les roadmaps disponibles plus bas (variantes possibles : "Des roadmaps de formation sont disponibles ci-dessous", "Plus bas, retrouvez des parcours de formation", "Consultez les roadmaps recommandées en dessous")
• Tu as maintenant accès à TOUTES les roadmaps roadmap.sh disponibles ci-dessus - utilise-les pour donner des conseils spécifiques !

Réponds UNIQUEMENT avec le texte du résumé :`;

    const response = await callLLM(prompt);
    return response.trim();
  } catch (error) {
    console.error("[LLM] Erreur generateStatsSummary:", error);
    return `Sur ${
      stats.count
    } salaires analysés, le salaire moyen est de ${Math.round(
      stats.mean
    )}€ avec une médiane à ${Math.round(
      stats.median
    )}€. Les salaires varient de ${Math.round(stats.min)}€ à ${Math.round(
      stats.max
    )}€.`;
  }
}

/**
 * 3️⃣ Parse une description de métier en langage naturel
 *
 * Exemple:
 * Input: "je fais du react et du node, 3 ans d'xp"
 * Output: [{ title: "Développeur Fullstack", confidence: 92 }]
 */
export interface JobSuggestion {
  title: string;
  confidence: number; // 0-100
  reasoning?: string; // Justification courte de la recommandation
}

export async function parseNaturalLanguageJob(
  description: string
): Promise<JobSuggestion[]> {
  if (!config.features.naturalLanguageSearch) {
    return [];
  }

  try {
    const prompt = `Tu es FOX, conseiller expert en orientation de carrière tech avec connaissance encyclopédique des métiers du numérique et de leurs évolutions. Tu comprends les aspirations, compétences et contextes variés des professionnels tech.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ANALYSE DE PROFIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Description utilisateur : "${description}"

🎯 MISSION : Identifier 1 à 3 métiers tech correspondant parfaitement à cette description

🧠 ANALYSE REQUISE :
1. Identifie les technologies/outils mentionnés
2. Détecte le niveau d'expérience (si mentionné)
3. Comprends le contexte (études, projets, aspirations)
4. Évalue les soft skills implicites
5. Détecte les indices de spécialisation (frontend/backend/fullstack/data/etc.)

📊 SCORING (0-100) :
• 90-100 : Correspondance parfaite, tous les signaux alignés
• 75-89 : Très bonne correspondance, quelques gaps mineurs
• 60-74 : Correspondance correcte, nécessite montée en compétence
• <60 : Ne pas proposer (trop éloigné du profil)

⚙️ RÈGLES STRICTES :
• Maximum 3 métiers, par ordre décroissant de score
• Métiers tech uniquement (développement, data, devops, cybersécurité, etc.)
• Noms de métiers en FRANÇAIS et standardisés
• Scores réalistes basés sur les indices réels de la description
• Si description vague/incomplète : scores plus conservateurs

🎯 FORMAT DE RÉPONSE (JSON STRICT) :
{
  "suggestions": [
    {
      "title": "Développeur Full Stack",
      "confidence": 88,
      "reasoning": "Maîtrise React et Node.js mentionnée"
    }
  ]
}

⚠️ IMPÉRATIF : Réponds UNIQUEMENT avec du JSON valide, aucun markdown, aucun texte additionnel.`;

    const response = await callLLM(prompt);

    try {
      const parsed = parseJSONFromLLM(response);
      return (parsed.suggestions as JobSuggestion[]) || [];
    } catch (parseError) {
      console.error("[LLM] Erreur parseNaturalLanguageJob:", parseError);
      return [];
    }
  } catch (error) {
    console.error("[LLM] Erreur parseNaturalLanguageJob:", error);
    return [];
  }
}

/**
 * 4️⃣ Match des métiers basés sur les compétences utilisateur
 * Pour la fonctionnalité "TROUVER QUEL MÉTIER JE PEUX FAIRE"
 */
export async function matchJobsBySkills(
  skills: UserSkills
): Promise<JobMatchResult[]> {
  if (!config.features.jobMatcher) {
    return [];
  }

  try {
    // Préparer la liste complète des roadmaps disponibles organisée par catégories
    const availableRoadmaps = {
      roles: config.roadmaps.roles.map((r) => `  • ${r.name} → ${r.url}`).join("\n"),
      skills: config.roadmaps.skills.map((s) => `  • ${s.name} → ${s.url}`).join("\n"),
    };

    const prompt = `Tu es FOX, conseiller en orientation de carrière tech de niveau expert avec 15 ans d'expérience. Tu as accompagné des centaines de développeurs dans leur transition professionnelle. Tu connais parfaitement l'écosystème tech, les compétences recherchées, et les parcours d'apprentissage optimaux.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PROFIL UTILISATEUR À ANALYSER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Technologies maîtrisées : ${skills.technologies.join(", ")}
🎓 Formation : ${skills.education}
${
  skills.experience ? `⏱️ Années d'expérience : ${skills.experience} an(s)` : ""
}
${
  skills.additionalInfo
    ? `💬 Informations additionnelles : ${skills.additionalInfo}`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ ROADMAPS DISPONIBLES (roadmap.sh) - LISTE COMPLÈTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 ROADMAPS PAR RÔLE / MÉTIER :
${availableRoadmaps.roles}

🔧 ROADMAPS PAR COMPÉTENCE / TECHNOLOGIE :
${availableRoadmaps.skills}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TA MISSION DÉTAILLÉE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Analyser en profondeur le profil (stack technique, niveau, contexte)
2. Identifier les 3 métiers tech les PLUS adaptés (pas de générique, sois précis)
3. Pour chaque métier :
   • Calculer un score de compatibilité réaliste (0-100)
   • Lister les compétences qui MATCHENT déjà
   • Lister les compétences MANQUANTES critiques
   • Recommander 2-4 roadmaps roadmap.sh pertinentes (URLs complètes)
   • Justifier brièvement pourquoi ce métier correspond

🧮 MÉTHODE DE SCORING (sois rigoureux) :
• 85-100 : Profil quasi-idéal, prêt pour le poste avec formations mineures
• 70-84 : Très bon fit, nécessite montée en compétence ciblée (3-6 mois)
• 55-69 : Fit correct, nécessite apprentissage conséquent (6-12 mois)
• <55 : Ne pas proposer (trop de gaps)

⚙️ RÈGLES CRITIQUES :
• Maximum 3 métiers, triés par score décroissant
• Métiers PRÉCIS (pas "Développeur" mais "Développeur Full Stack Node.js/React")
• Roadmaps : sélectionne parmi celles listées ci-dessus (URLs exactes)
• Compétences manquantes : sois spécifique et actionnable
• Si profil junior : recommande des roadmaps fondamentales
• Si profil senior : recommande des roadmaps avancées/architecturales
• Considère le contexte (études, projets perso, aspirations)

🎯 FORMAT DE RÉPONSE (JSON STRICT - STRUCTURE EXACTE) :
{
  "matches": [
    {
      "jobTitle": "Développeur Backend Node.js",
      "compatibilityScore": 78,
      "matchedSkills": ["JavaScript", "Node.js", "REST APIs"],
      "missingSkills": ["TypeScript", "Docker", "PostgreSQL", "Tests unitaires"],
      "recommendedRoadmaps": [
        "https://roadmap.sh/nodejs",
        "https://roadmap.sh/backend",
        "https://roadmap.sh/docker",
        "https://roadmap.sh/postgresql-dba"
      ],
      "reasoning": "Solide base JavaScript et Node.js. Compléter avec TypeScript et DevOps pour être opérationnel en entreprise."
    }
  ]
}

⚠️ IMPÉRATIF ABSOLU :
• Réponds UNIQUEMENT avec du JSON valide (pas de markdown, pas de commentaires)
• URLs roadmap.sh EXACTES (issues de la liste fournie)
• Noms de métiers en français, précis et standardisés
• Scores cohérents avec les gaps identifiés`;

    const response = await callLLM(prompt);

    try {
      const parsed = parseJSONFromLLM(response);

      // Valider et enrichir les résultats
      return ((parsed.matches as JobMatchResult[]) || []).map(
        (match: JobMatchResult) => ({
          jobTitle: match.jobTitle || "Métier inconnu",
          compatibilityScore: match.compatibilityScore || 0,
          averageSalary: 0, // Sera calculé par jobMatcher.ts
          matchedSkills: match.matchedSkills || [],
          missingSkills: match.missingSkills || [],
          recommendedRoadmaps: match.recommendedRoadmaps || [],
          reasoning: match.reasoning || "",
        })
      );
    } catch (parseError) {
      console.error("[LLM] Erreur matchJobsBySkills:", parseError);
      return [];
    }
  } catch (error) {
    console.error("[LLM] Erreur matchJobsBySkills:", error);
    return [];
  }
}

/**
 * 5️⃣ Recommande des roadmaps pertinentes pour un métier donné
 * Utilisé dans les pages de résultats de salaires
 */
export async function recommendRoadmapsForJob(
  jobTitles: string[]
): Promise<string[]> {
  if (!config.features.naturalLanguageSearch || jobTitles.length === 0) {
    return [];
  }

  try {
    // Préparer la liste complète des roadmaps disponibles organisée par catégories
    const availableRoadmaps = {
      roles: config.roadmaps.roles.map((r) => `  • ${r.name} → ${r.url}`).join("\n"),
      skills: config.roadmaps.skills.map((s) => `  • ${s.name} → ${s.url}`).join("\n"),
    };

    const jobTitlesText =
      jobTitles.length === 1 ? jobTitles[0] : jobTitles.slice(0, 3).join(", ");

    const prompt = `Tu es FOX, expert en orientation de carrière tech. Recommande 3 à 5 roadmaps roadmap.sh pertinentes pour quelqu'un qui vise le(s) métier(s) suivant(s) : ${jobTitlesText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ ROADMAPS DISPONIBLES (roadmap.sh) - LISTE COMPLÈTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 ROADMAPS PAR RÔLE / MÉTIER :
${availableRoadmaps.roles}

🔧 ROADMAPS PAR COMPÉTENCE / TECHNOLOGIE :
${availableRoadmaps.skills}

🎯 TA MISSION :
1. Identifier les roadmaps les PLUS pertinentes pour ce(s) métier(s)
2. Prioriser les roadmaps essentielles (fondamentales > avancées)
3. Limiter à 3-5 roadmaps maximum (pas de surcharge)
4. Inclure UNIQUEMENT des URLs de la liste ci-dessus

⚙️ RÈGLES STRICTES :
• Roadmaps par ordre de priorité (essentielles en premier)
• URLs EXACTES issues de la liste fournie
• Minimum 3, maximum 5 roadmaps
• Pertinence maximale pour le(s) métier(s) cité(s)

📋 EXEMPLES :
• Pour "DevOps Engineer" → ["https://roadmap.sh/devops", "https://roadmap.sh/docker", "https://roadmap.sh/kubernetes", "https://roadmap.sh/linux"]
• Pour "React Developer" → ["https://roadmap.sh/react", "https://roadmap.sh/frontend", "https://roadmap.sh/javascript", "https://roadmap.sh/typescript"]
• Pour "Backend Developer" → ["https://roadmap.sh/backend", "https://roadmap.sh/nodejs", "https://roadmap.sh/postgresql-dba", "https://roadmap.sh/system-design"]

🎯 FORMAT DE RÉPONSE (JSON STRICT) :
{
  "roadmaps": [
    "https://roadmap.sh/...",
    "https://roadmap.sh/...",
    "https://roadmap.sh/..."
  ]
}

⚠️ IMPÉRATIF : Réponds UNIQUEMENT avec du JSON valide, aucun markdown, aucun texte additionnel.`;

    const response = await callLLM(prompt);

    try {
      const parsed = parseJSONFromLLM(response);
      const roadmaps = (parsed.roadmaps as string[]) || [];

      // Valider que ce sont des URLs roadmap.sh valides
      return roadmaps.filter(
        (url) => url.startsWith("https://roadmap.sh/") && url.length > 20
      );
    } catch (parseError) {
      console.error("[LLM] Erreur recommendRoadmapsForJob:", parseError);
      return [];
    }
  } catch (error) {
    console.error("[LLM] Erreur recommendRoadmapsForJob:", error);
    return [];
  }
}
