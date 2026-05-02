import React, { useEffect, useState } from 'react';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { Sidebar } from './components/Sidebar';
import { ATSAnalyzer } from './components/ATSAnalyzer';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { TechnologyPage } from './components/TechnologyPage';
import { SecurityPage } from './components/SecurityPage';
import { EnterprisePage } from './components/EnterprisePage';
import { auth, logout } from './firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';

import { INITIAL_CONTRACT_DATA } from './types';
import { Menu, Save, Trash2, FileText, Eye, History, ShieldCheck, AlertTriangle, Target, Fingerprint } from 'lucide-react';

import { getClients, saveClient as apiSaveClient, deleteClient as apiDeleteClient, getDocuments as apiGetDocs, saveDocument as apiSaveDoc, deleteDocument as apiDeleteDoc } from './services/api';

const STORAGE_KEY = 'papercontracts_current_v1';
const HISTORY_KEY = 'papercontracts_history_v1';

const App = () => {
  const [isDemoActive, setIsDemoActive] = useState(() => localStorage.getItem('paper_demo_active') === 'true');
  const [currentView, setCurrentView] = useState('home'); // home, login, tech, sec, ent
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);


  const [contractData, setContractData] = useState(INITIAL_CONTRACT_DATA);

  useEffect(() => {
    // Handle redirect results
    getRedirectResult(auth).catch(err => console.error("Redirect login error:", err));

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setIsDemoActive(true);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);


   const handleAccessDemo = () => {
     setIsDemoActive(true);
     localStorage.setItem('paper_demo_active', 'true');
   };

  const handleLogout = async () => {
    await logout();
    setIsDemoActive(false);
    localStorage.removeItem('paper_demo_active');
  };

  const [history, setHistory] = useState([]);
  const [cloudHistory, setCloudHistory] = useState([]);
  const [clientProfiles, setClientProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('form');
  const [lastSaved, setLastSaved] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAtsAnalyzer, setShowAtsAnalyzer] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContractData({ ...INITIAL_CONTRACT_DATA, ...parsed });
      } catch (e) {
        console.error(e);
      }
    }

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }

    // Load Clients & Documents from API
    const loadAppData = async () => {
      try {
        const [clients, docs] = await Promise.all([
            getClients().catch(() => []),
            apiGetDocs().catch(() => [])
        ]);
        setClientProfiles(clients);
        setCloudHistory(docs);
      } catch (e) {
        if (!e.message.includes('Unauthorized')) {
          console.error('Error loading app data:', e);
        }
      }
    };
    loadAppData();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contractData));
      setLastSaved(new Date());
    }, 1000);
    return () => clearTimeout(timer);
  }, [contractData]);

  const handleReset = () => {
    if (window.confirm('Resetar todos os dados?')) {
      setContractData({ ...INITIAL_CONTRACT_DATA, type: contractData.type });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleTypeChange = (type) => {
    setContractData({ ...contractData, type });
    setSidebarOpen(false);
    setShowHistory(false);
  };

  const saveToHistory = async () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newDoc = {
      ...contractData,
      id: id,
      savedAt: new Date().toISOString(),
      name: contractData.contractTitle || contractData.clientName || 'Documento sem nome'
    };
    
    // Local Save
    const updatedHistory = [newDoc, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    
    // Cloud Save if Logged In
    if (user) {
        try {
            const savedDoc = await apiSaveDoc({
                id: id,
                title: newDoc.name,
                type: newDoc.type,
                content: contractData
            });
            setCloudHistory(prev => [savedDoc, ...prev]);
            showToast('Documento salvo na nuvem!');
        } catch (e) {
            console.error('Cloud save failed:', e);
            showToast('Salvo localmente (Erro na nuvem)', 'info');
        }
    } else {
        showToast('Documento salvo no histórico local!');
    }
  };

  const saveClientProfile = async (client) => {
    try {
        await apiSaveClient(client);
        setClientProfiles(prev => [...prev.filter(c => c.clientDoc !== client.clientDoc), client]);
        showToast('Perfil do cliente salvo no banco de dados!');
    } catch (e) {
        showToast('Erro ao salvar cliente: ' + e.message, 'error');
    }
  };

  const deleteClientProfile = async (doc) => {
    if (confirm('Excluir perfil deste cliente?')) {
        try {
            await apiDeleteClient(doc);
            setClientProfiles(prev => prev.filter(c => c.clientDoc !== doc));
            showToast('Perfil excluído com sucesso!');
        } catch (e) {
            showToast('Erro ao excluir cliente: ' + e.message, 'error');
        }
    }
  }

  const loadFromHistory = (doc) => {
    if (confirm('Carregar este documento? Isso substituirá os dados atuais.')) {
      setContractData(doc);
      setShowHistory(false);
    }
  };

  const deleteFromHistory = (id) => {
    if (confirm('Excluir este documento do histórico?')) {
      const updatedHistory = history.filter(d => d.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    }
  };

  const exportData = () => {
    const data = {
      current: contractData,
      history: history
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contractforge_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.history) {
          setHistory(parsed.history);
          localStorage.setItem(HISTORY_KEY, JSON.stringify(parsed.history));
        }
        if (parsed.current) {
          setContractData(parsed.current);
        }
        showToast('Dados importados com sucesso!');
      } catch (err) {
        showToast('Erro ao importar arquivo.', 'error');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const calculateScore = () => {
    let score = 0;
    const d = contractData;
    
    // Identity (20pts)
    if (d.contractorName) score += 5;
    if (d.contractorRole) score += 5;
    if (d.contractorLocation) score += 5;
    if (d.contractorLogo) score += 5;

    // Contact & Links (20pts)
    if (d.contractorContact) score += 5;
    if (d.contractorLinkedin) score += 5;
    if (d.contractorGithub) score += 5;
    if (d.contractorPortfolio) score += 5;

    // Content Depth (40pts)
    if (d.type === 'cv') {
        if (d.cvExperience?.length > 100) score += 10;
        if (d.cvProjects?.length > 50) score += 10;
        if (d.cvSkills?.length > 10) score += 10;
        if (d.cvEducation?.length > 30) score += 10;
    } else {
        if (d.letterBody?.length > 200) score += 20;
        if (d.letterSubject?.length > 10) score += 10;
        if (d.coverLetterObjective?.length > 20) score += 10;
    }

    // Integrity (20pts)
    if (d.status === 'final' || d.status === 'paid') score += 20;

    return Math.min(score, 100);
  };

  const docTitle = () => {
    const t = contractData.type;
    if (t === 'contract') return 'Acordo Vinculativo';
    if (t === 'nda') return 'Protocolo de Sigilo';
    if (t === 'quote') return 'Proposta de Valor';
    if (t === 'invoice') return 'Extrato de Liquidação';
    if (t === 'declaration') return 'Atestado de Fé Pública';
    if (t === 'letter') return 'Correspondência Oficial';
    if (t === 'coverLetter') return 'Carta de Impacto';
    return 'Dossiê Estratégico';
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-midnight flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-t-2 border-azure rounded-full animate-spin" />
          <Fingerprint size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-azure/50" />
        </div>
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Autenticando</span>
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Paper Contracts Engine v3.0</span>
        </div>
      </div>
    );
  }

  if (!isDemoActive && !user) {
    if (currentView === 'login') {
      return <LoginPage 
        onBack={() => setCurrentView('home')} 
        onLoginSuccess={() => setIsDemoActive(true)} 
      />;
    }
    if (currentView === 'tech') return <TechnologyPage onBack={() => setCurrentView('home')} />;
    if (currentView === 'sec') return <SecurityPage onBack={() => setCurrentView('home')} />;
    if (currentView === 'ent') return <EnterprisePage onBack={() => setCurrentView('home')} />;
    
    return <HomePage 
      onAccessDemo={handleAccessDemo} 
      onNavigate={(view) => setCurrentView(view)}
    />;
  }


  const loadFromCloud = (doc) => {
    if (confirm(`Carregar o dossiê "${doc.title}"? Isso substituirá os dados atuais.`)) {
      setContractData(doc.content);
      showToast('Dossiê carregado da nuvem!');
      if (window.innerWidth < 1024) setSidebarOpen(false);
    }
  };

  const deleteFromCloud = async (id) => {
    if (confirm('Excluir este dossiê permanentemente da nuvem?')) {
        try {
            await apiDeleteDoc(id);
            setCloudHistory(prev => prev.filter(d => d.id !== id));
            showToast('Dossiê excluído da nuvem!');
        } catch (e) {
            showToast('Erro ao excluir: ' + e.message, 'error');
        }
    }
  };

  return (
    <div className="h-screen bg-midnight text-slate-100 font-sans flex overflow-hidden selection:bg-azure/30 print:h-auto print:overflow-visible print:bg-white">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300 print:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <div className="print:hidden">
        <Sidebar 
          currentType={contractData.type} 
          onSelect={handleTypeChange} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
          onLogout={handleLogout}
          cloudHistory={cloudHistory}
          onLoadCloud={loadFromCloud}
          onDeleteCloud={deleteFromCloud}
        />
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0 pb-20 md:pb-0 relative print:h-auto print:pb-0">
        <header className="h-28 lg:h-32 px-6 lg:px-12 flex items-center justify-between border-b border-white/[0.03] bg-black/40 backdrop-blur-3xl sticky top-0 z-[60] print:hidden transition-all duration-500">
          <div className="flex items-center gap-4 lg:gap-10">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/5"
              aria-label="Abrir Menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex flex-col items-end border-r border-white/5 pr-6 lg:pr-10 py-1">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-1">Node ID</span>
                <span className="text-[11px] font-mono text-azure/80 font-bold tracking-tighter">PHNX-0128-TX</span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter leading-none">
                    {showAtsAnalyzer ? 'Simulador ATS' : docTitle()}
                 </h2>
                 {showAtsAnalyzer && (
                    <button 
                      onClick={() => setShowAtsAnalyzer(false)}
                      className="ml-2 text-[9px] bg-rose-500/10 text-rose-500 px-3 py-1 rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all uppercase font-black tracking-widest"
                    >
                      Sair
                    </button>
                 )}
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-azure animate-pulse" />
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] whitespace-nowrap">Criptografia Camada 02 Ativa</span>
                 </div>
                 <span className="hidden lg:inline text-[9px] text-slate-700 font-bold uppercase tracking-widest border-l border-white/10 pl-3">v.3.2.0-STABLE</span>
              </div>
            </div>
          </div>

          {/* SYSTEM METRICS (DESKTOP) */}
          <div className="hidden xl:flex items-center gap-10">
             <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Integridade Semântica</span>
                   <span className={`text-[10px] font-mono font-black ${calculateScore() > 80 ? 'text-emerald-500' : calculateScore() > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {calculateScore()}%
                   </span>
                </div>
                <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden">
                   <div 
                      className={`h-full transition-all duration-1000 ${calculateScore() > 80 ? 'bg-emerald-500' : calculateScore() > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${calculateScore()}%` }} 
                   />
                </div>
             </div>

             {lastSaved && (
               <div className="flex flex-col items-end border-l border-white/5 pl-10">
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Último Sinc</span>
                 <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest uppercase">
                   {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                 </span>
               </div>
             )}
          </div>

          {/* ACTION CLUSTER */}
          <div className="flex items-center gap-2.5 lg:gap-4">
            <button
              onClick={() => setShowAtsAnalyzer(true)}
              title="Simulador de Admissibilidade"
              className="hidden lg:flex p-3.5 bg-white/5 hover:bg-emerald-500/5 text-slate-500 hover:text-emerald-400 rounded-2xl border border-white/5 hover:border-emerald-500/10 transition-all active:scale-95"
            >
              <Target size={20} />
            </button>

            <button
              onClick={() => window.print()}
              className="p-3.5 lg:px-6 lg:py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border border-white/10 active:scale-95 shadow-lg"
            >
              <FileText size={20} className="text-azure" /> 
              <span className="hidden xl:inline">Exportar PDF</span>
            </button>

            <button
              onClick={saveToHistory}
              className="px-6 py-3.5 lg:px-8 bg-azure hover:bg-azure-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-azure/10 active:scale-95 group border border-azure/50"
            >
              <Save size={20} className="group-hover:scale-110 transition-transform" /> 
              <span>Salvar <span className="hidden sm:inline">Protocolo</span></span>
            </button>
          </div>
        </header>

        {/* MOBILE BOTTOM NAV */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-midnight-lighter/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-8 z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.4)] print:hidden">
            <button 
                onClick={() => { setActiveTab('form'); setShowHistory(false); }}
                className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'form' && !showHistory ? 'text-azure scale-105' : 'text-slate-500'}`}
            >
                <div className={`p-2.5 rounded-xl transition-colors ${activeTab === 'form' && !showHistory ? 'bg-azure/10' : ''}`}>
                    <FileText size={22} strokeWidth={activeTab === 'form' && !showHistory ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Editor</span>
            </button>
            
            <button 
                onClick={() => { setActiveTab('preview'); setShowHistory(false); }}
                className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'preview' ? 'text-azure scale-105' : 'text-slate-500'}`}
            >
                <div className={`p-2.5 rounded-xl transition-colors ${activeTab === 'preview' ? 'bg-azure/10' : ''}`}>
                    <Eye size={22} strokeWidth={activeTab === 'preview' ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Visualizar</span>
            </button>

            <button 
                onClick={() => setShowHistory(true)}
                className={`flex flex-col items-center gap-1.5 transition-all ${showHistory ? 'text-azure scale-105' : 'text-slate-500'}`}
            >
                <div className={`p-2.5 rounded-xl transition-colors ${showHistory ? 'bg-azure/10' : ''}`}>
                    <History size={22} strokeWidth={showHistory ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Arquivo</span>
            </button>
        </div>

        <main className="flex-1 flex gap-4 lg:gap-8 p-4 lg:p-10 overflow-hidden print:overflow-visible print:block bg-[#020408]">
          <div
            tabIndex="0"
            className={`flex-1 overflow-y-auto border border-white/5 bg-slate-950/50 backdrop-blur-3xl rounded-[3rem] focus:outline-none focus-visible:ring-1 focus-visible:ring-azure/30 transition-all custom-scrollbar print:hidden shadow-2xl ${activeTab === 'form' ? 'block' : 'hidden md:block'}`}
            role="region"
            aria-label="Editor de Documentos"
          >
            {showAtsAnalyzer ? (
              <ATSAnalyzer cvData={contractData} onClose={() => setShowAtsAnalyzer(false)} />
            ) : showHistory ? (
              <div className="p-8 lg:p-12 animate-in-scale">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Dashboard</h2>
                    <p className="text-slate-500 text-sm mt-1">Gerencie seus documentos e backups locais.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={exportData}
                      className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-800 transition-all active:scale-95"
                    >
                      Exportar
                    </button>
                    <label className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-800 transition-all cursor-pointer active:scale-95">
                      Importar
                      <input type="file" className="hidden" accept=".json" onChange={importData} />
                    </label>
                    <div className="w-px h-6 bg-slate-800 mx-2"></div>
                    <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">Voltar</button>
                  </div>
                </div>
                
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 premium-glass rounded-[2.5rem] border-dashed border-2 border-white/5">
                    <div className="p-5 bg-white/[0.03] rounded-3xl mb-6">
                        <FileText size={40} className="text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sua biblioteca está vazia</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map(doc => (
                      <div key={doc.id} className="premium-glass group rounded-[2rem] p-8 hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                                {doc.type}
                            </span>
                          </div>
                          <button onClick={() => deleteFromHistory(doc.id)} className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                             <Trash2 size={18} />
                          </button>
                        </div>
                        <h3 className="font-black text-white truncate mb-2 text-xl tracking-tighter">{doc.name}</h3>
                        <p className="text-[11px] text-slate-500 mb-8 font-bold uppercase tracking-widest">
                          {new Date(doc.savedAt).toLocaleDateString('pt-BR')} &bull; {new Date(doc.savedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="mt-auto">
                          <button 
                            onClick={() => loadFromHistory(doc)}
                            className="w-full py-4 bg-white/5 hover:bg-azure hover:text-white text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-[0.98] border border-white/10 group-hover:border-azure/30"
                          >
                            Abrir Documento
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <ContractForm 
                data={contractData} 
                onChange={setContractData} 
                onReset={handleReset}
                clientProfiles={clientProfiles}
                onSaveClient={saveClientProfile}
                onDeleteClient={deleteClientProfile}
                onNotify={showToast}
              />
            )}
          </div>

          <div 
            tabIndex="0"
            className={`flex-1 bg-white/[0.02] border border-white/5 rounded-[3rem] relative focus:outline-none focus-visible:ring-1 focus-visible:ring-azure/30 transition-all custom-scrollbar overflow-y-auto print:bg-white print:overflow-visible print:block shadow-2xl ${activeTab === 'preview' ? 'block' : 'hidden md:block'} ${showAtsAnalyzer ? '!hidden' : ''}`}
            role="region"
            aria-label="Visualização do Documento"
          >
            {!showAtsAnalyzer && (
                <>
                    <div className="absolute inset-0 bg-slate-900 z-0 print:hidden" />
                    <div className="relative z-10 h-full print:h-auto print:overflow-visible">
                      <ContractPreview 
                        data={contractData} 
                        onChange={(updates) => setContractData(prev => ({ ...prev, ...updates }))} 
                      />
                    </div>
                </>
            )}
          </div>
        </main>

        {/* CUSTOM TOAST */}
        {toast && (
            <div className="fixed top-20 right-6 left-6 md:left-auto md:w-80 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
                    toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                    <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {toast.type === 'error' ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;
