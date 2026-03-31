import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import logo from '../assets/finance_logo.png';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.role === 'admin') navigate('/admin/dashboard');
      else if (result.role === 'staff') navigate('/staff/dashboard');
      else if (result.role === 'agent') navigate('/agent/dashboard');
      else navigate('/app/dashboard');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && email && password && !loading) handleLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#0d1117] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-emerald-500/5 blur-[100px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-110 bg-[#161b22] border border-[#30363d] rounded-[36px] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 pb-4 bg-linear-to-br from-[#020617] to-[#161b22] relative border-b border-[#30363d]">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-2.5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight uppercase leading-none">GLOBAL<span className="text-blue-500"> LOAN</span></h1>
            <p className="text-[9px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-2">Loan Management System</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8 pt-6">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-[#e6edf3] uppercase leading-none mb-2 tracking-widest">Sign In</h2>
            <p className="text-slate-500 font-bold text-[8px] uppercase tracking-wider opacity-60">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center text-center animate-shake">
              <p className="text-[10px] font-bold uppercase tracking-wider">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4 space-y-2">
            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest leading-none px-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              className="w-full px-5 py-3.5 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[14px] font-bold text-[#e6edf3] placeholder:text-[#6e7681]
                 focus:outline-none focus:border-blue-600 focus:bg-[#161b22] focus:ring-10 focus:ring-blue-600/10 transition-all shadow-inner"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 space-y-2">
            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest leading-none px-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[14px] font-bold text-[#e6edf3] placeholder:text-[#6e7681]
                   focus:outline-none focus:border-blue-600 focus:bg-[#161b22] focus:ring-10 focus:ring-blue-600/10 transition-all shadow-inner"
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

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full py-4.5 rounded-2xl font-bold text-white text-[11px] tracking-[0.2em] uppercase
              transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl
              bg-blue-600 hover:bg-[#020617] hover:shadow-blue-600/20 shadow-blue-500/10 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign In <ChevronRight size={18} /></>
            )}
          </button>

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <span className="text-[8px] font-bold text-blue-500 uppercase tracking-[0.4em] animate-pulse">Signing in...</span>
            </div>
          )}

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-400 transition-colors">Register</Link>
            </p>
          </div>
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
