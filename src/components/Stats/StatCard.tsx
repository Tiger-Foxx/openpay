// src/components/Stats/StatCard.tsx

import React, { useState } from "react";
import { Card } from "@/components/UI/Card";

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  className?: string;
}

export const StatCard = React.memo<StatCardProps>(
  ({ title, value, subtitle, icon, tooltip, className = "" }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <Card className={`relative ${className}`} hover={false}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              {tooltip && (
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Information"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-black mb-1">
              {value}
            </p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {icon && <div className="text-gray-400 ml-4">{icon}</div>}
        </div>

        {/* Tooltip */}
        {tooltip && showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-black text-white text-xs rounded-lg shadow-lg z-10 w-64 animate-fade-in">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black" />
          </div>
        )}
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";
