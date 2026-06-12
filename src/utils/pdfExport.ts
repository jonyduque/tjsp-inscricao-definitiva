// @ts-expect-error
import html2pdf from "html2pdf.js";

export const exportToPDF = (candidateName: string) => {
  const element = document.getElementById("printable-form");
  if (!element) return;

  const opt = {
    margin: [15, 15, 15, 15],
    filename: `Inscricao-Definitiva-${candidateName.replace(/\s+/g, "-")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(element).set(opt).save();
};
