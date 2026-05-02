import React, { useState } from 'react';
import { Mail, Lock, Github, ArrowRight, Fingerprint, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithGoogle, signInWithGithub, loginEmail, registerEmail } from '../firebase';

export const LoginPage = ({ onBack, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (method) => {
    setError('');
    setLoading(true);
    try {
      if (method === 'google') await signInWithGoogle();
      if (method === 'github') await signInWithGithub();
      onLoginSuccess();
    } catch (err) {
      if (err.message.includes('auth/unauthorized-domain')) {
        setError(`DOMÍNIO NÃO AUTORIZADO: Adicione "localhost" e "paper-contracts.vercel.app" na lista de Domínios Autorizados no Console do Firebase.`);
      } else {
        setError(`FALHA NA AUTENTICAÇÃO: ${err.message}`);
      }
    } finally {

      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await registerEmail(email, password);
      } else {
        await loginEmail(email, password);
      }
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-azure/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in duration-500">
        {/* Card */}
        <div className="premium-glass rounded-[2.5rem] border border-white/5 p-10 shadow-2xl backdrop-blur-3xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-xl">
               <Fingerprint size={32} className="text-azure" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              {isRegister ? 'Criar Conta' : 'Acesse sua Conta'}
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
              Paper Contracts Enterprise
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 animate-shake">
              <AlertCircle size={18} className="text-rose-500 shrink-0" />
              <p className="text-[10px] font-black text-rose-400 uppercase leading-relaxed">{error}</p>
            </div>
          )}

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all active:scale-95 group disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-azure transition-colors">Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all active:scale-95 group disabled:opacity-50"
            >
              <Github size={20} className="text-white group-hover:text-azure transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-azure transition-colors">GitHub</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em] text-slate-700 bg-[#080a0f] px-4">
              Ou via E-mail
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-azure transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-azure/50 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha Forense</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-azure transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-azure/50 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-azure hover:bg-blue-400 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-azure/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (isRegister ? 'Confirmar Registro' : 'Entrar no Sistema')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
             <button 
               onClick={() => setIsRegister(!isRegister)}
               className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
             >
               {isRegister ? 'Já possui conta? Faça Login' : 'Não tem conta? Registre-se aqui'}
             </button>
             <button 
               onClick={onBack}
               className="text-[9px] font-black text-slate-700 hover:text-rose-500 uppercase tracking-[0.3em] transition-colors"
             >
               Voltar para Home
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
