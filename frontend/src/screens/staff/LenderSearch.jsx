import React, { useState } from 'react';
import { 
  Search, 
  Loader, 
  Shield, 
  AlertTriangle, 
  UserPlus, 
  ChevronRight, 
  Lock,
  Radar,
  Database,
  SearchCode,
  Globe,
  Fingerprint,
  Activity,
  CheckCircle2,
  Scan,
  ShieldCheck,
  Zap,
  Clock,
  TrendingDown
} from 'lucide-react';
import { mockBorrowers, mockLoans } from '../../data/mockData';
import { PageHeader, Btn } from '../../components/UI';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

export default function LenderSearch() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const { user } = useAuth();
  
  // Dev Override: Allowing all search during testing phase
  const isFree = false; 

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(false);
    
    // Neural Search Simulation
    setTimeout(() => {
      const res = mockBorrowers.filter(b =>
        b.nrc.toLowerCase().includes(query.toLowerCase()) ||
        b.phone.includes(query) ||
        b.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(res);
      setSearched(true);
      setLoading(false);
    }, 1200);
  };

  const directLend = (borrower) => {
    alert(`AUTOMATION PROTOCOL: Initializing secure loan stream for ${borrower.name}. \n- Entity added to local node. \n- Issuance form synchronized.`);
    setViewModal(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-2 lg:px-4">
      {/* Immersive Header */}
      <div className="bg-[#161b22] p-10 rounded-[40px] border border-[#30363d] shadow-sm relative overflow-hidden group">
         <div className="relative z-10">
           <PageHeader title="Global Search" subtitle="Search by ID, Phone, or Name" />
         </div>
         <div className="absolute top-0 right-0 w-80 h-full bg-blue-50/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-600/5 transition-all duration-1000" />
         <div className="absolute -left-10 -bottom-10 opacity-[0.03] rotate-12">
            <Globe size={200} />
         </div>
      </div>

      {/* Futuristic Search dashboard */}
      <div className="bg-[#161b22] rounded-[40px] border border-slate-50 shadow-2xl p-8 md:p-14 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-20 h-20 rounded-[32px] bg-blue-50 text-blue-600 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Scan size={40} className="group-hover:animate-pulse" />
           </div>
           <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Search Records</h3>
           <p className="text-[11px] text-slate-400 font-bold tracking-wider uppercase mb-10 opacity-70">Enter ID or Phone Number</p>
           
           <form onSubmit={handleSearch} onClick={handleSearch} className="w-full max-w-3xl flex flex-col md:flex-row gap-4 relative">
             <div className="flex-1 relative group/input">
               <Fingerprint size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-600 transition-colors" />
               <input
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 placeholder="Search e.g. 100456/11/1"
                 className="w-full pl-16 pr-10 py-4 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[13px] font-bold uppercase tracking-wider focus:border-blue-600 focus:bg-[#1c2128] transition-all outline-none shadow-sm placeholder:text-slate-200"
               />
             </div>
             <button
               type="submit"
               disabled={loading || !query.trim()}
               className="relative z-30 px-12 py-6 bg-[#020617] text-white rounded-[28px] text-[11px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all shadow-2xl active:scale-95 disabled:opacity-30 border-none cursor-pointer flex items-center justify-center gap-3 min-w-[200px]"
             >
               {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Scanning...
                  </>
               ) : (
                  <>
                    <Zap size={20} />
                    Search
                  </>
               )}
             </button>
           </form>
        </div>
      </div>

      {/* Results Matrix */}
      {searched && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
           <div className="flex items-center justify-between px-6">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-3">
                 <Database size={16} className="text-blue-600" /> Found Results ({results.length})
              </h4>
           </div>
           
           {results.length === 0 ? (
             <div className="text-center py-24 bg-[#161b22] rounded-[40px] border-2 border-dashed border-[#30363d]">
                <div className="w-20 h-20 rounded-[32px] bg-[#0d1117] text-slate-200 mx-auto mb-6 flex items-center justify-center">
                   <AlertTriangle size={40} />
                </div>
                <h4 className="text-lg font-bold text-white uppercase">Zero Matches found</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 max-w-xs mx-auto">No identity record matches your query in the global network registry.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {results.map(b => (
                 <div key={b.id} 
                   onClick={() => setViewModal(b)}
                   className="bg-[#161b22] p-8 rounded-[40px] border border-slate-50 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-600 hover:shadow-2xl transition-all group relative overflow-hidden"
                 >
                   <div className="flex items-center gap-6 relative z-10">
                     <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all border border-[#30363d] flex items-center justify-center shadow-inner">
                       {b.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                     </div>
                     <div className="min-w-0">
                       <p className="text-[18px] font-bold text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-none mb-2">{b.name}</p>
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {b.nrc}</span>
                          <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg">VERIFIED</span>
                       </div>
                     </div>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-[#0d1117] flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0">
                      <ChevronRight size={24} />
                   </div>
                   <div className="absolute right-0 top-0 w-24 h-full bg-blue-600/5 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      {/* Intelligence Profile Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Borrower Details" size="lg">
        {viewModal && (() => {
          const loans = mockLoans.filter(l => l.borrowerId === viewModal.id);
          const hasDefaults = viewModal.totalDefaults > 0 || viewModal.activeDefaults > 0;
          
          return (
            <div className="space-y-8 pb-4">
              <div className="relative p-10 bg-[#020617] rounded-[40px] text-white overflow-hidden shadow-2xl group flex flex-col md:flex-row items-center gap-8">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-600/10 blur-[60px]" />
                <div className="relative z-10 w-24 h-24 rounded-[32px] bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-blue-400 text-3xl font-bold shadow-2xl">
                   {viewModal.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div className="relative z-10 flex-1 text-center md:text-left">
                   <h3 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">{viewModal.name}</h3>
                   <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">{viewModal.nrc} • SYSTEM ID</p>
                   <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <div className="bg-[#161b22]/5 border border-white/10 px-4 py-2 rounded-2xl text-[9px] font-bold uppercase tracking-wider text-blue-300">PHONE: {viewModal.phone}</div>
                      <div className="bg-emerald-500/20 border border-emerald-500/20 px-4 py-2 rounded-2xl text-[9px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                         <ShieldCheck size={12} /> SECURED
                      </div>
                   </div>
                </div>
              </div>

              {/* Matrix Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Asset Cycle', value: loans.filter(l => l.status === 'active').length, icon: Activity },
                  { label: 'Risk Rating', value: viewModal.risk, icon: Radar, color: viewModal.risk === 'RED' ? 'text-red-600' : 'text-blue-600' },
                  { label: 'Late Stream', value: loans.filter(l => l.status === 'overdue').length, icon: Clock },
                  { label: 'Credit Tags', value: [...new Set(loans.map(l => l.loanType))].join(', ') || 'NONE', icon: Database },
                ].map(item => (
                  <div key={item.label} className="p-6 bg-[#161b22] border border-[#30363d] rounded-[32px] text-center hover:border-blue-600 transition-all group">
                    <item.icon size={20} className={`mx-auto mb-3 ${item.color || 'text-slate-300 group-hover:text-blue-600'} transition-colors`} />
                    <p className={`text-xl font-bold uppercase leading-none mb-2 ${item.color || 'text-white'}`}>{item.value}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none opacity-60">{item.label}</p>
                  </div>
                ))}
              </div>

              {!hasDefaults ? (
                <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[32px] text-center relative overflow-hidden group">
                  <ShieldCheck size={40} className="mx-auto mb-4 text-blue-600 opacity-20 group-hover:scale-110 transition-transform" />
                  <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-2">Everything Okay</p>
                  <p className="text-[10px] text-blue-800 leading-loose font-bold uppercase tracking-wider opacity-60 max-w-sm mx-auto">
                    Central registry reports zero active defaults. Identity synchronized across all validation nodes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="flex items-center gap-3 px-2">
                      <AlertTriangle size={18} className="text-red-500" />
                      <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Late Payments Found</p>
                   </div>
                   {loans.filter(l => l.status === 'defaulted').map(l => (
                     <div key={l.id} className="p-8 border border-red-100 rounded-[32px] bg-red-900/20 relative overflow-hidden group">
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-red-100 flex items-center justify-center text-red-600 shadow-sm">
                               <TrendingDown size={24} />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-red-600 tracking-tight leading-none mb-1">K{Number(l.principalAmount || l.amount || 0).toLocaleString()}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider opacity-80">{l.loanType} • ID: {l.id}</p>
                            </div>
                          </div>
                          {l.loanType === 'Collateral' && (
                            <button 
                              onClick={() => alert(`Reviewing Asset Verification for ${l.id}...\nStatus: Title Deed Encrypted.`)}
                              className="px-6 py-3 bg-[#161b22] border border-red-200 rounded-xl text-[9px] font-bold text-red-600 uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm border-none cursor-pointer"
                            >
                              Audit Assets
                            </button>
                          )}
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-full bg-red-500/5 blur-[40px] pointer-events-none"></div>
                     </div>
                   ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => setViewModal(null)} className="flex-1 py-5 bg-[#0d1117] text-slate-400 rounded-[24px] text-[11px] font-bold uppercase tracking-wider hover:text-white transition-all border-none cursor-pointer">Abort Review</button>
                <button onClick={() => directLend(viewModal)} className="flex-[2] py-5 bg-[#020617] text-white rounded-[24px] text-[11px] font-bold uppercase tracking-wider shadow-2xl active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center gap-3">
                  <UserPlus size={18} className="text-blue-400" /> Initialize Credit Stream
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
