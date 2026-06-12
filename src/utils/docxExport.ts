import { AlignmentType, Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import {
  type DocumentItem,
  documentsStructure,
} from "../data/documentsStructure";

export const exportToDocx = (
  candidateName: string,
  checkedItems: Record<string, boolean>,
  notes: Record<string, string>,
) => {
  const childrenElements: Paragraph[] = [];

  // Cabeçalho do documento Word
  childrenElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO",
          bold: true,
          font: "Georgia",
          size: 28,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: "FORMULÁRIO DE DOCUMENTOS - INSCRIÇÃO DEFINITIVA",
          bold: true,
          font: "Georgia",
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 500 },
      children: [
        new TextRun({
          text: "Candidato(a): ",
          bold: true,
          font: "Georgia",
        }),
        new TextRun({
          text: candidateName.toUpperCase(),
          bold: true,
          font: "Georgia",
        }),
      ],
    }),
  );

  // Função recursiva para adicionar itens
  const addItemsRecursive = (items: DocumentItem[], level = 0) => {
    items.forEach((item) => {
      const isChecked = !!checkedItems[item.id];
      const checkMark = isChecked ? "[X]" : "[  ]";
      const itemNote = notes[item.id];

      childrenElements.push(
        new Paragraph({
          indent: { left: level * 360 },
          spacing: { before: 120, after: 120 },
          children: [
            new TextRun({
              text: `${checkMark}  `,
              font: "Courier New",
              bold: true,
            }),
            new TextRun({
              text: item.label,
              font: "Georgia",
              italics: isChecked,
            }),
          ],
        }),
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
                font: "Georgia",
                size: 18,
                color: "666666",
                italics: true,
              }),
            ],
          }),
        );
      }

      if (item.subItems) {
        addItemsRecursive(item.subItems, level + 1);
      }
    });
  };

  // Processa todas as seções
  documentsStructure.forEach((section) => {
    const sectionNote = notes[section.id];
    childrenElements.push(
      new Paragraph({
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            font: "Georgia",
            size: 22,
          }),
        ],
      }),
    );

    if (sectionNote) {
      childrenElements.push(
        new Paragraph({
          indent: { left: 180 },
          spacing: { after: 180 },
          children: [
            new TextRun({
              text: `Anotação Seção: ${sectionNote}`,
              font: "Georgia",
              size: 18,
              color: "666666",
              italics: true,
            }),
          ],
        }),
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

  Packer.toBlob(doc).then((blob) => {
    saveAs(
      blob,
      `Inscricao-Definitiva-${candidateName.replace(/\s+/g, "-")}.docx`,
    );
  });
};
