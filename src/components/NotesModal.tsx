import { X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useFormStore } from "../store/formStore";

interface NotesModalProps {
  /** ID do item do documento associado à anotação */
  id: string | null;
  /** Rótulo/Nome amigável do item para exibição no cabeçalho */
  label: string;
  /** Função de callback acionada para fechar o modal */
  onClose: () => void;
}

/**
 * Componente NotesModal
 *
 * Permite ao usuário visualizar, editar e persistir notas de texto específicas para qualquer item
 * ou seção do formulário de forma isolada. Conecta-se diretamente ao Zustand store.
 */
export const NotesModal: React.FC<NotesModalProps> = ({
  id,
  label,
  onClose,
}) => {
  const { setNote } = useFormStore();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sincroniza o estado interno do textarea com o valor atual no store ao abrir/mudar de item
  useEffect(() => {
    if (id) {
      const initialValue = useFormStore.getState().notes[id] || "";
      setText(initialValue);
      // Foca no textarea de forma programática para evitar o atributo autoFocus (a11y)
      // Usamos um pequeno timeout para garantir que o modal foi renderizado e posicionado
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [id]);

  // Fecha o modal ao pressionar a tecla Escape
  useEffect(() => {
    if (!id) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, onClose]);

  // Se nenhum ID for fornecido, o modal não é renderizado
  if (!id) return null;

  const handleSave = () => {
    setNote(id, text);
    onClose();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click is mouse-only convenience
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape key handles keyboard close
    <div
      className="notes-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="notes-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h4 id="modal-title">Anotação: {label}</h4>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>
        <textarea
          ref={textareaRef}
          className="notes-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva suas anotações aqui (protocolos, pendências, etc.)..."
          aria-label={`Editar anotação para ${label}`}
        />
        <div className="modal-actions">
          <button type="button" className="modal-btn cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="modal-btn save" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
