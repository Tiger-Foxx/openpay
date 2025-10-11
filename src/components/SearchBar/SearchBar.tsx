// src/components/SearchBar/SearchBar.tsx

import React, { useState, useRef, useEffect } from "react";
import { AutoSuggest } from "./AutoSuggest";
import { getAutoSuggestTitles } from "@/services/salariesApi";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onSwitchToNaturalLanguage: () => void;
  placeholder?: string;
}

export const SearchBar = React.memo<SearchBarProps>(
  ({
    onSearch,
    onSwitchToNaturalLanguage,
    placeholder = "Rechercher un métier (ex: Développeur React, DevOps...)",
  }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce pour autosuggest
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
      <div className="relative w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          {/* Input principal */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder={placeholder}
              className="w-full px-6 py-4 pr-32 text-lg border-2 border-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/10 transition-all duration-200 bg-white shadow-soft"
              aria-label="Rechercher un métier"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showSuggestions}
            />

            {/* Loader dans l'input */}
            {isLoading && (
              <div className="absolute right-28 top-1/2 -translate-y-1/2">
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

            {/* Bouton recherche */}
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
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

          {/* AutoSuggest Dropdown */}
          {showSuggestions && (
            <AutoSuggest
              suggestions={suggestions}
              onSelect={handleSelectSuggestion}
              onClose={() => setShowSuggestions(false)}
            />
          )}
        </form>

        {/* Switch vers Natural Language */}
        <button
          onClick={onSwitchToNaturalLanguage}
          className="mt-4 text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center gap-2 mx-auto"
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
          <span>Décrire mon métier en langage naturel</span>
        </button>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
