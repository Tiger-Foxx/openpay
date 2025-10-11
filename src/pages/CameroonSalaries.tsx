// src/pages/CameroonSalaries.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/UI/Loader";
import { Button } from "@/components/UI/Button";
import { SalaryTableMobile } from "@/components/Table/SalaryTableMobile";
import { SalaryTable } from "@/components/Table/SalaryTable";
import { getSalariesByCountry } from "@/services/supabaseService";
import { cleanSalaries } from "@/utils/dataCleanup";
import { CleanedSalary } from "@/models/salary";
import { config } from "@/config";

export const CameroonSalaries = React.memo(() => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState<CleanedSalary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < config.ui.mobileBreakpoint);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchCameroonSalaries() {
      setIsLoading(true);
      setError(null);

      if (!config.supabase.enabled) {
        setError(
          "Supabase est désactivé. Impossible de charger les salaires camerounais."
        );
        setIsLoading(false);
        return;
      }

      try {
        const rawSalaries = await getSalariesByCountry("Cameroun");
        const cleaned = cleanSalaries(rawSalaries);
        setSalaries(cleaned);

        if (cleaned.length === 0) {
          setError(
            "Aucun salaire camerounais pour le moment. Soyez le premier à contribuer !"
          );
        }
      } catch (err) {
        console.error("[CameroonSalaries] Erreur:", err);
        setError("Une erreur est survenue lors du chargement des données.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCameroonSalaries();
  }, []);

  if (isLoading) {
    return <Loader text="Chargement des salaires camerounais..." />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl font-semibold text-black mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={() => navigate("/add-salary")}>
              Ajouter mon Salaire
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 mt-14">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
          Salaires Cameroun 🇨🇲
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Découvrez les salaires tech auto-déclarés au Cameroun. La communauté
          grandit — participez en ajoutant votre salaire !
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="primary" onClick={() => navigate("/add-salary")}>
            Ajouter mon Salaire
          </Button>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Retour
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-black mb-2">
            {salaries.length}
          </p>
          <p className="text-sm text-gray-600">
            Salaire{salaries.length > 1 ? "s" : ""} enregistré
            {salaries.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-black mb-2">
            {new Set(salaries.map((s) => s.title)).size}
          </p>
          <p className="text-sm text-gray-600">Métiers Différents</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-black mb-2">
            {new Set(salaries.map((s) => s.location)).size}
          </p>
          <p className="text-sm text-gray-600">Villes Représentées</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <p className="text-sm text-blue-900 leading-relaxed">
          <strong>Note :</strong> Les salaires camerounais sont fournis par la
          communauté via le formulaire "Ajouter mon Salaire". Les données
          françaises proviennent de{" "}
          <a
            href="https://salaires.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            salaires.dev
          </a>
          . Plus il y aura de contributions, plus les statistiques seront
          représentatives !
        </p>
      </div>

      {/* Table */}
      {isMobile ? (
        <SalaryTableMobile salaries={salaries} />
      ) : (
        <SalaryTable salaries={salaries} />
      )}
    </div>
  );
});

CameroonSalaries.displayName = "CameroonSalaries";
