// src/components/Stats/ExperienceBreakdown.tsx

import React from "react";
import { ExperienceBreakdownItem } from "@/models/statistics";
import { formatSalary } from "@/utils/dataFormatter";
import { Card } from "@/components/UI/Card";

export interface ExperienceBreakdownProps {
  data: ExperienceBreakdownItem[];
  className?: string;
}

export const ExperienceBreakdown = React.memo<ExperienceBreakdownProps>(
  ({ data, className = "" }) => {
    const maxSalary = Math.max(...data.map((item) => item.averageSalary));

    return (
      <Card className={className}>
        <h3 className="text-xl font-bold mb-6">Salaires par Expérience</h3>

        <div className="space-y-6">
          {data.map((item, index) => {
            const barWidth = (item.averageSalary / maxSalary) * 100;

            return (
              <div key={index} className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-black">{item.label}</h4>
                    <p className="text-sm text-gray-500">
                      {item.count} salaire{item.count > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {formatSalary(item.averageSalary)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Médiane : {formatSalary(item.medianSalary)}
                    </p>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            💡 La barre indique le salaire moyen pour chaque tranche
            d'expérience. Plus elle est longue, plus le salaire est élevé.
          </p>
        </div>
      </Card>
    );
  }
);

ExperienceBreakdown.displayName = "ExperienceBreakdown";
