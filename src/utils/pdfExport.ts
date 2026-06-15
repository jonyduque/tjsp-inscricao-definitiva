// @ts-expect-error
import html2pdf from "html2pdf.js";

export const exportToPDF = (candidateName: string) => {
  const element = document.getElementById("printable-form");
  if (!element) return;

  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    document.documentElement.classList.remove("dark");
  }

  const hasHideChecked = element.classList.contains("hide-checked-active");
  if (hasHideChecked) {
    element.classList.remove("hide-checked-active");
  }

  const cleanName =
    candidateName
      .trim()
      .replace(/[/:*?"<>|]/g, "")
      .trim() || "Candidato";

  const opt = {
    margin: [15, 15, 15, 15],
    filename: `Inscricao-Definitiva-${cleanName.replace(/\s+/g, "-")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  const restoreState = () => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
    if (hasHideChecked) {
      element.classList.add("hide-checked-active");
    }
  };

  html2pdf()
    .from(element)
    .set(opt)
    .save()
    .then(restoreState)
    .catch((err: unknown) => {
      restoreState();
      console.error(err);
    });
};
