// src/components/SearchBar/NaturalLanguageInput.tsx

import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import { parseNaturalLanguageJob, JobSuggestion } from "@/services/llmService";

export interface NaturalLanguageInputProps {
  onJobSelected: (jobTitle: string) => void;
  onBack: () => void;
}

export const NaturalLanguageInput = React.memo<NaturalLanguageInputProps>(
  ({ onJobSelected, onBack }) => {
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<JobSuggestion[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (description.trim().length < 10) {
        setError(
          "Veuillez décrire plus précisément votre métier (minimum 10 caractères)"
        );
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuggestions([]);

      try {
        const results = await parseNaturalLanguageJob(description);

        if (results.length === 0) {
          setError(
            "Aucun métier trouvé. Essayez de reformuler votre description."
          );
        } else {
          setSuggestions(results);
        }
      } catch (err) {
        console.error("[NaturalLanguageInput] Erreur:", err);
        setError("Une erreur est survenue. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Retour"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Décrire mon métier</h2>
            <p className="text-gray-600 text-sm mt-1">
              Expliquez ce que vous faites au quotidien, l'IA vous proposera le
              métier correspondant
            </p>

            {/* Conseils de précision */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900 font-medium mb-1">
                💡 Pour de meilleurs résultats, mentionnez :
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>
                  • <span className="font-semibold">Niveau d'expérience</span> :
                  Junior, Senior, Lead, Principal...
                </li>
                <li>
                  • <span className="font-semibold">Technologies</span> : React,
                  Python, AWS, Kubernetes...
                </li>
                <li>
                  • <span className="font-semibold">Responsabilités</span> :
                  Développement, architecture, management...
                </li>
                <li>
                  • <span className="font-semibold">Domaine</span> : Backend,
                  Frontend, Mobile, Data, DevOps...
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Exemple précis : Je suis Senior Backend Developer avec 5 ans d'expérience. Je développe des API REST en Node.js et TypeScript, j'utilise PostgreSQL et Redis. Je manage une équipe de 3 développeurs juniors et je participe à l'architecture des nouveaux services..."
              rows={6}
              className="w-full px-6 py-4 border-2 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/10 transition-all duration-200 bg-white resize-none shadow-soft"
              aria-label="Description de votre métier"
            />
            {/* Compteur de caractères */}
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {description.length} caractères{" "}
              {description.length < 50 &&
                description.length > 0 &&
                "• Ajoutez plus de détails"}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Analyser avec l'IA
          </Button>
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="text-lg font-semibold mb-4">
              Métiers correspondants
            </h3>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onJobSelected(suggestion.title)}
                className="w-full p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-medium transition-all duration-200 text-left group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg group-hover:text-black transition-colors">
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {suggestion.reasoning ||
                        "Correspondance détectée par l'IA"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {suggestion.confidence}% confiance
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

NaturalLanguageInput.displayName = "NaturalLanguageInput";
