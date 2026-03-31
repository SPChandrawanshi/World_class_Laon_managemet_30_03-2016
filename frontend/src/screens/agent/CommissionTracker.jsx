import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  History, 
  ArrowUpRight, 
  CheckCircle2, 
  Search, 
  Filter, 
  Wallet, 
  ArrowDownCircle, 
  Download,
  Users,
  Briefcase
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';

export default function CommissionTracker() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const role = user?.role?.toUpperCase();
      const isStaff = role === 'ADMIN' || role === 'STAFF';
      const endpoint = isStaff ? '/admin/commissions' : '/agent/commissions';
      const payoutEndpoint = isStaff ? '/admin/payouts' : '/agent/payouts';
      
      const [commRes, payoutRes] = await Promise.all([
        api.get(endpoint),
        api.get(payoutEndpoint)
      ]);

      if (commRes.data.success) {
        const comms = commRes.data.commissions || [];
        setHistory(comms);
        setStats({
          total: comms.reduce((sum, c) => sum + Number(c.amount), 0),
          count: comms.length
        });
      }

      if (payoutRes.data.success) {
        setPayouts(payoutRes.data.payouts || []);
      }
    } catch (err) {
      console.error('Fetch commissions error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [user]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [payoutFilter, setPayoutFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [processingData, setProcessingData] = useState({ trxId: '', method: 'NETWORK' });

  // Calculate earnings based on PENDING status from backend
  const pendingEarnings = history
    .filter(c => c.status === 'PENDING')
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const handlePayoutRequest = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.post('/agent/payout', { amount: pendingEarnings });
      if (res.data.success) {
        alert('SUCCESS: Your yield of K' + pendingEarnings.toLocaleString() + ' has been submitted for network processing.');
        setIsPayoutModalOpen(false);
        fetchCommissions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payout request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessPayout = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.put(`/admin/payouts/${selectedPayout.id}`, {
        status: 'COMPLETED',
        ...processingData
      });
      if (res.data.success) {
        alert('PAYOUT SETTLED: Network funds have been confirmed and distributed.');
        setIsProcessingModalOpen(false);
        setSelectedPayout(null);
        fetchCommissions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Processing failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 pb-20 px-2 lg:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title={(user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'STAFF') ? 'Global Yield Registry' : 'Agent Revenue Matrix'} 
          subtitle={(user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'STAFF') ? 'Network-wide commission distributions and agent payouts' : 'Detailed breakdown of your referral bonuses and capital rewards'} 
        />
        {user?.role?.toUpperCase() === 'AGENT' && (
          <button 
            onClick={() => setIsPayoutModalOpen(true)}
            className="bg-[#020617] text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl active:scale-95 border-none cursor-pointer"
          >
            <Wallet size={16} /> Request Payout
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] shadow-sm flex flex-col items-center justify-center group hover:border-blue-500 hover:shadow-2xl transition-all relative overflow-hidden">
           <div className="absolute inset-0 bg-blue-600/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10 w-16 h-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner group-hover:rotate-12 transition-transform">
              <DollarSign size={32} strokeWidth={2.5} />
           </div>
           <h3 className="relative z-10 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total {user?.role === 'ADMIN' ? 'Distributed' : 'Earned'}</h3>
           <p className="relative z-10 text-3xl font-bold text-white tracking-tight leading-none">K{stats.total.toLocaleString()}</p>
        </div>

        <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] shadow-sm flex flex-col items-center justify-center group hover:border-amber-500 hover:shadow-2xl transition-all relative overflow-hidden">
           <div className="absolute inset-0 bg-amber-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10 w-16 h-14 rounded-[22px] bg-amber-50 text-amber-600 flex items-center justify-center mb-6 shadow-inner group-hover:-rotate-12 transition-transform text-2xl">
              <Clock size={32} strokeWidth={2.5} />
           </div>
           <h3 className="relative z-10 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Payout</h3>
           <p className="relative z-10 text-3xl font-bold text-white tracking-tight leading-none">K{pendingEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-[#020617] p-8 rounded-[40px] text-white shadow-2xl flex flex-col items-center justify-center group relative overflow-hidden cursor-default">
           <div className="absolute inset-0 bg-emerald-600/10 blur-[80px] group-hover:bg-emerald-600/20 transition-all duration-1000" />
           <div className="relative z-10 w-16 h-14 rounded-[22px] bg-[#161b22]/5 border border-white/10 text-emerald-400 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <TrendingUp size={32} strokeWidth={2.5} />
           </div>
           <h3 className="relative z-10 text-[11px] font-bold text-blue-400/60 uppercase tracking-wider mb-1 leading-none">Network Velocity</h3>
           <p className="relative z-10 text-3xl font-bold text-white tracking-tight leading-none">OPTIMAL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#161b22] rounded-[40px] border border-[#30363d] shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 bg-[#161b22]/80 backdrop-blur-md">
              <h4 className="text-[12px] font-bold text-white uppercase tracking-wider">Revenue Stream Logic</h4>
              <div className="flex items-center gap-2">
                 {[
                   { key: 'all', label: 'All' },
                   { key: 'pending', label: 'Pending' },
                   { key: 'paid', label: 'Verified' },
                 ].map(({ key, label }) => (
                   <button key={key} onClick={() => setFilterStatus(key)}
                     className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${filterStatus === key ? 'bg-blue-600 text-white' : 'bg-[#0d1117] text-slate-400 hover:text-white'}`}>
                     {label}
                   </button>
                 ))}
                 <button onClick={() => fetchCommissions()} className="p-2.5 rounded-xl bg-[#0d1117] text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-inner border border-[#30363d]/50 cursor-pointer active:scale-95">
                    <History size={18} />
                 </button>
              </div>
           </div>
           
           <div className="overflow-x-auto custom-scrollbar pr-2 h-[450px]">
              {loading ? (
                 <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse italic">Connecting to Revenue Node...</div>
              ) : history.length > 0 ? (
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0d1117]/50 sticky top-0 z-10">
                       <tr>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">ID / Date</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Entity</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Yield</th>
                          <th className="px-8 py-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363d]/30">
                       {history.filter(c => filterStatus === 'all' ? true : filterStatus === 'paid' ? c.status === 'PAID' : c.status !== 'PAID').map(c => (
                          <tr
                            key={c.id}
                            onClick={() => setSelectedTx(c)}
                            className="hover:bg-blue-600/5 transition-all group cursor-pointer active:bg-blue-600/10"
                          >
                             <td className="px-8 py-6">
                                <p className="text-[12px] font-bold text-white tracking-tight group-hover:text-blue-500 transition-colors">#TX-{c.id}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                             </td>
                             <td className="px-8 py-6">
                                <span className="text-[11px] font-bold text-white uppercase group-hover:translate-x-1 transition-transform inline-block truncate max-w-[150px]">{user?.role === 'ADMIN' ? c.agent?.name : (c.borrower?.name || 'BORROWER')}</span>
                                {user?.role === 'ADMIN' && <p className="text-[8px] text-blue-500 font-bold uppercase">Agent Code: {c.agentId}</p>}
                             </td>
                             <td className="px-8 py-6 text-right">
                                <p className="text-[16px] font-bold text-slate-200 tracking-tight leading-none mb-1">K{Number(c.amount).toLocaleString()}</p>
                                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">{c.percentage}% Tier</p>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex justify-center">
                                   <StatusBadge status={c.status === 'PAID' ? 'verified' : 'pending'} onClick={(e) => { e.stopPropagation(); setFilterStatus(c.status === 'PAID' ? 'paid' : 'pending'); }} />
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              ) : (
                 <div className="py-20 text-center flex flex-col items-center justify-center h-full">
                    <Briefcase size={40} className="text-[#30363d] mb-4 opacity-20" />
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No active yield records</p>
                 </div>
              )}
           </div>
        </div>

        <div className="bg-[#161b22] rounded-[40px] border border-[#30363d] shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 bg-[#161b22]/80 backdrop-blur-md">
              <h4 className="text-[12px] font-bold text-white uppercase tracking-wider">Disbursement Registry</h4>
              <div className="flex items-center gap-2">
                 {[
                   { key: 'all', label: 'All' },
                   { key: 'PENDING', label: 'Pending' },
                   { key: 'COMPLETED', label: 'Verified' },
                 ].map(({ key, label }) => (
                   <button key={key} onClick={() => setPayoutFilter(key)}
                     className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${payoutFilter === key ? 'bg-blue-600 text-white' : 'bg-[#0d1117] text-slate-400 hover:text-white'}`}>
                     {label}
                   </button>
                 ))}
              </div>
           </div>
           
           <div className="overflow-x-auto custom-scrollbar pr-2 h-[450px]">
              {loading ? (
                 <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse italic">Connecting to Payout Node...</div>
              ) : payouts.length > 0 ? (
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0d1117]/50 sticky top-0 z-10">
                       <tr>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Transaction</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Volume</th>
                          <th className="px-8 py-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363d]/30">
                       {payouts.filter(p => payoutFilter === 'all' ? true : p.status === payoutFilter).map(p => (
                          <tr key={p.id} className="hover:bg-blue-600/5 transition-all group">
                             <td className="px-8 py-6">
                                <p className="text-[12px] font-bold text-white tracking-tight">PAY-#{p.id}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{new Date(p.createdAt).toLocaleDateString()}</p>
                                {user?.role === 'ADMIN' && <p className="text-[9px] text-blue-500 font-bold mt-1 uppercase">{p.agent?.name}</p>}
                             </td>
                             <td className="px-8 py-6 text-right">
                                <p className="text-[16px] font-bold text-slate-200 tracking-tight leading-none mb-1">K{Number(p.amount).toLocaleString()}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{p.method || 'NETWORK'}</p>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex flex-col items-center gap-2">
                                   <StatusBadge status={p.status === 'COMPLETED' ? 'verified' : (p.status === 'REJECTED' ? 'rejected' : 'pending')} onClick={() => setPayoutFilter(p.status === 'COMPLETED' ? 'COMPLETED' : p.status === 'REJECTED' ? 'REJECTED' : 'PENDING')} />
                                   {user?.role === 'ADMIN' && p.status === 'PENDING' && (
                                     <button 
                                       onClick={() => { setSelectedPayout(p); setIsProcessingModalOpen(true); }}
                                       className="text-[8px] font-bold text-blue-500 uppercase hover:underline cursor-pointer"
                                     >
                                       Finalize settlement
                                     </button>
                                   )}
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              ) : (
                 <div className="py-20 text-center flex flex-col items-center justify-center h-full">
                    <ArrowUpRight size={40} className="text-[#30363d] mb-4 opacity-20" />
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No payout history</p>
                 </div>
              )}
           </div>
        </div>
      </div>

      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Yield Authentication Proof">
         {selectedTx && (
           <div className="space-y-8">
              <div className="p-10 bg-[#020617] rounded-[40px] text-white flex flex-col items-center relative overflow-hidden group shadow-2xl border border-white/5">
                 <div className="absolute inset-0 bg-blue-600/10 blur-[80px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                 <div className="w-20 h-20 rounded-[28px] bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 shadow-2xl">
                    <DollarSign size={32} strokeWidth={2.5} />
                 </div>
                 <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2 opacity-70">Disbursed Amount</p>
                 <h3 className="text-4xl font-bold tracking-tight">K{Number(selectedTx.amount).toLocaleString()}</h3>
              </div>

              <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
                 {[
                   { label: 'Origin Agent', value: selectedTx.agent?.name || 'N/A' },
                   { label: 'Borrower Entity', value: selectedTx.borrower?.name || 'N/A' },
                   { label: 'Yield Tier', value: `${selectedTx.percentage}%` },
                   { label: 'Network Date', value: new Date(selectedTx.createdAt).toLocaleString() },
                   { label: 'Settlement Status', value: selectedTx.status === 'PAID' ? 'FULLY SETTLED' : 'PENDING SETTLEMENT' }
                 ].map((row, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-[#30363d] last:border-0 pb-4 last:pb-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.label}</span>
                      <span className={`text-[11px] font-bold uppercase ${row.label === 'Settlement Status' ? (selectedTx.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400') : 'text-white'}`}>{row.value}</span>
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => setSelectedTx(null)}
                className="w-full py-5 bg-[#020617] text-white rounded-[24px] font-bold text-[10px] uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95 border-none cursor-pointer"
              >
                Close Report
              </button>
           </div>
         )}
      </Modal>

      <Modal isOpen={isPayoutModalOpen} onClose={() => setIsPayoutModalOpen(false)} title="Yield Disbursement Hub">
         <div className="space-y-8">
            <div className={`p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl transition-all ${pendingEarnings > 0 ? 'bg-emerald-600' : 'bg-slate-800'}`}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full" />
               <h4 className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-2">Available for Settlement</h4>
               <p className="text-4xl font-bold tracking-tight">K{pendingEarnings.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
               <div className="p-6 bg-[#0d1117] rounded-[28px] border border-[#30363d] flex gap-4">
                  <ArrowDownCircle size={20} className="text-blue-500 flex-shrink-0" />
                  <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase">Monthly payouts are processed on the 1st of every month automatically to your registered wallet.</p>
               </div>
            </div>

            <button 
               onClick={handlePayoutRequest}
               disabled={pendingEarnings === 0 || isSubmitting}
               className={`w-full py-5 rounded-[28px] font-bold text-[10px] uppercase tracking-wider transition-all border border-[#30363d] cursor-pointer active:scale-95 ${pendingEarnings > 0 ? 'bg-blue-600 text-white shadow-xl hover:bg-emerald-600' : 'bg-[#161b22] text-slate-400 cursor-not-allowed'}`}
            >
               {isSubmitting ? 'Processing Node...' : (pendingEarnings > 0 ? 'Request Instant Payout' : 'Cycle Not Ended')}
            </button>
         </div>
      </Modal>

      <Modal isOpen={isProcessingModalOpen} onClose={() => setIsProcessingModalOpen(false)} title="Confirm Yield Distribution">
         <div className="space-y-8">
            <div className="p-10 bg-blue-600 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
               <h4 className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-2 text-center">Settlement for {selectedPayout?.agent?.name}</h4>
               <p className="text-4xl font-bold tracking-tight text-center">K{Number(selectedPayout?.amount).toLocaleString()}</p>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Distribution Method</label>
                  <select 
                    value={processingData.method}
                    onChange={(e) => setProcessingData({ ...processingData, method: e.target.value })}
                    className="w-full px-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-[20px] text-[13px] font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#161b22] appearance-none"
                  >
                    <option value="NETWORK">Network Wallet</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="CASH">Cash Settlement</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Node Transaction ID (Optional)</label>
                  <input 
                    type="text"
                    placeholder="Enter TXID or Proof Reference"
                    value={processingData.trxId}
                    onChange={(e) => setProcessingData({ ...processingData, trxId: e.target.value })}
                    className="w-full px-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-[20px] text-[13px] font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#161b22] transition-all placeholder:text-[#30363d]"
                  />
               </div>
            </div>

            <button 
               onClick={handleProcessPayout}
               disabled={isSubmitting}
               className="w-full py-6 bg-blue-600 text-white rounded-[28px] font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-xl active:scale-95 border-none cursor-pointer"
            >
               {isSubmitting ? 'Updating Ledger...' : 'Finalize Distribution'}
            </button>
         </div>
      </Modal>
    </div>
  );
}
