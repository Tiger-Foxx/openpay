// src/components/SearchBar/SearchBar.tsx

import React, { useState, useRef, useEffect } from "react";
import { AutoSuggest } from "./AutoSuggest";
import { getAutoSuggestTitles } from "@/services/salariesApi";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onSwitchToNaturalLanguage: () => void;
}

// Placeholders rotatifs avec exemples précis
const EXAMPLE_PLACEHOLDERS = [
  "Senior Backend Developer",
  "Lead Frontend Engineer React",
  "DevOps Engineer AWS",
  "Data Scientist Python",
  "Architecte Solutions Cloud",
  "Développeur Mobile Flutter",
  "Product Manager Tech",
  "UX/UI Designer",
  "Tech Lead Full Stack",
  "Ingénieur Machine Learning",
];

export const SearchBar = React.memo<SearchBarProps>(
  ({ onSearch, onSwitchToNaturalLanguage }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = useState(
      EXAMPLE_PLACEHOLDERS[0]
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Rotation du placeholder toutes les 3 secondes
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => {
          const currentIndex = EXAMPLE_PLACEHOLDERS.indexOf(prev);
          const nextIndex = (currentIndex + 1) % EXAMPLE_PLACEHOLDERS.length;
          return EXAMPLE_PLACEHOLDERS[nextIndex];
        });
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await getAutoSuggestTitles(query, 8);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          console.error("[SearchBar] Erreur autosuggest:", error);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    }, [query]);

    const handleSelectSuggestion = (suggestion: string) => {
      setQuery(suggestion);
      setShowSuggestions(false);
      onSearch(suggestion);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setShowSuggestions(false);
        onSearch(query);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    return (
      <div className="relative w-full space-y-4">
        {/* Helper text au-dessus */}
        <div className="text-center animate-fade-in">
          <p className="text-sm text-gray-600 font-medium mb-2">
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">
              Astuce
            </span>{" "}
            L'IA analyse votre recherche pour trouver les meilleures
            correspondances
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Tapez en langage naturel :{" "}
            <span className="font-semibold text-gray-700">
              "je suis dev front end junior"
            </span>
            ,{" "}
            <span className="font-semibold text-gray-700">
              "développeur backend avec Python"
            </span>
            ... Ne vous souciez pas trop des suggestions, l'IA comprendra votre
            intention !
          </p>

          {/* Exemples cliquables */}
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-gray-400">Exemples rapides :</span>
            {[
              "Senior Backend Developer",
              "Lead DevOps",
              "Data Scientist Python",
              "Tech Lead React",
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setQuery(example);
                  onSearch(example);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          {/* Conteneur principal avec glassmorphism */}
          <div className="relative group">
            {/* Effet glow au focus */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-3xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500"></div>

            {/* Input principal imposant */}
            <div className="relative bg-white rounded-3xl shadow-large border-2 border-gray-100 focus-within:border-black transition-all duration-300">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                placeholder={currentPlaceholder}
                className="w-full h-20 px-8 pr-56 text-xl font-medium bg-transparent focus:outline-none placeholder:text-gray-400 transition-all duration-300"
                aria-label="Rechercher un métier"
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-expanded={showSuggestions}
              />

              {/* Actions à droite */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {/* Loader */}
                {isLoading && (
                  <div className="animate-pulse">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                )}

                {/* Bouton Langage Naturel */}
                <button
                  type="button"
                  onClick={onSwitchToNaturalLanguage}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center gap-2"
                  title="Décrire en langage naturel"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span className="hidden sm:inline">IA</span>
                </button>

                {/* Bouton Recherche */}
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-medium"
                  aria-label="Rechercher"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* AutoSuggest Dropdown — Z-index élevé */}
          {showSuggestions && (
            <div className="relative z-50">
              <AutoSuggest
                suggestions={suggestions}
                onSelect={handleSelectSuggestion}
                onClose={() => setShowSuggestions(false)}
              />
            </div>
          )}
        </form>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
