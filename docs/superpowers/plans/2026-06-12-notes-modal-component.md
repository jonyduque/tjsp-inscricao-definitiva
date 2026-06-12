# Componente de Notas (Modal) e Estruturas de Casca Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o componente de modal para anotações do formulário (`NotesModal.tsx`) e adicionar seus respectivos estilos ao CSS do projeto.

**Architecture:** O `NotesModal` conecta-se ao Zustand store (`useFormStore`) para carregar a anotação atual com base em um ID fornecido, permitindo a edição e salvamento locais e atualizando o store global.

**Tech Stack:** React 19, Lucide React (ícone X), TypeScript, CSS customizado em index.css.

---

### Task 4.1: Componente de Notas (Modal)

**Files:**
- Create: `src/components/NotesModal.tsx`

- [ ] **Passo 1: Criar o arquivo NotesModal.tsx**
  Implementar o modal de anotações com o Zustand store conforme o plano principal.

- [ ] **Passo 2: Adicionar estilos ao index.css**
  Anexar os estilos CSS do modal no final do arquivo `src/index.css`.

- [ ] **Passo 3: Executar a verificação do Biome (linter/formatter)**
  Rodar o comando `npx biome check --write src/components/NotesModal.tsx src/index.css` para auto-corrigir problemas e formatar.

- [ ] **Passo 4: Executar a compilação do TypeScript**
  Rodar o comando `npx tsc --noEmit` para garantir que não existam erros de compilação.

- [ ] **Passo 5: Commitar as alterações**
  Comando:
  ```bash
  git add src/components/NotesModal.tsx src/index.css
  git commit -m "feat: create notes modal component and associated CSS"
  ```
