# Integrate Biome Linter/Formatter and Configure Vitest Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install and configure Biome for linting/formatting, update TypeScript and Vitest settings to resolve typing/import conflicts, clean up code style, build/verify the project, and commit the changes.

**Architecture:** We will set up Biome as the linter/formatter, adjust `vite.config.ts` imports from `vite` to `vitest/config` for correct test options compatibility, update `tsconfig.json` to recognize Vitest globals, run Biome format/check, verify the build, and perform a git commit.

**Tech Stack:** Biome, Vitest, TypeScript, Vite, React, Node.js

---

### Task 1: Install Biome

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install @biomejs/biome**
  Run: `npm install --save-dev @biomejs/biome`
  Expected: Biome installs successfully, and the dependency is added to `package.json` under `devDependencies`.

- [ ] **Step 2: Verify installation**
  Run: `npx biome --version`
  Expected: Prints Biome version (e.g. 1.9.4 or similar).

---

### Task 2: Create Biome Configuration

**Files:**
- Create: `biome.json`

- [ ] **Step 1: Create biome.json configuration file**
  Create: `biome.json` at the project root with the following content:
  ```json
  {
    "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
    "organizeImports": {
      "enabled": true
    },
    "linter": {
      "enabled": true,
      "rules": {
        "recommended": true
      }
    },
    "formatter": {
      "enabled": true,
      "indentStyle": "space",
      "indentWidth": 2
    }
  }
  ```
  Expected: File is successfully created and verified.

---

### Task 3: Fix Vitest Imports and Types

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`

- [ ] **Step 1: Modify vite.config.ts**
  Replace:
  ```typescript
  import { defineConfig } from 'vite';
  ```
  With:
  ```typescript
  import { defineConfig } from 'vitest/config';
  ```
  Expected: TypeScript compiles without module resolution errors for the new import.

- [ ] **Step 2: Modify tsconfig.json**
  Add `"types": ["vitest/globals"]` under `compilerOptions`.
  For example, insert:
  ```json
  "types": ["vitest/globals"]
  ```
  inside the `"compilerOptions"` block.
  Expected: TypeScript compile checks recognize Vitest globals such as `describe`, `it`, `expect`.

---

### Task 4: Format and Lint Files

**Files:**
- Modify: All source files (e.g. `src/main.tsx`, `vite.config.ts`, etc.)

- [ ] **Step 1: Run Biome check and format**
  Run: `npx biome check --write .`
  Expected: Formats and lints all JS, TS, and JSON files, correcting layout/formatting issues.

---

### Task 5: Verify Build and Commit

**Files:**
- None

- [ ] **Step 1: Verify the build**
  Run: `npm run build`
  Expected: Project compiles and builds successfully without any TS or bundler errors.

- [ ] **Step 2: Commit the changes**
  Run:
  ```powershell
  git add package.json package-lock.json biome.json vite.config.ts tsconfig.json
  git commit -m "fix: integrate Biome linter/formatter and configure Vitest types"
  ```
  Expected: Changes committed cleanly.
