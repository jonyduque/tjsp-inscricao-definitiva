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
  const { notes, setNote } = useFormStore();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sincroniza o estado interno do textarea com o valor atual no store ao abrir/mudar de item
  useEffect(() => {
    if (id) {
      setText(notes[id] || "");
      // Foca no textarea de forma programática para evitar o atributo autoFocus (a11y)
      // Usamos um pequeno timeout para garantir que o modal foi renderizado e posicionado
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [id, notes]);

  // Se nenhum ID for fornecido, o modal não é renderizado
  if (!id) return null;

  const handleSave = () => {
    setNote(id, text);
    onClose();
  };

  return (
    <div className="notes-modal-overlay">
      <div className="notes-modal">
        <div className="modal-header">
          <h4>Anotação: {label}</h4>
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
