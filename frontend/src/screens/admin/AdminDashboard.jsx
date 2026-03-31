import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, UserCheck, BarChart3, Lock, Users, CreditCard, Zap,
  Briefcase, History, ArrowUpRight, ShieldCheck, DollarSign,
  TrendingUp, Clock, AlertTriangle, PieChart, CalendarClock, CheckCircle2
} from 'lucide-react';
import api from '../../api/axios';
import { mockAuditLogs } from '../../data/mockData';
import { StatCard, StatusBadge } from '../../components/UI';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [collateralEnabled, setCollateralEnabled] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalPrincipal: 0,
    totalRevenue: 0,
    totalInterest: 0,
    totalLateFees: 0,
    totalPrincipalPaid: 0,
    pendingPaymentsCount: 0,
    pendingPaymentsAmount: 0,
    verifiedPaymentsCount: 0,
    totalCommission: 0,
    netRevenue: 0,
    upcomingPaymentsCount: 0,
    latePaymentsCount: 0,
    paidTodayCount: 0,
  });

  const [logs, setLogs] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);

  const fetchData = async () => {
    try {
      setLoadingLocal(true);
      const [statsRes, auditRes, configRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/audit'),
        api.get('/admin/config')
      ]);
      
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (auditRes.data.success) setLogs(auditRes.data.logs.slice(0, 5));
      if (configRes.data.success) {
        setCollateralEnabled(configRes.data.settings.collateral_enabled ?? true);
      }
    } catch (err) {
      console.error('Admin dashboard data fetch error', err);
    } finally {
      setLoadingLocal(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleCollateral = async () => {
    const newState = !collateralEnabled;
    console.log("[COLLATERAL TOGGLE CLICKED]", { from: collateralEnabled, to: newState });
    try {
      const res = await api.put('/admin/config', { settings: { collateral_enabled: String(newState) } });
      if (res.data.success) {
        setCollateralEnabled(newState);
      }
    } catch (err) {
      console.error('Failed to toggle collateral engine', err);
    }
  };

  const metrics = [
    { label: 'Total Users', value: stats.totalUsers ?? 0, icon: Users, color: '#ffffff', trend: 'Registered Members' },
    { label: 'Active Loans', value: stats.activeLoans ?? 0, icon: UserCheck, color: '#10b981', trend: 'Currently Running' },
    { label: 'Overdue Loans', value: stats.overdueLoans ?? 0, icon: Zap, color: '#ef4444', trend: 'Action Required' },
    { label: 'Total Principal', value: `K${((stats.totalPrincipal ?? 0)/1000).toFixed(1)}K`, icon: Globe, color: '#7c3aed', trend: 'Lent Out' },
    { label: 'Total Revenue', value: `K${(stats.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: '#10b981', trend: 'Interest + Penalties' },
    { label: 'Growth', value: `${stats.totalLoans ?? 0} Loans`, icon: BarChart3, color: '#6366f1', trend: 'Lifecycle Count' },
    { label: 'Net Revenue', value: `K${(stats.netRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: '#10b981', trend: 'After Commissions' },
    { label: 'Pending Payments', value: `K${(stats.pendingPaymentsAmount ?? 0).toLocaleString()}`, icon: Clock, color: '#f59e0b', trend: `${stats.pendingPaymentsCount ?? 0} Unverified` },
  ];

  const quickActions = [
    { label: 'Staff Accounts', path: '/admin/staff', icon: UserCheck, desc: 'Manage and verify lenders' },
    { label: 'Borrower List', path: '/admin/borrowers', icon: Users, desc: 'View all borrowers and history' },
    { label: 'Agent Network', path: '/admin/agents', icon: Briefcase, desc: 'Manage agents and commissions' },
    { label: 'Admin Access', path: '/admin/admins', icon: ShieldCheck, desc: 'Manage system administrators' },
    { label: 'All Loans', path: '/admin/loans', icon: CreditCard, desc: 'Monitor active and past loans' },
    { label: 'Payments Control', path: '/admin/payments', icon: DollarSign, desc: 'Financial tracking and verification' },
    { label: 'System Settings', path: '/admin/settings', icon: History, desc: 'Configure system and view logs' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20 px-1">
      <div className="bg-[#020617] rounded-3xl md:rounded-[48px] p-6 md:py-8 md:px-12 text-white relative overflow-hidden shadow-2xl group border border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md">
                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">System Health: Optimal</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white uppercase leading-tight mb-2">Authority <span className="text-blue-500">Center</span></h1>
            <p className="text-slate-400 text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-80">Loan Operations & System Management</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Server Region</p>
            <p className="text-sm font-bold text-white uppercase">Central Africa / Lusaka</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        {metrics.map((m, i) => (
          <StatCard key={i} label={m.label} value={m.value} icon={m.icon} color={m.color} trend={m.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Quick Actions Matrix */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Management Menu</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="bg-[#161b22] p-3 md:p-4 rounded-3xl md:rounded-[40px] border border-[#30363d] shadow-sm hover:border-blue-500 hover:shadow-xl transition-all text-left group flex items-center gap-4 md:gap-6"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#0d1117] text-slate-400 group-hover:bg-[#020617] group-hover:text-white transition-all flex items-center justify-center shadow-inner flex-shrink-0">
                  <item.icon size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[12px] md:text-[13px] font-bold text-white tracking-tight uppercase mb-0.5 md:mb-1 group-hover:text-blue-600 truncate">{item.label}</h4>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-tight opacity-70 group-hover:opacity-100 truncate">{item.desc}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-200 group-hover:text-blue-600 flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Intelligence Sidecard */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          {/* System Controls Section */}
          <div className="bg-[#161b22] rounded-[40px] p-10 border border-[#30363d] shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Governance</h3>
              <ShieldCheck size={20} className="text-blue-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-[#0d1117] rounded-[28px] border border-[#30363d] group hover:border-blue-200 transition-colors">
                <div className="min-w-0 pr-4">
                  <p className="text-[12px] font-bold text-white uppercase tracking-tight truncate">Collateral Engine</p>
                  <p className="text-[9px] text-blue-600 font-bold uppercase mt-1 tracking-wider">{collateralEnabled ? 'RUNNING' : 'DISABLED'}</p>
                </div>
                <div
                  onClick={handleToggleCollateral}
                  className={`w-14 h-8 rounded-full relative cursor-pointer transition-all duration-500 flex-shrink-0 ${collateralEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-[#161b22] rounded-full shadow-lg transition-all duration-500 ${collateralEnabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 bg-[#0d1117]/50 rounded-[28px] border border-[#30363d] opacity-60">
                <div>
                  <p className="text-[12px] font-bold text-white uppercase tracking-tight">AI Risk Scoring</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">ENTERPRISE ONLY</p>
                </div>
                <Lock size={16} className="text-slate-400" />
              </div>
            </div>

            <div className="mt-10 p-6 bg-[#020617] rounded-[32px] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/20 blur-[40px] rounded-full" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-4 text-blue-400">Audit Stream</h4>
              <div className="space-y-4">
                {logs.length > 0 ? logs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white uppercase truncate">{log.action}</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">{log.performedBy}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-[9px] text-slate-500 font-bold uppercase py-4">Generating secure log stream...</p>
                )}
              </div>
              <button onClick={() => navigate('/admin/settings')} className="w-full mt-6 py-4 rounded-2xl bg-[#161b22]/5 border border-white/10 text-[9px] font-bold text-white uppercase tracking-wider hover:bg-[#1c2128] hover:text-[#020617] transition-all">
                View Registry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Upcoming (7 days)',
            value: stats.upcomingPaymentsCount,
            icon: CalendarClock,
            color: 'border-blue-500/40 hover:border-blue-500',
            iconBg: 'bg-blue-500/10 text-blue-400',
            badge: 'text-blue-400',
            action: () => navigate('/admin/payments'),
          },
          {
            label: 'Late Payments',
            value: stats.latePaymentsCount,
            icon: AlertTriangle,
            color: 'border-red-500/40 hover:border-red-500',
            iconBg: 'bg-red-500/10 text-red-400',
            badge: 'text-red-400',
            action: () => navigate('/admin/payments'),
          },
          {
            label: 'Verified Today',
            value: stats.paidTodayCount,
            icon: CheckCircle2,
            color: 'border-emerald-500/40 hover:border-emerald-500',
            iconBg: 'bg-emerald-500/10 text-emerald-400',
            badge: 'text-emerald-400',
            action: () => navigate('/admin/payments'),
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className={`bg-[#161b22] rounded-[28px] p-6 border ${item.color} transition-all text-left flex items-center gap-5 group active:scale-95 cursor-pointer`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg} group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
              <p className={`text-3xl font-bold tracking-tight ${item.badge}`}>{item.value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Revenue Breakdown Section */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-[40px] p-8 md:p-12 shadow-sm space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-[#020617] text-white flex items-center justify-center shadow-inner">
               <PieChart size={24} />
            </div>
            <div>
               <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none mb-1">Revenue Overview</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detailed Financial Metrics</p>
            </div>
         </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-8 rounded-[32px] bg-[#0d1117] border border-[#30363d] group hover:border-blue-500 transition-all">
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Interest Collected</p>
               <h3 className="text-3xl font-bold text-blue-400 tracking-tight">K{(stats.totalInterest || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
             <div className="p-8 rounded-[32px] bg-[#0d1117] border border-[#30363d] group hover:border-amber-500 transition-all">
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Commission Paid</p>
               <h3 className="text-3xl font-bold text-rose-500 tracking-tight">K{(stats.totalCommission || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
             <div className="p-8 rounded-[32px] bg-[#0d1117] border border-[#30363d] group hover:border-emerald-500 transition-all">
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Late Fees Collected</p>
               <h3 className="text-3xl font-bold text-emerald-400 tracking-tight">K{(stats.totalLateFees || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-8 rounded-[32px] bg-[#020617] border border-blue-600/30 group hover:border-blue-500 transition-all relative overflow-hidden">
               <div className="absolute inset-0 bg-blue-600/5 blur-xl"></div>
               <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-1 relative z-10">Net Internal Yield</p>
               <h3 className="text-3xl font-bold text-white tracking-tight relative z-10">K{(stats.netRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
          </div>
      </div>

    </div>
  );
}
