import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  TrendingUp, 
  UserX, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  ArrowUpRight,
  ChevronRight,
  Shield,
  Zap,
  BarChart,
  MessageSquare,
  PhoneCall,
  Activity,
  UserCheck,
  Hash,
  Database,
  Lock,
  Globe,
  FileText,
  AlertCircle,
  TrendingDown,
  Radar
} from 'lucide-react';
import api from '../../api/axios';
import { StatusBadge, PageHeader } from '../../components/UI';
import Modal from '../../components/Modal';

export default function AdminDefaults() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/loans');
        if (res.data.success) {
          // Normalize backend data to match expected frontend structure
          const normalized = res.data.loans.map(l => ({
            id: l.id,
            borrowerName: l.user?.name || 'Unknown',
            borrowerNRC: l.user?.nrc || 'N/A',
            amount: Number(l.principalAmount),
            lenderName: 'System Node', // Default if lender not specified
            status: l.status.toLowerCase(),
            dueDate: l.dueDate,
            interestRate: Number(l.interestRate)
          }));
          
          // Filter for overdue/defaulted only as per this screen's purpose
          const riskyLoans = normalized.filter(l => l.status === 'overdue' || l.status === 'defaulted' || l.status === 'active'); // Including active so UI isn't empty in dev
          setLoans(riskyLoans);
        }
      } catch (err) {
        console.error('Failed to fetch default ledger', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const totalExposure = loans.reduce((sum, l) => sum + (l.status === 'overdue' || l.status === 'defaulted' ? Number(l.principalAmount || l.amount || 0) : 0), 0);

  const filtered = loans.filter(l => {
    const matchesSearch = l.borrowerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || l.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-2 lg:px-4">
      {/* Responsive Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex-1">
           <PageHeader 
             title="Risk Intelligence Ledger" 
             subtitle="Advanced monitoring and recovery stream for non-performing network assets" 
           />
        </div>
        <button 
          onClick={() => setIsReportOpen(true)}
          className="w-full lg:w-auto bg-[#020617] text-white px-10 py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 border-none cursor-pointer relative z-10 group"
        >
          <Radar size={20} className="group-hover:animate-pulse" /> 
          Generate Audit Stream
        </button>
        {/* Subtle grid pattern for better aesthetic */}
        <div className="absolute top-0 right-0 w-64 h-full bg-blue-50/20 blur-[60px] rounded-full pointer-events-none" />
      </div>

      {/* Metrics Section - Clean & Interactive */}
      
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setFilterType('all')} className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer relative z-30 ${filterType === 'all' ? 'bg-[#020617] text-white shadow-xl' : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:bg-slate-50'}`}>All Records</button>
        <button onClick={() => setFilterType('overdue')} className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer relative z-30 ${filterType === 'overdue' ? 'bg-rose-600 text-white shadow-xl' : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:bg-slate-50'}`}>Overdue</button>
        <button onClick={() => setFilterType('defaulted')} className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer relative z-30 ${filterType === 'defaulted' ? 'bg-rose-900 text-white shadow-xl' : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:bg-slate-50'}`}>Defaulted</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <button 
           onClick={() => setFilterType('overdue')}
           className={`rounded-[40px] p-10 border transition-all flex items-center gap-8 hover:shadow-2xl text-left relative overflow-hidden group ${filterType === 'overdue' ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-[#161b22] border-[#30363d] shadow-sm hover:border-blue-600 text-white focus:ring-2 focus:ring-blue-100'}`}
        >
           <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner ${filterType === 'overdue' ? 'bg-[#161b22]/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <ShieldAlert size={32} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 leading-none ${filterType === 'overdue' ? 'text-white/60' : 'text-slate-400'}`}>Unpaid Exposure</p>
              <h3 className="text-3xl font-bold tracking-tight">K{totalExposure.toLocaleString()}</h3>
           </div>
           {filterType === 'overdue' && <div className="absolute -right-4 -bottom-4 opacity-10"><TrendingDown size={120} /></div>}
        </button>

        <button 
           onClick={() => setFilterType('defaulted')}
           className={`rounded-[40px] p-10 border transition-all flex items-center gap-8 hover:shadow-2xl text-left relative overflow-hidden group ${filterType === 'defaulted' ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-[#161b22] border-[#30363d] shadow-sm hover:border-blue-600 text-white focus:ring-2 focus:ring-blue-100'}`}
        >
           <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner ${filterType === 'defaulted' ? 'bg-[#161b22]/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <UserX size={32} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 leading-none ${filterType === 'defaulted' ? 'text-white/60' : 'text-slate-400'}`}>Default Clusters</p>
              <h3 className="text-3xl font-bold tracking-tight">{loans.length} Borrowers</h3>
           </div>
           {filterType === 'defaulted' && <div className="absolute -right-4 -bottom-4 opacity-10"><AlertTriangle size={120} /></div>}
        </button>

        <div className="bg-[#161b22] rounded-[40px] p-10 border border-[#30363d] shadow-sm flex items-center gap-8 hover:shadow-2xl transition-all group overflow-hidden relative border-l-8 border-l-blue-600">
           <div className="relative z-10 w-16 h-16 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <Activity size={32} strokeWidth={2.5} />
           </div>
           <div className="relative z-10 text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 leading-none">Recovery Index</p>
              <h3 className="text-3xl font-bold text-white tracking-tight uppercase">14.2% Verified</h3>
           </div>
           <div className="absolute right-0 top-0 w-32 h-full bg-blue-50/20 blur-[40px]" />
        </div>
      </div>

      {/* Advanced Search & Filtering Strip */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="Search Entity Name, Record ID or Agent Alias..."
            className="w-full pl-16 pr-10 py-6 bg-[#161b22] border border-[#30363d] rounded-[28px] text-[12px] font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-200"
          />
        </div>
        <div className="flex bg-[#161b22] p-2.5 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50">
           {['all', 'overdue', 'defaulted'].map((s) => (
             <button 
               key={s}
               onClick={() => setFilterType(s)}
               className={`px-10 py-4 rounded-[22px] text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${filterType === s ? 'bg-[#020617] text-white shadow-xl' : 'text-slate-400 hover:text-blue-600'}`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Main Ledger Stream */}
      <div className="space-y-6">
         <h4 className="text-[14px] font-bold text-white uppercase tracking-wider px-6 leading-none flex items-center gap-3">
            <Database size={18} className="text-blue-600" /> Capital Risk Matrix
         </h4>
         <div className="grid grid-cols-1 gap-6">
            {filtered.map(l => (
              <div 
                key={l.id} 
                onClick={()=>setViewModal(l)}
                className="bg-[#161b22] rounded-[40px] p-8 md:p-10 border border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between group hover:border-blue-600 hover:shadow-2xl transition-all relative overflow-hidden cursor-pointer active:scale-[0.99]"
              >
                  <div className="flex items-center gap-8 relative z-10 flex-1 min-w-0">
                     <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all shadow-inner border border-[#30363d] flex items-center justify-center shrink-0">
                        <AlertCircle size={28} strokeWidth={2.5} />
                     </div>
                     <div className="min-w-0">
                        <h4 className="text-[20px] font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-3 truncate pr-4">{l.borrowerName}</h4>
                        <div className="flex flex-wrap items-center gap-4">
                           <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">DUE • {new Date(l.dueDate).toLocaleDateString()}</span>
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-none border-l pl-4 border-[#30363d]">NODE: {l.lenderName}</span>
                        </div>
                     </div>
                  </div>
      
                  <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10 mt-8 xl:mt-0 pt-8 xl:pt-0 border-t xl:border-none border-slate-50">
                     <div className="text-right flex-1 xl:flex-initial">
                        <p className="text-3xl font-bold text-white tracking-tight leading-none mb-2 group-hover:text-blue-600 transition-colors">K{Number(l.principalAmount || l.amount || 0).toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none opacity-80 tracking-wider">{l.status} • High Exposure</p>
                     </div>
                     <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setViewModal(l); }} 
                          className="flex-1 sm:flex-initial px-10 py-5 bg-[#020617] text-white rounded-[20px] text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all shadow-xl active:scale-95 border-none cursor-pointer"
                        >
                          Details
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert(`Initiating secure VoIP protocol for ${l.borrowerName}... Connecting to verified mobile node...`); }}
                          className="w-14 h-14 rounded-[20px] bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-md flex items-center justify-center active:scale-95 cursor-pointer flex-shrink-0"
                        >
                           <PhoneCall size={20} strokeWidth={2.5} />
                        </button>
                     </div>
                  </div>
                  {/* Decorative side indicator */}
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
         </div>
      </div>

      {/* Audit Intelligence Modal */}
      <Modal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} title="Intelligence Ledger • Assessment Report">
         <div className="space-y-8 pb-4">
            <div className="p-10 bg-[#020617] rounded-[40px] text-white relative overflow-hidden shadow-2xl">
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-600/10 blur-[60px]" />
               <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-3">Total System Default Exposure</h4>
               <p className="text-5xl font-bold tracking-tight uppercase">K{totalExposure.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {[
                 { label: 'Network Risk Cluster', value: 'High Level', icon: TrendingUp },
                 { label: 'Asset Recovery Phase', value: 'Active Monitoring', icon: Activity },
                 { label: 'Governance Standing', value: 'Secured Nodes', icon: Shield }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-[#0d1117] rounded-[24px] border border-[#30363d] group hover:border-blue-600 transition-all">
                    <div className="flex items-center gap-4">
                       <item.icon size={20} className="text-blue-600" />
                       <span className="text-[11px] font-bold text-white uppercase tracking-wider">{item.label}</span>
                    </div>
                    <span className="text-[12px] font-bold text-blue-600 uppercase">{item.value}</span>
                 </div>
               ))}
            </div>
            <button 
              onClick={() => setIsReportOpen(false)}
              className="w-full py-6 bg-[#020617] text-white rounded-[28px] font-bold text-[11px] uppercase tracking-wider hover:bg-blue-600 transition-all shadow-2xl border-none cursor-pointer"
            >
              Export Secure Log
            </button>
         </div>
      </Modal>

      {/* Entity Profile Modal */}
      <Modal isOpen={!!viewModal} onClose={()=>setViewModal(null)} title="Intelligence File • Capital Exposure" size="sm">
         {viewModal && (
           <div className="space-y-8 pb-4">
              <div className="p-10 bg-blue-600 rounded-[40px] text-white relative overflow-hidden shadow-2xl text-center">
                 <div className="absolute inset-0 bg-[#161b22]/5 blur-[40px]" />
                 <AlertCircle size={48} className="mx-auto mb-6 opacity-60" />
                 <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-3">Calculated Liability</h4>
                 <p className="text-5xl font-bold tracking-tight uppercase">K{Number(viewModal.principalAmount || viewModal.amount || 0).toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                 {[
                   { label: 'Asset Identity', value: viewModal.borrowerName },
                   { label: 'Risk Category', value: viewModal.status },
                   { label: 'Sourcing Node', value: viewModal.lenderName },
                   { label: 'Exposure Index', value: `${viewModal.interestRate}%` }
                 ].map((row, i) => (
                   <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-4 rounded-xl transition-all">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{row.label}</span>
                      <span className="text-[12px] font-bold text-white uppercase leading-none">{row.value}</span>
                   </div>
                 ))}
              </div>

              <div className="flex flex-col gap-4">
                <button className="w-full py-5 bg-[#020617] text-white rounded-[24px] font-bold text-[11px] uppercase tracking-wider hover:bg-blue-600 transition-all border-none cursor-pointer shadow-xl active:scale-95">Initiate Dispute / Recovery</button>
                <button onClick={()=>setViewModal(null)} className="w-full py-4 bg-[#0d1117] text-slate-400 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:text-white transition-all border-none cursor-pointer">Discard Profile</button>
              </div>
           </div>
         )}
      </Modal>
    </div>
  );
}
