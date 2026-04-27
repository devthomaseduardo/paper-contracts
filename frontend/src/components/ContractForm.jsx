import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Plus, Trash2, Bot, Eraser, Save, ChevronDown, ChevronUp, Briefcase, User, Wallet, Scale, PenTool, Image as ImageIcon, Globe, Smartphone, Wrench, Zap, Infinity, Palette, AlertTriangle, Lightbulb, Info, UserPlus, Users, ShieldCheck, MapPin, Phone, Linkedin, Github, Link, Calendar, CheckCircle2 } from 'lucide-react';
import { refineServiceDescription, generateLegalClause, analyzeRisks, generateTimeline } from '../services/api';

const sectionHeaderClasses = {
  parties: {
    active: 'bg-slate-800/90 border-indigo-500/70 shadow-lg shadow-indigo-500/10',
    idle: 'bg-slate-900/50 border-slate-700 hover:border-indigo-500/40 hover:bg-slate-800/40',
  },
  details: {
    active: 'bg-slate-800/90 border-emerald-500/70 shadow-lg shadow-emerald-500/10',
    idle: 'bg-slate-900/50 border-slate-700 hover:border-emerald-500/40 hover:bg-slate-800/40',
  },
  financial: {
    active: 'bg-slate-800/90 border-amber-500/70 shadow-lg shadow-amber-500/10',
    idle: 'bg-slate-900/50 border-slate-700 hover:border-amber-500/40 hover:bg-slate-800/40',
  },
  legal: {
    active: 'bg-slate-800/90 border-rose-500/70 shadow-lg shadow-rose-500/10',
    idle: 'bg-slate-900/50 border-slate-700 hover:border-rose-500/40 hover:bg-slate-800/40',
  },
  signature: {
    active: 'bg-slate-800/90 border-sky-500/70 shadow-lg shadow-sky-500/10',
    idle: 'bg-slate-900/50 border-slate-700 hover:border-sky-500/40 hover:bg-slate-800/40',
  },
};

const SERVICE_TEMPLATES = [
  {
      id: 'universal',
      label: 'Modelo Universal',
      icon: Infinity,
      services: [
        'Criação de Landing Pages e Sites Institucionais',
        'Desenvolvimento de E-commerces e Sistemas Web',
        'Otimização de SEO e Performance',
        'Manutenção e Suporte Técnico'
      ],
      clauses: ''
  },
  {
    id: 'web',
    label: 'Site / Landing Page',
    icon: Globe,
    services: [
      'Desenvolvimento de Interface (UI/UX) Responsiva',
      'Implementação Front-end com React/Next.js e Tailwind CSS',
      'Otimização de Performance (Core Web Vitals) e SEO Técnico Básico',
      'Configuração de Domínio e Hospedagem (Vercel/Netlify)',
      'Integração com WhatsApp e Formulários de Contato'
    ],
    clauses: `CLÁUSULA TÉCNICA - HOSPEDAGEM E DOMÍNIO:
A contratação e pagamento de domínio e hospedagem são de responsabilidade exclusiva do CONTRATANTE. O CONTRATADO prestará suporte na configuração inicial, mas não se responsabiliza por renovações futuras ou falhas nos servidores de terceiros.

COMPATIBILIDADE DE NAVEGADORES:
O projeto será compatível com as duas versões mais recentes dos navegadores Google Chrome, Safari, Firefox e Edge. Não há suporte garantido para versões antigas ou descontinuadas (ex: Internet Explorer).`
  },
  {
    id: 'app',
    label: 'App Mobile',
    icon: Smartphone,
    services: [
      'Design de Telas (Figma) e Prototipação de Alta Fidelidade',
      'Desenvolvimento Híbrido (React Native/Flutter) para Android e iOS',
      'Integração com APIs RESTful e Banco de Dados Local',
      'Testes de Usabilidade e Performance em Dispositivos Reais',
      'Compilação e Submissão para Apple App Store e Google Play Store'
    ],
    clauses: `CLÁUSULA DE PUBLICAÇÃO EM LOJAS:
O CONTRATADO realizará o processo técnico de submissão do aplicativo nas lojas (Apple Store e Google Play). O CONTRATANTE declara estar ciente de que é responsável pelas taxas anuais ou únicas cobradas pelas plataformas (Apple Developer Program / Google Play Console).

APROVAÇÃO NAS LOJAS:
O CONTRATADO adequará o aplicativo às diretrizes técnicas vigentes, porém a aprovação final depende exclusivamente da Apple e Google. Caso o modelo de negócio do CONTRATANTE infrinja regras das plataformas, o CONTRATADO não poderá ser responsabilizado pela rejeição.`
  },
  {
    id: 'maintenance',
    label: 'Manutenção Mensal',
    icon: Wrench,
    services: [
      'Monitoramento de Uptime e Disponibilidade (24/7)',
      'Backup Semanal de Banco de Dados e Arquivos',
      'Atualização de Plugins, Dependências e Patches de Segurança',
      'Correção de Bugs Críticos (Hotfixes) em até 24h',
      'Suporte Técnico via Email/WhatsApp (Horário Comercial)'
    ],
    clauses: `SLA (ACORDO DE NÍVEL DE SERVIÇO):
O tempo de resposta para chamados críticos é de até 24 horas úteis. Solicitações de novas funcionalidades, alterações de layout ou criação de novas páginas não estão inclusas na manutenção e serão orçadas separadamente como horas extras.

VIGÊNCIA E CANCELAMENTO:
Este contrato de manutenção tem renovação automática mensal. Pode ser cancelado por qualquer uma das partes mediante aviso prévio de 30 dias, sem multa rescisória após o período de fidelidade (se houver).`
  },
  {
    id: 'consulting',
    label: 'Consultoria Tech',
    icon: Zap,
    services: [
      'Análise e Definição de Arquitetura de Software Escalável',
      'Code Review (Revisão de Código) e Auditoria de Qualidade',
      'Otimização de Performance de Banco de Dados e Queries',
      'Mentoria Técnica para a Equipe Interna',
      'Documentação Técnica do Sistema'
    ],
    clauses: `NATUREZA DA CONSULTORIA:
O serviço limita-se à orientação estratégica, análise técnica e recomendação de soluções. A execução operacional de código rotineiro ("mão na massa") permanece sob responsabilidade da equipe interna do CONTRATANTE, salvo acordo específico em contrário descrito no escopo.

PROPRIEDADE INTELECTUAL:
Relatórios, diagramas e documentos produzidos durante a consultoria tornam-se propriedade do CONTRATANTE após o pagamento integral.`
  }
];

