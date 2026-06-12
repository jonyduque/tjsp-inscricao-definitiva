# Especificação Técnica de Design: Formulário de Inscrição Definitiva TJSP

Este documento especifica o design visual, o comportamento e a arquitetura técnica para a página web interativa do formulário de documentos para a Inscrição Definitiva do Tribunal de Justiça de São Paulo (TJSP), baseada no arquivo [Lista de documentos.md](file:///c:/Users/jonyd/OneDrive%20-%20Tribunal%20de%20Justica%20de%20Sao%20Paulo/Estudos%20-%20TJSP%20192/Inscri%C3%A7%C3%A3o%20definitiva/Formul%C3%A1rio/Lista%20de%20documentos.md).

---

## 1. Identidade Visual e Estilo (Tribunal Classy)

O formulário deve adotar uma estética premium inspirada em ambientes jurídicos tradicionais, equilibrando solenidade e modernidade.

### 1.1. Paleta de Cores (CSS Variables)

#### Modo Claro
*   `--bg-body`: `#fdfcfb` (Creme/areia muito suave, reduzindo fadiga ocular)
*   `--bg-paper`: `#ffffff` (Branco puro para os cartões/formulário)
*   `--text-primary`: `#2c2b29` (Preto quente suave)
*   `--text-muted`: `#6b6a67` (Cinza médio quente)
*   `--primary-gold`: `#b38e5d` (Ouro envelhecido/bronze)
*   `--primary-gold-hover`: `#967449`
*   `--border-color`: `#e5e0d8` (Borda fina bege/cinza quente)
*   `--bg-hover`: `rgba(179, 142, 93, 0.03)`

#### Modo Escuro
*   `--bg-body`: `#121214` (Preto carvão escuro)
*   `--bg-paper`: `#1c1c1f` (Cinza escuro para cartões/formulário)
*   `--text-primary`: `#e3e1dd` (Branco quente suave)
*   `--text-muted`: `#a1a09d` (Cinza claro suave)
*   `--primary-gold`: `#c5a880` (Ouro claro envelhecido)
*   `--primary-gold-hover`: `#b38e5d`
*   `--border-color`: `#38373b` (Borda fina carvão escuro)
*   `--bg-hover`: `rgba(179, 142, 93, 0.06)`

### 1.2. Tipografia e Espaçamentos
*   **Fontes:** Títulos principais (Seções e Candidato) usam a fonte serifada `Georgia` para evocar o tom tradicional de petições jurídicas. Textos auxiliares e labels dos itens usam fontes do sistema sans-serif (`system-ui`, `-apple-system`, `sans-serif`) para legibilidade ideal no navegador.
*   **Espaçamento:** Layout centrado com largura máxima de `900px`, padding generoso de `2.5rem` em telas desktop, adaptando-se para dispositivos móveis com margins menores.
*   **Efeito Riscado e Itálico:** Quando o item estiver ativo (marcado), seu texto é estilizado com `line-through` (riscado), `italic` (itálico) e opacidade reduzida para `0.55`, provendo feedback visual claro de conclusão de tarefa.

---

## 2. Comportamento e UX da Interface

### 2.1. Título do Candidato Editável
*   O título padrão é "NOME DO CANDIDATO".
*   Ao passar o mouse, uma borda tracejada fina na cor `--primary-gold` é exibida, indicando que o elemento é interativo. O cursor do mouse muda para `text` (digitação).
*   Ao clicar, o elemento torna-se editável (usando `contentEditable` no React). As alterações são salvas automaticamente no Zustand e persistidas no LocalStorage quando o foco sai do campo (`onBlur`).

### 2.2. Accordions para Seções do Formulário
*   As quatro seções principais (Documentos, Certidões, Informações e Atividade Jurídica) são estruturadas em Accordions colapsáveis.
*   O cabeçalho do accordion exibe o título da seção, uma contagem de itens concluídos/totais e o botão para abrir anotações da seção.
*   Ao clicar na barra do cabeçalho, a seção expande/colapsa de maneira suave.

### 2.3. Checkboxes e Lógica Recursiva (Pai/Filho)
*   Um clique em qualquer parte da linha do item (incluindo o label de texto) alterna o checkbox.
*   **Propagação para baixo (Pai -> Filhos):** Ao marcar/desmarcar um item pai, todos os seus subitens são marcados/desmarcados automaticamente.
*   **Propagação para cima (Filhos -> Pai):** O item pai será marcado automaticamente se, e somente se, **todos** os seus subitens forem marcados. Se qualquer subitem for desmarcado, o item pai é desmarcado.

### 2.4. Tooltips de Links de Apoio
*   Itens que possuem links de ajuda (como "CRC", "Receita Federal", "TJSP") possuem um botão discreto arredondado escrito **"🔗 Links"**.
*   Ao clicar no botão, um tooltip elegante com efeito de elevação (`box-shadow`) abre exatamente acima do botão, exibindo a lista de links oficiais com a indicação `↗`.
*   O tooltip fecha se o usuário clicar fora ou em outro botão de tooltip.

### 2.5. Modal de Anotações
*   À frente de cada seção e item, há um ícone de edição (bloco/lápis).
*   Ao clicar no ícone, abre-se um modal centralizado (`dialog` ou `overlay` com blur de fundo) contendo um `textarea` para o usuário digitar notas personalizadas sobre aquele documento (ex: data de solicitação, protocolo, custo).
*   Ao salvar, o modal fecha e um indicador "Nota" de estilo retrô/badge envelhecido é exibido ao lado do item correspondente.

---

## 3. Arquitetura de Software e Estado (Zustand)

### 3.1. Abordagem A: Estado Separado da Estrutura
Para manter a robustez contra alterações de código futuras e otimizar a persistência:
1.  **Dados Estáticos (`documentsStructure.json`):** Uma constante estruturada contendo o esqueleto em árvore de todo o formulário (IDs únicos, labels, links associados, e filhos).
2.  **Estado Zustand (`useFormStore`):**
    *   `candidateName: string` (Salva o nome do candidato)
    *   `checkedItems: Record<string, boolean>` (Chaves correspondendo aos IDs dos itens ativos)
    *   `notes: Record<string, string>` (Chaves correspondendo aos IDs dos itens com suas respectivas anotações)
    *   `darkMode: boolean` (Armazena o estado do tema)

A biblioteca `zustand/middleware` com `persist` será usada para sincronizar automaticamente o estado com o `localStorage` na chave `tjsp-inscricao-definitiva-storage`.

---

## 4. Exportação e Integrações (PDF, DOCX e JSON)

### 4.1. Exportação para PDF (Foco em Impressão)
*   Uso da biblioteca `html2pdf.js` para renderizar a página como PDF diretamente no navegador.
*   **Media-queries para Impressão (`@media print`):**
    *   Ocultar barra de ferramentas, botões de ação, botões de anotação, botões de links e contornos interativos.
    *   Ocultar accordions colapsados (forçar expansão de todos os itens).
    *   Manter apenas o título do candidato, a estrutura de árvore do formulário com caixas de seleção vazias ou marcadas, e as anotações correspondentes renderizadas logo abaixo de cada item com letra menor.
    *   Adicionar quebras de página controladas se necessário.

### 4.2. Exportação para DOCX
*   Uso da biblioteca `docx` para gerar um arquivo `.docx` legível nativamente no Microsoft Word.
*   O arquivo gerado conterá a estrutura idêntica de seções e itens, indicando se o item está checado ou não (ex: `[X]` ou `[ ]`) e imprimindo as anotações do usuário como recuo de parágrafo.

### 4.3. Exportação/Importação JSON
*   **Exportar JSON:** Cria um dump contendo `candidateName`, `checkedItems` e `notes`, permitindo download de um arquivo `<nome-do-candidato>-backup.json`.
*   **Importar JSON:** O usuário faz o upload do arquivo JSON. O store valida as chaves básicas e atualiza o estado, recuperando o formulário completo de forma instantânea.

---

## 5. Bibliotecas a Serem Utilizadas
1.  `react` e `react-dom` (Vite)
2.  `zustand` (Gerenciador de estado compacto com suporte a persistência nativa)
3.  `lucide-react` (Ícones modernos e limpos)
4.  `html2pdf.js` (Biblioteca client-side robusta para exportação de PDF via Canvas e jsPDF)
5.  `docx` (Criação de arquivos DOCX de forma limpa via script)

---

## 6. Plano de Verificação Visual e Funcional
*   **Responsividade:** Testar em telas mobile, tablet e desktop.
*   **Impressão:** Simular impressão no Chrome/Edge para validar que elementos interativos não poluem a versão física do documento.
*   **Persistência:** Fechar o navegador, alterar valores, recarregar a página e validar se todas as marcações e anotações permanecem idênticas.
