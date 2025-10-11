// src/pages/HomeMobile.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBarMobile } from "@/components/SearchBar/SearchBarMobile";
import { NaturalLanguageInput } from "@/components/SearchBar/NaturalLanguageInput";
import logoFox from "@/assets/logos/logo-fox-dark.png";

export const HomeMobile = React.memo(() => {
  const navigate = useNavigate();
  const [isNaturalLanguageMode, setIsNaturalLanguageMode] = useState(false);

  const handleSearch = (query: string) => {
    navigate(`/results?job=${encodeURIComponent(query)}`);
  };

  const handleJobSelected = (jobTitle: string) => {
    navigate(`/results?job=${encodeURIComponent(jobTitle)}`);
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col px-4 py-8">
      {/* Hero Section Mobile */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-3xl">O</span>
        </div>
        <h1 className="text-4xl font-bold text-black mb-2">OpenPay</h1>

        {/* by Fox - Version mobile */}
        <div className="flex items-center justify-center gap-1.5 mb-3 opacity-60">
          <span className="text-xs font-light text-gray-500">by</span>
          <img
            src={logoFox}
            alt="Fox Logo"
            className="h-5 w-auto object-contain"
          />
        </div>

        <p className="text-lg text-gray-600 mb-2">Salaires Tech transparents</p>
        <p className="text-sm text-gray-500 px-4">
          Découvrez les salaires réels de la communauté dev
        </p>
      </div>

      {/* Search Section */}
      <div className="flex-1 flex flex-col">
        {!isNaturalLanguageMode ? (
          <SearchBarMobile
            onSearch={handleSearch}
            onSwitchToNaturalLanguage={() => setIsNaturalLanguageMode(true)}
          />
        ) : (
          <NaturalLanguageInput
            onJobSelected={handleJobSelected}
            onBack={() => setIsNaturalLanguageMode(false)}
          />
        )}

        {/* Quick Actions Mobile */}
        {!isNaturalLanguageMode && (
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate("/find-my-job")}
              className="w-full px-6 py-4 bg-white border-2 border-black rounded-xl font-semibold hover:bg-black hover:text-white transition-all active:scale-98 flex items-center justify-between min-h-[60px]"
            >
              <span>Trouver mon Métier</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              onClick={() => navigate("/add-salary")}
              className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-98 flex items-center justify-between min-h-[60px]"
            >
              <span>Ajouter mon Salaire</span>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>

            <button
              onClick={() => navigate("/cameroon")}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold hover:border-black transition-all active:scale-98 flex items-center justify-between min-h-[60px]"
            >
              <span>Salaires Cameroun</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Stats Preview Mobile */}
      <div className="mt-auto pt-8 text-center text-xs text-gray-500">
        <p>
          <span className="font-semibold text-black">700+ salaires</span>{" "}
          auto-déclarés
        </p>
        <p className="mt-1">
          Données via{" "}
          <a
            href="https://salaires.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            salaires.dev
          </a>
        </p>
      </div>
    </div>
  );
});

HomeMobile.displayName = "HomeMobile";
