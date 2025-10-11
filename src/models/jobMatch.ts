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
  missingSkills: string[]; // Compétences manquantes
  learningResources?: string[]; // Liens/roadmaps (optionnel)
  matchedSkills: string[]; // Compétences correspondantes
}

export interface JobMatcherResponse {
  matches: JobMatchResult[]; // Top 3 max
  generatedAt: string;
}
