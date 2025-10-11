// src/components/Stats/StatsOverview.tsx

import React from "react";
import { SalaryStatistics } from "@/models/statistics";
import { StatCard } from "./StatCard";
import { formatSalary } from "@/utils/dataFormatter";

export interface StatsOverviewProps {
  stats: SalaryStatistics;
  className?: string;
}

export const StatsOverview = React.memo<StatsOverviewProps>(
  ({ stats, className = "" }) => {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
      >
        {/* Salaire Moyen */}
        <StatCard
          title="Salaire Moyen"
          value={formatSalary(stats.mean)}
          subtitle={`Sur ${stats.count} salaires`}
          icon={
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          tooltip="Somme de tous les salaires divisée par le nombre d'entrées"
        />

        {/* Médiane */}
        <StatCard
          title="Médiane"
          value={formatSalary(stats.median)}
          subtitle="50% gagnent plus"
          icon={
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          tooltip="Valeur centrale : 50% des salaires sont en dessous, 50% au dessus"
        />

        {/* Quartiles */}
        <StatCard
          title="Quartiles"
          value={`${formatSalary(stats.quartiles.q1)} - ${formatSalary(
            stats.quartiles.q3
          )}`}
          subtitle="25% - 75%"
          icon={
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          }
          tooltip="Q1 : 25% gagnent moins • Q3 : 75% gagnent moins. 50% des salaires sont dans cet intervalle."
        />

        {/* Écart-type */}
        <StatCard
          title="Écart-type"
          value={formatSalary(stats.stdDev)}
          subtitle={
            stats.stdDev / stats.mean > 0.3
              ? "Variabilité élevée"
              : "Variabilité faible"
          }
          icon={
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
          tooltip="Mesure la dispersion des salaires autour de la moyenne. Plus c'est élevé, plus les salaires varient."
        />

        {/* Min */}
        <StatCard
          title="Minimum"
          value={formatSalary(stats.min)}
          subtitle="Salaire le plus bas"
          icon={
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          }
        />

        {/* Max */}
        <StatCard
          title="Maximum"
          value={formatSalary(stats.max)}
          subtitle="Salaire le plus haut"
          icon={
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
        />

        {/* Débutant (0-2 ans) */}
        <StatCard
          title="Débutant (0-2 ans)"
          value={formatSalary(stats.leastExperiencedAvg)}
          subtitle="Salaire moyen junior"
          icon={
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />

        {/* Expérimenté (10+ ans) */}
        <StatCard
          title="Expérimenté (10+ ans)"
          value={formatSalary(stats.mostExperiencedAvg)}
          subtitle={`+${Math.round(
            ((stats.mostExperiencedAvg - stats.leastExperiencedAvg) /
              stats.leastExperiencedAvg) *
              100
          )}% vs junior`}
          icon={
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
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          }
        />
      </div>
    );
  }
);

StatsOverview.displayName = "StatsOverview";
