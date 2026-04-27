import React, { useEffect, useState } from 'react';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { Sidebar } from './components/Sidebar';
import { INITIAL_CONTRACT_DATA } from './types';
import { Menu, Save, Trash2, FileText, Eye, History } from 'lucide-react';

import { getClients, saveClient as apiSaveClient, deleteClient as apiDeleteClient } from './services/api';

const STORAGE_KEY = 'papercontracts_current_v1';
const HISTORY_KEY = 'papercontracts_history_v1';

const App = () => {
  const [contractData, setContractData] = useState(INITIAL_CONTRACT_DATA);
  const [history, setHistory] = useState([]);
  const [clientProfiles, setClientProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('form');
  const [lastSaved, setLastSaved] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState(null);

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

    // Load Clients from API
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClientProfiles(data);
      } catch (e) {
        console.error('Error loading clients:', e);
      }
    };
    loadClients();
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

  const saveToHistory = () => {
    const newDoc = {
      ...contractData,
      id: Math.random().toString(36).substr(2, 9),
      savedAt: new Date().toISOString(),
      name: contractData.clientName || 'Documento sem nome'
    };
    const updatedHistory = [newDoc, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    showToast('Documento salvo no histórico!');
  };

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

  const docTitle = () => {
    const t = contractData.type;
    if (t === 'contract') return 'Contrato';
    if (t === 'nda') return 'NDA';
    if (t === 'quote') return 'Orçamento';
    if (t === 'invoice') return 'Nota Fiscal';
    if (t === 'declaration') return 'Declaração';
    if (t === 'letter') return 'Papel Timbrado';
    if (t === 'coverLetter') return 'Carta de apresentação';
    return 'Currículo';
  };

  return (
    <div className="h-screen bg-midnight text-slate-100 font-sans flex overflow-hidden selection:bg-azure/30">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <Sidebar 
        currentType={contractData.type} 
        onSelect={handleTypeChange} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 pb-20 md:pb-0 relative">
        <header className="h-16 md:h-24 premium-glass flex items-center justify-between px-6 md:px-12 shrink-0 z-40 sticky top-0 border-b border-white/5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white p-2.5 -ml-2 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"
              aria-label="Abrir Menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg md:text-2xl text-white tracking-tighter">
                  {docTitle()}
                </h1>
                <div className="hidden md:block px-2 py-0.5 rounded-md bg-azure/10 border border-azure/20">
                  <span className="text-[10px] font-black text-azure uppercase tracking-widest">Active Draft</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Workspace &middot; Paper Contracts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastSaved && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Auto-salvo às {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}

            <button
              onClick={saveToHistory}
              className="group bg-azure hover:bg-azure-dark text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5 shadow-xl shadow-azure/20 active:scale-95"
            >
              <Save size={16} className="group-hover:scale-110 transition-transform" /> 
              <span className="hidden md:inline">Salvar Documento</span>
              <span className="md:hidden">Salvar</span>
            </button>
          </div>
        </header>

        {/* MOBILE BOTTOM NAV */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-midnight-lighter/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-8 z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
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

        <main className="flex-1 flex overflow-hidden">
          <div
            className={`flex-1 overflow-y-auto border-r border-slate-800 bg-slate-950 ${activeTab === 'form' ? 'block' : 'hidden md:block'}`}
          >
            {showHistory ? (
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
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-azure">
                                {doc.type}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                doc.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                doc.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                doc.status === 'final' ? 'bg-azure/10 text-azure border-azure/20' :
                                'bg-white/5 text-slate-400 border-white/10'
                            }`}>
                                {doc.status === 'paid' ? 'PAGO' : doc.status === 'pending' ? 'REVISÃO' : doc.status === 'final' ? 'FINAL' : 'RASCUNHO'}
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

          <div className={`flex-1 bg-slate-900 relative ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>
            <div className="absolute inset-0 bg-slate-900 z-0" />
            <div className="relative z-10 h-full">
              <ContractPreview data={contractData} />
            </div>
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
