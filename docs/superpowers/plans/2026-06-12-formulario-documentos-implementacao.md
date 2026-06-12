# Formulário de Inscrição Definitiva TJSP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar um formulário interativo em React com Vite para preenchimento de documentos da Inscrição Definitiva do TJSP, com controle recursivo de checkboxes, modal de anotações, alternância de tema, exportação para PDF/DOCX/JSON, persistência local e estilo visual refinado "Tribunal Classy".

**Architecture:** O formulário separa os dados do usuário (checkboxes ativos e notas textuais) da estrutura de documentos utilizando Zustand com middleware de persistência no `localStorage`. Os checkboxes propagam estados recursivamente (bidirecional). Componentes modulares renderizam a árvore com suporte a temas e visual amigável para impressão.

**Tech Stack:** React 19, TypeScript, Vite, Zustand (estado e persistência), Vitest (testes de store), Lucide React (ícones), html2pdf.js (exportação PDF) e docx (geração de DOCX).

---

### Task 1: Inicialização do Projeto e Configurações

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.tsx`
- Create: `src/index.html`
- Create: `src/index.css`
- Modify: `.gitignore`

- [x] **Passo 1: Criar o arquivo package.json com as dependências**

```json
{
  "name": "tjsp-inscricao-definitiva",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.3",
    "lucide-react": "^0.475.0",
    "docx": "^9.1.1",
    "html2pdf.js": "^0.10.2"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.1.0",
    "vitest": "^3.0.5"
  }
}
```

- [x] **Passo 2: Criar vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
```

- [x] **Passo 3: Criar tsconfig.json básico**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [x] **Passo 4: Criar src/index.html na raiz do projeto**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inscrição Definitiva - TJSP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [x] **Passo 5: Criar src/index.css com variáveis "Tribunal Classy"**

```css
:root {
  --bg-body: #fdfcfb;
  --bg-paper: #ffffff;
  --text-primary: #2c2b29;
  --text-muted: #6b6a67;
  --primary-gold: #b38e5d;
  --primary-gold-hover: #967449;
  --border-color: #e5e0d8;
  --bg-hover: rgba(179, 142, 93, 0.03);
}

:root.dark {
  --bg-body: #121214;
  --bg-paper: #1c1c1f;
  --text-primary: #e3e1dd;
  --text-muted: #a1a09d;
  --primary-gold: #c5a880;
  --primary-gold-hover: #b38e5d;
  --border-color: #38373b;
  --bg-hover: rgba(179, 142, 93, 0.06);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-body);
  color: var(--text-primary);
  font-family: 'Georgia', serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#root {
  min-height: 100vh;
}
```

- [x] **Passo 6: Instalar as dependências**

Execute: `npm install`
Expected: Instalação sem erros.

- [x] **Passo 7: Commit**

```bash
git add package.json vite.config.ts tsconfig.json src/index.html src/index.css
git commit -m "chore: initialize project config and theme styles"
```

---

### Task 2: Modelo de Dados Estático do Formulário

**Files:**
- Create: `src/data/documentsStructure.ts`

- [ ] **Passo 1: Criar o modelo TypeScript e os dados estáticos baseados em Lista de documentos.md**

