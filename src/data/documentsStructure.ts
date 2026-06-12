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
      { id: "doc-rg", label: "Documento de identidade/RG" },
    ],
  },
  {
    id: "certidoes",
    title: "Certidões",
    items: [
      {
        id: "cert-nascimento",
        label: "Certidão atualizada de nascimento ou de casamento",
        links: [
          {
            text: "CRC Registro Civil",
            url: "https://home.registrocivil.org.br/",
          },
        ],
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
        id: "cert-militar",
        label: "Quitação do serviço militar",
        links: [
          {
            text: "Forças Armadas",
            url: "https://alistamento.eb.mil.br/lista-servicos",
          },
        ],
      },
      {
        id: "cert-eleitor",
        label: "Título de eleitor e certidão de quitação eleitoral",
        links: [
          {
            text: "TSE Autoatendimento",
            url: "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral",
          },
        ],
      },
      {
        id: "cert-crimes-eleitorais",
        label: "Certidão negativa de crimes eleitorais",
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
            label: "Cartórios de protestos",
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
                text: "CJF Certidão Unificada",
                url: "https://certidao-unificada.cjf.jus.br/#/solicitacao-certidao",
              },
            ],
            subItems: [
              { id: "cert-fed-civel", label: "Cível (comum e fiscal)" },
              { id: "cert-fed-criminal", label: "Criminal" },
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
              { id: "cert-est-civel", label: "Cível (comum e fiscal)" },
              { id: "cert-est-exec-crim", label: "Execuções criminais" },
              { id: "cert-est-criminal", label: "Criminal" },
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
          },
        ],
      },
      {
        id: "cert-oab",
        label: "Certidão da OAB",
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
          "Certidão de inexistência de penalidade disciplinar OU da natureza de eventual procedimento disciplinar findo ou em andamento",
      },
    ],
  },
  {
    id: "informacoes",
    title: "Informações",
    items: [
      {
        id: "info-formulario-comissao",
        label: "Formulário (fornecido pela Comissão)",
        subItems: [
          {
            id: "info-form-a",
            label: "a) Locais de seu domicílio e residência, desde os 18 anos",
          },
          { id: "info-form-b1", label: "b1) Escolas em que estudou" },
          {
            id: "info-form-b2",
            label:
              "b2) Cargos, funções e atividades jurídicas, públicos ou privados, lucrativos ou não, desempenhados desde então, aí abrangidos os de natureza política",
          },
          {
            id: "info-form-c",
            label:
              "c) Membros da Magistratura e do Ministério Público com ou para os quais tenha atuado",
          },
          {
            id: "info-form-d",
            label:
              "d) Qualificação completa e referências de cônjuge ou companheiro",
          },
        ],
      },
      { id: "info-titulos", label: "Títulos" },
      {
        id: "info-curriculo",
        label:
          "Currículo completo profissional e acadêmico a partir dos 18 anos",
      },
      {
        id: "info-referencias",
        label:
          "Referências (nomes, endereços e cargos) - Poder Judiciário, Ministério Público, magistério jurídico superior e advocacia",
      },
      {
        id: "info-declaracao-firma",
        label:
          "Declaração, com firma reconhecida - Inexistência de indiciamento, IP, TC ou processo criminal OU notícia específica da ocorrência com esclarecimentos",
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
            id: "ativ-form-atividades",
            label:
              "atividades jurídicas desempenhadas (períodos e locais de sua prestação)",
          },
          {
            id: "ativ-form-autoridades",
            label:
              "principais autoridades com quem haja atuado em cada período",
          },
        ],
      },
      {
        id: "ativ-certidao-declaracao",
        label: "Certidão ou declaração da atividade jurídica",
      },
      {
        id: "ativ-atividades-exercidas",
        label: "Atividade jurídica reconhecida",
        subItems: [
          {
            id: "ativ-exclusiva-bacharel",
            label: "Aquela exercida com exclusividade por bacharel em Direito",
          },
          {
            id: "ativ-advocacia-atos",
            label:
              "Advocacia - participação anual mínima em 5 atos privativos de advogados em causas ou questões distintas",
            links: [
              { text: "TJSP-eproc", url: "https://certidoes.tjsp.jus.br/" },
            ],
          },
          {
            id: "ativ-cargos-conhecimento",
            label:
              "Cargos, empregos ou funções com utilização preponderante de conhecimento jurídico",
            subItems: [
              {
                id: "ativ-cargos-certidao",
                label:
                  "Certidão circunstanciada do órgão competente (atribuições e prática de atos)",
              },
            ],
          },
          {
            id: "ativ-conciliador",
            label:
              "Conciliador(a) perante Poder Judiciário (mínimo por 16 horas mensais e durante 1 ano)",
          },
          { id: "ativ-mediacao", label: "Mediação ou arbitragem" },
          {
            id: "ativ-pos-graduacao",
            label:
              "Pós-graduação com início antes da entrada em vigor da Res. CNJ 75 de 12/5/2009",
          },
        ],
      },
    ],
  },
];
