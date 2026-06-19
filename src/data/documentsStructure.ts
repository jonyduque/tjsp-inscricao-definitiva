
export interface DocumentLink {
  /** The text label for the link. */
  text: string;
  /** The URL destination. */
  url: string;
}

export interface DocumentItem {
  /** Unique identifier for the item. */
  id: string;
  /**
   * ID do documento no sistema oficial (documentos.json).
   * Utilizado para referenciar o documento na API/sistema externo.
   */
  apiId?: string;
  /** The text label of the item. */
  label: string;
  /** Helper text or instructions associated with the item. */
  description?: string;
  /** Links associated with this item. */
  links?: DocumentLink[];
  /** Sub-items nested under this item. */
  subItems?: DocumentItem[];
}

export interface DocumentSection {
  /** Unique identifier for the section. */
  id: string;
  /** Title of the section. */
  title: string;
  /** Optional helper text or subtitle for the section. */
  description?: string;
  /** Items within this section. */
  items: DocumentItem[];
}

export const documentsStructure: DocumentSection[] = [
  {
    id: "formularios",
    title: "Formulários e declarações",
    items: [
      {
        id: "doc-requerimento",
        label: "Requerimento de Inscrição Definitiva (anexo I)",
      },
      {
        id: "doc-ficha",
        label: "Ficha de Inscrição Definitiva (anexo II)",
      },
      {
        id: "info-form-a",
        label: "Locais de seu domicílio dos últimos 5 anos",
        description:
          "Formulário fornecido pela Comissão de Concurso (anexo III) - DOMICÍLIO DO(A) CANDIDATO(A) NOS ÚLTIMOS 05 (CINCO) ANOS",
      },
      {
        id: "info-curriculo",
        label:
          "Currículo das atividades profissionais e acadêmicas desempenhadas a partir dos 18 anos (com indicação dos nomes das instituições de ensino, datas de conclusão e afins)",
      },
      {
        id: "info-referencias",
        label:
          "Relação de fontes de referência",
      },
      {
        id: "info-declaracao-firma",
        label:
          "Declaração de não ter sido indiciado, investigado e processado criminalmente ou com esclarecimentos pertinentes",
      },
      {
        id: "info-cancelamento-oab",
        label: "Declaração de Cancelamento da Inscrição na OAB, se for o caso.",
      },
    ],
  },
  {
    id: "documentos",
    title: "Documentos",
    description: "Cópias autenticadas:",
    items: [
      {
        id: "doc-fotos",
        label: "2 fotos 3x4, iguais e recentes",
      },
      {
        id: "doc-diploma",
        label: "Diploma de bacharel em direito",
      },
      {
        id: "cert-cpf",
        label: "Situação no CPF",
        links: [
          {
            text: "Receita Federal",
            url: "https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp",
          },
        ],
      },
      {
        id: "cert-eleitor",
        label: "Título de Eleitor",
        links: [
          {
            text: "TSE Autoatendimento",
            url: "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral",
          },
        ],
      },
      {
        id: "doc-carteira-profissional",
        label: "Carteira Profissional (somente onde houver registro)",
      },
      {
        id: "doc-comprovante-endereco",
        label: "Comprovante de endereço",
      },
    ],
  },
  {
    id: "conjuge-filhos",
    title: "Cônjuge / Filhos(as)",
    items: [
      {
        id: "doc-comprovante-uniao-estavel",
        label: "Comprovante de União Estável",
      },
      {
        id: "doc-rg-conjuge",
        label: "RG da(o) cônjuge",
      },
      {
        id: "doc-cpf-conjuge",
        label: "CPF da(o) cônjuge",
      },
      {
        id: "doc-certidao-nascimento-filhos",
        label: "Certidão de nascimento dos filhos(as)",
      },
      {
        id: "doc-rg-filhos",
        label: "RG dos filhos(as)",
      },
      {
        id: "doc-cpf-filhos",
        label: "CPF dos filhos(as)",
      },
    ],
  },
  {
    id: "certidoes",
    title: "Certidões",
    items: [
      {
        id: "cert-nascimento",
        label: "Certidão de Nascimento e/ou Certidão de Casamento (se o nome dos pais for diferente do que consta da certidão juntar comprovante da alteração)",
        links: [
          {
            text: "CRC Registro Civil",
            url: "https://home.registrocivil.org.br/",
          },
        ],
      },
      {
        id: "cert-militar",
        label: "Certificado Militar",
        links: [
          {
            text: "Forças Armadas",
            url: "https://alistamento.eb.mil.br/lista-servicos",
          },
        ],
      },
      {
        id: "cert-crimes-eleitorais",
        label: "Certidão emitida pelo Tribunal Superior Eleitoral, comprovando a inexistência de crime eleitoral",
        links: [
          {
            text: "TSE Autoatendimento",
            url: "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral",
          },
        ],
      },
      {
        id: "cert-residencias-trabalho",
        label:
          "Certidões dos locais de residência ou trabalho dos últimos 5 anos",
        subItems: [
          {
            id: "cert-protestos",
            label: "Certidão dos cartórios de protestos",
            links: [
              {
                text: "CENPROT-SP",
                url: "https://protestosp.com.br/certidao-de-protesto",
              },
              {
                text: "CENPROT-Outros Estados",
                url: "https://www.pesquisaprotesto.com.br/",
              },
            ],
          },
          {
            id: "cert-federal",
            label: "Federal (Cível e Criminal)",
            links: [
              {
                text: "CJF-todos, exceto TRF6",
                url: "https://certidao-unificada.cjf.jus.br/#/solicitacao-certidao",
              },
            ],
            subItems: [
              {
                id: "cert-fed-civel-comum",
                label: "Certidão do distribuidor cível da Justiça Federal - comum",
              },
              {
                id: "cert-fed-civel-fiscal",
                label: "Certidão do distribuidor cível da Justiça Federal - fiscal",
              },
              {
                id: "cert-fed-criminal",
                label: "Certidão do distribuidor criminal da Justiça Federal",
              },
            ],
          },
          {
            id: "cert-estadual-tjsp",
            label: "Estadual (TJSP)",
            links: [
              {
                text: "TJSP-SAJ",
                url: "https://esaj.tjsp.jus.br/sco/abrirCadastro.do?servico=810101",
              },
              { text: "TJSP-eproc", url: "https://certidoes.tjsp.jus.br/" },
            ],
            subItems: [
              {
                id: "cert-est-civel-comum",
                label: "Certidão do distribuidor cível da Justiça Estadual - comum",
              },
              {
                id: "cert-est-civel-fiscal",
                label: "Certidão do distribuidor cível da Justiça Estadual - fiscal",
              },
              {
                id: "cert-est-exec-crim",
                label: "Certidão dos cartórios de execuções criminais",
              },
              {
                id: "cert-est-criminal",
                label: "Certidão do distribuidor criminal da Justiça Estadual",
              },
            ],
          },
          {
            id: "cert-militar-federal-estadual",
            label: "Militar Federal e Estadual - Criminal",
            links: [
              { text: "TJMSP", url: "https://certidoes.tjmsp.jus.br/#/" },
              {
                text: "STM",
                url: "https://stm.jus.br/servicos-ao-cidadao/atendimentoaocidadao/certidao-negativa",
              },
            ],
            subItems: [
              {
                id: "cert-militar-federal-criminal",
                label: "Certidão do distribuidor criminal da Justiça Militar Federal",
              },
              {
                id: "cert-militar-estadual-criminal",
                label: "Certidão do distribuidor criminal da Justiça Militar Estadual",
              },
            ],
          },
          {
            id: "cert-antecedentes",
            label: "Antecedentes criminais, Polícias Federal e Estadual",
            links: [
              {
                text: "SSP/SP",
                url: "https://www2.ssp.sp.gov.br/aacweb/carrega-iframe",
              },
              {
                text: "Polícia Federal",
                url: "https://www.gov.br/pt-br/servicos/emitir-certidao-de-antecedentes-criminais",
              },
            ],
            subItems: [
              {
                id: "cert-policia-civil",
                label: "Certidão da Polícia Civil",
              },
              {
                id: "cert-policia-federal",
                label: "Certidão da Polícia Federal",
              },
            ],
          },
        ],
      },
      {
        id: "cert-oab",
        label: "Carteira da OAB",
        links: [
          {
            text: "OAB/SP Serviços",
            url: "https://www2.oabsp.org.br/asp/dotnet/Index/Servicos/Advocacia?page=4",
          },
        ],
      },
      {
        id: "cert-oab-situacao",
        label: "Certidão da Ordem dos Advogados do Brasil com informação sobre a situação do(a) candidato(a) advogado perante a instituição",
        links: [
          {
            text: "OAB/SP Serviços",
            url: "https://www2.oabsp.org.br/asp/dotnet/Index/Servicos/Advocacia?page=4",
          },
        ],
      },
      {
        id: "cert-inexistencia-penalidade",
        label:
          "Certidão fornecida pelo órgão competente quanto à inexistência de penalidade disciplinar",
      },
    ],
  },
  {
    id: "atividade-juridica",
    title: "Atividade Jurídica",
    items: [
      {
        id: "ativ-formulario-comissao",
        label: "Formulário (fornecido pela Comissão)",
        subItems: [
          {
            id: "info-form-b2",
            label: "Atividades jurídicas desempenhadas (anexo IV)"
          },
          {
            id: "info-form-c",
            label: "Principais autoridades com quem haja atuado em cada período (anexo V)",
          },
        ],
      },
      {
        id: "ativ-certidao-declaracao",
        label: "Certidão ou declaração idônea que comprove haver completado, à data da inscrição definitiva, 3 (três) anos de atividade jurídica",
      },
      {
        id: "ativ-atividades-exercidas",
        label: "Atividade jurídica reconhecida",
        subItems: [
          {
            id: "ativ-exclusiva-bacharel",
            label: "Aquela exercida com exclusividade por bacharel em Direito"
          },
          {
            id: "ativ-advocacia-atos",
            label:
              "Advocacia - participação anual mínima em 5 atos privativos de advogados em causas ou questões distintas",
            description:
              "Certidão de militância. Se for SAJ tem de pedir pessoalmente, por e-mail ou no balcão virtual",
            links: [
              { text: "TJSP-eproc", url: "https://certidoes.tjsp.jus.br/" },
            ],
          },
          {
            id: "ativ-cargos-conhecimento",
            label: "Certidão ou declaração emitida pelo órgão onde exercia cargos, empregos ou funções com utilização preponderante de conhecimento jurídico"
          },
          {
            id: "ativ-conciliador",
            label: "Conciliador(a) perante Poder Judiciário (mínimo por 16 horas mensais e durante 1 ano)",
          },
          { id: "ativ-mediacao", label: "Mediação ou arbitragem" },
          {
            id: "ativ-pos-graduacao",
            label: "Pós-graduação com início antes da entrada em vigor da Res. CNJ 75 de 12/5/2009"
          },
        ],
      },
    ],
  },
  {
    id: "titulos",
    title: "Títulos",
    items: [
      {
        id: "tit_requerimento",
        label: "Requerimento de entrega de títulos (anexo VI) e eventual sumário dos documentos apresentados."
      },
      {
        id: "tit_judicatura",
        label: "Judicatura"
      },
      {
        id: "tit_procuradoria",
        label: "Cargo privativo de bacharel em Direito no MP, DP, AGU, Procuradoria"
      },
      {
        id: "tit_magisterio",
        label: "Magistério superior em Direito"
      },
      {
        id: "tit_outro_cargo",
        label: "Outro cargo privativo de bacharel em Direito"
      },
      {
        id: "tit_advocacia",
        label: "Advocacia"
      },
      {
        id: "tit_aprovacao",
        label: "Aprovação em concurso"
      },
      {
        id: "tit_doutorado",
        label: "Doutorado"
      },
      {
        id: "tit_mestrado",
        label: "Mestrado"
      },
      {
        id: "tit_pos",
        label: "Pós-graduação (+360h e monografia)"
      },
      {
        id: "tit_graduacao",
        label: "Graduação ou curso de preparação para Magistratura ou MP (+720h, freq. min. 75%, nota de aproveitamento)"
      },
      {
        id: "tit_extensao",
        label: "Curso de extensão (+100h, freq. min. 75%, nota de aproveitamento ou TCC)"
      },
      {
        id: "tit_livro",
        label: "Livro jurídico"
      },
      {
        id: "tit_artigo",
        label: "Artigo em revista"
      },
      {
        id: "tit_laurea",
        label: "Láurea universitária"
      },
      {
        id: "tit_banca",
        label: "Banca examinadora"
      },
      {
        id: "tit_conciliador",
        label: "Conciliador (+1 ano)"
      },
      {
        id: "tit_assistencia",
        label: "Assistência jurídica voluntária"
      },
      {
        id: "tit_residencia",
        label: "Programa de Residência Jurídica (+12 meses)"
      },
    ]
  },
  {
    id: "patrimonio",
    title: "Patrimônio e Renda",
    items: [
      {
        id: "pat-irpf",
        label: "Cópia da Declaração de Imposto de Renda; ou Declaração de que não possui bens, com firma reconhecida.",
      },
      {
        id: "pat-holerite",
        label: "Cópia do último demonstrativo de pagamento (holerite)",
      },
      {
        id: "pat-pis",
        label: "Demonstrativo PIS (ou extrato da Caixa Econômica Federal)",
      },
      {
        id: "pat-pasep",
        label: "Demonstrativo PASEP",
      },
      {
        id: "serv-certidao-previdenciaria",
        label: "Certidão ou declaração com informações previdenciárias (item 'e', apenas servidores públicos)",
      },
    ],
  },
];
