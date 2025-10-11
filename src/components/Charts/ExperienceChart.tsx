// src/components/Charts/ExperienceChart.tsx

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CleanedSalary } from "@/models/salary";
import { formatSalary } from "@/utils/dataFormatter";
import { Card } from "@/components/UI/Card";

export interface ExperienceChartProps {
  salaries: CleanedSalary[];
  className?: string;
}

export const ExperienceChart = React.memo<ExperienceChartProps>(
  ({ salaries, className = "" }) => {
    // Grouper par année d'expérience et calculer moyenne
    const experienceGroups = salaries.reduce((acc, salary) => {
      const xp = salary.total_xp;
      if (!acc[xp]) {
        acc[xp] = { totalCompensation: 0, count: 0 };
      }
      acc[xp].totalCompensation += salary.compensation;
      acc[xp].count++;
      return acc;
    }, {} as Record<number, { totalCompensation: number; count: number }>);

    const chartData = Object.entries(experienceGroups)
      .map(([xp, data]) => ({
        xp: parseInt(xp),
        avgSalary: Math.round(data.totalCompensation / data.count),
        count: data.count,
      }))
      .sort((a, b) => a.xp - b.xp)
      .filter((item) => item.xp <= 20); // Limiter à 20 ans d'XP pour lisibilité

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            <p className="font-semibold">
              {payload[0].payload.xp} an{payload[0].payload.xp > 1 ? "s" : ""}{" "}
              d'expérience
            </p>
            <p>{formatSalary(payload[0].value)} en moyenne</p>
            <p className="text-xs text-gray-300">
              ({payload[0].payload.count} salaire
              {payload[0].payload.count > 1 ? "s" : ""})
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <Card className={className}>
        <h3 className="text-xl font-bold mb-6">
          Évolution Salaire / Expérience
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="xp"
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              label={{
                value: "Années d'expérience",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 12, fill: "#666" },
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="avgSalary"
              stroke="#000000"
              strokeWidth={3}
              dot={{ fill: "#000000", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Chaque point représente le salaire moyen pour un nombre d'années
          d'expérience donné
        </p>
      </Card>
    );
  }
);

ExperienceChart.displayName = "ExperienceChart";
