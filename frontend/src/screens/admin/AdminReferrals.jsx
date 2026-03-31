import React, { useState } from 'react';
import { 
  Gift, 
  Search, 
  Filter, 
  TrendingUp, 
  UserPlus, 
  Zap, 
  Globe, 
  Activity, 
  ChevronRight, 
  Plus, 
  ArrowUpRight, 
  Target, 
  Hash, 
  LucideTrendingUp, 
  MessageSquare,
  Network,
  Share2,
  Lock,
  Database,
  ShieldCheck
} from 'lucide-react';
import { mockReferrals } from '../../data/mockData';
import { StatusBadge, PageHeader } from '../../components/UI';
import Modal from '../../components/Modal';

export default function AdminReferrals() {
  const [referrals] = useState(mockReferrals);
  const [search, setSearch] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = (referrals || []).filter(r => {
    if (!r) return false;
    
    // Status Filter
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;

    const q = (search || '').toLowerCase();
    const searchableFields = [
      r.referrer,
      r.referee,
      r.id,
      r.status
    ].map(f => (f || '').toString().toLowerCase());
    
    return searchableFields.some(f => f.includes(q));
  });

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="Referral Program" 
          subtitle="View and manage user referrals and rewards" 
        />
        <button 
          onClick={() => setIsDetailsOpen(true)}
          className="bg-[#020617] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-3 shadow-md active:scale-95 border border-[#020617]"
        >
          <Network size={16} /> Program Details
        </button>
      </div>

      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Referral Program Architecture">
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
              <Gift size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Standard Reward</p>
              <h4 className="text-xl font-bold text-white uppercase tracking-tight">K250 PER USER</h4>
            </div>
          </div>
          <div className="space-y-4">
             <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verification Protocol</h5>
             <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Network Proliferation', icon: Network, desc: 'User must sign up using unique hash.' },
                  { label: 'Activity Validation', icon: Activity, desc: 'Verified after first loan repayment.' },
                  { label: 'Fraud Protection', icon: ShieldCheck, desc: 'AI check for duplicate identity.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-[#0d1117] rounded-2xl border border-[#30363d]">
                    <step.icon size={18} className="text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-white uppercase mb-1">{step.label}</p>
                      <p className="text-[10px] text-slate-500 font-bold leading-tight uppercase opacity-80">{step.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <button onClick={() => setIsDetailsOpen(false)} className="w-full py-4 bg-[#020617] text-white rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all shadow-xl">Dismiss</button>
        </div>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-2xl transition-all relative overflow-hidden border-l-4 border-l-blue-600">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
               <Share2 size={24} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Growth Rate</p>
               <h3 className="text-2xl font-bold text-white leading-none">2.4x More</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <Network size={100} strokeWidth={2} />
            </div>
         </div>
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
               <Gift size={24} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Total Bonuses</p>
               <h3 className="text-2xl font-bold text-white leading-none">K{referrals.reduce((s,r)=>s+r.bonus,0).toLocaleString()}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <Target size={100} strokeWidth={2} />
            </div>
         </div>
         <div className="bg-[#020617] rounded-[40px] p-8 text-white shadow-2xl flex items-center gap-6 hover:scale-[1.02] transition-transform group relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 blur-[60px] opacity-10"></div>
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-[#161b22]/5 border border-white/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
               <Activity size={24} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider mb-1 leading-none">Total Referrals</p>
               <h3 className="text-2xl font-bold text-white leading-none">{referrals.length} Users</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
               <Database size={100} strokeWidth={2} />
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="Search by Name or ID..."
            className="w-full pl-14 pr-10 py-4 bg-[#161b22] border border-gray-100 rounded-2xl text-xs font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all shadow-md placeholder:text-slate-200"
          />
        </div>
        <div className="flex bg-[#161b22] p-1.5 rounded-2xl shadow-md border border-gray-100">
           {['all', 'verified', 'pending', 'flagged'].map((s) => (
             <button 
               key={s}
               onClick={() => setFilterStatus(s)}
               className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-blue-600'}`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Referral History</h3>
        <div className="space-y-3">
          {filtered.map((r) => (
            <div 
              key={r.id} 
              className="bg-[#161b22] rounded-[40px] p-6 border border-gray-50 hover:border-blue-600 hover:shadow-2xl transition-all group flex items-center justify-between gap-6 relative overflow-hidden"
            >
               <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-[22px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-white transition-all flex items-center justify-center shadow-inner">
                     <UserPlus size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-2">{r.referrer} index</h4>
                    <div className="flex items-center gap-3">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none opacity-80">PROLIFERATED: {r.referee}</p>
                       <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                       <p className="text-[10px] font-bold text-blue-600/40 uppercase tracking-wider leading-none">Hash Verified {r.id}</p>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-10 relative z-10">
                  <div className="text-right hidden sm:block">
                     <p className="text-2xl font-bold text-emerald-600 tracking-tight leading-none grayscale group-hover:grayscale-0 transition-all mb-1">K{r.bonus}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none opacity-80">Bonus Amount</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <StatusBadge status={r.status} />
                     <ChevronRight size={22} className="text-slate-100 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
               </div>

               <div className="absolute -right-4 -bottom-4 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity">
                  <Lock size={120} strokeWidth={2} />
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#020617] rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="absolute inset-0 bg-blue-600 blur-[80px] opacity-10"></div>
         <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <Zap size={20} className="text-blue-400" />
               <h4 className="text-xl font-bold tracking-tight uppercase leading-none">Growth Strategy</h4>
            </div>
            <p className="text-sm text-blue-100/60 font-medium leading-relaxed max-w-lg">The system suggests improving rewards to get more users. Estimated growth: +15% next month.</p>
         </div>
         <button className="px-8 py-4 bg-[#161b22] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all relative z-10 hover:bg-blue-600 hover:text-white border-none">Adjust Settings</button>
      </div>
    </div>
  );
}
