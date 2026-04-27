import React from 'react';
import {
  FileText,
  Lock,
  Calculator,
  Receipt,
  FileBadge,
  ScrollText,
  PenTool,
  Send,
  UserCircle,
  X,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar = ({ currentType, onSelect, isOpen, onClose }) => {
  const menu = [
    { id: 'contract', label: 'Contrato Social', icon: FileText, desc: 'Formalização de parcerias' },
    { id: 'nda', label: 'NDA / Sigilo', icon: Lock, desc: 'Acordo de confidencialidade' },
    { id: 'quote', label: 'Orçamento', icon: Calculator, desc: 'Proposta comercial detalhada' },
    { id: 'invoice', label: 'Nota Fiscal', icon: Receipt, desc: 'Comprovante de pagamento' },
    { id: 'declaration', label: 'Declaração', icon: FileBadge, desc: 'Afirmação de fatos oficiais' },
    { id: 'letter', label: 'Papel Timbrado', icon: ScrollText, desc: 'Comunicação institucional' },
    { id: 'letterhead', label: 'Timbrado Pro', icon: PenTool, desc: 'Identidade visual avançada' },
    { id: 'coverLetter', label: 'Carta de Apresentação', icon: Send, desc: 'Introdução profissional' },
    { id: 'cv', label: 'Currículo Moderno', icon: UserCircle, desc: 'Apresentação de carreira' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-[60] w-full max-w-[300px] bg-midnight-deep border-r border-white/5 flex flex-col transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="absolute right-4 top-6 lg:hidden text-slate-500 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Header / Logo */}
      <div className="h-24 px-8 flex items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-azure to-azure-dark flex items-center justify-center shadow-lg shadow-azure/20">
            <FileText size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter text-white uppercase">Paper Contracts</span>
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Editorial Suite</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Document Types</p>
        {menu.map((item) => {
          const isActive = currentType === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full group flex flex-col gap-1 p-4 rounded-2xl transition-all duration-300 relative ${
                isActive 
                  ? 'bg-white/5 border border-white/10' 
                  : 'hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive ? 'bg-azure text-white' : 'bg-slate-900 text-slate-500 group-hover:text-azure-light'}`}>
                  <Icon size={18} />
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors">
                    {item.desc}
                  </span>
                </div>
              </div>
              
              {isActive && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-azure shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-8 border-t border-white/5">
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck size={14} className="text-azure" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Local Security</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Dados armazenados localmente de forma segura.</p>
        </div>
      </div>
    </div>
  );
};
