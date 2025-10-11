// src/components/Table/SalaryTableMobile.tsx

import React, { useState } from "react";
import { CleanedSalary } from "@/models/salary";
import { formatSalary, formatDate, formatRemote } from "@/utils/dataFormatter";
import { Card } from "@/components/UI/Card";

export interface SalaryTableMobileProps {
  salaries: CleanedSalary[];
  className?: string;
}

export const SalaryTableMobile = React.memo<SalaryTableMobileProps>(
  ({ salaries, className = "" }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(salaries.length / itemsPerPage);
    const paginatedSalaries = salaries.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className={`space-y-4 ${className}`}>
        {paginatedSalaries.map((salary, index) => (
          <Card key={index} className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg text-black">
                  {salary.company}
                </h4>
                {salary.level && (
                  <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                    {salary.level}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-black">
                  {formatSalary(salary.compensation)}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Lieu</p>
                <p className="font-medium text-black">{salary.location}</p>
              </div>
              <div>
                <p className="text-gray-500">Expérience</p>
                <p className="font-medium text-black">
                  {salary.total_xp} an{salary.total_xp > 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Remote</p>
                <p className="font-medium text-black">
                  {formatRemote(salary.remote)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-black">
                  {formatDate(salary.date)}
                </p>
              </div>
            </div>
          </Card>
        ))}

        {/* Pagination Mobile */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">
              Page {currentPage} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border-2 border-black rounded-lg font-medium hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SalaryTableMobile.displayName = "SalaryTableMobile";
