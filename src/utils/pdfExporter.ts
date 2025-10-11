import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SalaryStatistics } from "@/models/statistics";
import { CleanedSalary } from "@/models/salary";
import { formatSalary, formatDate, formatRemote } from "./dataFormatter";

export interface PDFExportOptions {
  jobTitle: string;
  statistics: SalaryStatistics;
  salaries: CleanedSalary[];
  aiSummary?: string;
}

/**
 * Exporte les résultats d'analyse en PDF avec logo et design moderne
 */
export function exportToPDF(options: PDFExportOptions): void {
  const { jobTitle, statistics: stats, salaries, aiSummary } = options;
  const doc = new jsPDF();

  // En-tête avec logo (simulé avec texte stylisé)
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("OpenPay", 14, 20);

  // Badge "by Fox"
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("by Fox", 50, 20);

  // Ligne décorative
  doc.setDrawColor(255, 165, 0); // Orange
  doc.setLineWidth(2);
  doc.line(14, 24, 60, 24);

  // Titre du poste
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`Analyse : ${jobTitle}`, 14, 35);

  // Métadonnées
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Date : ${formatDate(new Date().toISOString())}`, 14, 42);
  doc.text(`Nombre de salaires analysés : ${stats.count}`, 14, 48);

  // Ligne de séparation
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(14, 52, 196, 52);

  let yPos = 60;

  // Résumé IA (si disponible)
  if (aiSummary && aiSummary.trim()) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("📊 Résumé de l'Analyse", 14, yPos);
    yPos += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    // Découper le résumé en lignes
    const summaryLines = doc.splitTextToSize(aiSummary, 180);
    doc.text(summaryLines, 14, yPos);
    yPos += summaryLines.length * 5 + 8;

    // Ligne de séparation
    doc.setDrawColor(220, 220, 220);
    doc.line(14, yPos, 196, yPos);
    yPos += 8;
  }

  // Statistiques principales
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("💰 Statistiques Principales", 14, yPos);
  yPos += 2;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  yPos += 6;

  const mainStats = [
    ["Salaire Moyen", formatSalary(stats.mean)],
    ["Salaire Médian (typique)", formatSalary(stats.median)],
    ["Écart-type", formatSalary(stats.stdDev)],
    ["Minimum", formatSalary(stats.min)],
    ["Maximum", formatSalary(stats.max)],
    ["25% gagnent moins de", formatSalary(stats.quartiles.q1)],
    ["75% gagnent moins de", formatSalary(stats.quartiles.q3)],
  ];

  mainStats.forEach(([label, value]) => {
    doc.text(`${label} :`, 14, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(value, 100, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 5;
  });

  // Statistiques par expérience
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("📈 Salaires par Expérience", 14, yPos);
  yPos += 6;

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
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    styles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Liste des salaires (nouvelle page)
  doc.addPage();

  // Header de la nouvelle page
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("📋 Détail des Salaires", 14, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `${Math.min(50, salaries.length)} premiers salaires sur ${
      salaries.length
    } au total`,
    14,
    27
  );

  autoTable(doc, {
    startY: 32,
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
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  // Footer avec branding
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Ligne décorative
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.3);
    doc.line(
      14,
      doc.internal.pageSize.height - 15,
      196,
      doc.internal.pageSize.height - 15
    );

    // Texte footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Généré par OpenPay by Fox — Salaires Tech en toute transparence",
      14,
      doc.internal.pageSize.height - 8
    );

    // Numéro de page
    doc.setFont("helvetica", "bold");
    doc.text(
      `${i} / ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 8,
      { align: "right" }
    );
  }

  // Téléchargement
  const cleanTitle = jobTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `openpay_${cleanTitle}_${timestamp}.pdf`;
  doc.save(filename);
}
