/**
 * Modèles pour le Job Matcher ("Trouver quel métier je peux faire")
 */

export interface UserSkills {
  technologies: string[]; // ["React", "Node.js", "TypeScript"]
  education: string; // "Bac+5 Informatique"
  experience?: number; // Années d'XP (optionnel)
  additionalInfo?: string; // Texte libre
}

export interface JobMatchResult {
  jobTitle: string;
  compatibilityScore: number; // 0-100
  averageSalary: number;
  matchedSkills: string[]; // Compétences correspondantes
  missingSkills: string[]; // Compétences manquantes
  recommendedRoadmaps?: string[]; // URLs roadmap.sh recommandées par l'IA
  reasoning?: string; // Justification courte de la recommandation
  learningResources?: string[]; // DEPRECATED - utiliser recommendedRoadmaps
}

export interface JobMatcherResponse {
  matches: JobMatchResult[]; // Top 3 max
  generatedAt: string;
}
