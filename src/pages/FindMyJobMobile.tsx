// src/pages/FindMyJobMobile.tsx

import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Loader } from "@/components/UI/Loader";
import { UserSkills, JobMatchResult } from "@/models/jobMatch";
import { findMatchingJobs } from "@/services/jobMatcher";
import { formatSalary } from "@/utils/dataFormatter";
import { Collapse } from "@/components/UI/Collapse";
import { Sparkles, X, Plus } from "lucide-react";
import Lottie from "lottie-react";
import foxZenAnimation from "@/assets/lotties/fox-zen.json";
import workBalanceAnimation from "@/assets/lotties/Work and life balance.json";

export const FindMyJobMobile = React.memo(() => {
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
      setError("Ajoutez au moins une technologie");
      return;
    }

    if (!formData.education.trim()) {
      setError("Renseignez votre formation");
      return;
    }

    setIsLoading(true);

    try {
      const matchedJobs = await findMatchingJobs(formData);
      setResults(matchedJobs);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[FindMyJobMobile] Erreur:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults([]);
    setFormData({
      technologies: [],
      education: "",
      experience: undefined,
      additionalInfo: "",
    });
    setError(null);
  };

  if (isLoading) {
    return <Loader text="Analyse en cours..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Mobile Compact */}
      <div className="text-center">
        <div className="w-42 h-42 mx-auto mb-3">
          <Lottie
            animationData={workBalanceAnimation}
            loop={true}
            className="w-full h-full drop-shadow-xl"
          />
        </div>
        <h1 className="text-2xl font-bold text-black mb-2 px-4">
          Trouver Mon Métier
        </h1>
        <p className="text-sm text-gray-600 px-6">
          L'IA analyse vos compétences et vous propose les meilleurs métiers
        </p>
      </div>

      {/* Form Mobile */}
      {results.length === 0 && (
        <div className="px-4">
          <Card className="!p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Technologies - Version Mobile Simplifiée */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Compétences <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                    Astuce
                  </span>{" "}
                  Langages, frameworks, outils...
                </p>

                {/* Input + Quick Suggestions */}
                <div className="space-y-2">
                  <div className="flex gap-2">
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
                      placeholder="Ex: React, Python..."
                      className="flex-1 min-w-0 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTech}
                      variant="secondary"
                      size="sm"
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Suggestions Buttons */}
                  {formData.technologies.length === 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "Python", "Node.js", "AWS", "Docker"].map(
                        (tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                technologies: [...prev.technologies, tech],
                              }));
                            }}
                            className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[11px] text-gray-700 active:bg-gray-100"
                          >
                            + {tech}
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {/* Selected Technologies */}
                  {formData.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {formData.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded text-xs font-medium"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="text-gray-500 hover:text-black"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Formation - Compact */}
              <div>
                <label
                  htmlFor="education"
                  className="block text-sm font-bold text-black mb-2"
                >
                  Formation <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                    Astuce
                  </span>{" "}
                  Niveau et spécialité
                </p>
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
                  placeholder="Ex: Bac+5 Informatique"
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              {/* Expérience - Compact */}
              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-bold text-black mb-2"
                >
                  Années d'XP (optionnel)
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
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              {/* Informations additionnelles - Compact */}
              <div>
                <label
                  htmlFor="additionalInfo"
                  className="block text-sm font-bold text-black mb-2"
                >
                  Infos Complémentaires (optionnel)
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
                  placeholder="Ex: Expérience en management, projet perso..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                className="!py-3"
              >
                Analyser avec l'IA
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Results Mobile */}
      {results.length > 0 && (
        <div className="px-4 space-y-4">
          {/* Header Results */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 shrink-0">
              <Lottie
                animationData={foxZenAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-black flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                {results.length} Métier{results.length > 1 ? "s" : ""}
              </h2>
              <p className="text-xs text-gray-600">Analyse terminée</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Nouveau
            </Button>
          </div>

          {/* Job Cards Mobile */}
          {results.map((match, index) => (
            <Card key={index} className="!p-4">
              <div className="space-y-3">
                {/* Header */}
                <div>
                  <h3 className="font-bold text-base text-black mb-1">
                    {match.jobTitle}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[11px] font-semibold">
                      {match.compatibilityScore}% compatible
                    </span>
                    {match.averageSalary > 0 && (
                      <span className="text-xs text-gray-600">
                        ~{formatSalary(match.averageSalary)}/an
                      </span>
                    )}
                  </div>
                </div>

                {/* Reasoning */}
                {match.reasoning && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {match.reasoning}
                  </p>
                )}

                {/* Collapsibles Mobile */}
                <div className="space-y-2">
                  {/* Matched Skills */}
                  <Collapse
                    title={`✅ Compétences acquises (${match.matchedSkills.length})`}
                    defaultOpen={false}
                  >
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {match.matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-green-50 text-green-800 rounded text-[11px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Collapse>

                  {/* Missing Skills */}
                  {match.missingSkills.length > 0 && (
                    <Collapse
                      title={`📚 À apprendre (${match.missingSkills.length})`}
                      defaultOpen={false}
                    >
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {match.missingSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-orange-50 text-orange-800 rounded text-[11px]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </Collapse>
                  )}

                  {/* Roadmaps */}
                  {match.recommendedRoadmaps.length > 0 && (
                    <Collapse
                      title={`🗺️ Roadmaps (${match.recommendedRoadmaps.length})`}
                      defaultOpen={false}
                    >
                      <div className="space-y-1.5 pt-2">
                        {match.recommendedRoadmaps.map((url, idx) => {
                          const roadmapName =
                            url.split("/").pop()?.replace("-", " ") ||
                            `Roadmap ${idx + 1}`;
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-2 py-1.5 bg-blue-50 hover:bg-blue-100 rounded text-xs text-blue-800 font-medium"
                            >
                              {roadmapName} →
                            </a>
                          );
                        })}
                      </div>
                    </Collapse>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});

FindMyJobMobile.displayName = "FindMyJobMobile";
