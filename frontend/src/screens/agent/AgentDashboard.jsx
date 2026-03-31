import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  Link2
} from 'lucide-react';
import { StatusBadge, StatCard, PageHeader } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeLoans: 0,
    totalCommission: 0,
    pendingPayout: 0
  });
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/register?ref=${user?.id || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, clientsRes] = await Promise.all([
        api.get('/agent/stats'),
        api.get('/agent/clients')
      ]);

      if (statsRes.data.success) {
        setStats({
          totalClients: statsRes.data.stats.clientsCount || 0,
          activeLoans: statsRes.data.stats.activeLoans || 0,
          totalCommission: statsRes.data.stats.totalEarnings || 0,
          pendingPayout: statsRes.data.stats.pendingPayout || 0
        });
      }

      if (clientsRes.data.success) {
        setRecentClients(clientsRes.data.clients.slice(0, 5) || []);
      }
    } catch (err) {
      console.error('Fetch agent dashboard error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = [
    { label: 'Total Referrals', value: stats.totalClients, icon: Users, color: '#ffffff', trend: 'Network Growth' },
    { label: 'Active Pipeline', value: stats.activeLoans, icon: Clock, color: '#7c3aed', trend: 'In Progress' },
    { label: 'Yield Earnt', value: `K${stats.totalCommission.toLocaleString()}`, icon: DollarSign, color: '#10b981', trend: 'Total Earnings' },
    { label: 'Unpaid Assets', value: `K${stats.pendingPayout.toLocaleString()}`, icon: Zap, color: '#f59e0b', trend: 'Pending Cycle' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="px-4">
        <PageHeader 
          title="Agent Overview" 
          subtitle="Track your referral performance and network yield"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {metrics.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} trend={s.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-l-4 border-blue-600 pl-4">Referred Borrowers</h2>
             <button onClick={() => navigate('/agent/clients')} className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline group">
               View All Clients <ArrowUpRight size={14} />
             </button>
          </div>
          
          <div className="bg-[#161b22] rounded-[40px] border border-[#30363d] shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0d1117]/50">
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Identity</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loan Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Yield Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan="3" className="py-10 text-center text-slate-500 text-[10px] font-bold uppercase animate-pulse">Synchronizing Records...</td></tr>
                  ) : recentClients.length > 0 ? recentClients.map((c, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate('/agent/clients')}>
                      <td className="px-8 py-6">
                        <p className="text-[14px] font-bold text-white uppercase leading-none mb-1">{c.name}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{c.phone}</p>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={c.loans?.[0]?.status || 'PENDING'} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[14px] font-bold text-blue-500">{c.loans?.[0]?.interestRate || 0}% Monthly</span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="py-20 text-center text-slate-500 text-[10px] font-bold uppercase italic">No referred clients found in memory</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#020617] p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl flex flex-col border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/30">
                  <Link2 size={22} />
                </div>
                <div>
                  <h2 className="text-[13px] font-bold text-white uppercase tracking-tight leading-tight">Your Referral Link</h2>
                  <p className="text-[9px] text-blue-400/70 font-bold uppercase tracking-wider">Share to earn commissions</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Referral URL</p>
                <p className="text-[10px] text-blue-300 font-mono break-all leading-relaxed">{referralLink}</p>
              </div>

              <button
                onClick={handleCopyLink}
                className={`w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-none cursor-pointer active:scale-95 ${
                  copied ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                } shadow-xl`}
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
              </button>

              <div className="mt-5 pt-5 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total Referrals</p>
                  <p className="text-[14px] font-bold text-white">{stats.totalClients}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Active Loans</p>
                  <p className="text-[14px] font-bold text-blue-400">{stats.activeLoans}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total Earned</p>
                  <p className="text-[14px] font-bold text-emerald-400">K{stats.totalCommission.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/agent/earnings')}
                className="mt-5 w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 border-none cursor-pointer active:scale-95"
              >
                View Earnings <ArrowUpRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
