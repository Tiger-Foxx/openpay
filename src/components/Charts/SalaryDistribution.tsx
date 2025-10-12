// src/components/Charts/SalaryDistribution.tsx

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CleanedSalary } from "@/models/salary";
import { generateDistributionBins } from "@/utils/statsCalculator";
import { Card } from "@/components/UI/Card";

export interface SalaryDistributionProps {
  salaries: CleanedSalary[];
  className?: string;
}

export const SalaryDistribution = React.memo<SalaryDistributionProps>(
  ({ salaries, className = "" }) => {
    const bins = generateDistributionBins(salaries, 10);

    const chartData = bins.map((bin) => ({
      range: `${Math.round(bin.rangeStart / 1000)}k-${Math.round(
        bin.rangeEnd / 1000
      )}k`,
      count: bin.count,
      percentage: Math.round(bin.percentage * 100),
    }));

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            <p className="font-semibold">{payload[0].payload.range}€</p>
            <p>
              {payload[0].value} salaire{payload[0].value > 1 ? "s" : ""} (
              {payload[0].payload.percentage}%)
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <Card className={className}>
        <h3 className="text-xl font-bold mb-6">Distribution des Salaires</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              label={{
                value: "Nombre",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: "#666" },
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#000000" : "#404040"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Chaque barre représente le nombre de salaires dans une tranche donnée
        </p>
      </Card>
    );
  }
);

SalaryDistribution.displayName = "SalaryDistribution";