```typescript
export interface DocumentLink {
  text: string;
  url: string;
}

export interface DocumentItem {
  id: string;
  label: string;
  links?: DocumentLink[];
  subItems?: DocumentItem[];
}

export interface DocumentSection {
  id: string;
  title: string;
  items: DocumentItem[];
}

export const documentsStructure: DocumentSection[] = [
  {
    id: "documentos",
    title: "Documentos",
    items: [
      { id: "doc-fotos", label: "2 fotos 3x4, iguais e recentes" },
      { id: "doc-diploma", label: "Diploma em Direito registrado pelo MEC" },
      { id: "doc-rg", label: "Documento de identidade/RG" }
    ]
  },
  {
    id: "certidoes",
    title: "Certidões",
    items: [
      {
        id: "cert-nascimento",
        label: "Certidão atualizada de nascimento ou de casamento",
        links: [{ text: "CRC Registro Civil", url: "https://home.registrocivil.org.br/" }]
      },
      {
        id: "cert-cpf",
        label: "Situação no CPF",
        links: [{ text: "Receita Federal", url: "https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp" }]
      },
      {
        id: "cert-militar",
        label: "Quitação do serviço militar",
        links: [{ text: "Forças Armadas", url: "https://alistamento.eb.mil.br/lista-servicos" }]
      },
      {
        id: "cert-eleitor",
        label: "Título de eleitor e certidão de quitação eleitoral",
        links: [{ text: "TSE Autoatendimento", url: "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral" }]
      },
      {
        id: "cert-crimes-eleitorais",
        label: "Certidão negativa de crimes eleitorais",
        links: [{ text: "TSE Autoatendimento", url: "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral" }]
      },
      {
        id: "cert-residencias-trabalho",
        label: "Certidões dos locais de residência ou trabalho dos últimos 5 anos",
        subItems: [
          {
            id: "cert-protestos",
            label: "Cartórios de protestos",
            links: [
              { text: "CENPROT-SP", url: "https://protestosp.com.br/certidao-de-protesto" },
              { text: "CENPROT-Outros Estados", url: "https://www.pesquisaprotesto.com.br/" }
            ]
          },
          {
            id: "cert-federal",
            label: "Federal (Cível e Criminal)",
            links: [{ text: "CJF Certidão Unificada", url: "https://certidao-unificada.cjf.jus.br/#/solicitacao-certidao" }],
            subItems: [
              { id: "cert-fed-civel", label: "Cível (comum e fiscal)" },
              { id: "cert-fed-criminal", label: "Criminal" }
            ]
          },
          {
            id: "cert-estadual-tjsp",
            label: "Estadual (TJSP)",
            links: [
              { text: "TJSP-SAJ", url: "https://esaj.tjsp.jus.br/sco/abrirCadastro.do?servico=810101" },
              { text: "TJSP-eproc", url: "https://certidoes.tjsp.jus.br/" }
            ],
            subItems: [
              { id: "cert-est-civel", label: "Cível (comum e fiscal)" },
              { id: "cert-est-exec-crim", label: "Execuções criminais" },
              { id: "cert-est-criminal", label: "Criminal" }
            ]
          },
          {
            id: "cert-militar-federal-estadual",
            label: "Militar Federal e Estadual - Criminal",
            links: [
              { text: "TJMSP", url: "https://certidoes.tjmsp.jus.br/#/" },
              { text: "STM", url: "https://stm.jus.br/servicos-ao-cidadao/atendimentoaocidadao/certidao-negativa" }
            ]
          },
          {
            id: "cert-antecedentes",
            label: "Antecedentes criminais, Polícias Federal e Estadual",
            links: [
              { text: "SSP/SP", url: "https://www2.ssp.sp.gov.br/aacweb/carrega-iframe" },
              { text: "Polícia Federal", url: "https://www.gov.br/pt-br/servicos/emitir-certidao-de-antecedentes-criminais" }
            ]
          }
        ]
      },
      {
        id: "cert-oab",
        label: "Certidão da OAB",
        links: [{ text: "OAB/SP Serviços", url: "https://www2.oabsp.org.br/asp/dotnet/Index/Servicos/Advocacia?page=4" }]
      },
      {
        id: "cert-inexistencia-penalidade",
        label: "Certidão de inexistência de penalidade disciplinar OU da natureza de eventual procedimento disciplinar findo ou em andamento"
      }
    ]
  },
  {
    id: "informacoes",
    title: "Informações",
    items: [
      {
        id: "info-formulario-comissao",
        label: "Formulário (fornecido pela Comissão)",
        subItems: [
          { id: "info-form-a", label: "a) Locais de seu domicílio e residência, desde os 18 anos" },
          { id: "info-form-b1", label: "b1) Escolas em que estudou" },
          { id: "info-form-b2", label: "b2) Cargos, funções e atividades jurídicas, públicos ou privados, lucrativos ou não, desempenhados desde então, aí abrangidos os de natureza política" },
          { id: "info-form-c", label: "c) Membros da Magistratura e do Ministério Público com ou para os quais tenha atuado" },
          { id: "info-form-d", label: "d) Qualificação completa e referências de cônjuge ou companheiro" }
        ]
      },
      { id: "info-titulos", label: "Títulos" },
      { id: "info-curriculo", label: "Currículo completo profissional e acadêmico a partir dos 18 anos" },
      { id: "info-referencias", label: "Referências (nomes, endereços e cargos) - Poder Judiciário, Ministério Público, magistério jurídico superior e advocacia" },
      { id: "info-declaracao-firma", label: "Declaração, com firma reconhecida - Inexistência de indiciamento, IP, TC ou processo criminal OU notícia específica da ocorrência com esclarecimentos" }
    ]
  },
  {
    id: "atividade-juridica",
    title: "Atividade Jurídica",
    items: [
      {
        id: "ativ-formulario-comissao",
        label: "Formulário (fornecido pela Comissão)",
        subItems: [
          { id: "ativ-form-atividades", label: "atividades jurídicas desempenhadas (períodos e locais de sua prestação)" },
          { id: "ativ-form-autoridades", label: "principais autoridades com quem haja atuado em cada período" }
        ]
      },
      { id: "ativ-certidao-declaracao", label: "Certidão ou declaração da atividade jurídica" },
      {
        id: "ativ-atividades-exercidas",
        label: "Atividade jurídica reconhecida",
        subItems: [
          { id: "ativ-exclusiva-bacharel", label: "Aquela exercida com exclusividade por bacharel em Direito" },
          {
            id: "ativ-advocacia-atos",
            label: "Advocacia - participação anual mínima em 5 atos privativos de advogados em causas ou questões distintas",
            links: [{ text: "TJSP-eproc", url: "https://certidoes.tjsp.jus.br/" }]
          },
          {
            id: "ativ-cargos-conhecimento",
            label: "Cargos, empregos ou funções com utilização preponderante de conhecimento jurídico",
            subItems: [
              { id: "ativ-cargos-certidao", label: "Certidão circunstanciada do órgão competente (atribuições e prática de atos)" }
            ]
          },
          { id: "ativ-conciliador", label: "Conciliador(a) perante Poder Judiciário (mínimo por 16 horas mensais e durante 1 ano)" },
          { id: "ativ-mediacao", label: "Mediação ou arbitragem" },
          { id: "ativ-pos-graduacao", label: "Pós-graduação com início antes da entrada em vigor da Res. CNJ 75 de 12/5/2009" }
        ]
      }
    ]
  }
];
```

