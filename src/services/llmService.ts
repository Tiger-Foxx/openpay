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
 */

let genAI: GoogleGenAI | null = null;

/**
 * Initialise le client Gemini (nouvelle API @google/genai)
 */
function getGenAI(): GoogleGenAI {
  if (!config.llm.apiKey) {
    console.error("[LLM] ❌ ERREUR: Clé API Gemini manquante!");
    console.error(
      "[LLM] 💡 Assure-toi que VITE_GEMINI_API_KEY est dans ton .env"
    );
    throw new Error("Clé API Gemini manquante dans la configuration");
  }

  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: config.llm.apiKey });
    console.log(
      "[LLM] ✅ Client Gemini initialisé (nouvelle API @google/genai)"
    );
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
 * Utilise la nouvelle API @google/genai
 */
async function callLLM(prompt: string): Promise<string> {
  try {
    const ai = getGenAI();

    console.log(
      "[LLM] 📤 Envoi prompt (premiers 200 chars):",
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

    return text;
  } catch (error) {
    console.error("[LLM] ❌ Erreur lors de l'appel:", error);
    console.error(
      "[LLM] 💡 Détails:",
      error instanceof Error ? error.message : String(error)
    );
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
   • Niveaux différents du MÊME métier (si niveau non spécifié)

📊 EXEMPLES DE MATCHING CORRECT :
   Input: "CloudOps" → Match: "Cloud Ops", "Cloud Operations Engineer", "CloudOps Engineer"
   Input: "CloudOps" → ❌ PAS: "Administrateur Système", "DevOps", "Architecte Infra"
   
   Input: "Data Scientist" → Match: "Data Scientist", "Scientist Data", "Senior Data Scientist"
   Input: "Data Scientist" → ❌ PAS: "Data Engineer", "Data Analyst", "ML Engineer"
   
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
 */
export async function generateStatsSummary(
  stats: SalaryStatistics,
  jobTitles?: string[]
): Promise<string> {
  if (!config.features.aiSummary) {
    return `Salaire moyen de ${Math.round(stats.mean)}€ sur ${
      stats.count
    } salaires analysés.`;
  }

  try {
    // Préparer le contexte des titres
    const titlesContext =
      jobTitles && jobTitles.length > 0
        ? `\n📋 POSTES CONCERNÉS : ${jobTitles.slice(0, 5).join(", ")}${
            jobTitles.length > 5 ? ` et ${jobTitles.length - 5} autres` : ""
          }`
        : "";

    const prompt = `Tu es Fox, expert en salaires tech. Rédige un résumé ULTRA-CLAIR, organisé en POINTS COURTS, adapté mobile (pas de colonnes, pas de phrases trop longues).${titlesContext}

📊 DONNÉES (${stats.count} salaires analysés) :
• Salaire médian (typique) : ${Math.round(stats.median)}€/an
• Fourchette globale : ${Math.round(stats.min)}€ → ${Math.round(stats.max)}€
• 50% gagnent PLUS de ${Math.round(stats.quartiles.median)}€
• 25% gagnent MOINS de ${Math.round(stats.quartiles.q1)}€

💼 ÉVOLUTION AVEC L'EXPÉRIENCE :
• Juniors (0-2 ans) : ${Math.round(stats.leastExperiencedAvg)}€ en moyenne
${
  stats.juniorMaxSalary
    ? `• 🏆 Meilleur junior : ${Math.round(stats.juniorMaxSalary)}€ - ${
        stats.juniorMaxDetails
      }`
    : ""
}
• Seniors (10+ ans) : ${Math.round(stats.mostExperiencedAvg)}€ en moyenne
${
  stats.seniorMaxSalary
    ? `• 🏆 Meilleur senior : ${Math.round(stats.seniorMaxSalary)}€ - ${
        stats.seniorMaxDetails
      }`
    : ""
}

🎯 STRUCTURE OBLIGATOIRE (phrases courtes, claires, mobile-first) :
${
  jobTitles && jobTitles.length > 1
    ? `0. Une phrase mentionnant les postes concernés (si plusieurs, cite "pour X, Y et Z" ou "pour X, Y et autres")`
    : jobTitles && jobTitles.length === 1
    ? `0. Une phrase mentionnant le poste concerné : "${jobTitles[0]}"`
    : ""
}
1. Une phrase sur le salaire typique (médiane)
2. Une phrase sur l'évolution junior → senior avec les moyennes
3. Une phrase mentionnant le meilleur profil junior si disponible
4. Une phrase mentionnant le meilleur profil senior si disponible
5. Une phrase d'encouragement ou conseil actionnable

✍️ RÈGLES D'OR :
• PHRASES COURTES (15-20 mots max chacune)
• AUCUN jargon technique (pas "quartile", "écart-type", etc.)
• REFORMULE simplement : "50% gagnent plus de X€" au lieu de "médiane"
• TON conversationnel et encourageant
• MOBILE-FIRST : pas de mise en page complexe, juste des phrases qui se lisent facilement

❌ INTERDICTIONS :
• Markdown, JSON, titres
• Phrases de plus de 25 mots
• Formulations techniques ou corporate
• Oublier de mentionner les meilleurs profils junior/senior

✅ EXEMPLE (ton attendu) :
"Le salaire typique est de 50k€. En début de carrière, on démarre autour de 38k€. Avec l'expérience (10+ ans), on atteint facilement 65k€. Le meilleur junior gagne 52k€ chez Scaleway à Paris. Le meilleur senior atteint 120k€ chez Google. La moitié des pros gagnent plus de 48k€. Pour viser le haut, spécialise-toi sur les technos cloud !"

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
