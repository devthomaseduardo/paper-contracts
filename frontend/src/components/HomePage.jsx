import React from 'react';
import { ArrowRight, Fingerprint, Globe, Shield, Zap, Layout, ArrowUpRight } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

export const HomePage = ({ onAccessDemo, onNavigate }) => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      onAccessDemo(); 
    } catch (error) {
      console.error("Erro ao logar com Google:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0c] text-[#e0e2e5] font-serif selection:bg-azure/30 overflow-x-hidden">
      {/* Editorial Header */}
      <nav className="fixed w-full z-50 px-8 py-10 flex items-center justify-between mix-blend-difference">
        <div className="flex items-center gap-6 group cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-white/20 transition-transform group-hover:rotate-12">
             <Fingerprint size={20} className="text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase italic">Paper Contracts.</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12">
          <button onClick={() => onNavigate('tech')} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors">Tecnologia</button>
          <button onClick={() => onNavigate('sec')} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors">Segurança</button>
          <button onClick={() => onNavigate('ent')} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors">Empresas</button>
        </div>

        <button
          onClick={() => onNavigate('login')}
          className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full transition-all active:scale-95"
        >
          <span className="text-[10px] font-black uppercase tracking-widest italic">Acessar Sistema</span>
          <ArrowRight size={16} />
        </button>
      </nav>

      {/* Hero Section - Editorial Layout */}
      <section className="relative min-h-screen flex items-center pt-32 px-8 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center w-full max-w-[1600px] mx-auto">
          
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-azure block animate-in fade-in slide-in-from-bottom-4">Padrão Forense Digital</span>
              <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter italic">
                A Arte de <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 italic">Vencer Documentos.</span>
              </h1>
            </div>

            <p className="text-2xl text-white/50 leading-relaxed font-light max-w-xl italic">
              Não é apenas um gerador. É uma ferramenta de precisão artesanal que funde tipografia clássica com inteligência semântica para o profissional de elite.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 pt-6">
              <button
                onClick={() => onNavigate('login')}
                className="group w-full sm:w-auto bg-azure text-white px-12 py-6 rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all hover:bg-blue-400 hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] flex items-center justify-center gap-4 active:scale-95 italic"
              >
                Iniciar Sessão
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="h-px w-20 bg-white/10 hidden sm:block" />
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] italic">Disponível para Web & Desktop</span>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5">
              <img 
                src="/editorial-hero.png" 
                alt="Editorial Paper and Ink" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080a0c] via-transparent to-transparent opacity-60" />
            </div>
            
            {/* Overlay Info */}
            <div className="absolute -bottom-10 -left-10 p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl animate-float max-w-xs">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                    <Zap size={24} className="text-black" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-white leading-tight">Processamento Semântico</span>
               </div>
               <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest font-bold">
                 Análise em tempo real de cláusulas jurídicas e requisitos técnicos via Gemini 1.5 Pro Engine.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 px-8 lg:px-24 border-t border-white/5">
         <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-end gap-16">
            <div className="max-w-3xl space-y-8">
               <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
                  A estética do poder <br/> em cada pixel.
               </h2>
               <p className="text-xl text-white/40 font-light leading-relaxed">
                  Substituímos o genérico pelo autêntico. Nossa plataforma utiliza algoritmos de diagramação suíça para garantir que seu documento não apenas informe, mas imponha autoridade.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-20">
               <div className="space-y-4">
                  <div className="text-6xl font-black text-azure italic tracking-tighter">01.</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Análise ATS</div>
               </div>
               <div className="space-y-4">
                  <div className="text-6xl font-black text-emerald-500 italic tracking-tighter">02.</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Security Vault</div>
               </div>
            </div>
         </div>
      </section>

      {/* Aesthetic Image Row */}
      <section className="px-8 lg:px-24 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
           <div className="rounded-[3rem] overflow-hidden border border-white/5 relative group">
              <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-1000" alt="Tech" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
                 <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Tecnologia Suíça</h3>
                 <p className="text-sm text-white/60 font-medium uppercase tracking-widest">Layouts que respiram profissionalismo.</p>
              </div>
           </div>
           <div className="rounded-[3rem] overflow-hidden border border-white/5 relative group">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-1000" alt="Security" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
                 <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Vault Inviolável</h3>
                 <p className="text-sm text-white/60 font-medium uppercase tracking-widest">Sua propriedade intelectual, blindada.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Footer Editorial */}
      <footer className="py-32 px-8 lg:px-24 bg-[#05070a] border-t border-white/5">
         <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="col-span-2 space-y-10">
               <h3 className="text-4xl font-black italic tracking-tighter text-white">Paper Contracts.</h3>
               <p className="text-white/30 text-sm max-w-sm uppercase tracking-widest leading-loose font-bold">
                 A plataforma definitiva para quem entende que a apresentação é 50% da vitória.
               </p>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Navegação</h4>
               <ul className="space-y-4">
                  <li><button onClick={() => onNavigate('tech')} className="text-xs text-white/40 hover:text-azure transition-colors uppercase font-bold tracking-widest">Tecnologia</button></li>
                  <li><button onClick={() => onNavigate('sec')} className="text-xs text-white/40 hover:text-azure transition-colors uppercase font-bold tracking-widest">Segurança</button></li>
                  <li><button onClick={() => onNavigate('ent')} className="text-xs text-white/40 hover:text-azure transition-colors uppercase font-bold tracking-widest">Empresas</button></li>
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Contato</h4>
               <p className="text-xs text-white/40 uppercase font-bold tracking-widest">suporte@papercontracts.com</p>
               <div className="flex gap-4 pt-4">
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"><ArrowUpRight size={14} /></div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"><ArrowUpRight size={14} /></div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};
