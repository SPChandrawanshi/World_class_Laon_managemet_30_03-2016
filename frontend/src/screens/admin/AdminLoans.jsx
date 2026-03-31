import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Plus, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  BarChart,
  Target,
  Globe,
  Lock,
  Hash,
  Activity,
  ChevronRight,
  TrendingDown,
  PieChart,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';

export default function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editInterest, setEditInterest] = useState(false);
  const [updatedInterest, setUpdatedInterest] = useState('');
  
  const [newLoan, setNewLoan] = useState({
     borrowerId: '',
     amount: '',
     duration: 3,
     interest: 10,
     loanType: 'Non-collateral'
  });

  const [adminFields, setAdminFields] = useState({
      agentId: '',
      agentCommissionRate: 5,
      initiationFeeRate: 3,
      interestRate: 10,
      latePenaltyRate: 2,
      graceDays: 3,
      dueDay: 5
  });

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/loans');
      if (res.data.success) {
        setLoans(res.data.loans || []);
      }
    } catch (err) {
      console.error('Fetch loans error', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error('Fetch users error', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/config');
      if (res.data.success && res.data.settings) {
        const s = res.data.settings;
        setNewLoan(prev => ({ 
          ...prev, 
          interest: s.default_interest || prev.interest 
        }));
        setAdminFields(prev => ({ 
          ...prev, 
          agentCommissionRate: s.default_agent_percentage || prev.agentCommissionRate,
          latePenaltyRate: s.default_late_fee || prev.latePenaltyRate,
          graceDays: s.default_grace_days || prev.graceDays
        }));
      }
    } catch (err) {
      console.error('Fetch settings error', err);
    }
  };

  React.useEffect(() => {
    fetchLoans();
    fetchUsers();
    fetchSettings();
  }, []);

  const handleSetTerms = async (id) => {
    console.log("Button clicked", { action: 'Approve / Set Terms', loanId: id, adminFields });
    setIsSubmitting(true);
    try {
      const payload = { 
         agentId: adminFields.agentId ? Number(adminFields.agentId) : null,
         agentCommissionRate: Number(adminFields.agentCommissionRate || 0),
         initiationFeeRate: Number(adminFields.initiationFeeRate || 0),
         interestRate: Number(adminFields.interestRate || 0),
         latePenaltyRate: Number(adminFields.latePenaltyRate || 0),
         graceDays: Number(adminFields.graceDays || 0),
         dueDay: Number(adminFields.dueDay || 0)
      };

      console.log("Sending request");
      const res = await api.put(`/admin/loans/${id}/set-terms`, payload);
      console.log("Response received", res);
      
      if (res.data.success) {
        setLoans(prev => prev.map(l => 
          l.id === id ? { ...l, status: 'TERMS_SET' } : l
        ));
        setTimeout(() => fetchLoans(), 1000); // UI updates
        setShowSuccess(true);
        setTimeout(() => {
          setViewModal(null);
          setShowSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('API Error:', err);
      alert(err.response?.data?.message || 'CRITICAL NETWORK ERROR: Failed to apply terms to the loan registry. Please verify backend status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitInterestUpdate = async (id) => {
    setIsSubmitting(true);
    try {
      const res = await api.put(`/admin/loans/${id}/interest`, { interestRate: Number(updatedInterest) });
      if (res.data.success) {
        setLoans(prev => prev.map(l => l.id === id ? { ...l, interestRate: Number(updatedInterest), interest: Number(updatedInterest) } : l));
        setViewModal(prev => ({ ...prev, interestRate: Number(updatedInterest), interest: Number(updatedInterest) }));
        setEditInterest(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating interest');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmFunds = async (id) => {
    console.log("Button clicked", { action: 'Confirm Funds', loanId: id });
    setIsSubmitting(true);
    try {
      console.log("Sending request");
      const res = await api.put(`/admin/loans/${id}/confirm-funds`);
      console.log("Response received", res);
      if (res.data.success) {
        setLoans(prev => prev.map(l => 
          l.id === id ? { ...l, status: 'ACTIVE' } : l
        ));
        setTimeout(() => fetchLoans(), 1000); // refresh list
        setViewModal(null);
      }
    } catch (err) {
      console.error('API Error:', err);
      alert(err.response?.data?.message || 'LIQUIDITY ERROR: Failed to confirm fund disbursement. The network node may be temporarily unreachable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to REJECT this loan?')) return;
    console.log("Button clicked", { action: 'Reject', loanId: id });
    setIsSubmitting(true);
    try {
      console.log("Sending request");
      const res = await api.put(`/admin/loans/${id}/reject`);
      console.log("Response received", res);
      if (res.data.success) {
        setTimeout(() => fetchLoans(), 500); // refresh layout
        setViewModal(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'REJECTION ERROR: Protocol failure while attempting to reject the loan. Please contact system admin.';
      alert(msg);
      console.error('API Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateLoan = async (e) => {
     e.preventDefault();
     console.log("[DIRECT GIVE LOAN CLICKED]", newLoan);
     if (!newLoan.borrowerId || !newLoan.amount) {
        alert("Please select a borrower and enter an amount.");
        return;
     }

     setIsSubmitting(true);
     try {
        const res = await api.post('/admin/loans', {
           userId: Number(newLoan.borrowerId),
           amount: Number(newLoan.amount),
           duration: Number(newLoan.duration),
           interest: Number(newLoan.interest)
        });
        if (res.data.success) {
           fetchLoans();
           setIsModalOpen(false);
           setNewLoan({ borrowerId: '', amount: '', duration: 3, interest: 10, loanType: 'Non-collateral' });
        }
     } catch (err) {
        alert(err.response?.data?.message || 'Error creating loan');
     } finally {
        setIsSubmitting(false);
     }
  };

  const filtered = loans.filter(l => 
    (l.user?.name || '').toLowerCase().includes(search.toLowerCase()) || 
    String(l.id).toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = loans.reduce((s, l) => s + Number(l.principalAmount || l.amount || 0), 0);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in duration-700 px-2 lg:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="Loan Management Protocol" 
          subtitle="Manage approvals, rejections, and loan configurations" 
        />
        <div className="flex gap-4">
           <button 
             onClick={() => setIsModalOpen(true)} 
             className="bg-[#020617] text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl cursor-pointer border-none"
           >
              <Plus size={16} /> Give Loan
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
               <Globe size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Total Value</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">K{totalValue.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative border-l-4 border-l-emerald-500">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:-rotate-12 transition-transform shadow-inner">
               <Activity size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Active Loans</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{loans.filter(l=>l.status==='APPROVED' || l.status==='ACTIVE').length}</h3>
            </div>
         </div>
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 rounded-[22px] bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
               <AlertCircle size={26} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Awaiting Review</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{loans.filter(l=>l.status==='PENDING').length}</h3>
            </div>
         </div>
         <div className="bg-[#020617] rounded-[40px] p-8 text-white shadow-2xl flex items-center gap-6 group overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-600 blur-[60px] opacity-10"></div>
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-[#161b22]/5 border border-white/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
               <ShieldCheck size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider mb-1 leading-none">System Integrity</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">STABLE</h3>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="Search by Borrower Name or Loan ID..."
            className="w-full pl-14 pr-10 py-5 bg-[#161b22] border border-[#30363d] rounded-[28px] text-[11px] font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-200 text-white"
          />
        </div>
      </div>

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
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Overdue Bal.</th>
                <th className="px-6 py-4 text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]/40">
              {loading ? (
                <tr><td colSpan="8" className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse text-[10px]">Synchronizing Data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="py-16 text-center text-slate-500 font-bold uppercase tracking-wider text-[10px]">No loans found</td></tr>
              ) : filtered.map(l => {
                const latePayments = (l.payments || []).filter(p => p.status === 'LATE');
                const overdueBalance = latePayments.reduce((s, p) => s + Number(p.totalCollected || 0), 0);
                const monthlyPayment = Number(l.monthlyPaymentCurrent || l.monthlyPayment || 0);
                return (
                  <tr key={l.id} onClick={() => setViewModal(l)} className="hover:bg-blue-600/5 cursor-pointer transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#0d1117] flex items-center justify-center text-blue-400 border border-[#30363d]">
                          <FileText size={14} />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-white uppercase group-hover:text-blue-400 transition-colors">{l.user?.name || 'Unknown'}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">#{l.id}</p>
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
                    <td className="px-6 py-4">
                      {overdueBalance > 0 ? (
                        <span className="text-[12px] font-bold text-rose-400">K{overdueBalance.toLocaleString()}</span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={l.status} onClick={(e) => { e.stopPropagation(); setViewModal(l); }} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setViewModal(l); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-all active:scale-95 cursor-pointer border-none">
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

      <Modal isOpen={!!viewModal} onClose={() => !isSubmitting && !showSuccess && setViewModal(null)} title="Loan Review & Authority" size="md">
        {viewModal && (
          showSuccess ? (
             <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-[32px] bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-bounce">
                   <CheckCircle2 size={56} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Loan Activated</h3>
                   <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Protocol Sync Complete</p>
                </div>
                <p className="text-[11px] text-slate-400 font-medium max-w-[200px] leading-relaxed">The loan has been successfully moved to the active ledger.</p>
             </div>
          ) : (
          <div className="space-y-8 pb-4">
            <div className="bg-[#020617] p-10 rounded-[40px] text-white flex flex-col items-center relative overflow-hidden group shadow-2xl border border-white/5">
               <div className="absolute inset-0 bg-blue-600/20 blur-[80px] group-hover:bg-blue-600/30 transition-all duration-1000 pointer-events-none"></div>
               <div className="w-20 h-20 rounded-[28px] bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 shadow-2xl backdrop-blur-sm">
                  <Zap size={32} className="group-hover:rotate-12 transition-transform" />
               </div>
               <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2 opacity-70 leading-none">Requested Liquidity</p>
               <h3 className="text-4xl font-bold tracking-tight leading-none mb-4">K{Number(viewModal.principalAmount || viewModal.amount || 0).toLocaleString()}</h3>
               
                <div className="flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                   <span className="text-blue-300">Borrower: {viewModal.user?.name}</span>
                   <div className="flex gap-4 opacity-60">
                      <span>{viewModal.user?.phone}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20 my-auto"></span>
                      <span>{viewModal.user?.email}</span>
                   </div>
                    <span className="text-emerald-400 mt-2 flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        Expected Yield: 
                        {editInterest ? (
                          <input 
                            type="number" 
                            step="0.1"
                            value={updatedInterest} 
                            onChange={(e) => setUpdatedInterest(e.target.value)} 
                            className="w-16 bg-black/30 border border-slate-700 rounded px-2 py-1 outline-none text-white text-xs text-center"
                          />
                        ) : (
                          `${viewModal.interestRate !== undefined ? viewModal.interestRate : (viewModal.interest || 0)}%`
                        )}
                        {editInterest ? (
                          <button onClick={() => submitInterestUpdate(viewModal.id)} className="bg-blue-600 px-2 py-1 rounded text-white text-[9px] uppercase font-bold border-none cursor-pointer">Save</button>
                        ) : (
                          <button onClick={() => { setEditInterest(true); setUpdatedInterest(viewModal.interestRate !== undefined ? viewModal.interestRate : (viewModal.interest || 0)); }} className="bg-[#161b22] px-2 py-1 rounded text-slate-400 text-[9px] uppercase font-bold hover:text-white border-none cursor-pointer">Edit</button>
                        )}
                      </div>
                      {viewModal.status === 'ACTIVE' && (
                        <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1">
                          Current Installment: K{(viewModal.monthlyPaymentCurrent || viewModal.monthlyPayment || 0).toLocaleString()}
                        </div>
                      )}
                    </span>
                </div>

               <div className="w-full mt-6 p-6 bg-[#0d1117] rounded-3xl border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                     <DollarSign size={14} /> Disbursement Protocol
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-left">
                     <div>
                        <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Method</p>
                        <p className="text-[11px] font-bold text-white uppercase">{viewModal.disbursementMethod || 'NOT SET'}</p>
                     </div>
                     {viewModal.disbursementMethod === 'cash' ? (
                        <>
                           <div className="col-span-2">
                              <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Delivery Address</p>
                              <p className="text-[11px] font-bold text-white">{viewModal.deliveryAddress || 'N/A'}</p>
                           </div>
                           <div>
                              <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">WhatsApp</p>
                              <p className="text-[11px] font-bold text-white">{viewModal.whatsapp || 'N/A'}</p>
                           </div>
                        </>
                     ) : (
                        <>
                           <div>
                              <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Bank Name</p>
                              <p className="text-[11px] font-bold text-white uppercase">{viewModal.bankName || 'N/A'}</p>
                           </div>
                           <div className="col-span-2">
                              <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Account (CLABE/Number)</p>
                              <p className="text-[11px] font-bold text-white">{viewModal.accountNumber || 'N/A'}</p>
                           </div>
                           <div className="col-span-2">
                              <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Account Name</p>
                              <p className="text-[11px] font-bold text-white uppercase">{viewModal.accountName || 'N/A'}</p>
                           </div>
                        </>
                     )}
                     <div className="col-span-2 pt-2 border-t border-white/5">
                        <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Reason / Description</p>
                        <p className="text-[11px] text-slate-300 font-medium italic">"{viewModal.description || 'No description provided'}"</p>
                     </div>
                  </div>
               </div>

               {viewModal.status === 'PENDING' && (
                 <div className="w-full mt-10 space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Agent Assignment</label>
                           <select 
                             value={adminFields.agentId} 
                             onChange={e => setAdminFields({...adminFields, agentId: e.target.value})}
                             className="w-full bg-black/30 border-2 border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-blue-500 outline-none transition-all font-bold"
                           >
                              <option value="">Direct Application</option>
                              {users.filter(u=>u.role?.toUpperCase()==='AGENT').map(a=>(
                                 <option key={a.id} value={a.id}>{a.name}</option>
                              ))}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Agent Comm. (%)</label>
                           <input type="number" value={adminFields.agentCommissionRate} onChange={e => setAdminFields({...adminFields, agentCommissionRate: e.target.value})} className="w-full bg-black/30 border-2 border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-blue-500 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Late Fee (% Mo)</label>
                           <input type="number" value={adminFields.latePenaltyRate} onChange={e => setAdminFields({...adminFields, latePenaltyRate: e.target.value})} className="w-full bg-black/30 border-2 border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-blue-500 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Grace Period (D)</label>
                           <input type="number" value={adminFields.graceDays} onChange={e => setAdminFields({...adminFields, graceDays: e.target.value})} className="w-full bg-black/30 border-2 border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-blue-500 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Initiation Fee (%)</label>
                           <input type="number" value={adminFields.initiationFeeRate} onChange={e => setAdminFields({...adminFields, initiationFeeRate: e.target.value})} className="w-full bg-black/30 border-2 border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-blue-500 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Due Day (Date)</label>
                           <input type="number" value={adminFields.dueDay} onChange={e => setAdminFields({...adminFields, dueDay: e.target.value})} className="w-full bg-black/30 border-2 border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-blue-500 outline-none transition-all font-bold" />
                        </div>
                     </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button 
                          disabled={isSubmitting}
                          onClick={() => handleSetTerms(viewModal.id)} 
                          className={`flex-1 py-3.5 px-4 text-white rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all shadow-lg active:scale-95 border border-white/10 cursor-pointer flex items-center justify-center gap-2 ${isSubmitting ? 'bg-[#1c2128] text-slate-500' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/25 hover:shadow-blue-500/40'}`}
                        >
                            {isSubmitting ? (
                               <>Updating Ledger...</>
                            ) : (
                               <><CheckCircle2 size={16} /> <span className="whitespace-nowrap">Apply Terms</span></>
                            )}
                        </button>
                         <button 
                           disabled={isSubmitting}
                           onClick={() => handleReject(viewModal.id)} 
                           className="flex-1 py-3.5 px-4 bg-[#161b22] text-rose-500 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all border border-rose-500/20 hover:bg-rose-600 hover:text-white hover:border-rose-500 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                         >
                           <XCircle size={16} /> <span className="whitespace-nowrap">Reject</span>
                       </button>
                    </div>
                 </div>
               )}

               {viewModal.status === 'TERMS_ACCEPTED' && (
                  <div className="w-full mt-6">
                     <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl mb-6">
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-center">Borrower has accepted terms. Awaiting final disbursement confirmation.</p>
                     </div>
                     <button 
                       disabled={isSubmitting}
                       onClick={() => handleConfirmFunds(viewModal.id)} 
                       className="w-full py-5 bg-emerald-600 text-white rounded-[24px] text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 border-none cursor-pointer flex items-center justify-center gap-3"
                     >
                        <ShieldCheck size={18} /> CONFIRM FUNDS DISBURSED
                     </button>
                  </div>
               )}
            </div>

            {viewModal.status !== 'PENDING' && (
              <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
                 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-4 mb-6">Terms of Authority</h4>
                 <div className="grid grid-cols-2 gap-8 px-4">
                    <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Agent Cut</p>
                        <p className="text-xl font-bold text-white tracking-tight">{viewModal.agentCommissionRate ?? viewModal.agentPercentage ?? 0}%</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Late Penalty</p>
                        <p className="text-xl font-bold text-white tracking-tight">{viewModal.latePenaltyRate ?? viewModal.lateFeePercentage ?? 0}%</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Grace Days</p>
                        <p className="text-xl font-bold text-white tracking-tight">{viewModal.graceDays ?? 0} Days</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Assignee</p>
                        <p className="text-xl font-bold text-white tracking-tight truncate">{users.find(u=>u.id===viewModal.agentId)?.name || 'N/A'}</p>
                    </div>
                 </div>
              </div>
            )}
            
            <button onClick={() => { setViewModal(null); setEditInterest(false); }} className="w-full py-5 bg-[#020617] text-white rounded-[24px] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 border-none cursor-pointer">Return to Registry</button>
          </div>
        )
      )}
</Modal>

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Issue Direct Capital" size="md">
         <form onSubmit={handleCreateLoan} className="space-y-8">
            <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Borrower Account</label>
                   <select
                      value={newLoan.borrowerId}
                      onChange={e => setNewLoan({ ...newLoan, borrowerId: e.target.value })}
                      className="w-full px-6 py-5 bg-[#0d1117] border-2 border-slate-800 rounded-[28px] text-[12px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                      required
                   >
                      <option value="">Select identity...</option>
                      {users.filter(u => u.role === 'BORROWER').map(b => (
                         <option key={b.id} value={b.id}>{b.name} ({b.email})</option>
                      ))}
                   </select>
                </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Principal Amount (K)</label>
                      <input
                        type="number"
                        value={newLoan.amount}
                        onChange={e => setNewLoan({ ...newLoan, amount: e.target.value })}
                        className="w-full px-6 py-5 bg-[#0d1117] border-2 border-slate-800 rounded-[28px] text-[12px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                        placeholder="0.00"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Interest Rate (%)</label>
                     <input
                        type="number"
                        value={newLoan.interest}
                        onChange={e => setNewLoan({ ...newLoan, interest: e.target.value })}
                        className="w-full px-6 py-5 bg-[#0d1117] border-2 border-slate-800 rounded-[28px] text-[12px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                        placeholder="10"
                        required
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Repayment Cycle (Months)</label>
                  <div className="grid grid-cols-4 gap-3">
                     {[1, 3, 6, 12].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setNewLoan({...newLoan, duration: n})}
                          className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${newLoan.duration === n ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-[#0d1117] text-slate-400'}`}
                        >
                           {n}m
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
               <button disabled={isSubmitting} type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-wider shadow-xl border-none cursor-pointer active:scale-95 transition-all">
                  {isSubmitting ? 'Processing Capital...' : 'Commit Capital Issue'}
               </button>
               <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[24px] font-bold text-[10px] uppercase tracking-wider border-none cursor-pointer active:scale-95 transition-all">Abort</button>
            </div>
         </form>
      </Modal>
    </div>
  );
}
