import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type DocumentItem,
  documentsStructure,
} from "../data/documentsStructure";

interface FormState {
  candidateName: string;
  checkedItems: Record<string, boolean>;
  notes: Record<string, string>;
  darkMode: boolean;

  setCandidateName: (name: string) => void;
  toggleItem: (id: string) => void;
  setNote: (id: string, note: string) => void;
  setDarkMode: (dark: boolean) => void;
  loadBackup: (data: {
    candidateName: string;
    checkedItems: Record<string, boolean>;
    notes: Record<string, string>;
  }) => void;
  reset: () => void;
}

// Mapas utilitários para busca rápida de relações pai-filho
const parentMap: Record<string, string> = {};
const childrenMap: Record<string, string[]> = {};
const itemMap: Record<string, DocumentItem> = {};

function traverse(item: DocumentItem, parentId?: string) {
  itemMap[item.id] = item;
  if (parentId) parentMap[item.id] = parentId;

  if (item.subItems && item.subItems.length > 0) {
    childrenMap[item.id] = item.subItems.map((child) => child.id);
    item.subItems.forEach((child) => {
      traverse(child, item.id);
    });
  }
}

// Popula os mapas utilitários a partir da estrutura
for (const section of documentsStructure) {
  for (const item of section.items) {
    traverse(item);
  }
}

// Funções auxiliares recursivas para propagação
const setCheckedRecursive = (
  id: string,
  value: boolean,
  checked: Record<string, boolean>,
) => {
  checked[id] = value;
  const children = childrenMap[id];
  if (children) {
    for (const childId of children) {
      setCheckedRecursive(childId, value, checked);
    }
  }
};

const updateParentsRecursive = (
  id: string,
  checked: Record<string, boolean>,
) => {
  const parentId = parentMap[id];
  if (!parentId) return;

  const siblingIds = childrenMap[parentId];
  const allChecked = siblingIds.every((siblingId) => !!checked[siblingId]);

  if (allChecked) {
    checked[parentId] = true;
  } else if (checked[parentId] === true) {
    checked[parentId] = false;
  }

  updateParentsRecursive(parentId, checked);
};

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      candidateName: "NOME DO CANDIDATO",
      checkedItems: {},
      notes: {},
      darkMode: false,

      setCandidateName: (name) => set({ candidateName: name }),

      toggleItem: (id) =>
        set((state) => {
          const checked = { ...state.checkedItems };
          const targetValue = !checked[id];

          // 1. Atualiza recursivamente para baixo (filhos)
          setCheckedRecursive(id, targetValue, checked);

          // 2. Atualiza recursivamente para cima (pais)
          updateParentsRecursive(id, checked);

          return { checkedItems: checked };
        }),

      setNote: (id, note) =>
        set((state) => {
          const notes = { ...state.notes };
          if (note.trim() === "") {
            delete notes[id];
          } else {
            notes[id] = note;
          }
          return { notes };
        }),

      setDarkMode: (dark) => set({ darkMode: dark }),

      loadBackup: (data) =>
        set({
          candidateName: data.candidateName || "NOME DO CANDIDATO",
          checkedItems: data.checkedItems || {},
          notes: data.notes || {},
        }),

      reset: () =>
        set({
          candidateName: "NOME DO CANDIDATO",
          checkedItems: {},
          notes: {},
        }),
    }),
    {
      name: "tjsp-inscricao-definitiva-storage",
    },
  ),
);
