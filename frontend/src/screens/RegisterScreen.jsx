import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Eye, EyeOff, ArrowLeft, Upload, Gift, User, Phone, Mail, Briefcase, 
  Lock, Shield, ChevronRight, Calendar, MapPin, Zap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ fixedRole }) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({
    name: '', birthdate: '', address: '', phone: '', email: '', password: '', role: fixedRole || 'BORROWER',
    idScan: null, referralCode: searchParams.get('ref') || '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role,
      dob: form.birthdate || undefined,
      address: form.address || undefined,
    };
    console.log("[REGISTER CLICKED]", { ...payload, password: '***' });
    const res = await register(payload);
    setLoading(false);
    console.log("[REGISTER RESULT]", res);
    if (res.success) {
      setSuccessMsg('Registration successful! Your account is pending Admin approval. You will be able to log in once authorized.');
      setTimeout(() => navigate('/login'), 5000);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  const Field = ({ label, icon: Icon, children }) => (
    <div className="group">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors pointer-events-none">
          <Icon size={18} />
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#161b22] md:bg-[#0d1117] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 pt-8 pb-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button onClick={() => navigate('/login')}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#161b22] shadow-sm border border-gray-100 text-gray-600 hover:text-blue-600 transition-all active:scale-90">
          <ArrowLeft size={20}/>
        </button>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
             <Shield size={18} />
           </div>
           <span className="text-sm font-bold tracking-tight text-white uppercase">LOAN<span className="text-blue-600">APP</span></span>
        </div>
        <div className="w-10" />
      </div>

      {/* Form Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-5 pb-10 pt-4">
        <div className="w-full max-w-[450px]">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">Create Account</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.15em]">Enter your details to join</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider">{error}</p>
            </div>
          )}

          {successMsg ? (
            <div className="flex flex-col items-center justify-center p-8 bg-blue-50/5 border-2 border-emerald-500/20 rounded-3xl text-center space-y-4 animate-in zoom-in duration-500">
               <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                 <CheckCircle2 size={32} />
               </div>
               <h3 className="text-xl font-bold text-white uppercase tracking-tight">Application Received</h3>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider max-w-[300px] leading-relaxed">
                 {successMsg}
               </p>
               <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-4">Redirecting to login...</p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!fixedRole && (
            <div className="grid grid-cols-2 gap-4 mb-2">
              <button type="button" onClick={() => update('role', 'BORROWER')} className={`py-3 rounded-2xl border-2 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${form.role === 'BORROWER' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                <User size={16} /> Borrower
              </button>
              <button type="button" onClick={() => update('role', 'AGENT')} className={`py-3 rounded-2xl border-2 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${form.role === 'AGENT' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                 <Zap size={16} /> Agent
              </button>
            </div>
            )}

            <Field label="Full Name" icon={User}>
              <input type="text" placeholder="e.g. David Zulu" value={form.name} required
                onChange={e => update('name', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#161b22] border border-gray-100 rounded-2xl text-[14px] font-bold shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Birthdate" icon={Calendar}>
                <input type="date" value={form.birthdate} required
                  onChange={e => update('birthdate', e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#161b22] border border-gray-100 rounded-2xl text-[14px] font-bold shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" />
              </Field>
              <Field label="Phone" icon={Phone}>
                <input type="tel" placeholder="097..." value={form.phone} required
                  onChange={e => update('phone', e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#161b22] border border-gray-100 rounded-2xl text-[14px] font-bold shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" />
              </Field>
            </div>

            <Field label="Email Address" icon={Mail}>
              <input type="email" placeholder="you@example.com" value={form.email} required
                onChange={e => update('email', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#161b22] border border-gray-100 rounded-2xl text-[14px] font-bold shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" />
            </Field>

            <Field label="Residential Address" icon={MapPin}>
              <input type="text" placeholder="Street name, City" value={form.address} required
                onChange={e => update('address', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#161b22] border border-gray-100 rounded-2xl text-[14px] font-bold shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" />
            </Field>

            <Field label="Security Password" icon={Lock}>
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} required
                onChange={e => update('password', e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-[#161b22] border border-gray-100 rounded-2xl text-[14px] font-bold shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-600 transition-colors">
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </Field>

            {/* ID Scan Upload */}
            <div className="group">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                Government ID Scan
              </label>
              <label className="flex flex-col items-center justify-center gap-3 w-full py-8 bg-blue-50/30 border-2 border-dashed border-blue-100 rounded-3xl cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group/upload relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-[#161b22] shadow-sm flex items-center justify-center text-blue-600 group-hover/upload:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                   <p className="text-[11px] font-bold text-white uppercase tracking-wider">
                     {form.idScan ? 'ID Uploaded Successfully' : 'Tap to Upload ID Scan'}
                   </p>
                   <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tight">
                     {form.idScan ? form.idScan.name : 'JPEG, PNG, or PDF'}
                   </p>
                </div>
                <input type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => update('idScan', e.target.files[0])} />
              </label>
            </div>

            <button type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white text-[12px] tracking-wider uppercase
                bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 
                shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
              {loading ? 'Creating...' : 'Finish Registration'}
               <ChevronRight size={18} />
            </button>
          </form>
          )}

          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-8">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-600 font-bold hover:underline px-1">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}
