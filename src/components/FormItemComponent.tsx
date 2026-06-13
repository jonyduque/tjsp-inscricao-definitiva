import { HelpCircle, SquarePen } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { DocumentItem } from "../data/documentsStructure";
import { useFormStore } from "../store/formStore";

interface FormItemComponentProps {
  /** O item de documento a ser renderizado */
  item: DocumentItem;
  /** Callback para abrir o modal de anotações */
  onOpenNote: (id: string, label: string) => void;
  /** Nível de aninhamento recursivo (usado para indentação) */
  level?: number;
}

/**
 * Componente FormItemComponent
 *
 * Renderiza recursivamente itens de checklist do formulário, gerenciando a seleção
 * e propagação de estado do checkbox personalizado, tooltips de links oficiais e
 * botões para anotações do item.
 */
export const FormItemComponent: React.FC<FormItemComponentProps> = ({
  item,
  onOpenNote,
  level = 0,
}) => {
  const { checkedItems, notes, toggleItem } = useFormStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isChecked = !!checkedItems[item.id];
  const hasNote = !!notes[item.id];

  const handleToggle = (e: React.MouseEvent) => {
    // Evita duplicar cliques se clicar em links ou botões de ação
    const target = e.target as HTMLElement;
    if (target.tagName === "A" || target.closest(".action-buttons-wrap")) {
      return;
    }
    toggleItem(item.id);
  };

  // Suporte à navegação por teclado (Enter ou Space para marcar/desmarcar)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleItem(item.id);
    }
  };

  // Fecha o tooltip ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`form-item-container level-${level}`}>
      {/* biome-ignore lint/a11y/useSemanticElements: custom checkbox row styling */}
      <div
        className={`form-item-row ${isChecked ? "item-checked" : ""} ${
          hasNote ? "item-has-note" : ""
        }`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="checkbox"
        aria-checked={isChecked}
        tabIndex={0}
      >
        <div className="item-checkbox-wrapper">
          <div
            className={`item-checkbox-indicator ${isChecked ? "checked" : ""}`}
          >
            {isChecked && <div className="checkbox-checkmark" />}
          </div>
          <span className="item-label-text">{item.label}</span>
          {hasNote && <span className="item-note-badge">Nota</span>}
        </div>

        <div className="action-buttons-wrap">
          {item.links && item.links.length > 0 && (
            <div className="link-tooltip-container" ref={tooltipRef}>
              <button
                type="button"
                className="link-tooltip-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
                aria-expanded={showTooltip}
                aria-label="Ver links do emissor oficial"
              >
                <HelpCircle size={12} />
                Links
              </button>
              {showTooltip && (
                <div className="link-tooltip-bubble" role="tooltip">
                  <strong>Emissor Oficial:</strong>
                  {item.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.text} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="item-action-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenNote(item.id, item.label);
            }}
            title="Anotar"
            aria-label={`Adicionar ou editar anotação para ${item.label}`}
          >
            <SquarePen size={13} />
          </button>
        </div>
      </div>

      {hasNote && <div className="print-only-note">Anotação: {notes[item.id]}</div>}

      {item.subItems && item.subItems.length > 0 && (
        <div className="sub-items-tree">
          {item.subItems.map((subItem) => (
            <FormItemComponent
              key={subItem.id}
              item={subItem}
              onOpenNote={onOpenNote}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
