// src/components/Charts/RemoteChart.tsx

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { RemoteBreakdownItem } from "@/models/statistics";
import { formatSalary, formatPercentage } from "@/utils/dataFormatter";
import { Card } from "@/components/UI/Card";

export interface RemoteChartProps {
  data: RemoteBreakdownItem[];
  className?: string;
}

const COLORS = {
  none: "#000000",
  partial: "#666666",
  full: "#cccccc",
};

const LABELS = {
  none: "Présentiel",
  partial: "Hybride",
  full: "100% Remote",
};

export const RemoteChart = React.memo<RemoteChartProps>(
  ({ data, className = "" }) => {
    const chartData = data
      .filter((item) => item.count > 0)
      .map((item) => ({
        name: LABELS[item.variant],
        value: item.count,
        percentage: item.percentage,
        avgSalary: item.averageSalary,
      }));

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            <p className="font-semibold">{data.name}</p>
            <p>
              {data.value} salaire{data.value > 1 ? "s" : ""} (
              {formatPercentage(data.percentage)})
            </p>
            <p className="text-xs text-gray-300">
              Salaire moyen : {formatSalary(data.avgSalary)}
            </p>
          </div>
        );
      }
      return null;
    };

    const CustomLegend = (props: any) => {
      const { payload } = props;
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {payload.map((entry: any, index: number) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    };

    return (
      <Card className={className}>
        <h3 className="text-xl font-bold mb-6">Répartition Télétravail</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${(percentage * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => {
                const variant = data[index]?.variant || "none";
                return <Cell key={`cell-${index}`} fill={COLORS[variant]} />;
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Détails */}
        <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
          {data
            .filter((item) => item.count > 0)
            .map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[item.variant] }}
                  />
                  <span className="font-medium">{LABELS[item.variant]}</span>
                </div>
                <span className="text-gray-600">
                  {formatSalary(item.averageSalary)} en moyenne
                </span>
              </div>
            ))}
        </div>
      </Card>
    );
  }
);

RemoteChart.displayName = "RemoteChart";
