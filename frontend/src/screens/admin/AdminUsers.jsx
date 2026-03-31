import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  ShieldCheck, 
  ArrowUpRight, 
  Search, 
  TrendingUp, 
  UserPlus 
} from 'lucide-react';
import { PageHeader } from '../../components/UI';

export default function AdminUsers() {
  const navigate = useNavigate();

  const userTypes = [
    { 
      label: 'Staff Members', 
      detail: 'Internal loan officers and managers', 
      path: '/admin/staff', 
      icon: UserCheck, 
      color: 'blue', 
      count: 'Active Nodes' 
    },
    { 
      label: 'Borrower Network', 
      detail: 'Registered entities and individuals', 
      path: '/admin/borrowers', 
      icon: Users, 
      color: 'emerald', 
      count: 'Primary Client' 
    },
    { 
      label: 'External Agents', 
      detail: 'Referral partners and field agents', 
      path: '/admin/agents', 
      icon: Briefcase, 
      color: 'amber', 
      count: 'Growth Node' 
    },
    { 
      label: 'System Admins', 
      detail: 'Super control and root access', 
      path: '/admin/admins', 
      icon: ShieldCheck, 
      color: 'rose', 
      count: 'Root Access' 
    },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="px-4">
        <PageHeader 
          title="User Network Hub" 
          subtitle="Consolidated management of all registered network identities"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {userTypes.map((type, i) => (
          <div 
            key={i}
            onClick={() => navigate(type.path)}
            className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm hover:border-blue-600 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden flex flex-col h-[320px] justify-between active:scale-95"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-[24px] bg-[#0d1117] border border-white/5 flex items-center justify-center text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all shadow-inner mb-6`}>
                <type.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight leading-none mb-2 group-hover:text-blue-500 transition-colors">{type.label}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-4 leading-relaxed">{type.detail}</p>
            </div>

            <div className="relative z-10 mt-auto flex items-center justify-between p-5 bg-[#0d1117]/50 rounded-[28px] border border-white/5">
               <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white uppercase leading-none tracking-widest">{type.count}</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Management Tier</span>
               </div>
               <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <ArrowUpRight size={18} />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 p-10 bg-[#020617] rounded-[48px] text-white relative overflow-hidden shadow-2xl border border-white/5">
         <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full mb-6">
                  <TrendingUp size={14} className="text-blue-500" />
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-none">Global Growth Engine</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase leading-tight mb-4">Scale Your Network</h2>
               <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">Instantly add new nodes to your financial ecosystem. Unified registration for all security tiers.</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
               <button onClick={() => navigate('/admin/borrowers')} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 border-none cursor-pointer active:scale-95">
                  <UserPlus size={18} /> New Borrower
               </button>
               <button onClick={() => navigate('/admin/staff')} className="px-10 py-5 bg-[#161b22] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#1c2128] transition-all flex items-center gap-3 shadow-xl border border-[#30363d] cursor-pointer active:scale-95">
                  Internal Entry
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
