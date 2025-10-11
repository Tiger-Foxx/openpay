// src/pages/Home.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { NaturalLanguageInput } from "@/components/SearchBar/NaturalLanguageInput";
import { AnimatedBackground } from "@/components/UI/AnimatedBackground";
import { Search, Plus } from "lucide-react";
import Lottie from "lottie-react";
import logoFox from "@/assets/logos/logo-fox-dark.png";
import developerAnimation from "@/assets/lotties/Developer.json";

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
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated Background avec particules */}
      <AnimatedBackground />

      {/* Hero Section - Design Magnifique */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20 pt-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Lottie Animation */}
            <div className="hidden lg:block animate-fade-in">
              <Lottie
                animationData={developerAnimation}
                loop={true}
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>

            {/* Right: Content */}
            <div className="text-center lg:text-left space-y-8 animate-slide-up">
              {/* Logo + Titre */}
              <div className="space-y-4">
                <div className="inline-block relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-2xl animate-pulse-slow"></div>
                  <h1 className="relative text-7xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-black bg-clip-text text-transparent tracking-tight">
                    <div className="flex items-center gap-2">
                      <img
                        src="/logo-pay.png"
                        alt="OpenPay"
                        className="h-40 w-auto object-contain"
                      />
                    </div>
                  </h1>
                </div>

                {/* by Fox - Signature stylée */}
                <div className="flex items-center justify-center lg:justify-start gap-2 opacity-70 hover:opacity-100 transition-all duration-300 group">
                  <span className="text-sm font-light text-gray-600">
                    crafted by
                  </span>
                  <img
                    src={logoFox}
                    alt="Fox"
                    className="h-6 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-yellow-600 bg-clip-text text-transparent">
                  Salaires Tech en toute transparence
                </p>
                <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Découvrez les salaires réels de{" "}
                  <span className="font-semibold text-gray-900">
                    700+ professionnels tech
                  </span>{" "}
                  — développeurs, DevOps, Data Engineers et bien plus encore.
                </p>
              </div>

              {/* Section Recherche - Dans la grille */}
              <div className="w-full">
                {!isNaturalLanguageMode ? (
                  <SearchBar
                    onSearch={handleSearch}
                    onSwitchToNaturalLanguage={() =>
                      setIsNaturalLanguageMode(true)
                    }
                  />
                ) : (
                  <NaturalLanguageInput
                    onJobSelected={handleJobSelected}
                    onBack={() => setIsNaturalLanguageMode(false)}
                  />
                )}
              </div>
            </div>
          </div>
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
            <Search className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors relative z-10" />
            <span className="relative z-10">Trouver mon Métier</span>
          </button>

          <button
            onClick={() => navigate("/add-salary")}
            className="group relative px-8 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-900 hover:shadow-large transition-all duration-300 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="h-6 w-6 relative z-10" />
            <span className="relative z-10">Ajouter mon Salaire</span>
          </button>

          <button
            onClick={() => navigate("/cameroon")}
            className="group relative px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl font-medium hover:from-green-100 hover:to-emerald-100 hover:text-green-800 transition-all duration-200 active:scale-98 flex items-center gap-2"
          >
            <span className="text-sm">Salaires Cameroun 🇨🇲</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
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
