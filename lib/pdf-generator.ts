"use client";

import jsPDF from "jspdf";
import { APP_NAME, CONTACT } from "./constants";

interface MotoData {
  name: string;
  reference: string;
  currency?: string;
  brand?: { name: string };
  thumbnail?: string;
  specifications?: Array<{ label: string; value: string; unit?: string }>;
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const ORANGE: [number, number, number] = [244, 152, 28];
const DARK: [number, number, number] = [30, 30, 30];
const LIGHT_GRAY: [number, number, number] = [248, 248, 248];
const WHITE: [number, number, number] = [255, 255, 255];
const BORDER: [number, number, number] = [210, 210, 210];

function drawTableHeader(doc: jsPDF, y: number, margin: number, tableW: number, labelW: number, locale: string): void {
  doc.setFillColor(...ORANGE);
  doc.rect(margin, y, tableW, 9, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(locale === "fr" ? "Spécification" : "Specification", margin + 4, y + 6.5);
  doc.text(locale === "fr" ? "Détail" : "Detail", margin + labelW + 4, y + 6.5);
}

export async function generateProductPDF(moto: MotoData, locale: "fr" | "en" = "fr"): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const tableW = pageWidth - margin * 2;
  const labelW = tableW * 0.38;
  const valueW = tableW - labelW;
  const rowH = 9;
  const footerH = 10;
  const maxY = pageHeight - footerH - 5;
  let y = margin;

  const drawFooter = () => {
    doc.setFillColor(...ORANGE);
    doc.rect(0, pageHeight - footerH, pageWidth, footerH, "F");
    doc.setTextColor(...DARK);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`${APP_NAME}  •  ${CONTACT.address}  •  ${CONTACT.phone}`, pageWidth / 2, pageHeight - 3.5, { align: "center" });
  };

  // ── EN-TÊTE : marque à gauche, image à droite ─────────────────
  const imgBase64 = moto.thumbnail ? await loadImageAsBase64(moto.thumbnail) : null;
  const imgW = 90;
  const imgH = 65;
  const imgX = pageWidth - margin - imgW;

  // Nom de marque / app (haut gauche)
  doc.setTextColor(...ORANGE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text((moto.brand?.name || APP_NAME).toUpperCase(), margin, y + 10);

  // Image (haut droite)
  if (imgBase64) {
    doc.addImage(imgBase64, "JPEG", imgX, y, imgW, imgH, undefined, "FAST");
  }

  y += imgH + 6;

  // ── TITRE ─────────────────────────────────────────────────────
  doc.setTextColor(...DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${locale === "fr" ? "Fiche Technique" : "Technical Sheet"} - ${moto.name}`,
    margin, y
  );
  y += 6;
  doc.setFontSize(10);
  doc.text(locale === "fr" ? "Spécifications Techniques" : "Technical Specifications", margin, y);
  y += 8;

  // ── TABLEAU UNE SEULE COLONNE PLEINE LARGEUR ──────────────────
  const specs = moto.specifications || [];

  drawTableHeader(doc, y, margin, tableW, labelW, locale);
  y += 9;

  for (let i = 0; i < specs.length; i++) {
    // calcul de la hauteur nécessaire (le texte peut être long)
    const spec = specs[i];
    const valLines = doc.splitTextToSize(
      `${spec.value}${spec.unit ? " " + spec.unit : ""}`,
      valueW - 6
    );
    const neededH = Math.max(rowH, valLines.length * 5 + 4);

    if (y + neededH > maxY) {
      drawFooter();
      doc.addPage();
      y = margin;
      drawTableHeader(doc, y, margin, tableW, labelW, locale);
      y += 9;
    }

    // fond alterné
    const even = i % 2 === 0;
    doc.setFillColor(...(even ? LIGHT_GRAY : WHITE));
    doc.rect(margin, y, tableW, neededH, "F");

    // bordures
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.rect(margin, y, tableW, neededH);
    doc.line(margin + labelW, y, margin + labelW, y + neededH);

    // texte Spécification (gauche)
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(spec.label, margin + 4, y + neededH / 2 + 3.5);

    // texte Détail (droite)
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(valLines, margin + labelW + 4, y + (neededH - valLines.length * 5) / 2 + 5);

    y += neededH;
  }

  drawFooter();
  doc.save(`fiche-${moto.reference}.pdf`);
}
