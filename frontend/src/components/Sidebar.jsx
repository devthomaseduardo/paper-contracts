import React from 'react';
import {
  FileText,
  Calculator,
  UserCircle,
  ScrollText,
  ShieldCheck,
  ChevronRight,
  Receipt,
  FileBadge,
  Lock,
  Send,
  PenTool,
} from 'lucide-react';

export const Sidebar = ({ currentType, onSelect }) => {
  const menu = [
    { id: 'contract', label: 'Contrato', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { id: 'nda', label: 'NDA / Sigilo', icon: Lock, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { id: 'quote', label: 'Orçamento', icon: Calculator, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'invoice', label: 'Nota Fiscal', icon: Receipt, color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { id: 'declaration', label: 'Declaração', icon: FileBadge, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 'letter', label: 'Timbrado', icon: ScrollText, color: 'text-slate-400', bg: 'bg-slate-400/10' },
    { id: 'letterhead', label: 'Papel Timbrado', icon: PenTool, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { id: 'coverLetter', label: 'Carta Apresentação', icon: Send, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 'cv', label: 'Currículo', icon: UserCircle, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  ];

  return (
    <div className="w-20 lg:w-72 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col h-full shrink-0 transition-all duration-300 z-50">
      <div className="h-24 flex items-center justify-center lg:justify-start lg:px-10 border-b border-slate-800/30">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-indigo-500/10 shrink-0 relative group cursor-pointer overflow-hidden border border-slate-200">
          <img src="/paper‑contracts.png" alt="Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="ml-5 hidden lg:block overflow-hidden">
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent italic">paper-contracts</span>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">by devthomas</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto">
        <p className="hidden lg:block px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 mt-4">Documentos</p>
        {menu.map((item) => {
          const isActive = currentType === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden border-2 ${
                isActive
                  ? 'bg-indigo-500/10 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)] scale-[1.02]'
                  : 'border-transparent text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isActive ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-900 group-hover:bg-slate-800'} transition-all duration-300`}>
                <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
              </div>
              <span className={`font-semibold flex-1 text-left text-sm tracking-tight ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800/30 hidden lg:block">
        <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <p className="font-bold text-slate-200 text-xs tracking-tight">Cloud Backup</p>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Sua logo e preferências estão seguras no cache local.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
