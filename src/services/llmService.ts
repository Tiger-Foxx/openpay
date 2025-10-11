// src/services/llmService.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { SalaryStatistics } from "@/models/statistics";
import { UserSkills, JobMatchResult } from "@/models/jobMatch";
import { config } from "@/config";

/**
 * Service LLM (Google Gemini) pour :
 * - Mapping sémantique des métiers
 * - Génération de résumés statistiques en langage naturel
 * - Parsing de descriptions de métiers
 * - Job matching basé sur compétences
 */

let genAI: GoogleGenerativeAI | null = null;

/**
 * Initialise le client Gemini
 */
function getGenAI(): GoogleGenerativeAI {
  if (!config.llm.apiKey) {
    console.error("[LLM] ❌ ERREUR: Clé API Gemini manquante!");
    console.error(
      "[LLM] 💡 Assure-toi que VITE_GEMINI_API_KEY est dans ton .env"
    );
    throw new Error("Clé API Gemini manquante dans la configuration");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.llm.apiKey);
    console.log("[LLM] ✅ Client Gemini initialisé");
    console.log(
      "[LLM] 🔑 Clé API (premiers 10 chars):",
      config.llm.apiKey.substring(0, 10) + "..."
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
 * Fonction utilitaire pour appeler le LLM avec gestion d'erreurs
 */
async function callLLM(prompt: string): Promise<string> {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: config.llm.model });

    console.log(
      "[LLM] 📤 Envoi prompt (premiers 200 chars):",
      prompt.substring(0, 200)
    );

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: config.llm.temperature,
        maxOutputTokens: config.llm.maxTokens,
      },
    });

    const response = result.response;
    const text = response.text();

    console.log(
      "[LLM] 📥 Réponse brute (premiers 500 chars):",
      text.substring(0, 500)
    );
    console.log(
      "[LLM] 📏 Longueur totale de la réponse:",
      text.length,
      "caractères"
    );

    if (!text || text.trim().length === 0) {
      console.error("[LLM] ⚠️ Réponse vide du LLM!");
      throw new Error("Réponse vide du LLM");
    }

    return text;
  } catch (error) {
    console.error("[LLM] Erreur lors de l'appel:", error);
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

    // ⚠️ LIMITE: Réduire à 150 titres pour éviter de dépasser le contexte Gemini
    const limitedTitles = allTitles.slice(0, 150);
    console.log("[LLM] 📋 Titres limités à:", limitedTitles.length);
    if (allTitles.length > 150) {
      console.warn(
        `[LLM] ⚠️ ${
          allTitles.length - 150
        } titres ignorés pour rester sous la limite de tokens`
      );
    }

    const prompt = `Tu es FOX, expert senior en classification de métiers tech avec 15 ans d'expérience dans l'analyse salariale et l'orientation de carrière. Tu maîtrises parfaitement les nuances entre métiers similaires, les évolutions de titres dans l'industrie, et les équivalences internationales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MISSION CRITIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifier TOUS les titres de poste correspondant sémantiquement à l'entrée utilisateur, en considérant TOUTES les variantes possibles (synonymes, langues, niveaux, abréviations).

📥 ENTRÉE UTILISATEUR : "${userInput}"

📋 BASE DE DONNÉES (Titres disponibles) :
${limitedTitles.map((title, idx) => `${idx + 1}. ${title}`).join("\n")}

⚙️ RÈGLES STRICTES :
1. Retourne UNIQUEMENT des titres EXACTS présents dans la liste ci-dessus
2. Considère TOUTES les variantes linguistiques (FR/EN/abréviations)
   • "dev" = "developer" = "développeur" = "software engineer"
3. Gère les niveaux d'expérience intelligemment :
   • Si "senior/lead/principal" dans l'input → priorise ces titres
   • Si "junior/débutant" → priorise ces titres
   • Si pas de niveau spécifié → inclus TOUS les niveaux
4. Comprends les équivalences métier :
   • "Fullstack" = "Full Stack" = "Full-Stack"
   • "DevOps" = "Dev Ops" = "SRE" (dans certains contextes)
   • "Data Scientist" = "ML Engineer" (si contexte approprié)
5. Gère les pluriels et variations orthographiques
6. Si incertitude : préfère INCLURE plutôt qu'exclure

🎯 FORMAT DE RÉPONSE (JSON STRICT - PAS D'AUTRE TEXTE) :
{
  "matches": ["Titre Exact 1", "Titre Exact 2", "Titre Exact N"],
  "reasoning": "Explication ultra-brève de ton matching (1 phrase max)"
}

⚠️ IMPÉRATIF : Réponds UNIQUEMENT avec le JSON valide. Aucun markdown, aucun commentaire.`;

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
 */
export async function generateStatsSummary(
  stats: SalaryStatistics
): Promise<string> {
  if (!config.features.aiSummary) {
    return `Salaire moyen de ${Math.round(stats.mean)}€ sur ${
      stats.count
    } salaires analysés.`;
  }

  try {
    const prompt = `Tu es FOX, analyste senior en rémunération tech avec expertise en interprétation statistique et communication de données RH. Ta mission : rendre les chiffres compréhensibles et actionnables pour TOUS les profils (juniors, seniors, recruteurs, candidats).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 STATISTIQUES À ANALYSER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Échantillon : ${stats.count} salaires
• Salaire moyen : ${Math.round(stats.mean)}€
• Médiane (valeur centrale) : ${Math.round(stats.median)}€
• Écart-type (variabilité) : ${Math.round(stats.stdDev)}€
• Amplitude : ${Math.round(stats.min)}€ → ${Math.round(stats.max)}€
• Premier quartile (25% gagnent moins) : ${Math.round(stats.quartiles.q1)}€
• Troisième quartile (75% gagnent moins) : ${Math.round(stats.quartiles.q3)}€
• Salaire moyen débutant (0-2 ans) : ${Math.round(stats.leastExperiencedAvg)}€
• Salaire moyen expérimenté (10+ ans) : ${Math.round(stats.mostExperiencedAvg)}€

🎯 TON OBJECTIF : Rédiger un résumé accessible et impactant

📝 STRUCTURE ATTENDUE (3-5 phrases max) :
1. Phrase d'accroche avec chiffres clés (moyenne/médiane)
2. Explication simple des quartiles (en 1 courte phrase)
3. Analyse de la progression salariale junior→senior (% d'augmentation)
4. Interprétation de l'écart-type (forte/faible variabilité et ce que ça signifie)
5. Insight actionnable (conseil court pour le lecteur)

✍️ STYLE :
• Ton professionnel mais chaleureux et encourageant
• Accessible à quelqu'un sans bagage statistique
• Utilise des métaphores si besoin pour clarifier
• Évite absolument le jargon technique non expliqué
• Concentre-toi sur ce que ça SIGNIFIE pour le lecteur

⚠️ IMPÉRATIF : Réponds UNIQUEMENT avec le texte du résumé, sans formatage markdown, sans titre, sans JSON.`;

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
    // Préparer la liste des roadmaps disponibles
    const availableRoadmaps = [
      ...config.roadmaps.roles.map((r) => `${r.name} (${r.url})`),
      ...config.roadmaps.skills.map((s) => `${s.name} (${s.url})`),
    ].join("\n");

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
🗺️ ROADMAPS DISPONIBLES (roadmap.sh)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${availableRoadmaps}

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
