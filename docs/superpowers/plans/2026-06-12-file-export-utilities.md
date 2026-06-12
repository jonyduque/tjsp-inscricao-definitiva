# File Export Utilities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement file export utilities for PDF and DOCX formats to allow candidates to export their filled documents checklist.

**Architecture:** Use `html2pdf.js` for exporting the DOM container `#printable-form` to PDF, and the `docx` library with `file-saver` to build and save a structured Word document from Zustand state.

**Tech Stack:** TypeScript, React, docx, html2pdf.js, file-saver, Biome, Vitest.

---

### Task 1: Instalar dependências adicionais de arquivo

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instalar dependências adicionais**

  Run: `npm install file-saver && npm install --save-dev @types/file-saver`
  Expected: Instalação bem-sucedida.

- [ ] **Step 2: Verificar package.json**

  Verify that `file-saver` is in `dependencies` and `@types/file-saver` is in `devDependencies`.

---

### Task 2: Criar utilitário de exportação para PDF

**Files:**
- Create: `src/utils/pdfExport.ts`

- [ ] **Step 1: Criar o arquivo `src/utils/pdfExport.ts`**

  Write the file content:
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

- [ ] **Step 2: Verificar a compilação com TSC**

  Run: `npx tsc --noEmit`
  Expected: Compilação sem erros.

---

### Task 3: Criar utilitário de exportação para DOCX

**Files:**
- Create: `src/utils/docxExport.ts`

- [ ] **Step 1: Criar o arquivo `src/utils/docxExport.ts`**

  Write the file content:
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

- [ ] **Step 2: Verificar a compilação com TSC**

  Run: `npx tsc --noEmit`
  Expected: Compilação sem erros.

---

### Task 4: Formatar, testar e commitar

**Files:**
- Modify: `src/utils/pdfExport.ts`
- Modify: `src/utils/docxExport.ts`

- [ ] **Step 1: Formatar com Biome**

  Run: `npx biome check --write src/utils/pdfExport.ts src/utils/docxExport.ts`
  Expected: Biome corrige formatações e passa sem erros.

- [ ] **Step 2: Verificar compilação final**

  Run: `npx tsc --noEmit`
  Expected: Sem erros.

- [ ] **Step 3: Commitar no Git**

  Run:
  ```bash
  git add src/utils/pdfExport.ts src/utils/docxExport.ts
  git commit -m "feat: implement utilities for PDF and DOCX export generation"
  ```
  Expected: Commited com sucesso.
