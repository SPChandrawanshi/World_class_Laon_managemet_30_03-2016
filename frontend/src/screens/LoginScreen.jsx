import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Shield, Fingerprint, Lock, ArrowUpRight, CheckCircle, Globe, 
  ChevronRight, ShieldCheck, Building2, User, Zap 
} from 'lucide-react';
import logo from '../assets/finance_logo.png';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../theme';

const ROLE_ICONS = {
  admin: <ShieldCheck size={24} />,
  staff: <Building2 size={22} />,
  borrower: <User size={24} />,
  agent: <Zap size={22} />
};

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (cred) => {
    setSelectedRole(cred);
    setEmail(cred.email || cred.phone || '');
    setPassword(cred.password);
    setError('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and Secure Key are required.');
      return;
    }
    setError('');
    setLoading(true);

    console.log("Button clicked");
    console.log("Sending request");
    const result = await login(email, password);
    console.log("Response received");
    setLoading(false);
    console.log("[LOGIN RESULT]", result);
    
    if (result.success) {
      if (result.role === 'admin') navigate('/admin/dashboard');
      else if (result.role === 'staff') navigate('/staff/dashboard');
      else if (result.role === 'agent') navigate('/agent/dashboard');
      else navigate('/app/dashboard');
    } else {
      setError(result.message || 'Access Denied. Check Credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d1117] flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full"></div>
      
      {/* Single Professional Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-[#161b22] border border-[#30363d] rounded-[36px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700">
        
        {/* Header Section */}
        <div className="p-8 pb-4 bg-gradient-to-br from-[#020617] to-[#161b22] relative border-b border-[#30363d]">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-2.5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight uppercase leading-none">GLOBAL<span className="text-blue-500"> LOAN</span></h1>
            <p className="text-[9px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-2">Financial Secure Node</p>
          </div>
        </div>

        {/* Portal Selection Body */}
        <div className="p-8 pt-6">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-[#e6edf3] uppercase leading-none mb-2 tracking-widest">Select Portal</h2>
            <p className="text-slate-500 font-bold text-[8px] uppercase tracking-wider opacity-60">Initialize secure terminal connection</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center text-center animate-shake">
              <p className="text-[10px] font-bold uppercase tracking-wider">{error}</p>
            </div>
          )}

          {/* Quick Access Dashboard Grid */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                onClick={() => handleRoleSelect(cred)}
                disabled={loading}
                className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all active:scale-95 disabled:opacity-50 group
                  ${selectedRole?.role === cred.role 
                    ? 'bg-blue-600/10 border-blue-600 shadow-lg shadow-blue-600/10' 
                    : 'bg-[#0d1117] border-[#30363d] hover:border-blue-600/50 hover:bg-[#1c2128]'}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-[#161b22]/[0.03] flex items-center justify-center transition-all mb-2
                  ${selectedRole?.role === cred.role ? 'text-blue-500 bg-blue-600/20' : 'text-[#6e7681] group-hover:text-blue-400'}`}>
                  {ROLE_ICONS[cred.role]}
                </div>
                <span className={`text-[7px] font-bold uppercase tracking-widest transition-colors
                  ${selectedRole?.role === cred.role ? 'text-white' : 'text-[#8b949e] group-hover:text-blue-200'}`}>
                  {cred.role}
                </span>
              </button>
            ))}
          </div>

          {/* Credentials Input */}
          <div className="mb-4 space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest leading-none">Identifier (Email/Phone)</label>
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@global.com"
              className="w-full px-5 py-3.5 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[14px] font-bold text-[#e6edf3] placeholder:text-[#6e7681]
                 focus:outline-none focus:border-blue-600 focus:bg-[#161b22] focus:ring-[10px] focus:ring-blue-600/10 transition-all shadow-inner"
            />
          </div>

          {/* Secure Key Input */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest leading-none">Secure Key</label>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[14px] font-bold text-[#e6edf3] placeholder:text-[#6e7681]
                   focus:outline-none focus:border-blue-600 focus:bg-[#161b22] focus:ring-[10px] focus:ring-blue-600/10 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Final Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className={`w-full py-4.5 rounded-2xl font-bold text-white text-[11px] tracking-[0.2em] uppercase
              transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl
              bg-blue-600 hover:bg-[#020617] hover:shadow-blue-600/20 shadow-blue-500/10 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Connect Terminal <ChevronRight size={18} /></>
            )}
          </button>

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-[8px] font-bold text-blue-500 uppercase tracking-[0.4em] animate-pulse">Syncing Secure Pipe...</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
