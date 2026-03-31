import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Hash, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewModal, setViewModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/payments');
      if (res.data.success) {
        setPayments(res.data.payments || []);
      }
    } catch (err) {
      console.error('Fetch payments error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await api.get('/admin/payments/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error exporting financial records');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleVerify = async (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    
    console.log("[PAYMENT VERIFY CLICKED]", id);
    setIsSubmitting(true);
    try {
      const res = await api.put(`/admin/payments/${id}/verify`);
      if (res.data.success) {
        setConfirmId(null);
        fetchPayments();
        setViewModal(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error verifying payment');
      setConfirmId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = payments.filter(p => {
    const matchesSearch = (p.loan?.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.trxId || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (p.status || '').toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    paid: payments.filter(p => p.status === 'VERIFIED').reduce((s, p) => s + Number(p.totalCollected || p.baseAmount || 0), 0),
    pending: payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + Number(p.totalCollected || p.baseAmount || 0), 0),
    late: payments.filter(p => Number(p.penaltyAmount) > 0).reduce((s, p) => s + Number(p.penaltyAmount), 0),
    count: payments.length
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in duration-700 px-2 lg:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="Financial Asset Registry" 
          subtitle="Real-time tracking and verification of across-network capital flow" 
        />
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="bg-[#020617] text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl cursor-pointer border-none active:scale-95 disabled:opacity-50"
        >
          {isExporting ? <Activity className="animate-spin" size={16} /> : <Download size={16} />} 
          {isExporting ? 'Generating...' : 'Export Financials'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
               <TrendingUp size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Total Collected</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">K{stats.paid.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative border-l-4 border-l-amber-500">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-amber-50 text-amber-600 flex items-center justify-center group-hover:-rotate-12 transition-transform shadow-inner text-2xl">
               <Clock size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Pending Clearing</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">K{stats.pending.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative border-l-4 border-l-rose-500">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
               <AlertCircle size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Accrued Late Fees</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">K{stats.late.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-[#020617] rounded-[40px] p-8 text-white shadow-2xl flex items-center gap-6 group overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-600 blur-[60px] opacity-10"></div>
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-[#161b22]/5 border border-white/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
               <ShieldCheck size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider mb-1 leading-none">Network Health</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">OPTIMAL</h3>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#161b22] p-2 rounded-[28px] border border-[#30363d]">
        <div className="flex gap-1 w-full md:w-auto">
          {[
            { key: 'ALL',      label: 'All Records' },
            { key: 'PENDING',  label: 'Pending' },
            { key: 'VERIFIED', label: 'Verified' },
            { key: 'LATE',     label: 'Late' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${
                statusFilter === key
                  ? key === 'PENDING' ? 'bg-amber-500 text-white shadow-lg'
                  : key === 'VERIFIED' ? 'bg-emerald-600 text-white shadow-lg'
                  : key === 'LATE' ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-[#1c2128]'
              }`}
            >
              {label}
              {key !== 'ALL' && (
                <span className="ml-2 opacity-70">
                  ({payments.filter(p => (p.status || '').toUpperCase() === key).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by Borrower or Transaction ID..."
            className="w-full pl-14 pr-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse italic">Connecting to Ledger...</div>
        ) : filtered.map(p => (
          <div 
            key={p.id} 
            onClick={() => setViewModal(p)}
            className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group cursor-pointer hover:border-blue-600 hover:shadow-2xl transition-all"
          >
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-emerald-400 transition-all flex items-center justify-center shadow-inner border border-white/5">
                   <DollarSign size={24} />
                </div>
                <div className="flex flex-col min-w-0">
                   <h4 className="text-[18px] font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-2 truncate">{p.loan?.user?.name || 'Unknown User'}</h4>
                   <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider opacity-80">
                      <span className="flex items-center gap-1.5"><Hash size={12} className="text-blue-400" /> TRX: {p.trxId || 'N/A'}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                      <span className={p.status === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'}>{p.method || 'CASH'}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                      <span className="text-blue-600">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'Pending verification'}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 pt-6 sm:pt-0 border-white/5">
                <div className="text-right">
                   <p className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none mb-2">K{Number(p.totalCollected || p.baseAmount || 0).toLocaleString()}</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Gross Clearing</p>
                </div>
                <div className="flex items-center gap-6">
                   <StatusBadge
                     status={p.status === 'VERIFIED' ? 'verified' : 'pending'}
                     onClick={(e) => { e.stopPropagation(); setStatusFilter(p.status || 'ALL'); }}
                   />
                   <ChevronRight size={20} className="text-slate-100 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                </div>
             </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-[#161b22] rounded-[40px] border border-dashed border-[#30363d]">
             No financial records found
          </div>
        )}
      </div>

      <Modal 
        isOpen={!!viewModal} 
        onClose={() => {
          if (!isSubmitting) {
            setViewModal(null);
            setConfirmId(null);
          }
        }} 
        title="Transaction Authority Proof" 
        size="md"
      >
        {viewModal && (
          <div className="space-y-8 pb-4">
             <div className="bg-[#020617] p-10 rounded-[40px] text-white flex flex-col items-center relative overflow-hidden group shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-emerald-600/10 blur-[80px] group-hover:bg-emerald-600/20 transition-all duration-1000"></div>
                <div className="w-20 h-20 rounded-[28px] bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6 shadow-2xl backdrop-blur-sm">
                   <ShieldCheck size={32} className="group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2 opacity-70 leading-none">Settled Amount</p>
                <h3 className="text-4xl font-bold tracking-tight leading-none mb-4">K{Number(viewModal.totalCollected || viewModal.baseAmount || 0).toLocaleString()}</h3>
                
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
                   <span className="text-slate-400">Borrower: {viewModal.loan?.user?.name}</span>
                   <span className="text-white/20">/</span>
                   <span className={viewModal.status === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}>{viewModal.status}</span>
                </div>
             </div>

             <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-4 mb-6">Ledger Details</h4>
                <div className="grid grid-cols-2 gap-8 px-4">
                   <div>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Method</p>
                       <p className="text-xl font-bold text-white tracking-tight uppercase">{viewModal.method}</p>
                   </div>
                   <div>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Late Amount</p>
                       <p className={`text-xl font-bold tracking-tight ${Number(viewModal.penaltyAmount) > 0 ? 'text-rose-500' : 'text-white'}`}>K{Number(viewModal.penaltyAmount || 0).toLocaleString()}</p>
                   </div>
                   <div className="col-span-2">
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Transaction Identity (TRX ID)</p>
                       <p className="text-xl font-bold text-blue-400 tracking-tight break-all uppercase selection:bg-blue-600 selection:text-white">{viewModal.trxId || 'Manual Override'}</p>
                   </div>
                   <div>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Impact</p>
                       <p className="text-xl font-bold text-white tracking-tight">K{Number(viewModal.totalCollected || viewModal.baseAmount || 0).toLocaleString()}</p>
                   </div>
                   <div>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Loan ID</p>
                       <p className="text-xl font-bold text-white tracking-tight">#{viewModal.loanId}</p>
                   </div>
                </div>
             </div>

             {viewModal.status === 'PENDING' && (
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleVerify(viewModal.id)} 
                  className={`w-full py-6 text-white rounded-[28px] text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95 border-none cursor-pointer flex items-center justify-center gap-3 ${
                    confirmId === viewModal.id ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                  }`}
                >
                   {isSubmitting ? 'Verifying Node...' : confirmId === viewModal.id ? 'Are you sure? Click again to Confirm' : 'Verify & Close Transaction'}
                </button>
             )}

             <button onClick={() => setViewModal(null)} className="w-full py-5 bg-[#020617] text-white rounded-[24px] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 border-none cursor-pointer">Return to Financials</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
