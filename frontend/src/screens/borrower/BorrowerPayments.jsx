import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Filter, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, Download, Receipt, ArrowUpRight, Zap
} from 'lucide-react';
import { PageHeader, StatusBadge, Input, Select, Btn } from '../../components/UI';
import api from '../../api/axios';
import Modal from '../../components/Modal';

export default function BorrowerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [submitModal, setSubmitModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [proofForm, setProofForm] = useState({ trxId: '', method: 'CASH', principalPaid: '' });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/client/payments/my');
      if (res.data.success) {
        setPayments(res.data.payments || []);
      }
    } catch (err) {
      console.error('Failed to fetch payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter(p => 
    String(p.loanId).includes(search) || 
    p.trxId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = payments
    .filter(p => p.status === 'VERIFIED')
    .reduce((s, p) => s + Number(p.totalCollected || p.baseAmount || 0), 0);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-2 lg:px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="My Payment Ledger" 
          subtitle="Track all your verified and pending capital repayments." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] shadow-sm flex items-center gap-6 group hover:border-emerald-500 transition-all">
            <div className="w-16 h-16 rounded-[22px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
               <CheckCircle2 size={32} />
            </div>
            <div>
               <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Verified</h3>
               <p className="text-3xl font-bold text-white tracking-tight">K{totalPaid.toLocaleString()}</p>
            </div>
         </div>
         <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] shadow-sm flex items-center gap-6 group hover:border-amber-500 transition-all">
            <div className="w-16 h-16 rounded-[22px] bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
               <Clock size={32} />
            </div>
            <div>
               <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Approval</h3>
               <p className="text-3xl font-bold text-white tracking-tight">{payments.filter(p=>p.status==='PENDING').length}</p>
            </div>
         </div>
         <div className="bg-[#020617] p-8 rounded-[40px] border border-white/5 shadow-2xl flex items-center gap-6 group relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/10 blur-[60px]" />
            <div className="relative z-10 w-16 h-16 rounded-[22px] bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
               <Receipt size={32} />
            </div>
            <div className="relative z-10">
               <h3 className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-1">Total Transactions</h3>
               <p className="text-3xl font-bold text-white tracking-tight">{payments.length}</p>
            </div>
         </div>
      </div>

      <div className="bg-[#161b22] rounded-[40px] border border-[#30363d] shadow-sm overflow-hidden min-h-[400px]">
         <div className="p-8 border-b border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider">Transaction Archive</h4>
            <div className="relative w-full md:w-80">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                 type="text"
                 placeholder="Search by Loan ID or TRX..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Synchronizing Ledger...</div>
            ) : filtered.length > 0 ? (
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-[#0d1117]/50">
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loan Ref</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capital Amount</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Status</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#30363d]/30">
                    {filtered.map(p => (
                       <tr key={p.id} className="hover:bg-blue-600/5 transition-all group">
                          <td className="px-10 py-8 font-mono text-[11px] text-blue-500 font-bold">#{p.trxId || `TX-${p.id}`}</td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-3">
                                <span className="text-[12px] font-bold text-white">Loan #{p.loanId}</span>
                                <ArrowUpRight size={14} className="text-slate-500" />
                             </div>
                          </td>
                          <td className="px-10 py-8 font-bold text-[14px] text-white tracking-tight">K{Number(p.totalCollected || p.baseAmount || 0).toLocaleString()}</td>
                           <td className="px-10 py-8">
                              <StatusBadge
                                status={p.status === 'VERIFIED' ? 'APPROVED' : (p.trxId ? 'VERIFYING' : 'PAY NOW')}
                                onClick={p.status === 'PENDING' ? () => {
                                  setProofForm({ trxId: p.trxId || '', method: p.method || 'CASH', principalPaid: '' });
                                  setSubmitModal(p);
                                } : null}
                              />
                           </td>
                          <td className="px-10 py-8 text-right">
                             <p className="text-[12px] font-bold text-white tracking-tighter">{new Date(p.createdAt).toLocaleDateString()}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            ) : (
              <div className="py-40 text-center flex flex-col items-center">
                 <div className="w-20 h-20 rounded-3xl bg-[#0d1117] flex items-center justify-center text-slate-700 mb-6">
                    <Receipt size={40} />
                 </div>
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Zero verified records found in archive</p>
              </div>
            )}
         </div>
      </div>
      <Modal isOpen={!!submitModal} onClose={() => setSubmitModal(null)} title="Submit Payment Proof">
        {submitModal && (
          <div className="space-y-6 pb-2">
            <div className="bg-[#020617] p-6 rounded-[32px] text-center text-white relative overflow-hidden shadow-xl">
               <div className="absolute inset-0 bg-blue-900/10 blur-3xl"></div>
               <p className="relative z-10 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 opacity-70">Total Payment Amount</p>
               <h3 className="relative z-10 text-3xl font-bold tracking-tight leading-none mb-1">K{(Number(submitModal.totalCollected || submitModal.baseAmount || 0) + (Number(proofForm.principalPaid) || 0)).toLocaleString()}</h3>
               <p className="relative z-10 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Loan Ref: #{submitModal.loanId} (Base: K{Number(submitModal.totalCollected || submitModal.baseAmount || 0).toLocaleString()})</p>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Disbursement / Payment Method</label>
                  <Select 
                    value={proofForm.method} 
                    onChange={e => setProofForm(p => ({ ...p, method: e.target.value }))}
                  >
                    <option value="CASH">Cash / Physical Agent</option>
                    <option value="WIRE">Bank Wire / Transfer</option>
                    <option value="MOBILE">Mobile Money</option>
                  </Select>
               </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Transaction ID / Reference Number</label>
                  <Input 
                    placeholder="Enter TRX-ID or Receipt #" 
                    value={proofForm.trxId}
                    onChange={e => setProofForm(p => ({ ...p, trxId: e.target.value }))}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Additional Principal Paydown (Optional)</label>
                  <Input 
                    type="number"
                    placeholder="Enter extra amount to reduce principal" 
                    value={proofForm.principalPaid}
                    onChange={e => setProofForm(p => ({ ...p, principalPaid: e.target.value }))}
                  />
               </div>
            </div>

            <div className="flex gap-3 pt-2">
               <Btn variant="ghost" className="flex-1" onClick={() => setSubmitModal(null)}>Cancel</Btn>
               <Btn 
                 className="flex-[2]" 
                 disabled={submitting || !proofForm.trxId}
                 onClick={async () => {
                   console.log("[PAYMENT PROOF SUBMIT CLICKED]", submitModal.id, proofForm);
                   console.log("Button clicked", { action: 'Payment Submit', payload });
                   setSubmitting(true);
                   try {
                     const payload = {
                       ...proofForm,
                       principalPaid: Number(proofForm.principalPaid) || 0,
                       totalCollected: Number(submitModal.totalCollected || submitModal.baseAmount || 0) + (Number(proofForm.principalPaid) || 0)
                     };
                     console.log("Sending request");
                     const res = await api.put(`/client/payments/${submitModal.id}`, payload);
                     console.log("Response received", res);
                     if (res.data.success) {
                        setSubmitModal(null);
                        fetchPayments();
                     }
                   } catch (err) {
                     alert('Synchronization Error: Neural uplink failed to broadcast payment record. Check network authority.');
                   } finally {
                     setSubmitting(false);
                   }
                 }}
               >
                 {submitting ? 'Broadcasting...' : 'Update Record'}
               </Btn>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
