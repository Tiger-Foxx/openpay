// src/components/SearchBar/SearchBarMobile.tsx

import React, { useState } from "react";
import { Modal } from "@/components/UI/Modal";
// import { AutoSuggest } from "./AutoSuggest";
import { getAutoSuggestTitles } from "@/services/salariesApi";

export interface SearchBarMobileProps {
  onSearch: (query: string) => void;
  onSwitchToNaturalLanguage: () => void;
}

export const SearchBarMobile = React.memo<SearchBarMobileProps>(
  ({ onSearch, onSwitchToNaturalLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const placeholders = [
      "Senior Backend Developer",
      "Lead Frontend Engineer React",
      "DevOps Engineer AWS",
      "Data Engineer Python",
      "Full Stack Developer Node.js",
      "Tech Lead",
      "Cloud Architect",
      "Machine Learning Engineer",
    ];

    const quickExamples = [
      "Développeur React",
      "DevOps",
      "Data Scientist",
      "Backend Node.js",
    ];

    // Rotation du placeholder
    React.useEffect(() => {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [placeholders.length]);

    const handleInputChange = async (value: string) => {
      setQuery(value);

      if (value.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await getAutoSuggestTitles(value, 6);
        setSuggestions(results);
      } catch (error) {
        console.error("[SearchBarMobile] Erreur autosuggest:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSelectSuggestion = (suggestion: string) => {
      setQuery(suggestion);
      onSearch(suggestion);
      setIsOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query);
        setIsOpen(false);
      }
    };

    return (
      <>
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-4 bg-white border-2 border-black rounded-2xl text-left flex items-center justify-between shadow-soft active:scale-98 transition-transform duration-200"
        >
          <span className="text-gray-500">Rechercher un métier...</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
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

        {/* Modal Fullscreen */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="full"
          showCloseButton={false}
        >
          <div className="bg-white p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Rechercher un métier</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                aria-label="Fermer"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              {/* Helper text avec IA */}
              <div className="mt-3 px-1">
                <p className="text-xs text-gray-700 mb-1">
                  <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    Astuce
                  </span>{" "}
                  L'IA analyse votre recherche
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Tapez en langage naturel : "je suis dev front end junior",
                  "backend Python"... Ne vous souciez pas des suggestions !
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  autoFocus
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all duration-300"
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
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
              </div>

              
            </form>

            {/* Quick Examples */}
            {query.length === 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 font-medium mb-3">
                  Recherches populaires
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSuggestion(example)}
                      className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-900 active:scale-95 transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-3">Suggestions</p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors active:scale-98 font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Switch Natural Language */}
            <button
              onClick={() => {
                setIsOpen(false);
                onSwitchToNaturalLanguage();
              }}
              className="mt-8 w-full px-6 py-4 bg-black text-white rounded-xl font-medium active:scale-98 transition-transform duration-200 flex items-center justify-center gap-2"
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span>En langage naturel</span>
            </button>
          </div>
        </Modal>
      </>
    );
  }
);

SearchBarMobile.displayName = "SearchBarMobile";
