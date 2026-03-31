import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Activity, CheckCircle, Gift, ArrowRight, ShieldCheck, Zap, 
  Layers, Globe, Star, Info, ChevronRight, History, AlertTriangle, Database,
  PlusCircle, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { RiskBadge, StatusBadge, StatCard, Btn } from '../../components/UI';
import { THEME } from '../../theme';
import Modal from '../../components/Modal';

export default function BorrowerDashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [isSecurityModalOpen, setSecurityModalOpen] = useState(false);
  const [myLoans, setMyLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    activeLoan: null,
    totalPaid: 0
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/client/stats');
        if (statsRes.data.success) {
          setStats({
            activeLoan: statsRes.data.stats.activeLoan,
            totalPaid: statsRes.data.stats.totalPaid || 0
          });
        }

        const loansRes = await api.get('/client/loans/my');
        if (loansRes.data.success) setMyLoans(loansRes.data.loans || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeLoan = stats.activeLoan;
  const termsPendingLoan = myLoans.find(l => l.status === 'TERMS_SET');
  const defaults = myLoans.filter(l => l.status === 'LATE').length;
  const risk = defaults > 0 ? 'RED' : myLoans.length > 0 ? 'GREEN' : 'AMBER';
  const riskStyle    = THEME.risk[risk];

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 pb-24 animate-in fade-in duration-700 px-2 lg:px-4">
      {/* Hero Banner - Compact & Professional */}
      <div className="bg-[#020617] rounded-[40px] p-4 md:p-5 text-white relative overflow-hidden shadow-md group active:scale-[0.98] transition-transform cursor-pointer" onClick={() => navigate('/app/profile')}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <p className="text-blue-400 text-[10px] font-bold tracking-wider uppercase opacity-80">Welcome back to LOANAPP Registry</p>
               <h2 className="text-lg md:text-xl font-bold text-white uppercase leading-tight">Hello, {user?.name || 'Borrower'} 👋</h2>
               <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="px-4 py-2 bg-[#161b22]/5 border border-white/10 rounded-2xl backdrop-blur-md">
                     <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-0.5 opacity-60">Node ID</p>
                     <p className="text-[11px] font-bold text-white tracking-wider uppercase">{user?.id ? `NODE-${user.id}` : 'BW-001'}</p>
                 </div>
                 <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-md flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Lv. 2 Secure</span>
                 </div>
              </div>
           </div>
           <div className="hidden md:flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-[24px] bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-2xl">
                 <Star size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mt-2 opacity-60">Elite Tier</p>
           </div>
        </div>
      </div>

      {/* Primary Action Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Risk & Credit Health */}
         <div
           className="md:col-span-2 lg:col-span-2 rounded-[28px] p-5 md:p-8 border border-[#30363d] shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer bg-[#161b22]"
           onClick={() => navigate('/app/loans')}
         >
           <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.05] group-hover:scale-110 transition-transform duration-700" style={{ color: riskStyle.dot }}>
              <Activity size={192} strokeWidth={1} />
           </div>
           <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 h-full">
             <div className="flex-1">
               <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60" style={{ color: riskStyle.dot }}>Account Status</p>
               <h3 className="text-xl md:text-3xl font-bold uppercase" style={{ color: riskStyle.dot }}>
                 {risk === 'GREEN' ? 'Premium Credit Path ✅' : risk === 'AMBER' ? 'Verification Alert ⚠️' : 'Incident Flagged 🔴'}
               </h3>
               <p className="text-[10px] mt-4 max-w-xl font-bold uppercase tracking-wider leading-loose opacity-60" style={{ color: riskStyle.dot }}>
                  Your risk-level profile is live. Maintain consistent repayments to stay in the premium tier.
               </p>
             </div>
             <div className="flex flex-col items-center gap-4">
                <RiskBadge risk={risk} />
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity" style={{ color: riskStyle.dot }}>
                   Analyze Path <ArrowRight size={14} />
                </div>
             </div>
           </div>
         </div>

         {/* Loan Center - NEW CLEAR CTA */}
         <div
           onClick={() => navigate('/app/apply')}
           className="bg-blue-600 rounded-[28px] p-5 md:p-8 text-white flex flex-col justify-between group hover:bg-[#020617] hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden active:scale-95"
         >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#161b22]/10 blur-[60px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
            <div className="relative z-10 w-12 h-12 rounded-[18px] bg-[#161b22] text-blue-600 flex items-center justify-center mb-3 shadow-xl">
               <PlusCircle size={24} strokeWidth={3} />
            </div>
            <div className="relative z-10">
               <p className="text-[9px] font-bold text-blue-200 uppercase tracking-wider mb-1 leading-none">Need money?</p>
               <h3 className="text-xl font-bold uppercase">Apply Now</h3>
               <p className="text-[9px] mt-1 font-bold uppercase tracking-wider opacity-60">Instant Loan Record</p>
            </div>
         </div>

         {/* Referral Quick Action */}
         <div
           onClick={() => navigate('/app/referrals')}
           className="bg-[#161b22] rounded-[28px] p-5 md:p-8 border border-[#30363d] flex flex-col items-center justify-center text-center group hover:border-blue-600 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden active:scale-95"
         >
            <div className="relative z-10 w-12 h-12 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-[#020617] group-hover:text-white transition-all shadow-inner">
               <Gift size={24} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 leading-none">Referral Bounty</p>
               <p className="text-xl font-bold text-white">K150.00</p>
            </div>
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600/5 blur-[40px]" />
         </div>
      </div>

      {/* Fast Metrics Section */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <button onClick={() => navigate('/app/loans')} className="bg-[#161b22] p-1.5 rounded-[20px] border-none text-left cursor-pointer group active:scale-95 transition-transform">
          <StatCard label="Loans" value={myLoans.length} color="#ffffff" icon={Layers} trend="Total" />
        </button>
        <button onClick={() => navigate('/app/loans')} className="bg-[#161b22] p-1.5 rounded-[20px] border-none text-left cursor-pointer group active:scale-95 transition-transform">
           <StatCard label="Owed" value={activeLoan ? `K${Number(activeLoan.currentPrincipal).toLocaleString()}` : 'K0'} color="#2563eb" icon={Zap} trend="Principal" />
        </button>
        <button onClick={() => navigate('/app/loans')} className="bg-[#161b22] p-1.5 rounded-[20px] border-none text-left cursor-pointer group active:scale-95 transition-transform">
           <StatCard label="Paid" value={`K${Number(stats.totalPaid).toLocaleString()}`} color="#10b981" icon={CheckCircle} trend="Cleared" />
        </button>
      </div>

      {/* Terms Acceptance Alert */}
      {termsPendingLoan && (
        <div className="flex items-center gap-4 p-4 md:p-8 bg-blue-50/50 border-2 border-blue-100 rounded-[24px] animate-pulse group cursor-pointer" onClick={() => navigate('/app/loans')}>
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-[16px] bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 flex-shrink-0">
             <FileText size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] md:text-lg font-bold text-blue-900 uppercase tracking-tight leading-none mb-1">Terms Ready</p>
            <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider opacity-80 truncate">Tap to review & accept your loan terms</p>
          </div>
          <ChevronRight size={18} className="text-blue-600 flex-shrink-0" />
        </div>
      )}

      {/* Critical Alerts */}
      {defaults > 0 && (
        <div className="flex items-center gap-4 p-4 md:p-8 bg-rose-50/50 border-2 border-rose-100 rounded-[24px] animate-pulse group cursor-pointer" onClick={() => navigate('/app/loans')}>
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-[16px] bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/30 flex-shrink-0">
             <AlertTriangle size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] md:text-lg font-bold text-rose-900 uppercase tracking-tight leading-none mb-1">Incident Flagged ({defaults})</p>
            <p className="text-[9px] text-rose-600 font-bold uppercase tracking-wider opacity-80 truncate">Tap to resolve overdue payments</p>
          </div>
          <ChevronRight size={18} className="text-rose-600 flex-shrink-0" />
        </div>
      )}

      {/* Data Matrix Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
         {/* Recent Streams Feed */}
         <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-3">
                  <Database size={14} className="text-blue-600" /> All Loans
               </h3>
               <button onClick={() => navigate('/app/loans')} className="text-[9px] font-bold text-blue-600 uppercase tracking-wider px-4 py-2 rounded-full transition-all border border-blue-600/30 bg-[#161b22] shadow-sm active:scale-95">
                  View All
               </button>
            </div>
            {myLoans.length === 0 ? (
               <div className="py-16 bg-[#161b22] rounded-[28px] border border-[#30363d] flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#21262d] text-[#6e7681] flex items-center justify-center mb-3">
                     <CreditCard size={28} />
                  </div>
                  <p className="text-sm font-bold text-[#e6edf3] uppercase tracking-tight">Zero Active Streams</p>
               </div>
            ) : (
               <div className="space-y-2.5">
                  {myLoans.slice(0,4).map(l => (
                     <div key={l.id} onClick={() => navigate('/app/loans')} className="bg-[#161b22] rounded-[22px] p-4 border border-[#30363d] flex items-center justify-between group hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden active:scale-[0.99]">
                        <div className="flex items-center gap-3 relative z-10 min-w-0">
                           <div className="w-10 h-10 rounded-[14px] bg-[#21262d] text-[#8b949e] group-hover:bg-[#020617] group-hover:text-blue-400 transition-all border border-[#30363d] flex items-center justify-center shrink-0">
                              <Zap size={18} strokeWidth={2.5} />
                           </div>
                           <div className="min-w-0">
                              <h4 className="text-[13px] font-bold text-[#e6edf3] uppercase tracking-tight leading-none mb-1.5 group-hover:text-blue-600 transition-colors truncate">{l.agent?.name || 'Global Lender'}</h4>
                              <div className="flex items-center gap-2 flex-wrap">
                                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">K{Number(l.principalAmount || l.amount || 0).toLocaleString()}</span>
                                 <span className="text-[9px] font-bold text-slate-500 uppercase">DUE {l.dueDate ? new Date(l.dueDate).toLocaleDateString() : 'N/A'}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10 shrink-0 ml-2">
                           <StatusBadge status={l.status} />
                           <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <div className="absolute left-0 top-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-[22px]" />
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Support Hub Area */}
         <div className="space-y-4">
            <div className="bg-blue-600 rounded-[28px] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setSecurityModalOpen(true)}>
               <div className="absolute top-0 right-0 w-40 h-40 bg-[#161b22]/10 blur-[60px] rounded-full group-hover:bg-[#1c2128]/20 transition-all duration-700" />
               <h4 className="text-lg font-bold uppercase tracking-tight mb-3">Security Protocol</h4>
               <p className="text-[10px] font-bold uppercase tracking-wider leading-loose opacity-80">
                  Your borrower node and asset data are encrypted and synchronized only with authorized lenders.
               </p>
               <button className="mt-6 w-full py-4 bg-[#161b22] text-white rounded-[18px] text-[10px] font-bold uppercase tracking-wider hover:bg-blue-50 transition-all active:scale-95 border-none shadow-xl flex items-center justify-center gap-2">
                  <Info size={16} /> Access Whitepaper
               </button>
            </div>

            <div className="bg-[#161b22] rounded-[28px] border border-[#30363d] p-5 shadow-sm relative overflow-hidden group">
               <div className="relative z-10">
                  <h4 className="text-[12px] font-bold text-[#8b949e] uppercase tracking-wider mb-4">Network Infrastructure</h4>
                  <div className="space-y-4">
                     {[
                       { color: 'bg-emerald-500', label: 'Main Registry Sync', status: 'Online' },
                       { color: 'bg-blue-500', label: 'Lender Nodes', status: 'Linked' },
                       { color: 'bg-[#6e7681]', label: 'Disbursement Hub', status: 'Standby' }
                     ].map((node, i) => (
                        <div key={i} className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${node.color} animate-pulse`} />
                              <span className="text-[10px] font-bold text-[#e6edf3] uppercase tracking-wider">{node.label}</span>
                           </div>
                           <span className="text-[9px] font-bold text-[#8b949e] uppercase tracking-wider">{node.status}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                  <Globe size={160} />
               </div>
            </div>
         </div>
      </div>

      {/* Security Protocol Modal */}
      <Modal isOpen={isSecurityModalOpen} onClose={() => setSecurityModalOpen(false)} title="Security Protocol • Encryption Hub">
         <div className="space-y-8 pb-4">
            <div className="p-10 bg-[#020617] rounded-[40px] text-white relative overflow-hidden shadow-2xl text-center">
               <div className="absolute inset-0 bg-blue-600/20 blur-[60px]" />
               <ShieldCheck size={56} className="mx-auto mb-4 text-blue-400" />
               <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-3">Data Integrity Status</h4>
               <p className="text-4xl font-bold tracking-tight uppercase">SECURED</p>
            </div>
            <div className="space-y-4">
               {[
                 'Personal NRC Identification Encrypted',
                 'Historical Credit Streams Hidden from Public',
                 'Authorized Lender Access Logged',
                 'Biometric Identity Synchronization Active'
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-4 p-5 bg-[#0d1117] rounded-[28px] border border-[#30363d]">
                    <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider leading-relaxed">{text}</span>
                 </div>
               ))}
            </div>
            <button 
               onClick={() => setSecurityModalOpen(false)}
               className="w-full py-6 bg-[#020617] text-white rounded-[28px] font-bold text-[11px] uppercase tracking-wider hover:bg-blue-600 transition-all shadow-2xl border-none cursor-pointer"
            >
               I Understand
            </button>
         </div>
      </Modal>
    </div>
  );
}
