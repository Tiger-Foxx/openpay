// src/pages/FindMyJob.tsx

import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Loader } from "@/components/UI/Loader";
import { UserSkills, JobMatchResult } from "@/models/jobMatch";
import { findMatchingJobs } from "@/services/jobMatcher";
import { formatSalary } from "@/utils/dataFormatter";
import { Collapse } from "@/components/UI/Collapse";

export const FindMyJob = React.memo(() => {
  const [formData, setFormData] = useState<UserSkills>({
    technologies: [],
    education: "",
    experience: undefined,
    additionalInfo: "",
  });

  const [techInput, setTechInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<JobMatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !formData.technologies.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, trimmed],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.technologies.length === 0) {
      setError("Veuillez ajouter au moins une technologie");
      return;
    }

    if (!formData.education.trim()) {
      setError("Veuillez renseigner votre formation");
      return;
    }

    setIsLoading(true);

    try {
      const matches = await findMatchingJobs(formData);

      if (matches.matches.length === 0) {
        setError(
          "Aucun métier trouvé correspondant à votre profil. Essayez d'ajouter plus de compétences."
        );
      } else {
        setResults(matches.matches);
      }
    } catch (err) {
      console.error("[FindMyJob] Erreur:", err);
      setError(
        "Une erreur est survenue lors de l'analyse. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      technologies: [],
      education: "",
      experience: undefined,
      additionalInfo: "",
    });
    setTechInput("");
    setResults([]);
    setError(null);
  };

  if (isLoading) {
    return <Loader text="Analyse de votre profil en cours..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
          Trouver Quel Métier Je Peux Faire
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Décrivez vos compétences et votre formation. L'IA vous proposera les
          métiers tech les plus adaptés avec leur salaire moyen et les
          compétences à acquérir.
        </p>
      </div>

      {/* Form */}
      {results.length === 0 && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Technologies */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Technologies & Compétences{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="Ex: React, Node.js, Docker..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
                <Button
                  type="button"
                  onClick={handleAddTech}
                  variant="secondary"
                >
                  Ajouter
                </Button>
              </div>
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-gray-500 hover:text-black transition-colors"
                        aria-label={`Supprimer ${tech}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Formation */}
            <div>
              <label
                htmlFor="education"
                className="block text-sm font-semibold text-black mb-2"
              >
                Formation <span className="text-red-500">*</span>
              </label>
              <input
                id="education"
                type="text"
                value={formData.education}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    education: e.target.value,
                  }))
                }
                placeholder="Ex: Bac+5 Informatique, Licence Développement Web..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Expérience */}
            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-semibold text-black mb-2"
              >
                Années d'Expérience (optionnel)
              </label>
              <input
                id="experience"
                type="number"
                min="0"
                value={formData.experience || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="Ex: 3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Informations additionnelles */}
            <div>
              <label
                htmlFor="additionalInfo"
                className="block text-sm font-semibold text-black mb-2"
              >
                Informations Complémentaires (optionnel)
              </label>
              <textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    additionalInfo: e.target.value,
                  }))
                }
                placeholder="Ex: Projets personnels, certifications, domaines d'intérêt..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Analyser mon Profil
            </Button>
          </form>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          {/* Header Results */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">
              {results.length} Métier{results.length > 1 ? "s" : ""}{" "}
              Correspondant{results.length > 1 ? "s" : ""}
            </h2>
            <Button variant="secondary" onClick={handleReset}>
              Nouvelle Analyse
            </Button>
          </div>

          {/* Job Cards */}
          {results.map((match, index) => (
            <Card key={index} className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {match.jobTitle}
                  </h3>
                  {match.reasoning && (
                    <p className="text-sm text-gray-600 mb-3">
                      {match.reasoning}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-xl">
                    <span className="text-2xl font-bold text-green-800">
                      {match.compatibilityScore}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Compatibilité</p>
                </div>
              </div>

              {/* Salary */}
              {match.averageSalary > 0 && (
                <div className="flex items-center gap-2 text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold text-gray-700">
                    Salaire moyen :
                  </span>
                  <span className="font-bold text-black">
                    {formatSalary(match.averageSalary)}
                  </span>
                </div>
              )}

              {/* Matched Skills */}
              {match.matchedSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    ✅ Compétences Correspondantes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {match.matchedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {match.missingSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    📚 Compétences à Acquérir
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {match.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmaps */}
              {match.recommendedRoadmaps &&
                match.recommendedRoadmaps.length > 0 && (
                  <Collapse title="🗺️ Roadmaps Recommandées">
                    <div className="space-y-2">
                      {match.recommendedRoadmaps.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-black group"
                        >
                          <span>{url.split("/").pop()?.replace("-", " ")}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </Collapse>
                )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});

FindMyJob.displayName = "FindMyJob";
