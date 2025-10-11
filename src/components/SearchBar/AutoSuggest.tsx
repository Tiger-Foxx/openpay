// src/components/SearchBar/AutoSuggest.tsx

import React, { useEffect, useRef } from "react";

export interface AutoSuggestProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

export const AutoSuggest = React.memo<AutoSuggestProps>(
  ({ suggestions, onSelect, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Fermer au clic extérieur
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (suggestions.length === 0) return null;

    return (
      <div
        ref={containerRef}
        id="search-suggestions"
        role="listbox"
        className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-xl shadow-medium overflow-hidden z-50 animate-slide-up"
      >
        <div className="max-h-[400px] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect(suggestion)}
              role="option"
              aria-selected="false"
              className="w-full px-6 py-3 text-left hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-100"
            >
              <span className="font-medium text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>

        {/* Footer avec nombre de résultats */}
        <div className="px-6 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
          {suggestions.length} résultat{suggestions.length > 1 ? "s" : ""}{" "}
          trouvé{suggestions.length > 1 ? "s" : ""}
        </div>
      </div>
    );
  }
);

AutoSuggest.displayName = "AutoSuggest";
