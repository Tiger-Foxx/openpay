// src/pages/HomeMobile.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBarMobile } from "@/components/SearchBar/SearchBarMobile";
import { NaturalLanguageInput } from "@/components/SearchBar/NaturalLanguageInput";
import { AnimatedBackground } from "@/components/UI/AnimatedBackground";
import { Search, Plus, ChevronRight } from "lucide-react";
import Lottie from "lottie-react";
import logoFox from "@/assets/logos/logo-fox-dark.png";
import developerAnimation from "@/assets/lotties/Developer.json";

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
    <div className="min-h-[calc(100vh-150px)] flex flex-col px-4 py-6 relative overflow-hidden">
      {/* Animated Background avec particules */}
      <AnimatedBackground />

      {/* Hero Section Mobile - Avec Lottie */}
      <div className="text-center mb-6 animate-fade-in">
        {/* Lottie Animation Mobile */}
        <div className="w-32 h-32 mx-auto mb-4">
          <Lottie
            animationData={developerAnimation}
            loop={true}
            className="w-full h-full drop-shadow-xl"
          />
        </div>

        {/* Titre avec gradient */}
        <div className="relative inline-block mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 blur-xl"></div>
          <h1 className="relative text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-black bg-clip-text text-transparent">
            <div className="flex items-center gap-2">
              <img
                src="/logo-pay.png"
                alt="OpenPay"
                className="h-18 w-auto object-contain"
              />
            </div>
          </h1>
        </div>

        {/* by Fox - Version mobile stylée */}
        <div className="flex items-center justify-center gap-1.5 mb-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-light text-gray-600">crafted by</span>
          <img src={logoFox} alt="Fox" className="h-5 w-auto object-contain" />
        </div>

        <p className="text-xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-yellow-600 bg-clip-text text-transparent mb-2">
          Salaires Tech transparents
        </p>
        <p className="text-sm text-gray-600 px-4 leading-relaxed">
          Découvrez les salaires réels de{" "}
          <span className="font-semibold text-black">700+</span> professionnels
          tech
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

        {/* Quick Actions Mobile - Design magnifique */}
        {!isNaturalLanguageMode && (
          <div
            className="mt-6 space-y-3 animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <button
              onClick={() => navigate("/find-my-job")}
              className="group w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-2xl font-semibold hover:border-black hover:shadow-medium transition-all duration-300 active:scale-95 flex items-center justify-between min-h-[64px] overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center gap-3 relative z-10">
                <Search className="h-5 w-5 text-gray-700 group-hover:text-black transition-colors" />
                <span>Trouver mon Métier</span>
              </div>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>

            <button
              onClick={() => navigate("/add-salary")}
              className="group w-full px-6 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-900 hover:shadow-large transition-all duration-300 active:scale-95 flex items-center justify-between min-h-[64px] overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center gap-3 relative z-10">
                <Plus className="h-5 w-5" />
                <span>Ajouter mon Salaire</span>
              </div>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>

            <button
              onClick={() => navigate("/cameroon")}
              className="group w-full px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl font-medium hover:from-green-100 hover:to-emerald-100 active:bg-green-100 transition-all duration-200 flex items-center justify-between"
            >
              <span className="text-sm">Salaires Cameroun 🇨🇲</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
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
