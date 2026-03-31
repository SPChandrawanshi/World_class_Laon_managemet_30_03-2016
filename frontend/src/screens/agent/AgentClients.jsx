import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, TrendingUp } from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';

export default function AgentClients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/agent/clients');
      if (res.data.success) {
        setClients(res.data.clients || []);
      }
    } catch (err) {
      console.error('Fetch agent clients error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toString().includes(searchQuery)
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="px-4">
        <PageHeader 
          title="Referred Borrowers" 
          subtitle="Management hub for your personal referral network" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all cursor-default relative overflow-hidden">
           <div className="absolute inset-0 bg-blue-600/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                 <Users size={28} />
              </div>
              <div className="min-w-0">
                 <h3 className="text-3xl font-bold text-white tracking-tight leading-none mb-1.5">{clients.length}</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Registered Network</p>
              </div>
           </div>
           <TrendingUp size={24} className="text-emerald-500 opacity-60 ml-auto relative z-10" />
        </div>

        <div className="bg-[#020617] p-8 rounded-[40px] text-white overflow-hidden relative shadow-2xl border border-white/5">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[80px] rounded-full" />
           <div className="relative z-10 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#161b22]/5 border border-white/10 text-blue-400 flex items-center justify-center shadow-xl">
                 <TrendingUp size={28} />
              </div>
               <div className="min-w-0">
                 <h3 className="text-3xl font-bold text-white tracking-tight leading-none mb-1.5">K{(clients.reduce((sum, c) => sum + (c.loans || []).reduce((total, l) => total + Number(l.principalAmount || 0), 0), 0)).toLocaleString()}</h3>
                 <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider leading-none">Active Capital Managed</p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 px-4">
        <div className="flex-1 relative">
           <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
           <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client identifier..."
              className="w-full pl-14 pr-6 py-5 bg-[#161b22] border border-[#30363d] rounded-[24px] text-[11px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none shadow-sm transition-all placeholder:text-slate-600"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
         {loading ? (
           <div className="col-span-full py-20 text-center text-slate-500 text-[10px] font-bold uppercase animate-pulse italic">Reading Client Manifest...</div>
         ) : filteredClients.length > 0 ? filteredClients.map(cl => (
            <div key={cl.id} className="bg-[#161b22] rounded-[48px] border border-[#30363d] p-8 hover:border-blue-600 hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between cursor-pointer active:scale-[0.98]">
               <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] border border-white/5 flex items-center justify-center text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all shadow-inner">
                     <Users size={28} />
                  </div>
                  <StatusBadge status={cl.loans?.[0]?.status || 'PENDING'} />
               </div>
               
               <div>
                  <h4 className="text-xl font-bold text-white tracking-tight leading-tight uppercase group-hover:text-blue-600 transition-colors mb-1">{cl.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-8 italic">Verified Referral</p>
                  
                  <div className="space-y-4 pt-6 border-t border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-[#0d1117] flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors">
                          <Phone size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{cl.phone}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-[#0d1117] flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors">
                          <Mail size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 lowercase">{cl.email}</span>
                     </div>
                  </div>
               </div>

               <div className="mt-8 flex items-center justify-between p-5 bg-[#0d1117]/50 rounded-[28px] border border-white/5">
                  <div className="flex flex-col">
                     <span className="text-[14px] font-bold text-white uppercase leading-none">K{Number(cl.loans?.[0]?.principalAmount || 0).toLocaleString()}</span>
                     <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Capital Value</span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-[12px] font-bold text-blue-500 leading-none">{Number(cl.loans?.[0]?.interestRate || 0)}%</span>
                     <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Interest</span>
                  </div>
               </div>
            </div>
         )) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-[#161b22] rounded-[48px] border border-dashed border-[#30363d]">
             <Users size={40} className="text-slate-600 mb-4 opacity-20" />
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Referral list empty</p>
          </div>
         )}
      </div>
    </div>
  );
}
