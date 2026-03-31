import React, { useState } from 'react';
import { 
  Eye, 
  Trash2, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  UserX,
  Database,
  ShieldCheck,
  Activity,
  History,
  TrendingDown,
  Info
} from 'lucide-react';
import { mockDefaultLedger } from '../../data/mockData';
import { Btn, PageHeader, EmptyState, ConfirmDialog } from '../../components/UI';
import Modal from '../../components/Modal';

export default function LenderDefaults() {
  const [ledger, setLedger]         = useState([...mockDefaultLedger]);
  const [search, setSearch]         = useState('');
  const [viewModal, setViewModal]   = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab]   = useState('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verSuccess, setVerSuccess] = useState(false);

  const filtered = ledger.filter(d => {
    const matchesSearch = d.borrowerName.toLowerCase().includes(search.toLowerCase()) || d.borrowerNRC.includes(search);
    const matchesTab = activeTab === 'all' || d.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalDefaultAmount = ledger.reduce((sum, d) => sum + d.defaultAmount, 0);

  const handleVerifyRequest = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerSuccess(true);
      setTimeout(() => {
        setVerSuccess(false);
        setViewModal(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in duration-700 px-2 lg:px-4">
      {/* Premium Page Header */}
      <div className="bg-[#161b22] p-8 md:p-10 rounded-[40px] border border-[#30363d] shadow-sm relative overflow-hidden">
        <div className="relative z-10">
           <PageHeader
            title="Operational Default Ledger"
            subtitle={`${ledger.length} risk-flagged entries synchronized with central governance`}
          />
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-blue-50/30 blur-[60px] rounded-full pointer-events-none" />
      </div>

      {/* Info & Strategy Banner */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-8 bg-amber-50/50 border border-amber-100 rounded-[32px] animate-in slide-in-from-top duration-500">
        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
           <AlertTriangle size={28} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-amber-900 font-bold uppercase tracking-wider mb-1">Protocol Compliance Notice</p>
          <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider leading-relaxed opacity-80">
            These records represent defaulted assets under your management. Flags contribute to the borrower's **Global Credit Tier**, visible across the entire LOANAPP Network. Only verified council admins can purge these entries.
          </p>
        </div>
        <div className="px-5 py-2.5 bg-[#161b22] rounded-xl border border-amber-100 shadow-sm whitespace-nowrap">
           <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Node Status: Reporting</p>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm group hover:border-blue-600 transition-all flex items-center gap-6 overflow-hidden relative">
            <div className="w-14 h-14 rounded-[22px] bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
               <TrendingDown size={28} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Net Default Exposure</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">K{totalDefaultAmount.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm group hover:border-blue-600 transition-all flex items-center gap-6 overflow-hidden relative">
            <div className="w-14 h-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
               <UserX size={28} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Flagged Borrowers</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{ledger.length} Verified</h3>
            </div>
         </div>
         <div className="bg-[#020617] rounded-[40px] p-8 text-white shadow-2xl flex items-center gap-6 group overflow-hidden relative border-l-4 border-l-blue-600">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-600/10 blur-[40px]"></div>
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-[#161b22]/5 border border-white/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
               <History size={28} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider mb-1 leading-none">Reporting Frequency</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">Active</h3>
            </div>
         </div>
      </div>

      {/* Search & Filter Matrix */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="Search Target Entity, NRC or Incident ID..."
            className="w-full pl-16 pr-10 py-5 bg-[#161b22] border border-[#30363d] rounded-[28px] text-[11px] font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all shadow-xl shadow-slate-200/50" 
          />
        </div>
        <div className="flex bg-[#161b22] p-2.5 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-x-auto custom-scrollbar no-scrollbar">
           {['all', 'active', 'settled'].map((t) => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-10 py-4 rounded-[22px] text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${activeTab === t ? 'bg-[#020617] text-white shadow-xl' : 'text-slate-400 hover:text-blue-600'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {/* Risk List Stream */}
      {filtered.length === 0 ? (
        <EmptyState icon="✅" title="Operational Harmony" 
          description="Your node currently reports zero critical default incidents. All Loan Managements are performing optimally." />
      ) : (
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 leading-none flex items-center gap-3">
             <Database size={16} className="text-blue-600" /> Managed Risk Incidents
          </h4>
          <div className="grid grid-cols-1 gap-6">
            {filtered.map(d => (
              <div 
                key={d.id} 
                onClick={() => setViewModal(d)}
                className="bg-[#161b22] rounded-[40px] p-8 md:p-10 border border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between group hover:border-blue-600 hover:shadow-2xl transition-all relative overflow-hidden cursor-pointer active:scale-[0.99]"
              >
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="w-16 h-16 rounded-[24px] bg-red-50 text-red-600 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all shadow-inner border border-red-100 flex items-center justify-center shrink-0">
                       <UserX size={32} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                       <h4 className="text-[20px] font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-3">{d.borrowerName}</h4>
                       <div className="flex flex-wrap items-center gap-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none bg-[#0d1117] px-4 py-1.5 rounded-full border border-[#30363d]">NRC: {d.borrowerNRC}</span>
                          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider leading-none bg-red-50 px-4 py-1.5 rounded-full border border-red-100">INCIDENT: {d.id}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10 mt-8 xl:mt-0 pt-8 xl:pt-0 border-t xl:border-none border-slate-50">
                    <div className="text-right">
                       <p className="text-3xl font-bold text-red-600 tracking-tight leading-none mb-2">K{d.defaultAmount.toLocaleString()}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none opacity-80 tracking-wider">Loan {d.loanId} • Flagged {d.defaultDate}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                       <button className="flex-1 sm:flex-initial px-10 py-5 bg-[#020617] text-white rounded-[20px] text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all shadow-xl active:scale-95 border-none cursor-pointer">
                          profile Details
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); setDeleteConfirm(d); }}
                         className="w-14 h-14 rounded-[20px] bg-[#0d1117] text-slate-400 hover:bg-red-600 hover:text-white transition-all shadow-md flex items-center justify-center active:scale-95 cursor-pointer border-none shrink-0"
                       >
                          <Trash2 size={20} strokeWidth={2.5} />
                       </button>
                    </div>
                 </div>
                 {/* Decorative side bar */}
                 <div className="absolute left-0 top-0 w-1.5 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intelligence Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Intelligence profile • Audit File" size="md">
        {viewModal && (
          <div className="space-y-8 pb-4">
             <div className="p-10 bg-[#020617] rounded-[40px] text-white relative overflow-hidden shadow-2xl text-center">
                <div className="absolute inset-0 bg-blue-600/20 blur-[60px]" />
                <ShieldAlert size={48} className="mx-auto mb-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-3">Calculated Liability</h4>
                <p className="text-5xl font-bold tracking-tight uppercase">K{viewModal.defaultAmount.toLocaleString()}</p>
             </div>

             {verSuccess ? (
                <div className="py-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                   <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                      <ShieldCheck size={40} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-tight">Audit Synchronized</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">profile has been flagged for re-verification in the central governance hub.</p>
                </div>
             ) : (
                <>
                   <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: 'Asset Reference', value: viewModal.id },
                       { label: 'Borrower Identity', value: viewModal.borrowerName },
                       { label: 'Central NRC', value: viewModal.borrowerNRC },
                       { label: 'Loan Catalog', value: viewModal.loanId },
                       { label: 'Report Date', value: viewModal.defaultDate },
                       { label: 'Exposure Status', value: viewModal.status },
                     ].map((row, i) => (
                       <div key={i} className="flex flex-col gap-1 p-5 bg-[#0d1117] rounded-[28px] border border-[#30363d] hover:border-blue-200 transition-all group overflow-hidden">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-2">{row.label}</p>
                          <p className="text-[12px] font-bold text-white uppercase leading-none">{row.value}</p>
                       </div>
                     ))}
                   </div>

                   <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleVerifyRequest}
                        disabled={isVerifying}
                        className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-wider hover:bg-blue-700 transition-all border-none cursor-pointer shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                         {isVerifying ? (
                            <>
                               <Activity size={18} className="animate-spin" />
                               Synchronizing...
                            </>
                         ) : (
                            <>
                               <ShieldCheck size={18} /> Request Re-Verification
                            </>
                         )}
                      </button>
                      <button onClick={() => setViewModal(null)} className="w-full py-4 bg-[#0d1117] text-slate-400 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:text-white transition-all border-none cursor-pointer">Discard File</button>
                   </div>
                </>
             )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { setLedger(prev => prev.filter(d => d.id !== deleteConfirm?.id)); setDeleteConfirm(null); }}
        title="Archive Incident Record?"
        message={`This will permanently remove the risk flag for ${deleteConfirm?.borrowerName} from your operational stream. Proceed with caution.`}
        confirmLabel="Purge Incident"
        isDanger
      />
    </div>
  );
}
