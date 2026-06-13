// @ts-expect-error
import html2pdf from "html2pdf.js";

export const exportToPDF = (candidateName: string) => {
  const element = document.getElementById("printable-form");
  if (!element) return;

  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    document.documentElement.classList.remove("dark");
  }

  const cleanName = candidateName.trim().replace(/[\/:*?"<>|]/g, "").trim() || "Candidato";

  const opt = {
    margin: [15, 15, 15, 15],
    filename: `Inscricao-Definitiva-${cleanName.replace(/\s+/g, "-")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  const restoreDark = () => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  };

  html2pdf()
    .from(element)
    .set(opt)
    .save()
    .then(restoreDark)
    .catch((err: unknown) => {
      restoreDark();
      console.error(err);
    });
};
