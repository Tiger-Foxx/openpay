// src/pages/ResultsMobile.tsx

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
import { SalaryTableMobile } from "@/components/Table/SalaryTableMobile";
import { Collapse } from "@/components/UI/Collapse";
import { exportToPDF } from "@/utils/pdfExporter";

export const ResultsMobile = React.memo(() => {
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
        const allSalaries = await getCombinedSalaries();
        const allTitles = await getUniqueTitles();
        const mappedTitles = await mapJobTitlesToDatabase(jobQuery, allTitles);

        if (mappedTitles.length === 0) {
          setError(`Aucun métier trouvé pour "${jobQuery}"`);
          setIsLoading(false);
          return;
        }

        const filtered = filterSalaries(allSalaries, { titles: mappedTitles });

        if (filtered.length < 5) {
          setError(
            `Données insuffisantes (${filtered.length} salaires). Minimum 5 requis.`
          );
          setIsLoading(false);
          return;
        }

        setMatchedSalaries(filtered);

        const statistics = calculateStatistics(filtered);
        setStats(statistics);

        const summary = await generateStatsSummary(statistics);
        setAiSummary(summary);
      } catch (err) {
        console.error("[ResultsMobile] Erreur:", err);
        setError("Une erreur est survenue.");
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
    return <Loader text="Analyse en cours..." />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
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
        <p className="text-lg font-semibold text-black mb-4">{error}</p>
        <Button variant="primary" fullWidth onClick={() => navigate("/")}>
          Retour
        </Button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Mobile */}
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">{jobQuery}</h1>
        <p className="text-sm text-gray-600 mb-4">
          {matchedSalaries.length} salaire
          {matchedSalaries.length > 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => navigate("/")}
          >
            Nouvelle recherche
          </Button>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleExportPDF}
          >
            PDF
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsOverview stats={stats} />

      {/* AI Summary - Mobile optimisé */}
      {aiSummary && (
        <Collapse title="Résumé des Salaires" defaultOpen={true}>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            {aiSummary.split(". ").map(
              (sentence, index) =>
                sentence.trim() && (
                  <p key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>
                      {sentence.trim()}
                      {!sentence.endsWith(".") && "."}
                    </span>
                  </p>
                )
            )}
          </div>
        </Collapse>
      )}

      {/* Experience */}
      <ExperienceBreakdown data={stats.experienceBreakdown} />

      {/* Main Chart */}
      <SalaryDistribution salaries={matchedSalaries} />

      {/* Additional Charts */}
      {showAllCharts && (
        <div className="space-y-6">
          <ExperienceChart salaries={matchedSalaries} />
          <RemoteChart data={stats.remoteBreakdown} />
        </div>
      )}

      {!showAllCharts && (
        <Button
          variant="ghost"
          fullWidth
          onClick={() => setShowAllCharts(true)}
        >
          Voir plus de graphiques
        </Button>
      )}

      {/* Table Mobile */}
      <SalaryTableMobile salaries={matchedSalaries} />
    </div>
  );
});

ResultsMobile.displayName = "ResultsMobile";
