# Adjust Documents Structure Static Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply spec review fixes to `src/data/documentsStructure.ts` to include static helper texts/instructions, restore legal terminology, and update links and descriptions.

**Architecture:** Extend interfaces with an optional `description` field, add/modify corresponding static data, and run quality checks (Biome and tsc) before committing.

**Tech Stack:** TypeScript, Node.js

---

### Task 1: Update Interfaces and Section Descriptions

**Files:**
- Modify: `src/data/documentsStructure.ts:1-29`

- [x] **Step 1: Add description parameter to DocumentSection and DocumentItem interfaces**
  Update `DocumentItem` and `DocumentSection` to include `description?: string`.

- [x] **Step 2: Add description to the section with id "documentos"**
  Update the `"documentos"` section by adding `description: "Cópias autenticadas:"`.

---

### Task 2: Restore Specific Detail and Helper Texts

**Files:**
- Modify: `src/data/documentsStructure.ts:100-280`

- [x] **Step 1: Update id "cert-federal" link text**
  Change the link text for `"cert-federal"` from `"CJF Certidão Unificada"` to `"CJF-todos, exceto TRF6"`.

- [x] **Step 2: Update id "ativ-cargos-certidao" label**
  Change the label of `"ativ-cargos-certidao"` to:
  `"Certidão circunstanciada do órgão competente (atribuições e a prática reiterada de atos que exijam a utilização preponderante de conhecimento jurídico)"`.

- [x] **Step 3: Add description to id "ativ-advocacia-atos"**
  Add `description: "Certidão de militância. Se for SAJ tem de pedir pessoalmente, por e-mail ou no balcão virtual"` to `"ativ-advocacia-atos"`.

---

### Task 3: Format, Typecheck and Commit

- [x] **Step 1: Run Biome to format the changes**
  Run `npx biome check --write src/data/documentsStructure.ts`

- [x] **Step 2: Run tsc to verify TypeScript compilation**
  Run `npx tsc --noEmit`

- [x] **Step 3: Commit changes**
  Add files and commit with message:
  ```bash
  git add src/data/documentsStructure.ts
  git commit -m "fix: adjust static data structure to match exact markdown instructions and helper texts"
  ```
