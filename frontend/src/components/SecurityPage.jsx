import React from 'react';
import { ShieldCheck, Lock, Fingerprint, EyeOff, ArrowLeft, Key, Scale } from 'lucide-react';

export const SecurityPage = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-sans selection:bg-azure/30 p-6 md:p-16 relative overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
      </button>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

      <main className="max-w-6xl mx-auto pt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocolos Forenses Ativos</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              Sua Privacidade <br/> é Inegociável.
            </h1>
          </div>
          <div className="w-full lg:w-1/3 aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
             <img src="/sec-editorial.png" alt="Security" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
          {/* Security Box 1 */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-12 rounded-[3rem] border border-white/10 space-y-8">
             <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <Lock size={40} className="text-emerald-500" />
             </div>
             <div className="space-y-4">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Criptografia de Ponta</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Utilizamos AES-256 para salvar seus dados localmente e conexões TLS 1.3 para qualquer comunicação com a nuvem. Seus documentos são fragmentados e protegidos por chaves únicas.
                </p>
             </div>
          </div>

          {/* Security Box 2 */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-12 rounded-[3rem] border border-white/10 space-y-8">
             <div className="w-20 h-20 bg-azure/10 rounded-3xl flex items-center justify-center border border-azure/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                <EyeOff size={40} className="text-azure" />
             </div>
             <div className="space-y-4">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Zero-Knowledge Architecture</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Nós não "lemos" o que você escreve. O processamento de IA é feito via tokens efêmeros que são destruídos após a geração dos insights, garantindo sigilo absoluto.
                </p>
             </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { icon: Fingerprint, label: 'Biometria Digital', desc: 'Acesso via Firebase Auth com autenticação multifator.' },
             { icon: Key, label: 'Vault Local', desc: 'Suas chaves de acesso nunca saem do seu navegador.' },
             { icon: Scale, label: 'Conformidade LGPD', desc: 'Total controle sobre seus dados e direito ao esquecimento.' }
           ].map((item, i) => (
             <div key={i} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-4 hover:bg-white/[0.05] transition-all">
                <item.icon size={24} className="text-slate-500" />
                <h4 className="text-sm font-black text-white uppercase tracking-widest">{item.label}</h4>
                <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">{item.desc}</p>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
};