const Input = ({ label, value, onChange, placeholder, className = "", icon: Icon }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{label}</label>
    </div>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
          <Icon size={16} />
        </div>
      )}
      <input
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-900/30 border border-slate-800/60 text-slate-200 text-xs sm:text-sm ${Icon ? 'pl-10 sm:pl-11' : 'px-4'} py-2.5 sm:py-3 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500/40 focus:bg-slate-900/60 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 placeholder:text-slate-700 font-medium`}
      />
    </div>
  </div>
);

// Parses dd/MM/yyyy -> yyyy-MM-dd for the native input
const toBrowserDate = (ptDate) => {
  if (!ptDate) return '';
  const parts = ptDate.split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
  return '';
};
// Parses yyyy-MM-dd -> dd/MM/yyyy
const toPtDate = (isoDate) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
};

const DateInput = ({ label, value, onChange, className = '' }) => {
  const shortcuts = [
    { label: 'Hoje', days: 0 },
    { label: '+7d', days: 7 },
    { label: '+15d', days: 15 },
    { label: '+30d', days: 30 },
    { label: '+60d', days: 60 },
  ];
  const applyShortcut = (days) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    onChange(d.toLocaleDateString('pt-BR'));
  };
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] px-1 block">{label}</label>
      <div className="relative group">
        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none z-10" />
        <input
          type="date"
          value={toBrowserDate(value)}
          onChange={(e) => onChange(toPtDate(e.target.value))}
          className="w-full bg-slate-900/30 border border-slate-800/60 text-slate-200 text-sm pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-indigo-500/40 focus:bg-slate-900/60 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 font-medium [color-scheme:dark] cursor-pointer"
        />
      </div>
      <div className="flex gap-1.5 flex-wrap px-1">
        {shortcuts.map(s => (
          <button
            key={s.label}
            type="button"
            onClick={() => applyShortcut(s.days)}
            className="text-[8px] font-bold text-slate-500 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-full hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const TextArea = ({ label, value, onChange, placeholder, className = "", maxLength = 4000 }) => {
  const count = (value || '').length;
  const isOverLimit = count > 3000; // Average A4 limit for clean layout
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{label}</label>
          <div className="flex items-center gap-2">
             <span className={`text-[9px] font-mono ${isOverLimit ? 'text-amber-500 font-bold' : 'text-slate-600'}`}>
                {count.toLocaleString()} / {maxLength.toLocaleString()}
             </span>
             {isOverLimit && (
                 <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 animate-pulse">A4 Limit</span>
             )}
          </div>
      </div>
      <div className="relative">
        <textarea
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full bg-slate-900/30 border ${isOverLimit ? 'border-amber-500/30' : 'border-slate-800/60'} text-slate-200 text-sm px-4 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/40 focus:bg-slate-900/60 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 placeholder:text-slate-700 min-h-[120px] resize-y font-medium leading-relaxed`}
        />
        <div className="absolute bottom-3 right-3 flex gap-1">
            <div className={`w-1 h-1 rounded-full ${count > 1000 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            <div className={`w-1 h-1 rounded-full ${count > 2000 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            <div className={`w-1 h-1 rounded-full ${count > 3000 ? 'bg-amber-500' : 'bg-slate-800'}`} />
        </div>
      </div>
    </div>
  );
};




