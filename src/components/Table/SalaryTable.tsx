// src/components/Table/SalaryTable.tsx

import React, { useState, useMemo } from "react";
import { CleanedSalary } from "@/models/salary";
import { formatSalary, formatDate, formatRemote } from "@/utils/dataFormatter";
import { Card } from "@/components/UI/Card";

export interface SalaryTableProps {
  salaries: CleanedSalary[];
  className?: string;
}

type SortKey = "company" | "compensation" | "total_xp" | "date" | "location";
type SortOrder = "asc" | "desc";

export const SalaryTable = React.memo<SalaryTableProps>(
  ({ salaries, className = "" }) => {
    const [sortKey, setSortKey] = useState<SortKey>("compensation");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Tri
    const sortedSalaries = useMemo(() => {
      return [...salaries].sort((a, b) => {
        let aVal: any = a[sortKey];
        let bVal: any = b[sortKey];

        if (sortKey === "date") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (typeof aVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }, [salaries, sortKey, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(sortedSalaries.length / itemsPerPage);
    const paginatedSalaries = sortedSalaries.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const handleSort = (key: SortKey) => {
      if (sortKey === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortOrder("desc");
      }
    };

    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
      if (sortKey !== columnKey) {
        return (
          <svg
            className="h-4 w-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        );
      }
      return sortOrder === "asc" ? (
        <svg
          className="h-4 w-4 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    };

    return (
      <Card className={className} noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("company")}
                >
                  <div className="flex items-center gap-2">
                    Entreprise
                    <SortIcon columnKey="company" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("location")}
                >
                  <div className="flex items-center gap-2">
                    Lieu
                    <SortIcon columnKey="location" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("compensation")}
                >
                  <div className="flex items-center gap-2">
                    Salaire
                    <SortIcon columnKey="compensation" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("total_xp")}
                >
                  <div className="flex items-center gap-2">
                    Expérience
                    <SortIcon columnKey="total_xp" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Remote
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <SortIcon columnKey="date" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedSalaries.map((salary, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-black">
                      {salary.company}
                    </div>
                    {salary.level && (
                      <div className="text-xs text-gray-500">
                        {salary.level}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {salary.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-base font-semibold text-black">
                      {formatSalary(salary.compensation)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {salary.total_xp} an{salary.total_xp > 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatRemote(salary.remote)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(salary.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Affichage {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, salaries.length)} sur{" "}
              {salaries.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </Card>
    );
  }
);

SalaryTable.displayName = "SalaryTable";