- [ ] **Passo 2: Commit**

```bash
git add src/data/documentsStructure.ts
git commit -m "feat: define static documents hierarchy and structure"
```

---

### Task 3: Gerenciamento de Estado Zustand com Testes Unitários (TDD)

**Files:**
- Create: `src/store/formStore.ts`
- Create: `src/store/__tests__/formStore.test.ts`

- [ ] **Passo 1: Escrever os testes do Zustand Store (`formStore.test.ts`)**
O teste deve verificar:
1. Marcação simples de item.
2. Marcação recursiva de pai para filhos.
3. Marcação recursiva de filhos para pai (se todos checados, pai fica checado; se um filho for desmarcado, pai fica desmarcado).
4. Persistência de anotações.
5. Edição do nome do candidato.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from '../formStore';

describe('useFormStore', () => {
  beforeEach(() => {
    const store = useFormStore.getState();
    store.reset();
  });

  it('deve atualizar o nome do candidato', () => {
    const store = useFormStore.getState();
    store.setCandidateName('Dr. Roberto Silva');
    expect(useFormStore.getState().candidateName).toBe('Dr. Roberto Silva');
  });

  it('deve marcar/desmarcar item sem filhos', () => {
    const store = useFormStore.getState();
    store.toggleItem('doc-fotos');
    expect(useFormStore.getState().checkedItems['doc-fotos']).toBe(true);

    store.toggleItem('doc-fotos');
    expect(useFormStore.getState().checkedItems['doc-fotos']).toBe(false);
  });

  it('deve marcar todos os filhos ao marcar o pai', () => {
    const store = useFormStore.getState();
    store.toggleItem('cert-federal');
    expect(useFormStore.getState().checkedItems['cert-fed-civel']).toBe(true);
    expect(useFormStore.getState().checkedItems['cert-fed-criminal']).toBe(true);
  });

  it('deve marcar o pai se todos os filhos forem marcados individualmente', () => {
    const store = useFormStore.getState();
    store.toggleItem('cert-fed-civel');
    expect(useFormStore.getState().checkedItems['cert-federal']).toBe(undefined);

    store.toggleItem('cert-fed-criminal');
    expect(useFormStore.getState().checkedItems['cert-federal']).toBe(true);
  });

  it('deve desmarcar o pai se um dos filhos for desmarcado', () => {
    const store = useFormStore.getState();
    store.toggleItem('cert-federal');
    expect(useFormStore.getState().checkedItems['cert-federal']).toBe(true);

    store.toggleItem('cert-fed-civel');
    expect(useFormStore.getState().checkedItems['cert-federal']).toBe(false);
  });

  it('deve salvar e remover anotações', () => {
    const store = useFormStore.getState();
    store.setNote('doc-fotos', 'Fotos retiradas em 10/06');
    expect(useFormStore.getState().notes['doc-fotos']).toBe('Fotos retiradas em 10/06');

    store.setNote('doc-fotos', '');
    expect(useFormStore.getState().notes['doc-fotos']).toBe(undefined);
  });
});
```

- [ ] **Passo 2: Implementar o Zustand Store (`formStore.ts`) para passar nos testes**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { documentsStructure, DocumentItem } from '../data/documentsStructure';

interface FormState {
  candidateName: string;
  checkedItems: Record<string, boolean>;
  notes: Record<string, string>;
  darkMode: boolean;
  
  setCandidateName: (name: string) => void;
  toggleItem: (id: string) => void;
  setNote: (id: string, note: string) => void;
  setDarkMode: (dark: boolean) => void;
  loadBackup: (data: { candidateName: string; checkedItems: Record<string, boolean>; notes: Record<string, string> }) => void;
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
    childrenMap[item.id] = item.subItems.map(child => child.id);
    item.subItems.forEach(child => traverse(child, item.id));
  }
}

// Popula os mapas utilitários a partir da estrutura
documentsStructure.forEach(section => {
  section.items.forEach(item => traverse(item));
});

// Funções auxiliares recursivas para propagação
const setCheckedRecursive = (id: string, value: boolean, checked: Record<string, boolean>) => {
  checked[id] = value;
  const children = childrenMap[id];
  if (children) {
    children.forEach(childId => setCheckedRecursive(childId, value, checked));
  }
};

const updateParentsRecursive = (id: string, checked: Record<string, boolean>) => {
  const parentId = parentMap[id];
  if (!parentId) return;

  const siblingIds = childrenMap[parentId];
  const allChecked = siblingIds.every(siblingId => !!checked[siblingId]);
  
  checked[parentId] = allChecked;
  updateParentsRecursive(parentId, checked);
};

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      candidateName: 'NOME DO CANDIDATO',
      checkedItems: {},
      notes: {},
      darkMode: false,

      setCandidateName: (name) => set({ candidateName: name }),

      toggleItem: (id) => set((state) => {
        const checked = { ...state.checkedItems };
        const targetValue = !checked[id];
        
        // 1. Atualiza recursivamente para baixo (filhos)
        setCheckedRecursive(id, targetValue, checked);
        
        // 2. Atualiza recursivamente para cima (pais)
        updateParentsRecursive(id, checked);

        return { checkedItems: checked };
      }),

      setNote: (id, note) => set((state) => {
        const notes = { ...state.notes };
        if (note.trim() === '') {
          delete notes[id];
        } else {
          notes[id] = note;
        }
        return { notes };
      }),

      setDarkMode: (dark) => set({ darkMode: dark }),

      loadBackup: (data) => set({
        candidateName: data.candidateName || 'NOME DO CANDIDATO',
        checkedItems: data.checkedItems || {},
        notes: data.notes || {},
      }),

      reset: () => set({
        candidateName: 'NOME DO CANDIDATO',
        checkedItems: {},
        notes: {},
      }),
    }),
    {
      name: 'tjsp-inscricao-definitiva-storage',
    }
  )
);
```

