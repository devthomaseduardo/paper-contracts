export const INITIAL_CONTRACT_DATA = {
  type: 'contract',
  status: 'draft',
  accentColor: '#6366f1',
  risks: [],
  letterheadStyle: 'classic',
  pixKey: '',
  clientProfiles: [],


  contractorName: "Seu Nome Completo",
  contractorDoc: "00.000.000/0001-00",
  contractorLocation: "Sua Cidade - UF",
  contractorRole: "Seu Cargo / Profissão",
  contractorContact: "seuemail@exemplo.com | (00) 00000-0000",
  contractorLinkedin: "linkedin.com/in/seuperfil",
  contractorGithub: "github.com/seuperfil",
  contractorPortfolio: "seuportfolio.com.br",
  contractorSignature: null,
  contractorLogo: null,

  timeline: [], 
  taxConfig: { iss: 5, irrf: 0, platformFee: 0 },

  
  clientName: "",
  clientAddress: "",
  clientZipPhone: "",
  clientDoc: "",
  
  services: [
    "Criação de Landing Pages e Sites Institucionais",
    "Desenvolvimento de E-commerces e Sistemas Web",
    "Otimização de SEO e Performance",
    "Manutenção e Suporte Técnico"
  ],
  
  valueTotal: "0,00",
  valueEntry: "0,00",
  valueBalance: "0,00",
  balanceDate: "na entrega final",
  
  deliveryDays: "15",
  revisionCount: "2",
  
  extraClauses: "",
  
  forumCity: "São Paulo - SP",
  contractDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),

  quoteItems: [],
  quoteValidUntil: "15 dias",
  invoiceId: new Date().getFullYear() + "-001",
  invoiceIssueDate: new Date().toLocaleDateString('pt-BR'),

  cvSummary: "Resumo profissional. Descreva aqui suas principais habilidades, anos de experiência, conquistas mais importantes e o que você busca na sua carreira.",
  
  cvExperience: "EXPERIÊNCIA PROFISSIONAL\n\nEmpresa Exemplo (Mês/Ano – Presente)\nCargo / Função\nDescreva suas principais atividades e resultados alcançados nesta posição.\n\nEmpresa Anterior (Mês/Ano – Mês/Ano)\nCargo / Função\nDescreva suas principais atividades e resultados alcançados nesta posição.",
  
  cvEducation: "Formação Acadêmica – Instituição (Ano de Conclusão)\n\nCertificações:\n- Certificação Exemplo 1\n- Certificação Exemplo 2",
  
  cvSkills: [
    "Habilidade 1", "Habilidade 2", "Habilidade 3", "Habilidade 4", "Habilidade 5"
  ],

  letterBody: "Prezados,\n\nEscrevo para apresentar minha proposta de serviços...",
  letterSubject: "Apresentação Comercial",
  
  coverLetterObjective: "Demonstrar como minha experiência técnica pode resolver os gargalos de performance da sua plataforma atual.",
  coverLetterCta: "Gostaria de agendar uma breve reunião de 15 minutos para apresentar alguns cases de sucesso.",
};