export const ContractForm = ({ data, onChange, onReset, clientProfiles = [], onSaveClient, onDeleteClient, onNotify }) => {
  const [activeSection, setActiveSection] = useState('parties');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isClauseLoading, setIsClauseLoading] = useState(false);
  const [isRiskLoading, setIsRiskLoading] = useState(false);
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const notify = (msg, type = 'success') => onNotify ? onNotify(msg, type) : alert(msg);
  
  // Local inputs
  const [newService, setNewService] = useState('');
  const [clausePrompt, setClausePrompt] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newSkill, setNewSkill] = useState('');

  const signatureInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // --- CEP LOOKUP ---
  const handleCepLookup = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    setIsCepLoading(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const json = await res.json();
      if (json.erro) {
        setCepError('CEP não encontrado.');
        return;
      }
      const address = `${json.logradouro}${json.complemento ? ', ' + json.complemento : ''} - ${json.bairro}, ${json.localidade} - ${json.uf}`;
      onChange({
        ...data,
        clientAddress: address,
        clientZip: cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2'),
      });
    } catch (e) {
      setCepError('Erro ao buscar CEP.');
    } finally {
      setIsCepLoading(false);
    }
  };

  // --- LOGIC HANDLERS ---
  const handleServiceAdd = () => {
    if (newService.trim()) {
      onChange({ ...data, services: [...data.services, newService] });
      setNewService('');
    }
  };

  const handleApplyTemplate = (template) => {
      if (confirm(`Aplicar o modelo "${template.label}"?\nIsso substituirá os serviços atuais e adicionará as cláusulas específicas.`)) {
          onChange({
              ...data,
              services: template.services,
              extraClauses: template.clauses
          });
      }
  };
  
  const handleAiImprove = async () => {
    if (!newService.trim()) return;
    setIsAiLoading(true);
    try {
      const refined = await refineServiceDescription(newService);
      onChange({ ...data, services: [...data.services, ...refined] });
      setNewService('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateClause = async () => {
    if (!clausePrompt.trim()) return;
    setIsClauseLoading(true);
    try {
      const clause = await generateLegalClause(clausePrompt);
      if (clause.startsWith('Erro:') || clause.startsWith('Erro ao')) {
        console.error(clause);
        return;
      }
      const currentClauses = data.extraClauses ? data.extraClauses + "\n\n" : "";
      onChange({ ...data, extraClauses: currentClauses + clause });
      setClausePrompt('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsClauseLoading(false);
    }
  };

  const handleAnalyzeRisks = async () => {
    setIsRiskLoading(true);
    try {
      const risks = await analyzeRisks(data);
      onChange({ ...data, risks });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRiskLoading(false);
    }
  };

  const handleGenerateTimeline = async () => {
    if (data.services.length === 0) return;
    setIsTimelineLoading(true);
    try {
      const timeline = await generateTimeline(data.services);
      onChange({ ...data, timeline });
      setActiveSection('details'); // Stay in details to see the timeline
    } catch (e) {
      console.error(e);
    } finally {
      setIsTimelineLoading(false);
    }
  };


  const handleQuoteAdd = () => {
    if (newItemDesc.trim() && newItemPrice) {
        const item = {
            id: Math.random().toString(36).substr(2, 9),
            description: newItemDesc,
            quantity: Number(newItemQty),
            unitPrice: parseFloat(newItemPrice.replace(',', '.'))
        };
        onChange({ ...data, quoteItems: [...data.quoteItems, item] });
        setNewItemDesc('');
        setNewItemPrice('');
        setNewItemQty('1');
    }
  };

  const handleSkillAdd = () => {
    if (newSkill.trim()) {
      onChange({ ...data, cvSkills: [...data.cvSkills, newSkill] });
      setNewSkill('');
    }
  };

  const handleImageUpload = (e, field) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              handleChange(field, reader.result);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleDeclarationTemplate = (type) => {
    let subject = '';
    let body = '';
    
    if (type === 'hours') {
        subject = 'Declaração de Horas Trabalhadas';
        body = `Declaramos para os devidos fins que ${data.contractorName}, inscrito no CPF ${data.contractorDoc}, prestou serviços de desenvolvimento de software no período de [DATA INICIO] a [DATA FIM], totalizando [TOTAL] horas de trabalho dedicadas ao projeto.`;
    } else if (type === 'service') {
        subject = 'Declaração de Prestação de Serviços';
        body = `Declaramos para os devidos fins de comprovação de renda e atividade que ${data.contractorName}, profissional autônomo na área de tecnologia, presta serviços de desenvolvimento de software para esta empresa de forma recorrente, recebendo mensalmente a quantia aproximada de R$ [VALOR].`;
    } else if (type === 'residence') {
        subject = 'Declaração de Residência';
        body = `Eu, ${data.contractorName}, inscrito no CPF ${data.contractorDoc}, declaro para os devidos fins que resido e sou domiciliado no endereço: ${data.contractorLocation}.`;
    } else if (type === 'vinculo') {
        subject = 'Declaração de Inexistência de Vínculo Empregatício';
        body = `Declaro, para os devidos fins, que presto serviços de natureza autônoma e eventual para [NOME DA EMPRESA], não havendo subordinação, habitualidade ou cumprimento de horário que caracterize vínculo empregatício nos moldes da CLT.`;
    }

    onChange({ ...data, letterSubject: subject, letterBody: body });
  };

  const handleCoverLetterTemplate = () => {
      onChange({
          ...data,
          letterSubject: "Apresentação: Desenvolvedor Fullstack Sênior",
          letterBody: "Prezados,\n\nAcompanho o trabalho da sua empresa há algum tempo e vejo grande potencial de otimização em suas plataformas digitais.\n\nCom minha experiência em React, Next.js e performance web, tenho certeza que posso ajudar a reduzir o tempo de carregamento e aumentar a conversão de seus produtos.",
          coverLetterObjective: "Aplicar técnicas de engenharia de software para escalar seus produtos digitais e melhorar a experiência do usuário.",
          coverLetterCta: "Tenho disponibilidade para uma call rápida na próxima terça-feira às 14h. Aguardo seu retorno."
      });
  }

  // --- RENDER HELPERS ---
  const getSkin = (id) => {
    if (id === 'style') {
      return {
        active: 'bg-slate-800/90 border-purple-500/70 shadow-lg shadow-purple-500/10',
        idle: 'bg-slate-900/50 border-slate-700 hover:border-purple-500/40 hover:bg-slate-800/40',
      };
    }
    return sectionHeaderClasses[id];
  };



  const SectionHeader = ({ id, title, icon: Icon }) => {
    const active = activeSection === id;
    return (
      <button
        type="button"
        onClick={() => setActiveSection(active ? null : id)}
        className={`w-full flex items-center justify-between p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-700 hover:shadow-glow group relative overflow-hidden ${
          active 
            ? 'bg-slate-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-[1.01]' 
            : 'bg-slate-950/40 border-slate-800/40 hover:border-slate-700 hover:bg-slate-900/60'
        }`}
      >
        {active && (
           <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
        )}
        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-500 ${active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'}`}>
            <Icon size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className={`font-black text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{title}</h3>
            {active && <p className="text-[9px] sm:text-[10px] text-indigo-300/60 font-medium mt-0.5">Configurações desta seção</p>}
          </div>
        </div>
        <div className={`p-1.5 sm:p-2 rounded-lg transition-all duration-500 ${active ? 'bg-indigo-500/10 text-indigo-400 rotate-180' : 'bg-slate-900 text-slate-700'}`}>
          <ChevronDown size={14} className="sm:w-4 sm:h-4" />
        </div>
      </button>
    );
  };

  return (
    <>
    <div className="p-4 sm:p-6 pb-32 space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 mb-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="flex flex-col gap-1">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Fase do Documento</h3>
             <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
                {[
                  { id: 'draft', label: 'Rascunho', color: 'bg-slate-700', desc: 'Marca d\'água de rascunho' },
                  { id: 'pending', label: 'Em Revisão', color: 'bg-amber-500', desc: 'Carimbo de revisão técnica' },
                  { id: 'final', label: 'Finalizado', color: 'bg-emerald-500', desc: 'Documento limpo e oficial' },
                  { id: 'paid', label: 'Pago', color: 'bg-teal-500', desc: 'Carimbo de pagamento' }
                ].map(s => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleChange('status', s.id)}
                      className={`group relative flex flex-col items-center min-w-[100px] p-2 rounded-xl transition-all duration-300 border-2 ${
                          data.status === s.id 
                          ? `bg-slate-800/80 border-indigo-500/50 shadow-lg shadow-indigo-500/10` 
                          : 'border-transparent hover:bg-slate-800/30'
                      }`}
                    >
                        <div className={`w-2 h-2 rounded-full mb-1.5 ${data.status === s.id ? s.color : 'bg-slate-700'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${data.status === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                        <span className="text-[8px] text-slate-600 font-medium group-hover:text-slate-400 transition-colors hidden sm:block">{s.desc}</span>
                    </button>
                ))}
             </div>
          </div>
          <div className="h-px bg-slate-800/50 w-full" />
          <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 font-medium italic">O status altera marcas d'água e carimbos no PDF final.</p>
              <button type="button" onClick={onReset} className="inline-flex min-h-8 items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                <Eraser size={14} aria-hidden /> <span>Resetar Tudo</span>
              </button>
          </div>
      </div>

      {/* 1. IDENTIFICAÇÃO — mesmo acordeão em todas as telas (layout clássico) */}
      <div className="space-y-2">
        <SectionHeader id="parties" title="Identificação & Branding" icon={User} />
        {activeSection === 'parties' && (
          <div className="p-5 bg-slate-900/30 border-l-2 border-indigo-500 rounded-r-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-lg border border-dashed border-slate-600 flex items-center justify-center bg-slate-900 overflow-hidden shrink-0">
                {data.contractorLogo ? (
                  <img src={data.contractorLogo} className="w-full h-full object-contain" alt="" />
                ) : (
                  <ImageIcon className="text-slate-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-300 mb-1">Sua Logomarca</p>
                <p className="text-xs text-slate-500 mb-2">Exibida no topo dos documentos.</p>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="text-xs bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-700 text-white"
                >
                  Carregar logo
                </button>
                <input type="file" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'contractorLogo')} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Seus Dados (Contratado)</label>
                  <button 
                    onClick={() => {
                      onChange({
                        ...data,
                        contractorName: "Thomas Eduardo",
                        contractorDoc: "60.882.678/0001-77",
                        contractorLocation: "São Paulo - SP",
                        contractorRole: "Desenvolvedor Fullstack Sênior",
                        contractorContact: "devthomaseduardo@gmail.com | (11) 97497-5062",
                        contractorLinkedin: "linkedin.com/in/devthomaseduardo",
                        contractorGithub: "github.com/devthomaseduardo",
                        contractorPortfolio: "thomaseduardo.online"
                      });
                    }}
                    className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded hover:bg-indigo-500/20 transition-all flex items-center gap-1"
                  >
                    <Zap size={10} /> AUTO-PREENCHER MEUS DADOS
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pl-3 border-l border-slate-700">
                  <Input label="Nome Completo" value={data.contractorName} onChange={(e) => handleChange('contractorName', e.target.value)} />
                  <Input label="Função / Cargo" value={data.contractorRole} onChange={(e) => handleChange('contractorRole', e.target.value)} />
                  <Input label="CPF / CNPJ" value={data.contractorDoc} onChange={(e) => handleChange('contractorDoc', e.target.value)} />
                  <Input label="Cidade — estado" value={data.contractorLocation} onChange={(e) => handleChange('contractorLocation', e.target.value)} />
                  <Input label="Contato" value={data.contractorContact} onChange={(e) => handleChange('contractorContact', e.target.value)} />
                  <Input label="LinkedIn" value={data.contractorLinkedin} onChange={(e) => handleChange('contractorLinkedin', e.target.value)} />
                  <Input label="GitHub" value={data.contractorGithub} onChange={(e) => handleChange('contractorGithub', e.target.value)} />
                  <Input label="Portfólio URL" value={data.contractorPortfolio} onChange={(e) => handleChange('contractorPortfolio', e.target.value)} className="md:col-span-2" />
                </div>
              </div>

              {data.type !== 'cv' && (
                <div className="md:col-span-2 mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Destinatário (Cliente)</label>
                    
                    <div className="flex items-center gap-2">
                      {clientProfiles.length > 0 && (
                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                          <Users size={12} className="text-emerald-500" />
                          <select 
                            className="bg-transparent border-none text-[10px] font-bold text-slate-300 outline-none cursor-pointer"
                            onChange={(e) => {
                              const client = clientProfiles.find(c => c.clientDoc === e.target.value);
                              if (client) {
                                onChange({
                                  ...data,
                                  clientName: client.clientName,
                                  clientDoc: client.clientDoc,
                                  clientAddress: client.clientAddress,
                                  clientZipPhone: client.clientZipPhone
                                });
                              }
                            }}
                          >
                            <option value="">BANCO DE CLIENTES</option>
                            {clientProfiles.map(c => (
                              <option key={c.clientDoc} value={c.clientDoc}>{c.clientName}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <button 
                        onClick={() => {
                          if (!data.clientName || !data.clientDoc) return notify('Preencha pelo menos Nome e Documento do cliente.', 'error');
                          onSaveClient({
                            clientName: data.clientName,
                            clientDoc: data.clientDoc,
                            clientAddress: data.clientAddress,
                            clientZipPhone: data.clientZipPhone
                          });
                        }}
                        className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2"
                      >
                        <Save size={10} /> SALVAR NESTE BANCO
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pl-3 border-l border-slate-700">
                    <Input label="Nome / razão social" value={data.clientName} onChange={(e) => handleChange('clientName', e.target.value)} placeholder="Nome do Cliente ou Empresa" />
                    <Input label="CPF ou CNPJ do Cliente" value={data.clientDoc} onChange={(e) => handleChange('clientDoc', e.target.value)} placeholder="000.000.000-00" />

                    {/* CEP with lookup */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] px-1 block">CEP</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            value={data.clientZip || ''}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d{1,3})/, '$1-$2');
                              handleChange('clientZip', v);
                              setCepError('');
                            }}
                            onBlur={(e) => handleCepLookup(e.target.value)}
                            placeholder="00000-000"
                            maxLength={9}
                            className="w-full bg-slate-900/30 border border-slate-800/60 text-slate-200 text-sm pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-indigo-500/40 focus:bg-slate-900/60 transition-all placeholder:text-slate-700 font-medium font-mono"
                          />
                        </div>
                        <button
                          onClick={() => handleCepLookup(data.clientZip || '')}
                          disabled={isCepLoading}
                          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 shrink-0"
                        >
                          {isCepLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Globe size={16} />
                          )}
                          {isCepLoading ? 'Buscando...' : 'Buscar'}
                        </button>
                      </div>
                      {cepError && <p className="text-[10px] text-rose-400 px-1">{cepError}</p>}
                    </div>

                    <Input
                      label="Telefone do Cliente"
                      icon={Phone}
                      value={data.clientPhone || ''}
                      onChange={(e) => handleChange('clientPhone', e.target.value)}
                      placeholder="(11) 98888-8888"
                    />

                    <Input label="Endereço completo" value={data.clientAddress} onChange={(e) => handleChange('clientAddress', e.target.value)} className="md:col-span-2" placeholder="Preenchido automaticamente pelo CEP..." />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => onSaveClient({
                        clientName: data.clientName,
                        clientDoc: data.clientDoc,
                        clientAddress: data.clientAddress,
                        clientZipPhone: data.clientZipPhone
                      })}
                      disabled={!data.clientName || !data.clientDoc}
                      className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-2 hover:text-emerald-300 disabled:opacity-30 disabled:grayscale transition-all"
                    >
                      <UserPlus size={14} /> Salvar nos meus clientes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. DETALHES DO SERVIÇO / ITENS */}
      <div className="space-y-2">
        <SectionHeader 
            id="details" 
            title={data.type === 'cv' ? 'Experiência & Skills' : (data.type === 'letter' || data.type === 'declaration' || data.type === 'coverLetter') ? 'Conteúdo do Texto' : 'Escopo & Itens'} 
            icon={Briefcase} 
        />
        {activeSection === 'details' && (
             <div className="p-5 bg-slate-900/30 border-l-2 border-emerald-500 rounded-r-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                
                {/* TEMPLATES QUICK ACCESS */}
                {data.type === 'contract' && (
                    <div className="mb-6">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3 block">Modelos Rápidos (Templates)</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {SERVICE_TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => handleApplyTemplate(t)}
                                    className="flex flex-col items-center gap-2 p-3 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800 rounded-xl transition-all group"
                                >
                                    <div className="p-2 bg-slate-950 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
                                        <t.icon size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 group-hover:text-white text-center">{t.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="h-px bg-slate-800 my-6"></div>
                    </div>
                )}

                {/* CONTRATO */}
                {(data.type === 'contract' || data.type === 'nda') && (
                    <div className="space-y-4">
                        {data.type === 'contract' && (
                            <div className="space-y-4">
                                <div className="flex gap-2 flex-col md:flex-row">
                                    <input 
                                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                                        placeholder="Descreva o serviço a ser prestado..."
                                        value={newService}
                                        onChange={(e) => setNewService(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleServiceAdd()}
                                    />
                                    <button onClick={handleServiceAdd} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-white transition-colors"><Plus /></button>
                                    <button onClick={handleAiImprove} disabled={isAiLoading} className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded-lg text-white flex gap-2 items-center font-medium transition-colors">
                                        <Sparkles size={16} className={isAiLoading ? 'animate-spin' : ''}/> {isAiLoading ? 'Melhorando...' : 'IA Refine'}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        'Hospedagem e Domínio',
                                        'Otimização SEO',
                                        'Design Responsivo',
                                        'Integração API',
                                        'Suporte 30 dias',
                                        'Mentoria Técnica'
                                    ].map(chip => (
                                        <button
                                            key={chip}
                                            onClick={() => {
                                                if (!data.services.includes(chip)) {
                                                    handleChange('services', [...data.services, chip]);
                                                }
                                            }}
                                            className="text-[9px] font-bold text-slate-400 bg-slate-800/40 border border-slate-700 px-2 py-1 rounded-md hover:border-emerald-500 hover:text-white transition-all"
                                        >
                                            + {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            {data.type === 'nda' && <p className="text-sm text-slate-400 italic mb-2">O NDA já possui cláusulas padrão de sigilo. Adicione serviços específicos se necessário para contextualizar.</p>}
                            {data.services.map((s, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-slate-600 transition-colors">
                                    <span className="text-sm text-slate-300">{s}</span>
                                    <button onClick={() => {
                                        const updated = data.services.filter((_, idx) => idx !== i);
                                        handleChange('services', updated);
                                    }} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>

                        {data.services.length > 0 && (
                            <div className="pt-4 border-t border-slate-800">
                                <button 
                                    onClick={handleGenerateTimeline}
                                    disabled={isTimelineLoading}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold text-[10px] uppercase tracking-widest rounded-lg border border-indigo-500/20 flex items-center justify-center gap-2 transition-all"
                                >
                                    {isTimelineLoading ? <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-500 border-t-transparent" /> : <Bot size={14} />}
                                    {isTimelineLoading ? 'GERANDO CRONOGRAMA...' : 'GERAR CRONOGRAMA TÉCNICO (IA)'}
                                </button>
                                
                                {data.timeline && data.timeline.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {data.timeline.map((p, i) => (
                                            <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-white uppercase tracking-tight">{p.phase}</span>
                                                    <span className="text-[10px] font-mono text-indigo-400">{p.duration}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 leading-tight">{p.deliverables}</p>
                                            </div>
                                        ))}
                                        <button onClick={() => handleChange('timeline', [])} className="text-[10px] text-slate-600 hover:text-slate-400 uppercase font-bold">Limpar cronograma</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ORÇAMENTO e INVOICE */}
                {(data.type === 'quote' || data.type === 'invoice') && (
                    <div className="space-y-4">
                         <div className="grid grid-cols-12 gap-2 items-end bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <div className="col-span-12 md:col-span-6">
                                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Item / Serviço</label>
                                <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder="Descrição" />
                            </div>
                            <div className="col-span-4 md:col-span-2">
                                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Qtd</label>
                                <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm" type="number" value={newItemQty} onChange={e => setNewItemQty(e.target.value)} />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Preço Unit.</label>
                                <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm" type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="0.00" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <button onClick={handleQuoteAdd} className="w-full h-[38px] bg-emerald-500 hover:bg-emerald-400 rounded flex items-center justify-center text-black"><Plus size={20} /></button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {data.quoteItems.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-900/50 p-2 rounded border border-slate-800 text-sm">
                                    <span className="col-span-6 md:col-span-7 font-medium">{item.description}</span>
                                    <span className="col-span-2 text-center text-slate-400">{item.quantity}</span>
                                    <span className="col-span-3 md:col-span-2 text-right text-emerald-400">R$ {item.unitPrice.toFixed(2)}</span>
                                    <button onClick={() => {
                                         handleChange('quoteItems', data.quoteItems.filter(i => i.id !== item.id));
                                    }} className="col-span-1 text-slate-600 hover:text-red-500 flex justify-end"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CV */}
                {data.type === 'cv' && (
                    <div className="space-y-4">
                        <TextArea label="Resumo Profissional" value={data.cvSummary} onChange={e => handleChange('cvSummary', e.target.value)} className="min-h-[100px]" />
                        <TextArea label="Experiência Profissional" value={data.cvExperience} onChange={e => handleChange('cvExperience', e.target.value)} className="min-h-[150px]" />
                        <TextArea label="Educação" value={data.cvEducation} onChange={e => handleChange('cvEducation', e.target.value)} className="min-h-[80px]" />
                        
                        <div>
                             <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold ml-1 mb-2 block">Skills</label>
                             <div className="flex gap-2 mb-3">
                                <input className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Adicionar habilidade..." onKeyDown={e => e.key === 'Enter' && handleSkillAdd()} />
                                <button onClick={handleSkillAdd} className="bg-sky-500 text-black px-4 rounded font-bold hover:bg-sky-400 transition-colors">Add</button>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {data.cvSkills.map((skill, i) => (
                                    <span key={i} className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                        {skill} <button onClick={() => {
                                            const updated = data.cvSkills.filter((_, idx) => idx !== i);
                                            handleChange('cvSkills', updated);
                                        }} className="text-slate-500 hover:text-white"><Trash2 size={10}/></button>
                                    </span>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {/* TIMBRADO / CARTA / DECLARAÇÃO */}
                {(data.type === 'letterhead' || data.type === 'letter' || data.type === 'declaration') && (
                    <div className="space-y-4">
                        {data.type === 'declaration' && (
                            <div className="flex gap-2 mb-4 flex-wrap">
                                <button onClick={() => handleDeclarationTemplate('hours')} className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-colors">Horas</button>
                                <button onClick={() => handleDeclarationTemplate('service')} className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-colors">Prestação Serviços</button>
                                <button onClick={() => handleDeclarationTemplate('residence')} className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-colors">Residência</button>
                                <button onClick={() => handleDeclarationTemplate('vinculo')} className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-colors">Sem Vínculo</button>
                            </div>
                        )}
                        {data.type !== 'letterhead' && (
                            <Input label="Título / Assunto" value={data.letterSubject} onChange={e => handleChange('letterSubject', e.target.value)} />
                        )}
                        <TextArea 
                            label={data.type === 'letterhead' ? 'Conteúdo do Papel Timbrado' : 'Conteúdo do Documento'} 
                            value={data.letterBody} 
                            onChange={e => handleChange('letterBody', e.target.value)} 
                            className="min-h-[350px]" 
                        />
                    </div>
                )}

                {/* CARTA DE APRESENTAÇÃO (Novo) */}
                {data.type === 'coverLetter' && (
                    <div className="space-y-4">
                        <div className="mb-4">
                           <button onClick={handleCoverLetterTemplate} className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded border border-purple-500/50 hover:bg-purple-500 hover:text-black transition-colors">Preencher Modelo Padrão</button>
                        </div>
                        <Input label="Título / Assunto" value={data.letterSubject} onChange={e => handleChange('letterSubject', e.target.value)} />
                        <TextArea label="Corpo da Carta" value={data.letterBody} onChange={e => handleChange('letterBody', e.target.value)} className="min-h-[200px]" />
                        <div className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-lg space-y-4">
                            <TextArea label="Objetivo Principal (Destaque)" value={data.coverLetterObjective} onChange={e => handleChange('coverLetterObjective', e.target.value)} className="min-h-[80px]" />
                            <Input label="Chamada para Ação (CTA)" value={data.coverLetterCta} onChange={e => handleChange('coverLetterCta', e.target.value)} placeholder="Ex: Gostaria de agendar uma reunião..." />
                        </div>
                    </div>
                )}
             </div>
        )}
      </div>

      {/* 3. FINANCEIRO & PRAZOS (Contrato/Orçamento/Recibo) */}
      {(data.type === 'contract' || data.type === 'quote' || data.type === 'invoice') && (
        <div className="space-y-2">
            <SectionHeader id="financial" title="Financeiro & Datas" icon={Wallet} />
            {activeSection === 'financial' && (
                <div className="p-5 bg-slate-900/30 border-l-2 border-amber-500 rounded-r-xl grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    {data.type === 'contract' && (
                        <>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input 
                                        label="Valor Total (R$)" 
                                        value={data.valueTotal} 
                                        onChange={(e) => {
                                            const total = e.target.value;
                                            handleChange('valueTotal', total);
                                            const t = parseFloat(total.replace(',', '.') || '0');
                                            const e_val = parseFloat(data.valueEntry.replace(',', '.') || '0');
                                            handleChange('valueBalance', (t - e_val).toString().replace('.', ','));
                                        }} 
                                    />
                                    <Input 
                                        label="Entrada (Sinal)" 
                                        value={data.valueEntry} 
                                        onChange={(e) => {
                                            const entry = e.target.value;
                                            handleChange('valueEntry', entry);
                                            const t = parseFloat(data.valueTotal.replace(',', '.') || '0');
                                            const ev = parseFloat(entry.replace(',', '.') || '0');
                                            handleChange('valueBalance', (t - ev).toString().replace('.', ','));
                                        }} 
                                    />
                                    <Input label="Saldo" value={data.valueBalance} onChange={(e) => handleChange('valueBalance', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => {
                                            const t = parseFloat(data.valueTotal.replace(',', '.') || '0');
                                            const half = (t / 2).toString().replace('.', ',');
                                            handleChange('valueEntry', half);
                                            handleChange('valueBalance', half);
                                            notify('Valores divididos 50/50!');
                                        }}
                                        className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-2.5 rounded-xl border border-indigo-500/30 hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
                                    >
                                        DIVIDIR 50/50
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const t = parseFloat(data.valueTotal.replace(',', '.') || '0');
                                            handleChange('valueEntry', (t * 0.3).toFixed(2).replace('.', ','));
                                            handleChange('valueBalance', (t * 0.7).toFixed(2).replace('.', ','));
                                            notify('Sinal de 30% aplicado!');
                                        }}
                                        className="text-[10px] font-black bg-slate-800 text-slate-400 px-3 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
                                    >
                                        30% SINAL
                                    </button>
                                </div>
                            </div>
                            <DateInput
                                label="Data do Saldo"
                                value={data.balanceDate}
                                onChange={(val) => handleChange('balanceDate', val)}
                            />
                            <Input label="Prazo de Entrega (dias)" value={data.deliveryDays} onChange={(e) => handleChange('deliveryDays', e.target.value)} />
                            <Input label="Qtd. Revisões" value={data.revisionCount} onChange={(e) => handleChange('revisionCount', e.target.value)} />
                        </>
                    )}
                    {data.type === 'quote' && (
                         <div className="md:col-span-2">
                             <DateInput label="Validade da Proposta" value={data.quoteValidUntil} onChange={(val) => handleChange('quoteValidUntil', val)} />
                         </div>
                    )}
                    {data.type === 'invoice' && (
                        <>
                             <Input label="Número do Recibo/Nota" value={data.invoiceId} onChange={e => handleChange('invoiceId', e.target.value)} />
                             <DateInput label="Data de Emissão" value={data.invoiceIssueDate} onChange={(val) => handleChange('invoiceIssueDate', val)} />
                        </>
                    )}
                    {data.type !== 'invoice' && <DateInput label="Data do Documento" value={data.contractDate} onChange={(val) => handleChange('contractDate', val)} className="md:col-span-2" />}
                    <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-amber-500/10 mt-2">
                        <label className="text-[10px] uppercase text-amber-400 font-bold mb-2 block">Dados para Pagamento (Opcional)</label>
                        <Input label="Sua Chave PIX" value={data.pixKey} onChange={e => handleChange('pixKey', e.target.value)} placeholder="E-mail, CPF, CNPJ ou Aleatória" />
                        <p className="text-[10px] text-slate-500 mt-2">Isso gerará um QR Code (ou texto de instrução) no rodapé de orçamentos e notas fiscais.</p>
                    </div>

                    <div className="md:col-span-2 bg-slate-950 p-5 rounded-xl border border-indigo-500/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest">Calculadora Freelancer ROI</label>
                            <span className="text-[10px] text-slate-500 font-mono">Net vs Gross</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-[9px] text-slate-500 uppercase block mb-1">ISS (%)</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs" value={data.taxConfig?.iss ?? 0} onChange={e => handleChange('taxConfig', { ...(data.taxConfig || {}), iss: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="text-[9px] text-slate-500 uppercase block mb-1">IRRF (%)</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs" value={data.taxConfig?.irrf ?? 0} onChange={e => handleChange('taxConfig', { ...(data.taxConfig || {}), irrf: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="text-[9px] text-slate-500 uppercase block mb-1">Taxa Plataforma (%)</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs" value={data.taxConfig?.platformFee ?? 0} onChange={e => handleChange('taxConfig', { ...(data.taxConfig || {}), platformFee: Number(e.target.value) })} />
                            </div>
                        </div>
                        
                        {data.valueTotal && (
                            <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] text-indigo-300 uppercase font-bold">Valor Líquido Estimado</p>
                                    <p className="text-lg font-bold text-white">
                                        {(() => {
                                            const total = parseFloat(data.valueTotal?.toString().replace(',', '.') || '0') || 0;
                                            const tc = data.taxConfig || { iss: 0, irrf: 0, platformFee: 0 };
                                            const tax = ((tc.iss || 0) + (tc.irrf || 0) + (tc.platformFee || 0)) / 100;
                                            const net = total * (1 - tax);
                                            return net.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                        })()}
                                    </p>
                                </div>
                                <div className="text-right">
                                     <p className="text-[9px] text-slate-500 uppercase">Dedução Total</p>
                                     <p className="text-xs font-mono text-rose-400">-{ (data.taxConfig?.iss || 0) + (data.taxConfig?.irrf || 0) + (data.taxConfig?.platformFee || 0) }%</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      )}

      {/* 4. JURÍDICO & IA (Contrato/Orçamento/NDA) */}
      {(data.type === 'contract' || data.type === 'quote' || data.type === 'nda') && (
         <div className="space-y-2">
            <SectionHeader id="legal" title="Cláusulas & IA Jurídica" icon={Scale} />
            {activeSection === 'legal' && (
                <div className="p-5 bg-slate-900/30 border-l-2 border-rose-500 rounded-r-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <Input label="Foro (Cidade-UF)" value={data.forumCity} onChange={e => handleChange('forumCity', e.target.value)} />
                    
                    <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/20">
                         <div className="flex items-center gap-2 mb-3 text-rose-400">
                             <Bot size={18} /> <span className="text-sm font-bold uppercase">Gerador de Cláusulas</span>
                         </div>
                         <div className="flex gap-2 mb-3">
                            <input className="flex-1 bg-slate-950 border border-slate-700 rounded px-4 py-2 text-sm" placeholder="Ex: Multa por atraso de pagamento de 10%..." value={clausePrompt} onChange={e => setClausePrompt(e.target.value)} />
                            <button onClick={handleGenerateClause} disabled={isClauseLoading} className="bg-rose-500 hover:bg-rose-600 px-4 rounded text-white font-bold text-xs uppercase tracking-wide transition-colors">
                                {isClauseLoading ? '...' : 'Gerar'}
                            </button>
                         </div>
                    </div>
                    
                    <TextArea label="Cláusulas Adicionais / Observações" value={data.extraClauses} onChange={e => handleChange('extraClauses', e.target.value)} className="min-h-[150px] font-mono text-sm" />

                    <div className="pt-4 border-t border-slate-800">
                         <button 
                            onClick={handleAnalyzeRisks} 
                            disabled={isRiskLoading}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-amber-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                         >
                            {isRiskLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />
                            ) : <AlertTriangle size={16} />}
                            {isRiskLoading ? 'ANALISANDO DOCUMENTO...' : 'ANALISAR RISCOS COM IA'}
                         </button>

                         {data.risks && data.risks.length > 0 && (
                             <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                                 {data.risks.map((r, i) => (
                                     <div key={i} className={`p-3 rounded-lg flex gap-3 text-xs leading-relaxed ${
                                         r.type === 'risk' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 
                                         r.type === 'warning' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 
                                         'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                                     }`}>
                                         <div className="shrink-0 mt-0.5">
                                             {r.type === 'risk' ? <AlertTriangle size={14} /> : r.type === 'warning' ? <Info size={14} /> : <Lightbulb size={14} />}
                                         </div>
                                         <p>{r.message}</p>
                                     </div>
                                 ))}
                                 <button onClick={() => handleChange('risks', [])} className="text-[10px] text-slate-500 hover:text-slate-300 uppercase font-bold px-2 py-1">Limpar análise</button>
                             </div>
                         )}
                    </div>
                </div>
            )}
         </div>
      )}

      {/* 5. ESTILO & CORES */}
      <div className="space-y-2">
          <SectionHeader id="style" title="Cores & Identidade" icon={Palette} />
          {activeSection === 'style' && (
              <div className="p-5 bg-slate-900/30 border-l-2 border-purple-500 rounded-r-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                      {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6', '#1e293b', '#000000', '#475569'].map(c => (
                          <button
                            key={c}
                            onClick={() => handleChange('accentColor', c)}
                            className={`w-full aspect-square rounded-full border-2 transition-transform hover:scale-110 ${data.accentColor === c ? 'border-white' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                      ))}
                  </div>
                  <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={data.accentColor} 
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-xs text-slate-400 font-mono">{data.accentColor.toUpperCase()}</span>
                  </div>
              </div>
          )}
      </div>

      {/* 6. ASSINATURA */}
      <div className="space-y-2">
         <SectionHeader id="signature" title="Assinatura Digital" icon={PenTool} />
         {activeSection === 'signature' && (
             <div className="p-5 bg-slate-900/30 border-l-2 border-sky-500 rounded-r-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                 <p className="text-xs text-slate-400 mb-2">Faça upload de uma imagem da sua assinatura (PNG transparente recomendado).</p>
                 <div className="flex items-center gap-4">
                     <button onClick={() => signatureInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm border border-slate-600 transition-colors">
                         Carregar Assinatura
                     </button>
                     <input type="file" ref={signatureInputRef} onChange={(e) => handleImageUpload(e, 'contractorSignature')} className="hidden" accept="image/*" />
                     {data.contractorSignature && (
                         <button onClick={() => handleChange('contractorSignature', null)} className="text-red-400 text-sm hover:underline">Remover</button>
                     )}
                 </div>
                 {data.contractorSignature && (
                     <div className="mt-4 p-4 bg-slate-800 rounded-lg inline-block border border-slate-700">
                         <img src={data.contractorSignature} alt="Signature Preview" className="h-16 object-contain" />
                     </div>
                 )}
             </div>
         )}
      </div>

    </div>
    
    <footer className="mt-8 pt-8 pb-12 border-t border-slate-800/50 flex flex-col items-center gap-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Powered by</p>
        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span className="text-xs font-bold text-white">Thomas Eduardo <span className="text-indigo-400">@devthomas</span></span>
        </div>
        <p className="text-[9px] text-slate-600 mt-1">&copy; {new Date().getFullYear()} paper-contracts v2.5 | by devthomas</p>
    </footer>
    </>
  );
};

