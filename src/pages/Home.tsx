// src/pages/Home.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { NaturalLanguageInput } from "@/components/SearchBar/NaturalLanguageInput";

export const Home = React.memo(() => {
  const navigate = useNavigate();
  const [isNaturalLanguageMode, setIsNaturalLanguageMode] = useState(false);

  const handleSearch = (query: string) => {
    navigate(`/results?job=${encodeURIComponent(query)}`);
  };

  const handleJobSelected = (jobTitle: string) => {
    navigate(`/results?job=${encodeURIComponent(jobTitle)}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section avec effet gradient subtil */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        {/* Logo + Titre avec animation entrée */}
        <div className="text-center mb-16 space-y-6 animate-fade-in">
          {/* Logo XXL avec effet glow */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-black/5 blur-3xl rounded-full"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl flex items-center justify-center shadow-large transform hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-6xl">O</span>
            </div>
          </div>

          {/* Titre principal */}
          <div className="space-y-3">
            <h1 className="text-7xl sm:text-8xl font-black text-black tracking-tight">
              OpenPay
            </h1>
            <p className="text-2xl sm:text-3xl font-medium text-gray-600">
              Salaires Tech en toute transparence
            </p>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Découvrez les salaires réels de la communauté tech —
              principalement développeurs, DevOps, Data Engineers et autres
              métiers IT.
            </p>
          </div>
        </div>

        {/* Section Recherche — Cœur du système */}
        <div
          className="w-full max-w-5xl relative z-10 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          {!isNaturalLanguageMode ? (
            <SearchBar
              onSearch={handleSearch}
              onSwitchToNaturalLanguage={() => setIsNaturalLanguageMode(true)}
            />
          ) : (
            <NaturalLanguageInput
              onJobSelected={handleJobSelected}
              onBack={() => setIsNaturalLanguageMode(false)}
            />
          )}
        </div>

        {/* Quick Actions — Sous la recherche, z-index inférieur */}
        <div
          className="mt-12 flex flex-wrap gap-4 justify-center relative z-0 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <button
            onClick={() => navigate("/find-my-job")}
            className="group relative px-8 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-900 hover:border-black hover:shadow-medium transition-all duration-300 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors"
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
            <span className="relative">Trouver mon Métier</span>
          </button>

          <button
            onClick={() => navigate("/add-salary")}
            className="group relative px-8 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-900 hover:shadow-large transition-all duration-300 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="relative">Ajouter mon Salaire</span>
          </button>

          <button
            onClick={() => navigate("/cameroon")}
            className="group relative px-8 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-900 hover:border-black hover:shadow-medium transition-all duration-300 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="relative">Salaires Cameroun 🇨🇲</span>
          </button>
        </div>

        {/* Stats Preview — En bas, discret */}
        <div
          className="mt-20 text-center space-y-2 animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          <p className="text-sm text-gray-500">
            Basé sur <span className="font-bold text-black">700+ salaires</span>{" "}
            auto-déclarés
          </p>
          <p className="text-xs text-gray-400">
            Données France via{" "}
            <a
              href="https://salaires.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-black transition-colors"
            >
              salaires.dev
            </a>{" "}
            + communauté OpenPay
          </p>
        </div>
      </div>

      {/* Background décoratif subtil */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-gray-100 to-transparent rounded-full blur-3xl opacity-30"></div>
      </div>
    </div>
  );
});

Home.displayName = "Home";