- [ ] **Passo 3: Executar os testes**

Execute: `npx vitest run`
Expected: Todos os testes passam (PASS).

- [ ] **Passo 4: Commit**

```bash
git add src/store/formStore.ts src/store/__tests__/formStore.test.ts
git commit -m "feat: implement Zustand store with recursive check logic and pass unit tests"
```

---

### Task 4: Componente de Notas (Modal) e Estruturas de Casca

**Files:**
- Create: `src/components/NotesModal.tsx`

- [ ] **Passo 1: Criar o componente NotesModal**
O modal deve abrir quando selecionado, preencher o textarea com a nota correspondente ao ID do elemento e ter opções de Salvar e Cancelar.

```tsx
import React, { useState, useEffect } from 'react';
import { useFormStore } from '../store/formStore';
import { X } from 'lucide-react';

interface NotesModalProps {
  id: string | null;
  label: string;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ id, label, onClose }) => {
  const { notes, setNote } = useFormStore();
  const [text, setText] = useState('');

  useEffect(() => {
    if (id) {
      setText(notes[id] || '');
    }
  }, [id, notes]);

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
          <button className="close-btn" onClick={onClose} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
        <textarea
          className="notes-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva suas anotações aqui (protocolos, pendências, etc.)..."
          autoFocus
        />
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-btn save" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
```

Adicione no `src/index.css` a estilização correspondente ao modal:

```css
.notes-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.notes-modal {
  background-color: var(--bg-paper);
  border: 1.5px solid var(--primary-gold);
  border-radius: 6px;
  width: 90%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.modal-header h4 {
  font-size: 1.1rem;
  color: var(--primary-gold);
  font-weight: normal;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
}

.notes-textarea {
  width: 100%;
  height: 140px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.8rem;
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
  resize: vertical;
  background-color: transparent;
  color: var(--text-primary);
  margin-bottom: 1.2rem;
}

.notes-textarea:focus {
  outline: none;
  border-color: var(--primary-gold);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  font-family: system-ui, sans-serif;
  transition: all 0.2s;
}

.modal-btn.cancel {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
}

.modal-btn.cancel:hover {
  background-color: var(--bg-hover);
}

.modal-btn.save {
  background: var(--primary-gold);
  border: 1px solid var(--primary-gold);
  color: white;
}

.modal-btn.save:hover {
  background: var(--primary-gold-hover);
}
```

- [ ] **Passo 2: Commit**

```bash
git add src/components/NotesModal.tsx src/index.css
git commit -m "feat: create notes modal component and associated CSS"
```

---

### Task 5: Componentes do Formulário (Item e Accordion)

**Files:**
- Create: `src/components/FormItemComponent.tsx`
- Create: `src/components/AccordionSection.tsx`

