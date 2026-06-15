import { ChevronDown, SquarePen } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import type { DocumentItem, DocumentSection } from "../data/documentsStructure";
import { useFormStore } from "../store/formStore";
import { FormItemComponent } from "./FormItemComponent";

// Conta recursivamente os itens marcados
const countChecked = (
  items: DocumentItem[],
  checkedItems: Record<string, boolean>,
): number => {
  let count = 0;
  for (const item of items) {
    if (checkedItems[item.id]) {
      count++;
    }
    if (item.subItems) {
      count += countChecked(item.subItems, checkedItems);
    }
  }
  return count;
};

// Conta recursivamente o total de itens
const countTotal = (items: DocumentItem[]): number => {
  let count = 0;
  for (const item of items) {
    count++;
    if (item.subItems) {
      count += countTotal(item.subItems);
    }
  }
  return count;
};

interface AccordionSectionProps {
  /** A seção do documento a ser exibida */
  section: DocumentSection;
  /** Callback para abrir o modal de anotações */
  onOpenNote: (id: string, label: string) => void;
}

/**
 * Componente AccordionSection
 *
 * Exibe uma seção inteira de documentos de forma colapsável, mostrando o título da
 * seção, um contador dinâmico (itens marcados / total de itens incluindo subitens)
 * e controles para anotações da seção.
 */
export const AccordionSection: React.FC<AccordionSectionProps> = ({
  section,
  onOpenNote,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { checkedItems, notes } = useFormStore();

  const total = useMemo(() => countTotal(section.items), [section.items]);
  const checked = useMemo(
    () => countChecked(section.items, checkedItems),
    [section.items, checkedItems],
  );
  const hasSectionNote = !!notes[section.id];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={`accordion-section ${isOpen ? "open" : "collapsed"} ${
        checked === total && total > 0 ? "section-checked-state" : ""
      }`}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: custom accordion header trigger */}
      <div
        className="accordion-header"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`sect-content-${section.id}`}
      >
        <h3 className="accordion-title">
          {section.title}
          <span className="accordion-counter">
            ({checked}/{total})
          </span>
          {hasSectionNote && (
            <button
              type="button"
              className="item-note-link-btn font-sans"
              onClick={(e) => {
                e.stopPropagation();
                onOpenNote(section.id, `Seção ${section.title}`);
              }}
              title={`Ver nota: ${notes[section.id]}`}
              aria-label={`Visualizar anotação da seção ${section.title}`}
            >
              <span className="note-label-prefix">Nota: </span>
              <span className="note-label-content">{notes[section.id]}</span>
            </button>
          )}
        </h3>
        <div className="accordion-controls">
          <button
            type="button"
            className="item-action-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenNote(section.id, `Seção ${section.title}`);
            }}
            title="Anotar na Seção"
            aria-label={`Adicionar ou editar anotação para Seção ${section.title}`}
          >
            <SquarePen size={14} />
          </button>
          <ChevronDown className="accordion-arrow-icon" size={16} />
        </div>
      </div>

      {hasSectionNote && (
        <div className="print-only-note">
          Anotação Seção: {notes[section.id]}
        </div>
      )}

      <div
        className="accordion-content"
        id={`sect-content-${section.id}`}
        hidden={!isOpen}
      >
        {section.items.map((item) => (
          <FormItemComponent
            key={item.id}
            item={item}
            onOpenNote={onOpenNote}
          />
        ))}
      </div>
    </div>
  );
};
