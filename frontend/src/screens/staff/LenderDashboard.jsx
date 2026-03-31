import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Globe, Activity, AlertTriangle, ShieldCheck, 
  DollarSign, ChevronRight, Zap, Target, Search, RefreshCw, BarChart,
  Clock, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { StatusBadge, StatCard } from '../../components/UI';

export default function LenderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoans: 0,
    activeLoans: 0,
    pendingPayments: 0,
    latePayments: 0,
    pendingLoans: 0,
    totalCapital: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, loansRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/loans')
      ]);
      
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (loansRes.data.success) {
        setRecentRequests(loansRes.data.loans.filter(l =>
          ['PENDING', 'TERMS_SET', 'TERMS_ACCEPTED', 'FUNDS_CONFIRMED'].includes(l.status)
        ).slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      throw err; // Re-throw to handle in caller
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().catch(() => {});
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetchData();
      alert('Network Authority Synchronized: Node verified with Core Registry.');
    } catch (err) {
      alert('NETWORK ERROR: Synchronization failed. Please check your connection to the Core Registry.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 animate-in fade-in duration-700 px-4 pt-4">
      
      {/* Hero Section */}
      <div className="bg-[#020617] rounded-[32px] p-5 md:p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
           <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">Lender Portal • Node v2.4</p>
                 </div>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-2">Today's Work</h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider opacity-70">Hello {user?.name}, here is your priority list for today.</p>
           </div>

           <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handleSync}
                disabled={syncing}
                className="px-6 py-3 bg-[#161b22]/5 hover:bg-[#1c2128]/10 border border-white/10 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                 <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> 
                 {syncing ? 'Syncing...' : 'Refresh Ledger'}
              </button>
              <button 
                onClick={() => navigate('/staff/loans')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[11px] uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all flex items-center gap-3 active:scale-95 cursor-pointer group"
              >
                 <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                 Check Requests
              </button>
           </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Live Portfolio" value={`K${(stats.totalPrincipal || 0).toLocaleString()}`} color="#ffffff" icon={Globe} trend="Capital Value" />
        <StatCard label="Pending Approval" value={stats.pendingLoans || 0} color="#2563eb" icon={Activity} trend="Action Required" />
        <StatCard label="Late Collections" value={stats.overdueLoans || 0} color="#ef4444" icon={AlertTriangle} trend="Immediate Follow-up" />
        <StatCard label="Verified Clients" value={stats.totalUsers || 0} color="#10b981" icon={BarChart} trend="Network Growth" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Requests */}
          <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                    <Target size={16} className="text-blue-600" />
                    <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Priority Loan Requests</h3>
                 </div>
                 <button onClick={() => navigate('/staff/loans')} className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline cursor-pointer">
                    Check All
                 </button>
              </div>
              <div className="space-y-3">
                 {loading ? (
                   <div className="py-20 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse italic">Accessing Node...</div>
                 ) : recentRequests.length > 0 ? recentRequests.map((loan) => (
                    <div 
                       key={loan.id} 
                       className="p-5 bg-[#161b22] rounded-[32px] border border-[#30363d] flex items-center justify-between hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group shadow-sm gap-4"
                       onClick={() => navigate('/staff/loans')}
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all flex items-center justify-center border border-[#30363d] shadow-inner">
                             <Clock size={22} />
                          </div>
                          <div className="min-w-0">
                             <h4 className="text-[14px] font-bold text-white group-hover:text-blue-600 transition-colors uppercase truncate mb-1">{loan.user?.name}</h4>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ID: {loan.id} • {new Date(loan.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                             <p className="text-lg font-bold text-white group-hover:text-blue-600 transition-colors">K{Number(loan.principalAmount || loan.amount).toLocaleString()}</p>
                             <p className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Requested</p>
                          </div>
                          <StatusBadge status={loan.status} />
                          <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-600" />
                       </div>
                    </div>
                 )) : (
                   <div className="p-10 bg-[#161b22] rounded-[32px] border border-dashed border-[#30363d] text-center flex flex-col items-center justify-center">
                     <CheckCircle2 size={32} className="text-emerald-500 mb-4 opacity-50" />
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No pending requests</p>
                   </div>
                 )}
              </div>
          </div>

          {/* Quick Actions / Verify Portal */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-2">
                <Zap size={16} className="text-blue-600" />
                <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Verification Shortcuts</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                   onClick={() => navigate('/staff/payments')}
                   className="p-6 bg-[#161b22] rounded-[32px] border border-[#30363d] hover:border-emerald-500 transition-all cursor-pointer group shadow-sm bg-gradient-to-br from-[#161b22] to-[#161b22]"
                >
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <DollarSign size={24} />
                   </div>
                   <h4 className="text-sm font-bold text-white uppercase mb-1">Verify Payments</h4>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Confirm receipts & clear TRX</p>
                </div>
                <div 
                   onClick={() => navigate('/staff/calendar')}
                   className="p-6 bg-[#161b22] rounded-[32px] border border-[#30363d] hover:border-blue-500 transition-all cursor-pointer group shadow-sm"
                >
                   <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Clock size={24} />
                   </div>
                   <h4 className="text-sm font-bold text-white uppercase mb-1">Due List</h4>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Today's collection map</p>
                </div>
             </div>

             <div className="p-6 bg-[#020617] rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-600/5 blur-2xl group-hover:bg-blue-600/10 transition-all"></div>
                <div className="relative z-10">
                   <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-blue-400" /> Node Status
                   </h4>
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sync Integrity</span>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Verified</span>
                   </div>
                   <div className="h-1.5 w-full bg-[#161b22] rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                   </div>
                   <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-3 text-center">Connected to Core Money Network Protocol</p>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}