- [ ] **Passo 1: Criar o componente FormItemComponent**
O componente renderiza recursivamente os itens e subitens. Lida com o estilo riscado/itálico, botão de anotações e tooltip de links.

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { DocumentItem } from '../data/documentsStructure';
import { useFormStore } from '../store/formStore';
import { HelpCircle, SquarePen } from 'lucide-react';

interface FormItemComponentProps {
  item: DocumentItem;
  onOpenNote: (id: string, label: string) => void;
  level?: number;
}

export const FormItemComponent: React.FC<FormItemComponentProps> = ({ item, onOpenNote, level = 0 }) => {
  const { checkedItems, notes, toggleItem } = useFormStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isChecked = !!checkedItems[item.id];
  const hasNote = !!notes[item.id];

  const handleToggle = (e: React.MouseEvent) => {
    // Evita duplicar cliques se clicar na label que já dispara o onChange
    if ((e.target as HTMLElement).tagName === 'A' || (e.target as HTMLElement).closest('.action-buttons-wrap')) {
      return;
    }
    toggleItem(item.id);
  };

  // Fecha tooltip ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`form-item-container level-${level}`}>
      <div 
        className={`form-item-row ${isChecked ? 'item-checked' : ''} ${hasNote ? 'item-has-note' : ''}`}
        onClick={handleToggle}
      >
        <div className="item-checkbox-wrapper">
          <div className={`item-checkbox-indicator ${isChecked ? 'checked' : ''}`}>
            {isChecked && <div className="checkbox-checkmark" />}
          </div>
          <span className="item-label-text">{item.label}</span>
          {hasNote && <span className="item-note-badge">Nota</span>}
        </div>

        <div className="action-buttons-wrap">
          {item.links && item.links.length > 0 && (
            <div className="link-tooltip-container" ref={tooltipRef}>
              <button 
                className="link-tooltip-trigger" 
                onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
              >
                <HelpCircle size={12} />
                Links
              </button>
              {showTooltip && (
                <div className="link-tooltip-bubble">
                  <strong>Emissor Oficial:</strong>
                  {item.links.map((link, idx) => (
                    <a 
                      key={idx} 
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
            className="item-action-icon-btn" 
            onClick={(e) => { e.stopPropagation(); onOpenNote(item.id, item.label); }}
            title="Anotar"
          >
            <SquarePen size={13} />
          </button>
        </div>
      </div>

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
```

- [ ] **Passo 2: Criar o componente AccordionSection**

```tsx
import React, { useState } from 'react';
import { DocumentSection } from '../data/documentsStructure';
import { FormItemComponent } from './FormItemComponent';
import { useFormStore } from '../store/formStore';
import { ChevronDown, SquarePen } from 'lucide-react';

interface AccordionSectionProps {
  section: DocumentSection;
  onOpenNote: (id: string, label: string) => void;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ section, onOpenNote }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { checkedItems, notes } = useFormStore();

  const countChecked = (items: any[]): number => {
    let count = 0;
    items.forEach(item => {
      if (checkedItems[item.id]) count++;
      if (item.subItems) count += countChecked(item.subItems);
    });
    return count;
  };

  const countTotal = (items: any[]): number => {
    let count = 0;
    items.forEach(item => {
      count++;
      if (item.subItems) count += countTotal(item.subItems);
    });
    return count;
  };

  const total = countTotal(section.items);
  const checked = countChecked(section.items);
  const hasSectionNote = !!notes[section.id];

  return (
    <div className={`accordion-section ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="accordion-title">
          {section.title}
          <span className="accordion-counter">({checked}/{total})</span>
          {hasSectionNote && <span className="item-note-badge font-sans">Nota</span>}
        </h3>
        <div className="accordion-controls">
          <button 
            className="item-action-icon-btn" 
            onClick={(e) => { e.stopPropagation(); onOpenNote(section.id, `Seção ${section.title}`); }}
            title="Anotar na Seção"
          >
            <SquarePen size={14} />
          </button>
          <ChevronDown className="accordion-arrow-icon" size={16} />
        </div>
      </div>
      
      {isOpen && (
        <div className="accordion-content">
          {section.items.map((item) => (
            <FormItemComponent 
              key={item.id} 
              item={item} 
              onOpenNote={onOpenNote} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

Adicione o CSS para os itens e accordions no `src/index.css`:

```css
/* Estilo Accordion */
.accordion-section {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 1rem;
  background-color: var(--bg-paper);
  overflow: hidden;
}

.accordion-header {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: rgba(179, 142, 93, 0.02);
  user-select: none;
}

.accordion-header:hover {
  background-color: var(--bg-hover);
}

.accordion-title {
  font-size: 1.15rem;
  color: var(--primary-gold);
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.accordion-counter {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: system-ui, sans-serif;
}

.accordion-controls {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.accordion-arrow-icon {
  color: var(--primary-gold);
  transition: transform 0.2s ease;
}

.accordion-section.collapsed .accordion-arrow-icon {
  transform: rotate(-90deg);
}

.accordion-content {
  border-top: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
}

/* Árvore de Itens */
.form-item-container {
  display: flex;
  flex-direction: column;
}

.form-item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid rgba(179, 142, 93, 0.05);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.form-item-row:hover {
  background-color: var(--bg-hover);
}

.item-checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  flex: 1;
}

.item-checkbox-indicator {
  width: 17px;
  height: 17px;
  border: 1.5px solid var(--primary-gold);
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 3px;
  flex-shrink: 0;
}

.item-checkbox-indicator.checked {
  background-color: var(--primary-gold);
}

.checkbox-checkmark {
  width: 3.5px;
  height: 7px;
  border: solid white;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg) translate(-0.5px, -0.5px);
}

.item-label-text {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--text-primary);
}

.form-item-row.item-checked .item-label-text {
  text-decoration: line-through;
  font-style: italic;
  opacity: 0.55;
}

.action-buttons-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.item-action-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-gold);
  padding: 4px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  opacity: 0.7;
}

.item-action-icon-btn:hover {
  opacity: 1;
  background-color: rgba(179, 142, 93, 0.1);
}

.item-note-badge {
  font-size: 0.7rem;
  font-weight: bold;
  background-color: rgba(179, 142, 93, 0.15);
  color: var(--primary-gold);
  padding: 1px 5px;
  border-radius: 10px;
  align-self: center;
}

.sub-items-tree {
  padding-left: 1.5rem;
  border-left: 1px dotted var(--primary-gold);
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

/* Tooltip */
.link-tooltip-container {
  position: relative;
  display: inline-block;
}

.link-tooltip-trigger {
  background: rgba(179, 142, 93, 0.08);
  border: 1px solid rgba(179, 142, 93, 0.25);
  color: var(--primary-gold);
  font-family: system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.link-tooltip-trigger:hover {
  background-color: var(--primary-gold);
  color: white;
}

.link-tooltip-bubble {
  width: 220px;
  background-color: var(--bg-paper);
  border: 1px solid var(--primary-gold);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
}

.link-tooltip-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--primary-gold) transparent transparent transparent;
}

.link-tooltip-bubble strong {
  display: block;
  margin-bottom: 4px;
  color: var(--primary-gold);
}

.link-tooltip-bubble a {
  display: block;
  color: var(--primary-gold);
  text-decoration: none;
  padding: 4px 0;
  border-bottom: 1px solid rgba(179, 142, 93, 0.08);
}

.link-tooltip-bubble a:last-child {
  border-bottom: none;
}

.link-tooltip-bubble a:hover {
  text-decoration: underline;
}
```

- [ ] **Passo 3: Commit**

```bash
git add src/components/FormItemComponent.tsx src/components/AccordionSection.tsx src/index.css
git commit -m "feat: implement FormItemComponent with custom checkbox and tooltip, and AccordionSection"
```

---

### Task 6: Exportação de Arquivos (PDF, DOCX, JSON)

**Files:**
- Create: `src/utils/pdfExport.ts`
- Create: `src/utils/docxExport.ts`

- [ ] **Passo 1: Criar utilitário de exportação para PDF (`pdfExport.ts`)**
Deve instanciar o `html2pdf` e passar as configurações do layout, focando na impressão amigável (as media queries no CSS farão a ocultação de botões, mas a biblioteca renderizará o container específico `#printable-form`).

```typescript
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const exportToPDF = (candidateName: string) => {
  const element = document.getElementById('printable-form');
  if (!element) return;

  const opt = {
    margin:       [15, 15, 15, 15],
    filename:     `Inscricao-Definitiva-${candidateName.replace(/\s+/g, '-')}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
};
```

- [ ] **Passo 2: Criar utilitário de exportação para DOCX (`docxExport.ts`)**
O arquivo DOCX deve exportar o nome do candidato e a lista de documentos estruturada de acordo com o preenchimento, mostrando `[X]` ou `[ ]` e imprimindo as anotações associadas com recuo de parágrafo.

```typescript
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { documentsStructure, DocumentItem } from '../data/documentsStructure';

export const exportToDocx = (
  candidateName: string,
  checkedItems: Record<string, boolean>,
  notes: Record<string, string>
) => {
  const childrenElements: Paragraph[] = [];

  // Cabeçalho do documento Word
  childrenElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO',
          bold: true,
          font: 'Georgia',
          size: 28,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: 'FORMULÁRIO DE DOCUMENTOS - INSCRIÇÃO DEFINITIVA',
          bold: true,
          font: 'Georgia',
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 500 },
      children: [
        new TextRun({
          text: 'Candidato(a): ',
          bold: true,
          font: 'Georgia',
        }),
        new TextRun({
          text: candidateName.toUpperCase(),
          bold: true,
          font: 'Georgia',
        }),
      ],
    })
  );

  // Função recursiva para adicionar itens
  const addItemsRecursive = (items: DocumentItem[], level = 0) => {
    items.forEach(item => {
      const isChecked = !!checkedItems[item.id];
      const checkMark = isChecked ? '[X]' : '[  ]';
      const itemNote = notes[item.id];

      childrenElements.push(
        new Paragraph({
          indent: { left: level * 360 },
          spacing: { before: 120, after: 120 },
          children: [
            new TextRun({
              text: `${checkMark}  `,
              font: 'Courier New',
              bold: true,
            }),
            new TextRun({
              text: item.label,
              font: 'Georgia',
              italics: isChecked,
            }),
          ],
        })
      );

      // Adiciona a nota se existir
      if (itemNote) {
        childrenElements.push(
          new Paragraph({
            indent: { left: (level + 1) * 360 },
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Anotação: ${itemNote}`,
                font: 'Georgia',
                size: 18,
                color: '666666',
                italics: true,
              }),
            ],
          })
        );
      }

      if (item.subItems) {
        addItemsRecursive(item.subItems, level + 1);
      }
    });
  };

  // Processa todas as seções
  documentsStructure.forEach(section => {
    const sectionNote = notes[section.id];
    childrenElements.push(
      new Paragraph({
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            font: 'Georgia',
            size: 22,
          }),
        ],
      })
    );

    if (sectionNote) {
      childrenElements.push(
        new Paragraph({
          indent: { left: 180 },
          spacing: { after: 180 },
          children: [
            new TextRun({
              text: `Anotação Seção: ${sectionNote}`,
              font: 'Georgia',
              size: 18,
              color: '666666',
              italics: true,
            }),
          ],
        })
      );
    }

    addItemsRecursive(section.items, 1);
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: childrenElements,
      },
    ],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `Inscricao-Definitiva-${candidateName.replace(/\s+/g, '-')}.docx`);
  });
};
```

Instale a dependência `file-saver` para salvar arquivos blob no navegador:
`npm install file-saver` e `npm install --save-dev @types/file-saver`.

- [ ] **Passo 3: Instalar file-saver**

Execute: `npm install file-saver && npm install --save-dev @types/file-saver`
Expected: Instalação bem sucedida.

- [ ] **Passo 4: Commit**

```bash
git add src/utils/pdfExport.ts src/utils/docxExport.ts
git commit -m "feat: implement utilities for PDF and DOCX export generation"
```

---

### Task 7: Tela Principal (App.tsx) com Tema e Upload JSON

**Files:**
- Modify: `src/App.tsx`

- [ ] **Passo 1: Substituir src/App.tsx pela interface final**
A interface lida com a alternância de tema no padrão do sistema com salvamento, botões de ação na barra superior (incluindo abrir arquivo JSON e restaurar o estado), acordions e o formulário renderizado no tema Gold & Charcoal.

```tsx
import React, { useState, useEffect } from 'react';
import { useFormStore } from './store/formStore';
import { documentsStructure } from './data/documentsStructure';
import { AccordionSection } from './components/AccordionSection';
import { NotesModal } from './components/NotesModal';
import { exportToPDF } from './utils/pdfExport';
import { exportToDocx } from './utils/docxExport';
import { Sun, Moon, FileText, Download, Upload, RotateCcw } from 'lucide-react';

export default function App() {
  const { 
    candidateName, 
    setCandidateName, 
    checkedItems, 
    notes, 
    darkMode, 
    setDarkMode, 
    loadBackup, 
    reset 
  } = useFormStore();

  const [activeNote, setActiveNote] = useState<{ id: string; label: string } | null>(null);

  // Inicialização do tema base
  useEffect(() => {
    const storedTheme = localStorage.getItem('tjsp-theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Padrão do sistema
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
      if (systemPrefersDark) document.documentElement.classList.add('dark');
    }
  }, [setDarkMode]);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tjsp-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tjsp-theme', 'light');
    }
  };

  // Exportar Backup JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ candidateName, checkedItems, notes }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `inscricao_definitiva_${candidateName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar Backup JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.candidateName || parsed.checkedItems || parsed.notes) {
          loadBackup(parsed);
          alert('Dados do formulário carregados com sucesso!');
        } else {
          alert('Arquivo JSON inválido ou incompatível.');
        }
      } catch (err) {
        alert('Erro ao processar o arquivo JSON.');
      }
    };
  };

  return (
    <div className="app-container">
      {/* Container principal para o formulário */}
      <div className="printable-card" id="printable-form">
        <div className="toolbar-section">
          <div className="main-actions-group">
            <button className="toolbar-action-btn" onClick={() => exportToPDF(candidateName)}>
              <FileText size={14} /> PDF
            </button>
            <button className="toolbar-action-btn" onClick={() => exportToDocx(candidateName, checkedItems, notes)}>
              <FileText size={14} /> DOCX
            </button>
            <button className="toolbar-action-btn" onClick={handleExportJSON}>
              <Download size={14} /> Exportar JSON
            </button>
            
            <label className="toolbar-action-btn file-input-label">
              <Upload size={14} /> Abrir JSON
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportJSON} 
                style={{ display: 'none' }} 
              />
            </label>

            <button className="toolbar-action-btn reset-btn" onClick={() => { if(confirm('Limpar todas as marcações?')) reset(); }} title="Limpar Formulário">
              <RotateCcw size={14} /> Limpar
            </button>
          </div>
          
          <button className="theme-toggle-round-btn" onClick={toggleTheme} title="Alternar Tema">
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
```

Adicione o CSS de layout no `src/index.css` e as **media queries de impressão**:

```css
/* Layout Principal */
.app-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 1.5rem;
}

.printable-card {
  width: 100%;
  max-width: 900px;
  background-color: var(--bg-paper);
  border: 1px solid var(--border-color);
  border-top: 6px solid var(--primary-gold);
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  padding: 2.5rem;
}

/* Barra de Ferramentas */
.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.main-actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.toolbar-action-btn {
  background-color: transparent;
  border: 1px solid var(--primary-gold);
  color: var(--primary-gold);
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
}

.toolbar-action-btn:hover {
  background-color: var(--primary-gold);
  color: white;
}

.file-input-label {
  cursor: pointer;
}

.reset-btn {
  border-color: #d9534f;
  color: #d9534f;
}

.reset-btn:hover {
  background-color: #d9534f;
  color: white;
}

.theme-toggle-round-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-toggle-round-btn:hover {
  border-color: var(--primary-gold);
  color: var(--primary-gold);
}

/* Header do Candidato */
.candidate-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.editable-candidate-input {
  background: transparent;
  border: 1px dashed transparent;
  font-family: 'Georgia', serif;
  font-size: 1.8rem;
  color: var(--primary-gold);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  width: 90%;
  max-width: 600px;
  cursor: text;
  transition: all 0.2s ease;
}

.editable-candidate-input:hover {
  border-color: var(--primary-gold);
  background-color: var(--bg-hover);
}

.editable-candidate-input:focus {
  outline: none;
  border-style: solid;
  border-color: var(--primary-gold);
  background-color: transparent;
}

/* Estilos de Impressão */
@media print {
  body {
    background-color: white !important;
    color: black !important;
    font-size: 12pt;
  }
  
  .app-container {
    padding: 0 !important;
  }
  
  .printable-card {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    max-width: 100% !important;
  }

  /* Oculta controles */
  .toolbar-section,
  .action-buttons-wrap,
  .item-action-icon-btn,
  .link-tooltip-trigger,
  .accordion-arrow-icon {
    display: none !important;
  }

  /* Garante Accordions expandidos */
  .accordion-content {
    display: block !important;
    border-top: 1px solid #000 !important;
    padding: 0.5rem 0 !important;
  }

  .accordion-section {
    border: none !important;
    border-bottom: 1px solid #000 !important;
    border-radius: 0 !important;
    margin-bottom: 1.5rem !important;
    page-break-inside: avoid;
  }

  .accordion-header {
    background: none !important;
    padding: 0.5rem 0 !important;
  }

  .accordion-title {
    color: black !important;
    font-size: 14pt !important;
    font-weight: bold !important;
  }

  /* Mantém árvore de recuo */
  .sub-items-tree {
    border-left: 1px solid #ccc !important;
    padding-left: 1.2rem !important;
  }

  .form-item-row {
    border-bottom: 1px solid #eee !important;
    page-break-inside: avoid;
  }

  .form-item-row:hover {
    background: none !important;
  }

  /* Estiliza checkboxes na impressão */
  .item-checkbox-indicator {
    border: 1px solid black !important;
  }
  
  .item-checkbox-indicator.checked {
    background-color: black !important;
  }

  /* Mostra anotações na impressão */
  .item-note-badge {
    display: none !important;
  }

  /* Força quebra de página de seções longas se necessário */
  .sections-container {
    page-break-before: auto;
  }
}
```

- [ ] **Passo 2: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "feat: complete App container UI with theme toggling, JSON import/export and print styles"
```

---

### Task 8: Teste e Validação do Builds

**Files:**
- Modify: `src/main.tsx`

- [ ] **Passo 1: Criar/Verificar src/main.tsx**
Inicializa a aplicação React sob a div `#root`.

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Passo 2: Testar se a aplicação compila**

Execute: `npm run build`
Expected: Builds compilados sem erros em `dist/`.

- [ ] **Passo 3: Parar o servidor do visual companion e limpar**

Execute: `scripts/stop-server.sh`
Expected: Servidor parado com sucesso.

- [ ] **Passo 4: Commit final**

```bash
git add src/main.tsx
git commit -m "feat: setup react entry point and verify build"
```
