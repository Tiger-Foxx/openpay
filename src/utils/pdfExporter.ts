import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { SalaryStatistics } from "@/models/statistics";
import type { CleanedSalary } from "@/models/salary";
import { formatSalary, formatDate, formatRemote } from "./dataFormatter";

/**
 * Exporte les résultats d'analyse en PDF
 */
export function exportResultsToPDF(
  jobTitle: string,
  stats: SalaryStatistics,
  salaries: CleanedSalary[]
): void {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("OpenPay — Analyse de Salaire", 14, 22);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Poste : ${jobTitle}`, 14, 32);
  doc.text(`Date : ${formatDate(new Date().toISOString())}`, 14, 38);
  doc.text(`Nombre de salaires analysés : ${stats.count}`, 14, 44);

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(14, 48, 196, 48);

  // Statistiques principales
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Statistiques Principales", 14, 56);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let yPos = 64;

  const mainStats = [
    ["Moyenne", formatSalary(stats.mean)],
    ["Médiane", formatSalary(stats.median)],
    ["Écart-type", formatSalary(stats.stdDev)],
    ["Minimum", formatSalary(stats.min)],
    ["Maximum", formatSalary(stats.max)],
    ["Q1 (25%)", formatSalary(stats.quartiles.q1)],
    ["Q3 (75%)", formatSalary(stats.quartiles.q3)],
  ];

  mainStats.forEach(([label, value]) => {
    doc.text(`${label} :`, 14, yPos);
    doc.text(value, 80, yPos);
    yPos += 6;
  });

  // Statistiques par expérience
  yPos += 6;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Salaires par Expérience", 14, yPos);
  yPos += 8;

  autoTable(doc, {
    startY: yPos,
    head: [["Expérience", "Nombre", "Salaire Moyen", "Médiane"]],
    body: stats.experienceBreakdown.map((item) => [
      item.label,
      item.count.toString(),
      formatSalary(item.averageSalary),
      formatSalary(item.medianSalary),
    ]),
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0] },
  });

  // Liste des salaires (nouvelle page)
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Détail des Salaires", 14, 22);

  autoTable(doc, {
    startY: 30,
    head: [["Entreprise", "Lieu", "Salaire", "XP", "Remote"]],
    body: salaries
      .slice(0, 50)
      .map((s) => [
        s.company,
        s.location,
        formatSalary(s.compensation),
        `${s.total_xp} ans`,
        formatRemote(s.remote),
      ]),
    theme: "striped",
    headStyles: { fillColor: [0, 0, 0] },
    styles: { fontSize: 8 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "Généré par OpenPay — openpay.dev",
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} / ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }

  // Téléchargement
  const filename = `openpay_${jobTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
  doc.save(filename);
}
