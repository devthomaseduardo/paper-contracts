import React from 'react';
import { ArrowRight, FileText, Zap, Shield, History, Palette } from 'lucide-react';

export const HomePage = ({ onAccessDemo }) => {
  return (
    <div className="min-h-screen bg-midnight text-slate-100 font-sans selection:bg-azure/30 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-azure/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5 premium-glass">
        <div className="flex items-center gap-3">
          <img src="/paper‑contracts.png" alt="Paper Contracts Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <span className="font-black text-xl tracking-tighter text-white">Paper Contracts</span>
        </div>
        <button 
          onClick={onAccessDemo}
          className="text-xs font-black uppercase tracking-widest text-azure hover:text-white px-5 py-2.5 rounded-full border border-azure/30 hover:border-azure/60 hover:bg-azure/10 transition-all"
        >
          Acesso Demo
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="px-6 md:px-12 pt-32 pb-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mx-auto lg:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Plataforma Open Source</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">
              Documentos profissionais em <span className="text-transparent bg-clip-text bg-gradient-to-r from-azure to-emerald-400">segundos.</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Paper Contracts é uma plataforma de código aberto para criação instantânea de contratos, NDAs, notas fiscais e orçamentos. Sem cadastros complexos, sem custos mensais. Apenas a ferramenta que você precisa.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={onAccessDemo}
                className="group w-full sm:w-auto bg-white text-midnight hover:bg-slate-200 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
              >
                Testar Plataforma
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a 
                href="#features"
                className="group w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 backdrop-blur-md"
              >
                Como funciona
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-none relative flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-azure/20 to-transparent blur-3xl rounded-full" />
            <div className="relative rotate-2 hover:rotate-0 transition-transform duration-500 animate-float">
                <img 
                  src="/paper‑contracts.png" 
                  alt="Paper Contracts Hero" 
                  className="w-full max-w-[400px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
                />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 md:px-12 py-24 bg-black/20 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Projetado para eficiência</h2>
              <p className="text-slate-400">Tudo que você precisa para formalizar seus negócios, no seu navegador.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Rápido & Responsivo", desc: "Editor em tempo real com visualização lado a lado do documento." },
                { icon: Shield, title: "Privacidade Local", desc: "Seus dados ficam salvos apenas no seu navegador, sem servidores de terceiros." },
                { icon: History, title: "Histórico & Backups", desc: "Mantenha o histórico de versões e exporte backups completos dos seus contratos." },
                { icon: FileText, title: "Múltiplos Formatos", desc: "NDAs, orçamentos, notas fiscais, contratos de prestação de serviços e mais." },
                { icon: Palette, title: "Design Premium", desc: "Documentos com tipografia profissional e layout impecável prontos para impressão." },
                { icon: ArrowRight, title: "Exportação Direta", desc: "Gere arquivos PDF ou envie para impressão com um único clique." }
              ].map((feature, i) => (
                <div key={i} className="premium-glass p-8 rounded-[2rem] border border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon size={24} className="text-azure" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-12 py-8 text-center border-t border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            &copy; {new Date().getFullYear()} Paper Contracts. Plataforma Open Source.
          </p>
        </footer>
      </main>
    </div>
  );
};
