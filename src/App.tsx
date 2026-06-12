import { Download, FileText, Moon, RotateCcw, Sun, Upload } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { AccordionSection } from "./components/AccordionSection";
import { NotesModal } from "./components/NotesModal";
import { documentsStructure } from "./data/documentsStructure";
import { useFormStore } from "./store/formStore";
import { exportToDocx } from "./utils/docxExport";
import { exportToPDF } from "./utils/pdfExport";

export default function App() {
  const {
    candidateName,
    setCandidateName,
    checkedItems,
    notes,
    darkMode,
    setDarkMode,
    loadBackup,
    reset,
  } = useFormStore();

  const [activeNote, setActiveNote] = useState<{
    id: string;
    label: string;
  } | null>(null);

  // Sincroniza classe do tema dark no documento
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Exportar Backup JSON
  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({ candidateName, checkedItems, notes }, null, 2),
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `inscricao_definitiva_${candidateName.toLowerCase().replace(/\s+/g, "_")}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar Backup JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const target = e.target;
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.candidateName || parsed.checkedItems || parsed.notes) {
          loadBackup(parsed);
          alert("Dados do formulário carregados com sucesso!");
        } else {
          alert("Arquivo JSON inválido ou incompatível.");
        }
      } catch {
        alert("Erro ao processar o arquivo JSON.");
      } finally {
        target.value = "";
      }
    };
  };

  return (
    <div className="app-container">
      {/* Container principal para o formulário */}
      <div className="printable-card" id="printable-form">
        <div className="toolbar-section">
          <div className="main-actions-group">
            <button
              type="button"
              className="toolbar-action-btn"
              onClick={() => exportToPDF(candidateName)}
            >
              <FileText size={14} /> PDF
            </button>
            <button
              type="button"
              className="toolbar-action-btn"
              onClick={() => exportToDocx(candidateName, checkedItems, notes)}
            >
              <FileText size={14} /> DOCX
            </button>
            <button
              type="button"
              className="toolbar-action-btn"
              onClick={handleExportJSON}
            >
              <Download size={14} /> Exportar JSON
            </button>

            <label className="toolbar-action-btn file-input-label">
              <Upload size={14} /> Abrir JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                style={{ display: "none" }}
              />
            </label>

            <button
              type="button"
              className="toolbar-action-btn reset-btn"
              onClick={() => {
                if (window.confirm("Limpar todas as marcações?")) reset();
              }}
              title="Limpar Formulário"
            >
              <RotateCcw size={14} /> Limpar
            </button>
          </div>

          <button
            type="button"
            className="theme-toggle-round-btn"
            onClick={toggleTheme}
            title="Alternar Tema"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="candidate-header">
          <input
            type="text"
            className="editable-candidate-input"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            title="Clique para editar o nome"
          />
        </div>

        <div className="sections-container">
          {documentsStructure.map((section) => (
            <AccordionSection
              key={section.id}
              section={section}
              onOpenNote={(id, label) => setActiveNote({ id, label })}
            />
          ))}
        </div>
      </div>

      {activeNote && (
        <NotesModal
          id={activeNote.id}
          label={activeNote.label}
          onClose={() => setActiveNote(null)}
        />
      )}
    </div>
  );
}
