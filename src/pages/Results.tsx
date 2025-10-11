// src/pages/Results.tsx

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CleanedSalary } from "@/models/salary";
import { SalaryStatistics } from "@/models/statistics";
import { getCombinedSalaries } from "@/services/supabaseService";
import { mapJobTitlesToDatabase } from "@/services/llmService";
import { filterSalaries } from "@/services/salariesApi";
import { getUniqueTitles } from "@/services/salariesApi";
import { calculateStatistics } from "@/utils/statsCalculator";
import { generateStatsSummary } from "@/services/llmService";
import { Loader } from "@/components/UI/Loader";
import { Button } from "@/components/UI/Button";
import { StatsOverview } from "@/components/Stats/StatsOverview";
import { ExperienceBreakdown } from "@/components/Stats/ExperienceBreakdown";
import { SalaryDistribution } from "@/components/Charts/SalaryDistribution";
import { ExperienceChart } from "@/components/Charts/ExperienceChart";
import { RemoteChart } from "@/components/Charts/RemoteChart";
import { SalaryTable } from "@/components/Table/SalaryTable";
import { Collapse } from "@/components/UI/Collapse";
import { exportToPDF } from "@/utils/pdfExporter";

export const Results = React.memo(() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobQuery = searchParams.get("job");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedSalaries, setMatchedSalaries] = useState<CleanedSalary[]>([]);
  const [stats, setStats] = useState<SalaryStatistics | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [showAllCharts, setShowAllCharts] = useState(false);

  useEffect(() => {
    if (!jobQuery) {
      navigate("/");
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Récupérer toutes les données
        const allSalaries = await getCombinedSalaries();
        const allTitles = await getUniqueTitles();

        // 2. Mapper le job query vers des titres exacts avec LLM
        const mappedTitles = await mapJobTitlesToDatabase(jobQuery, allTitles);

        if (mappedTitles.length === 0) {
          setError(
            `Aucun métier trouvé pour "${jobQuery}". Essayez une autre recherche.`
          );
          setIsLoading(false);
          return;
        }

        // 3. Filtrer les salaires correspondants
        const filtered = filterSalaries(allSalaries, { titles: mappedTitles });

        if (filtered.length < 5) {
          setError(
            `Données insuffisantes pour "${jobQuery}" (${filtered.length} salaires trouvés). Minimum 5 requis.`
          );
          setIsLoading(false);
          return;
        }

        setMatchedSalaries(filtered);

        // 4. Calculer les statistiques
        const statistics = calculateStatistics(filtered);
        setStats(statistics);

        // 5. Générer résumé IA
        const summary = await generateStatsSummary(statistics);
        setAiSummary(summary);
      } catch (err) {
        console.error("[Results] Erreur:", err);
        setError("Une erreur est survenue lors du chargement des données.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [jobQuery, navigate]);

  const handleExportPDF = () => {
    if (stats && matchedSalaries.length > 0) {
      exportToPDF({
        jobTitle: jobQuery || "",
        statistics: stats,
        salaries: matchedSalaries,
        aiSummary,
      });
    }
  };

  if (isLoading) {
    return <Loader text="Analyse des salaires en cours..." />;
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
          <p className="text-xl font-semibold text-black mb-2">{error}</p>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="mt-6"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
            {jobQuery}
          </h1>
          <p className="text-gray-600">
            {matchedSalaries.length} salaire
            {matchedSalaries.length > 1 ? "s" : ""} analysé
            {matchedSalaries.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Nouvelle recherche
          </Button>
          <Button variant="primary" onClick={handleExportPDF}>
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* AI Summary - Desktop avec meilleur formatage */}
      {aiSummary && (
        <Collapse title="Résumé des Salaires" defaultOpen>
          <div className="space-y-2 text-gray-700 leading-relaxed">
            {aiSummary.split(". ").map(
              (sentence, index) =>
                sentence.trim() && (
                  <p key={index} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="flex-1">
                      {sentence.trim()}
                      {!sentence.endsWith(".") && "."}
                    </span>
                  </p>
                )
            )}
          </div>
        </Collapse>
      )}

      {/* Experience Breakdown */}
      <ExperienceBreakdown data={stats.experienceBreakdown} />

      {/* Main Chart */}
      <SalaryDistribution salaries={matchedSalaries} />

      {/* Additional Charts */}
      {showAllCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          <ExperienceChart salaries={matchedSalaries} />
          <RemoteChart data={stats.remoteBreakdown} />
        </div>
      )}

      {!showAllCharts && (
        <div className="text-center">
          <Button variant="ghost" onClick={() => setShowAllCharts(true)}>
            Voir plus de graphiques
          </Button>
        </div>
      )}

      {/* Table */}
      <SalaryTable salaries={matchedSalaries} />
    </div>
  );
});

Results.displayName = "Results";
