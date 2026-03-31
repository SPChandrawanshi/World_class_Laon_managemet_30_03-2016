import React, { useState, useEffect } from 'react';
import {
   FileText,
   Search,
   Filter,
   Plus,
   Calendar,
   CreditCard,
   Users,
   ShieldCheck,
   ChevronRight,
   AlertTriangle,
   Zap,
   Clock,
   CheckCircle2,
   X
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';

export default function LenderLoans() {
   const [loans, setLoans] = useState([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [viewModal, setViewModal] = useState(null);
   const [activeTab, setActiveTab] = useState('ALL'); // PENDING, APPROVED, ALL
   const [borrowers, setBorrowers] = useState([]);
   const [agents, setAgents] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   
   const [adminFields, setAdminFields] = useState({
       agentId: '',
       agentCommissionRate: 5,
       initiationFeeRate: 0, 
       interestRate: 10,
       latePenaltyRate: 2,
       graceDays: 3,
       dueDay: 5
   });

   const fetchData = async () => {
      try {
         setLoading(true);
         const [loansRes, usersRes, configRes] = await Promise.all([
            api.get('/admin/loans'),
            api.get('/admin/users'),
            api.get('/admin/config')
         ]);
         
         if (loansRes.data.success) {
            setLoans(loansRes.data.loans || []);
         }
         if (usersRes.data.success) {
            const allUsers = usersRes.data.users || [];
            setBorrowers(allUsers.filter(u => u.role === 'BORROWER'));
            setAgents(allUsers.filter(u => u.role === 'AGENT'));
         }
         if (configRes.data.success) {
            const s = configRes.data.settings;
            setAdminFields(prev => ({
               ...prev,
               interestRate: s.default_interest ?? prev.interestRate,
               latePenaltyRate: s.default_late_fee ?? prev.latePenaltyRate,
               agentCommissionRate: s.default_agent_percentage ?? prev.agentCommissionRate,
               graceDays: s.default_grace_days ?? prev.graceDays
            }));
         }
      } catch (err) {
         console.error('Fetch loans error', err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   const filtered = (loans || []).filter(Boolean).filter(l => {
      const name = l.user?.name || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
                          String(l.id).includes(search);
      const matchesTab = activeTab === 'ALL' ? true : l.status === activeTab;
      return matchesSearch && matchesTab;
   });

   const handleSetTerms = async (id) => {
      console.log("[STAFF SET TERMS CLICKED]", id, adminFields);
      setIsSubmitting(true);
      try {
         const payload = { 
            agentId: adminFields.agentId ? Number(adminFields.agentId) : null,
            agentCommissionRate: Number(adminFields.agentCommissionRate),
            initiationFeeRate: Number(adminFields.initiationFeeRate),
            interestRate: Number(adminFields.interestRate),
            latePenaltyRate: Number(adminFields.latePenaltyRate),
            graceDays: Number(adminFields.graceDays),
            dueDay: Number(adminFields.dueDay)
         };

         const res = await api.put(`/admin/loans/${id}/set-terms`, payload);
         if (res.data.success) {
            setShowSuccess(true);
            setTimeout(() => {
               fetchData();
               setViewModal(null);
               setShowSuccess(false);
            }, 2000);
         }
      } catch (err) {
         alert(err.response?.data?.message || 'Error setting terms');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleConfirmFunds = async (id) => {
      console.log("[STAFF CONFIRM FUNDS CLICKED]", id);
      setIsSubmitting(true);
      try {
         const res = await api.put(`/admin/loans/${id}/confirm-funds`);
         if (res.data.success) {
            fetchData();
            setViewModal(null);
         }
      } catch (err) {
         alert(err.response?.data?.message || 'Error confirming funds');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleReject = async (id) => {
      if (!window.confirm('Reject this loan request?')) return;
      console.log("[STAFF REJECT CLICKED]", id);
      setIsSubmitting(true);
      try {
         const res = await api.put(`/admin/loans/${id}/reject`);
         if (res.data.success) {
            fetchData();
            setViewModal(null);
         }
      } catch (err) {
         alert(err.response?.data?.message || 'Error rejecting loan');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-700">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 pt-4">
            <PageHeader
               title="Check Requests"
               subtitle="Verify and authorize network loan applications"
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all group">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock size={24} />
               </div>
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Pending Requests</p>
                  <h3 className="text-2xl font-bold text-white leading-none">{(loans || []).filter(l => l.status === 'PENDING').length}</h3>
               </div>
            </div>
            <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-emerald-500 transition-all group">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={24} />
               </div>
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Active Assets</p>
                  <h3 className="text-2xl font-bold text-white leading-none">{(loans || []).filter(l => l.status === 'APPROVED' || l.status === 'ACTIVE').length}</h3>
               </div>
            </div>
            <div className="bg-[#020617] rounded-[32px] p-6 text-white border border-white/5 shadow-2xl flex items-center gap-5 relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-all"></div>
               <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#161b22] text-blue-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <ShieldCheck size={24} />
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider leading-none mb-1">Clearing Node</p>
                  <h3 className="text-2xl font-bold text-white leading-none uppercase">Verified</h3>
               </div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#161b22] p-2 rounded-[28px] border border-[#30363d] mx-4">
            <div className="flex gap-1 w-full md:w-auto">
               {['PENDING', 'APPROVED', 'ALL'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-[#1c2128]'}`}
                 >
                   {tab === 'PENDING' ? 'New Requests' : tab === 'APPROVED' ? 'Cleared' : 'Audit Trail'}
                 </button>
               ))}
            </div>
            <div className="relative w-full md:w-80">
               <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
               <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by ID or Borrower..."
                  className="w-full pl-14 pr-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-600"
               />
            </div>
         </div>

         <div className="px-4">
            <div className="bg-[#161b22] rounded-3xl border border-[#30363d] shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-[#0d1117] border-b border-[#30363d]">
                        <tr>
                           <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Borrower</th>
                           <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Principal</th>
                           <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Monthly</th>
                           <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Due Day</th>
                           <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Agent</th>
                           <th className="px-6 py-4 text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                           <th className="px-6 py-4 text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#30363d]/40">
                        {loading ? (
                           <tr><td colSpan="7" className="py-20 text-center text-slate-500 text-[10px] font-bold uppercase animate-pulse">Connecting to Registry...</td></tr>
                        ) : filtered.length === 0 ? (
                           <tr><td colSpan="7" className="py-16 text-center text-slate-500 text-[10px] font-bold uppercase">All nodes synchronized</td></tr>
                        ) : filtered.map(l => {
                           const monthlyPayment = Number(l.monthlyPaymentCurrent || l.monthlyPayment || 0);
                           return (
                              <tr key={l.id} onClick={() => setViewModal(l)} className="hover:bg-blue-600/5 cursor-pointer transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-blue-400">
                                          <FileText size={14} />
                                       </div>
                                       <div>
                                          <p className="text-[12px] font-bold text-white uppercase group-hover:text-blue-400 transition-colors">{l.user?.name || 'Unknown'}</p>
                                          <p className="text-[9px] text-slate-500 font-bold">#{l.id}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="text-[13px] font-bold text-white">K{Number(l.principalAmount || 0).toLocaleString()}</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase">{l.interestRate || 0}% / mo</p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="text-[12px] font-bold text-emerald-400">
                                       {monthlyPayment > 0 ? `K${monthlyPayment.toLocaleString()}` : '—'}
                                    </p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="text-[11px] font-bold text-slate-300">
                                       {l.dueDay ? `${l.dueDay}${l.dueDay === 1 ? 'st' : l.dueDay === 2 ? 'nd' : l.dueDay === 3 ? 'rd' : 'th'}` : '—'}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="text-[11px] font-bold text-slate-300">{l.agent?.name || '—'}</span>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                    <StatusBadge status={l.status} onClick={(e) => { e.stopPropagation(); setViewModal(l); }} />
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button onClick={(e) => { e.stopPropagation(); setViewModal(l); }}
                                       className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-all active:scale-95">
                                       Manage
                                    </button>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Loan Info Modal */}
         <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Loan Authority Review" size="lg">
            {viewModal && (
                <div className="space-y-8 pb-4">
                  {showSuccess ? (
                     <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 rounded-[32px] bg-emerald-500 text-white flex items-center justify-center shadow-2xl animate-bounce">
                           <CheckCircle2 size={56} />
                        </div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Terms Set Successfully</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Protocol Sync Complete</p>
                     </div>
                  ) : (
                     <>
                        <div className="bg-[#020617] p-8 md:p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl group border border-white/5">
                           <div className="absolute inset-0 bg-blue-900/10 blur-3xl group-hover:bg-blue-900/20 transition-all"></div>
                           <div className="relative z-10 flex flex-col items-center">
                              <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2 opacity-60 leading-none">Requested Capital</p>
                              <h3 className="text-4xl font-bold tracking-tight leading-none mb-6">K{(viewModal.principalAmount ?? 0).toLocaleString()}</h3>

                              <div className="flex flex-wrap justify-center gap-3">
                                 <div className="px-5 py-2.5 bg-[#161b22]/5 border border-white/5 rounded-2xl flex flex-col items-center min-w-[100px]">
                                    <p className="text-white text-[12px] font-bold leading-none">{viewModal.duration} Months</p>
                                    <p className="text-[8px] text-blue-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Term</p>
                                 </div>
                                 <div className="px-5 py-2.5 bg-[#161b22]/5 border border-white/5 rounded-2xl flex flex-col items-center min-w-[100px]">
                                    <p className="text-blue-300 text-[12px] font-bold leading-none">{viewModal.interestRate || viewModal.interest || 0}%</p>
                                    <p className="text-[8px] text-blue-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Interest</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-4">
                           <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">Disbursement Details</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Method</p>
                                 <p className="text-[11px] font-bold text-white uppercase">{viewModal.disbursementMethod || 'Cash'}</p>
                              </div>
                              {viewModal.disbursementMethod === 'wire' ? (
                                 <>
                                    <div>
                                       <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Bank</p>
                                       <p className="text-[11px] font-bold text-white uppercase">{viewModal.bankName}</p>
                                    </div>
                                    <div className="col-span-2">
                                       <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Account</p>
                                       <p className="text-[11px] font-bold text-white">{viewModal.accountNumber}</p>
                                    </div>
                                 </>
                              ) : (
                                 <div className="col-span-2">
                                    <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Address / Contact</p>
                                    <p className="text-[11px] font-bold text-white">{viewModal.deliveryAddress} • {viewModal.whatsapp}</p>
                                 </div>
                              )}
                           </div>
                        </div>

                        {viewModal.status === 'PENDING' && (
                           <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Agent</label>
                                    <select 
                                      value={adminFields.agentId} 
                                      onChange={e => setAdminFields({...adminFields, agentId: e.target.value})}
                                      className="w-full bg-black/30 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none"
                                    >
                                       <option value="">Direct</option>
                                       {agents.map(a => (
                                          <option key={a.id} value={a.id}>{a.name}</option>
                                       ))}
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Interest (%)</label>
                                    <input type="number" value={adminFields.interestRate} onChange={e => setAdminFields({...adminFields, interestRate: e.target.value})} className="w-full bg-black/30 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Penalty (%)</label>
                                    <input type="number" value={adminFields.latePenaltyRate} onChange={e => setAdminFields({...adminFields, latePenaltyRate: e.target.value})} className="w-full bg-black/30 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Grace Days</label>
                                    <input type="number" value={adminFields.graceDays} onChange={e => setAdminFields({...adminFields, graceDays: e.target.value})} className="w-full bg-black/30 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white" />
                                 </div>
                              </div>

                              <div className="flex gap-4">
                                 <button onClick={() => handleReject(viewModal.id)} disabled={isSubmitting} className="flex-1 py-4 bg-rose-600/20 text-rose-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest border-none cursor-pointer">Reject</button>
                                 <button onClick={() => handleSetTerms(viewModal.id)} disabled={isSubmitting} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest border-none cursor-pointer shadow-xl">Set Terms</button>
                              </div>
                           </div>
                        )}

                        {viewModal.status === 'TERMS_ACCEPTED' && (
                           <div className="pt-4">
                              <button 
                                onClick={() => handleConfirmFunds(viewModal.id)}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-emerald-600 text-white rounded-3xl text-[10px] font-bold uppercase tracking-widest border-none cursor-pointer shadow-xl shadow-emerald-600/20"
                              >
                                {isSubmitting ? 'Confirming...' : 'Confirm Funds Disbursed'}
                              </button>
                           </div>
                        )}

                        <div className="flex justify-center pt-2">
                           <button onClick={() => setViewModal(null)} className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-none bg-transparent cursor-pointer hover:text-white transition-colors">Close View</button>
                        </div>
                     </>
                  )}
                </div>
            )}
         </Modal>
      </div>
   );
}
