import React from 'react';
import { Cpu, Zap, BrainCircuit, Code2, ArrowLeft, Database, Search } from 'lucide-react';

export const TechnologyPage = ({ onBack }) => {
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

      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-1/2 h-screen bg-azure/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-6xl mx-auto pt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-azure/10 border border-azure/20 mb-8">
               <Cpu size={14} className="text-azure" />
               <span className="text-[10px] font-black text-azure uppercase tracking-widest">Stack Tecnológica 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              Onde o Código <br/> encontra o Direito.
            </h1>
          </div>
          <div className="w-full lg:w-1/3 aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
             <img src="/tech-editorial.png" alt="Tech" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {/* Tech Card 1 */}
          <div className="premium-glass p-10 rounded-[2.5rem] border border-white/5 space-y-6 group">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-azure/50 transition-all">
                <BrainCircuit size={32} className="text-azure" />
             </div>
             <h3 className="text-2xl font-black text-white tracking-tight">Motor IA Gemini 1.5</h3>
             <p className="text-slate-400 text-sm leading-relaxed font-medium">
               Utilizamos a infraestrutura da Google Cloud para processamento de linguagem natural, garantindo que seu currículo seja interpretado com precisão semântica total.
             </p>
             <div className="pt-6 border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latência: &lt; 800ms</div>
          </div>

          {/* Tech Card 2 */}
          <div className="premium-glass p-10 rounded-[2.5rem] border border-white/5 space-y-6 group">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-all">
                <Search size={32} className="text-emerald-400" />
             </div>
             <h3 className="text-2xl font-black text-white tracking-tight">Algoritmos de ATS</h3>
             <p className="text-slate-400 text-sm leading-relaxed font-medium">
               Simulamos os principais sistemas de recrutamento (Greenhouse, Workday, Gupy) para validar a legibilidade do seu documento antes do envio.
             </p>
             <div className="pt-6 border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acurácia: 99.8%</div>
          </div>

          {/* Tech Card 3 */}
          <div className="premium-glass p-10 rounded-[2.5rem] border border-white/5 space-y-6 group">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-400/50 transition-all">
                <Code2 size={32} className="text-blue-400" />
             </div>
             <h3 className="text-2xl font-black text-white tracking-tight">Arquitetura de SPA</h3>
             <p className="text-slate-400 text-sm leading-relaxed font-medium">
               Construído em React 19 com Vite, garantindo uma interface instantânea, sem recarregamentos de página, focada em produtividade.
             </p>
             <div className="pt-6 border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bundle Size: Optimizado</div>
          </div>
        </div>

        <section className="mt-32 p-12 bg-white/5 rounded-[3rem] border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-azure/10 skew-x-12 translate-x-20" />
           <div className="max-w-2xl relative z-10 space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Inovação Contínua</h2>
              <p className="text-slate-400 leading-relaxed font-medium">
                Nossa equipe de engenharia e advogados trabalha em conjunto para traduzir as mudanças nas leis de privacidade e as novas tendências de RH em código funcional.
              </p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
                    <Database size={14} className="text-azure" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Sync Local-First</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
                    <Zap size={14} className="text-azure" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Real-time Preview</span>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};
