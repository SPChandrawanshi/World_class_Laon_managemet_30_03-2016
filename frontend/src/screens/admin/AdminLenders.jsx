import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Globe, ShieldCheck, Activity, Search, Filter, 
  Building, Trash2, Database, Mail, Phone, Lock, Upload,
  CheckCircle2
} from 'lucide-react';
import { StatusBadge, Btn, PageHeader, ConfirmDialog } from '../../components/UI';
import Modal from '../../components/Modal';
import api from '../../api/axios';

import { THEME } from '../../theme';

const C = THEME.role.admin;

export default function AdminLenders() {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModal, setViewModal]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm]               = useState({ name: '', businessName: '', email: '', phone: '', password: 'Password123!', document: null, plan: 'free' });
  const [errors, setErrors]           = useState({});
  const [allLoans, setAllLoans]       = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchLenders = async () => {
    try {
      setLoading(true);
      console.log("[ADMIN LENDERS] Fetching partner nodes...");
      const res = await api.get('/admin/users');
      if (res.data.success) {
        const partners = (res.data.users || []).filter(u => u.role === 'STAFF' || u.role === 'LENDER');
        setLenders(partners);
        console.log("[ADMIN LENDERS] SUCCESS: Partners count =", partners.length);
      }
    } catch (err) {
      console.error('[ADMIN LENDERS] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await api.get('/admin/loans');
      if (res.data.success) {
        setAllLoans(res.data.loans || []);
      }
    } catch (err) {
      console.error('Fetch loans error', err);
    }
  };

  useEffect(() => {
    fetchLenders();
    fetchLoans();
  }, []);

  const filtered = lenders.filter(l => 
    (l.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (l.businessName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAddLender = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Owner name is mandatory';
    if (!form.businessName) newErrors.businessName = 'Business identity required';
    if (!form.email) newErrors.email = 'Valid email required';
    if (!form.phone) newErrors.phone = 'Contact number required';
    if (!form.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      let documentUrl = null;
      if (form.document) {
        documentUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(form.document);
        });
      }

      const { document, ...payloadData } = form; // Remove File object
      
      const res = await api.post('/admin/users', { ...payloadData, documentUrl, role: 'LENDER' });
      if (res.data.success) {
        setLenders([res.data.user, ...lenders]);
        setShowSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setShowSuccess(false);
          setForm({ name: '', businessName: '', email: '', phone: '', password: 'Password123!', document: null, plan: 'free' });
          setErrors({});
        }, 2000);
      }
    } catch (err) {
      console.error('Add lender error', err);
      setErrors({ server: err.response?.data?.message || 'Failed to register partner' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLender = async () => {
    try {
      const res = await api.delete(`/admin/users/${deleteConfirm.id}`);
      if (res.data.success) {
        setLenders(p => p.filter(l => l.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Delete lender error', err);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in duration-700 px-2 lg:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="Node Partner Registry" 
          subtitle="Enterprise governance for verified micro-lending entities" 
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#020617] text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl active:scale-95 border-none cursor-pointer"
        >
          <UserPlus size={16} /> Register New Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative">
           <div className="relative z-10 w-14 h-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
              <Globe size={26} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Global Nodes</p>
              <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{lenders.length}</h3>
           </div>
        </div>
        <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative">
           <div className="relative z-10 w-14 h-14 rounded-[22px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:-rotate-12 transition-transform shadow-inner">
              <ShieldCheck size={26} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Verified Stream</p>
              <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{lenders.filter(l=>l.verificationStatus==='verified').length}</h3>
           </div>
        </div>
        <div className="bg-[#020617] rounded-[40px] p-8 text-white shadow-2xl flex items-center gap-6 group overflow-hidden relative border-l-4 border-l-blue-600">
           <div className="absolute inset-0 bg-blue-600/10 blur-[40px]"></div>
           <div className="relative z-10 w-14 h-14 rounded-[22px] bg-[#161b22]/5 border border-white/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
              <Activity size={26} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider mb-1 leading-none">Aggregated Yield</p>
              <h3 className="text-3xl font-bold text-white tracking-tight leading-none">K2.4M</h3>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="Search Partner ID, Owner Name or Business Entity..."
            className="w-full pl-14 pr-10 py-5 bg-[#161b22] border border-[#30363d] rounded-[28px] text-[11px] font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-200"
          />
        </div>
        <button onClick={() => alert('Advanced filtering dashboard arriving soon.')} className="px-8 py-5 bg-[#161b22] border border-[#30363d] rounded-[28px] text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-3 shadow-xl shadow-slate-200/50 cursor-pointer">
           <Filter size={18} /> Deep Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(l => (
          <div key={l.id} className="bg-[#161b22] rounded-[40px] border border-slate-50 shadow-sm p-8 hover:border-blue-600 hover:shadow-2xl transition-all group relative flex flex-col justify-between h-full overflow-hidden">
             <div className="mb-8 relative z-10">
                <div className="flex items-start justify-between mb-6">
                   <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all shadow-inner border border-[#30363d] flex items-center justify-center">
                      <Building size={28} />
                   </div>
                    <div className="flex flex-col items-end gap-2">
                       <StatusBadge 
                          status={l.isApproved ? 'verified' : 'pending'} 
                          onClick={async (e) => {
                             e.stopPropagation();
                             try {
                                const res = await api.put(`/admin/users/${l.id}/approve`, { isApproved: !l.isApproved });
                                if (res.data.success) {
                                   setLenders(p => p.map(u => u.id === l.id ? { ...u, isApproved: !l.isApproved, isVerified: !l.isApproved } : u));
                                }
                             } catch (err) {
                                console.error('Toggle approve error', err);
                             }
                          }}
                       />
                       <div className={`px-3 py-1 rounded-full border text-[8px] font-bold uppercase tracking-wider ${
                         l.plan === 'paid' 
                           ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                           : 'bg-blue-50 text-blue-600 border-blue-100'
                       }`}>
                         {l.plan === 'paid' ? '⭐ Premium' : '🔒 Free'}
                       </div>
                    </div>
                 </div>
                <div>
                   <h4 className="text-[17px] font-bold text-white leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight mb-2">{l.businessName}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider opacity-80">{l.name}</p>
                </div>
             </div>
  
             <div className="flex gap-3 mt-auto relative z-10">
                <button 
                   onClick={() => setViewModal(l)}
                   className="flex-1 py-4 bg-[#020617] text-white rounded-2xl text-[9px] font-bold uppercase tracking-wider active:scale-95 transition-all hover:bg-blue-600 shadow-xl border-none cursor-pointer"
                 >
                    Full Profile
                 </button>
                 <button 
                    onClick={() => setDeleteConfirm(l)}
                    className="w-12 h-12 rounded-2xl bg-[#0d1117] text-slate-400 hover:bg-red-600 hover:text-white flex items-center justify-center active:scale-95 transition-all border-none cursor-pointer"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Database size={100} />
              </div>
           </div>
        ))}
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Intelligence Profile • Node Partner" size="lg">
        {viewModal && (
          <div className="space-y-8 pb-4">
            <div className="relative p-10 bg-[#020617] rounded-[40px] text-white overflow-hidden shadow-2xl group">
               <div className="absolute inset-0 bg-blue-600/10 blur-[60px]"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 rounded-[32px] bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-3xl shadow-2xl">
                     {viewModal.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 text-center md:text-left min-w-0">
                     <h3 className="text-3xl font-bold truncate tracking-tight uppercase">{viewModal.businessName}</h3>
                     <p className="text-blue-400/60 text-[10px] font-bold uppercase tracking-wider mt-2">{viewModal.name} • Authorized Proprietor</p>
                     <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <div className="px-4 py-2 bg-[#161b22]/5 rounded-2xl border border-white/10 text-[9px] font-bold uppercase tracking-wider text-blue-100">NODE: {viewModal.id}</div>
                        <div className={`px-4 py-2 rounded-2xl border text-[9px] font-bold uppercase tracking-wider ${
                           viewModal.plan === 'paid'
                             ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
                             : 'bg-blue-500/20 border-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20'
                        }`}>
                          {viewModal.plan === 'paid' ? '⭐ Premium Entity' : '🔒 Standard Node'}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex flex-col gap-1 p-6 bg-[#0d1117] rounded-[28px] border border-[#30363d] relative group overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 leading-none">Registered Email</p>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-blue-600" />
                    <p className="text-[13px] font-bold text-white truncate relative z-10 uppercase">{viewModal.email}</p>
                  </div>
               </div>
               <div className="flex flex-col gap-1 p-6 bg-[#0d1117] rounded-[28px] border border-[#30363d] relative group overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 leading-none">Mobile Node</p>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-blue-600" />
                    <p className="text-[13px] font-bold text-white relative z-10 uppercase">{viewModal.phone}</p>
                  </div>
               </div>
            </div>

            <div className="bg-[#161b22] rounded-[40px] border border-[#30363d] shadow-sm overflow-hidden flex flex-col">
               <div className="p-6 border-b border-slate-50 bg-[#0d1117]/50 flex items-center justify-between">
                  <h4 className="text-[12px] font-bold text-white uppercase tracking-wider">Active Ledger Exposure</h4>
                  <Database size={18} className="text-blue-600" />
               </div>
               <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                 {(() => {
                   const role = viewModal.role?.toUpperCase();
                   const userLoans = role === 'BORROWER'
                     ? allLoans.filter(l => l.userId === viewModal.id)
                     : role === 'AGENT'
                     ? allLoans.filter(l => l.agentId === viewModal.id)
                     : allLoans; // STAFF / ADMIN / LENDER — show all loans
                   return (
                 <table className="w-full">
                    <thead className="bg-[#161b22] sticky top-0 border-b border-[#30363d] z-10">
                       <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Entity / Borrower</th>
                          <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">All Loans</th>
                          <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Repayment Window</th>
                          <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Asset Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363d]">
                       {userLoans.length === 0 ? (
                          <tr><td colSpan="4" className="px-6 py-12 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-loose">Zero live assets found in this node</td></tr>
                       ) : (
                          userLoans.map((loan) => (
                             <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-5">
                                   <div className="flex flex-col">
                                      <span className="text-[13px] font-bold text-white uppercase mb-1">{loan.user?.name || 'Private Entity'}</span>
                                      <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">REF: {loan.id}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-5">
                                   <div className="flex flex-col">
                                      <span className="text-[13px] font-bold text-white">K{Number(loan.principalAmount).toLocaleString()}</span>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">YIELD: {loan.interestRate}%</span>
                                   </div>
                                </td>
                                <td className="px-6 py-5">
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 uppercase leading-none mb-1">{loan.duration} Installments</span>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">EXP: {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'AWAITING DISBURSEMENT'}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                   <div className={`inline-block px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                                      loan.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                      loan.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' :
                                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                   }`}>
                                      {loan.status}
                                   </div>
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
                   );
                 })()}
               </div>
            </div>

            <button className="w-full py-5 bg-[#020617] text-white rounded-[24px] text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all shadow-xl active:scale-95 border-none cursor-pointer" onClick={() => setViewModal(null)}>Dismiss profile</button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteLender}
        title="Terminate Partner Node?"
        message={`This action will permanently purge ${deleteConfirm?.businessName} from the network registry. All associated streams will be archived. Are you absolutely certain?`}
        confirmLabel="Purge Node"
        isDanger
      />

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Register Node Partner" size="md">
        {showSuccess ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
             <div className="w-24 h-24 rounded-[32px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/10">
                <CheckCircle2 size={56} strokeWidth={2.5} />
             </div>
             <div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Registration Complete</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-2 max-w-xs">New partner node has been synchronized and verified in the central registry.</p>
             </div>
          </div>
        ) : (
          <form onSubmit={handleAddLender} className="space-y-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 leading-none flex items-center gap-2">
                  <Building size={12} className="text-blue-600" /> Business Identity
                </label>
                <input 
                  className={`w-full px-6 py-4 border-2 rounded-2xl text-[12px] font-bold uppercase tracking-wider outline-none transition-all ${errors.businessName ? 'border-red-500 bg-red-900/20 text-red-700' : 'border-[#30363d] bg-[#0d1117] focus:border-blue-600 focus:bg-[#1c2128] text-white group-hover:border-slate-200'}`}
                  value={form.businessName} onChange={e => { setForm({...form, businessName: e.target.value}); if(errors.businessName) setErrors({...errors, businessName: null}); }}
                  placeholder="e.g. CAPITAL TRUST LTD"
                />
                {errors.businessName && <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider ml-2">{errors.businessName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 leading-none flex items-center gap-2">
                  <UserPlus size={12} className="text-blue-600" /> Authorized Owner
                </label>
                <input 
                  className={`w-full px-6 py-4 border-2 rounded-2xl text-[12px] font-bold uppercase tracking-wider outline-none transition-all ${errors.name ? 'border-red-500 bg-red-900/20 text-red-700' : 'border-[#30363d] bg-[#0d1117] focus:border-blue-600 focus:bg-[#1c2128] text-white group-hover:border-slate-200'}`}
                  value={form.name} onChange={e => { setForm({...form, name: e.target.value}); if(errors.name) setErrors({...errors, name: null}); }}
                  placeholder="e.g. STEPHEN BANDA"
                />
                {errors.name && <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider ml-2">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 leading-none flex items-center gap-2">
                  <Mail size={12} className="text-blue-600" /> Secure Email
                </label>
                <input 
                   type="email"
                   className={`w-full px-6 py-4 border-2 rounded-2xl text-[12px] font-bold uppercase tracking-wider outline-none transition-all ${errors.email ? 'border-red-500 bg-red-900/20 text-red-700' : 'border-[#30363d] bg-[#0d1117] focus:border-blue-600 focus:bg-[#1c2128] text-white group-hover:border-slate-200'}`}
                   value={form.email} onChange={e => { setForm({...form, email: e.target.value}); if(errors.email) setErrors({...errors, email: null}); }}
                   placeholder="PARTNER@EXAMPLE.COM"
                />
                {errors.email && <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider ml-2">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 leading-none flex items-center gap-2">
                  <Phone size={12} className="text-blue-600" /> Mobile Node
                </label>
                <input 
                  className={`w-full px-6 py-4 border-2 rounded-2xl text-[12px] font-bold uppercase tracking-wider outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-900/20 text-red-700' : 'border-[#30363d] bg-[#0d1117] focus:border-blue-600 focus:bg-[#1c2128] text-white group-hover:border-slate-200'}`}
                  value={form.phone} onChange={e => { setForm({...form, phone: e.target.value}); if(errors.phone) setErrors({...errors, phone: null}); }}
                  placeholder="+260 9xx xxxxxx"
                />
                {errors.phone && <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider ml-2">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 leading-none flex items-center gap-2">
                <Lock size={12} className="text-blue-600" /> Partner Access Code (Password)
              </label>
              <input 
                type="text"
                className={`w-full px-6 py-4 border-2 rounded-2xl text-[12px] font-bold tracking-widest outline-none transition-all ${errors.password ? 'border-red-500 bg-red-900/20' : 'border-[#30363d] bg-[#0d1117] text-white focus:border-blue-600'}`}
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
              />
              <p className="text-[8px] text-slate-500 font-bold uppercase ml-2 italic">Provide this code to the partner for initial login</p>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 leading-none">Subscription Tier</label>
               <div className="grid grid-cols-2 gap-3">
                  {['free', 'paid'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({...form, plan: p})}
                      className={`py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border-2 flex items-center justify-center gap-3 ${
                        form.plan === p 
                          ? 'bg-[#020617] text-white border-[#020617] shadow-xl' 
                          : 'bg-[#161b22] text-slate-400 border-[#30363d] hover:border-slate-200'
                      }`}
                    >
                      {p === 'paid' ? <CheckCircle2 size={14} className="text-blue-400" /> : <Lock size={14} />}
                      {p === 'paid' ? '⭐ Premium' : 'Free Access'}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 leading-none">Authentication Docs</label>
              <label className="block w-full border-2 border-dashed border-[#30363d] rounded-[28px] p-8 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50/50 transition-all group/upload relative overflow-hidden bg-[#0d1117]/50">
                 <input type="file" className="hidden" onChange={e => setForm({...form, document: e.target.files[0]})} />
                 <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-[22px] bg-[#161b22] text-blue-600 flex items-center justify-center shadow-lg group-hover/upload:scale-110 transition-transform">
                      <Upload size={24} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-white uppercase tracking-tight">
                        {form.document ? form.document.name : 'Verify Business License'}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        {form.document ? 'Document Encrypted' : 'PDF, JPG or PNG (MAX 5MB)'}
                      </p>
                    </div>
                 </div>
                 {form.document && <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-emerald-500 animate-pulse border-4 border-white"></div>}
              </label>
            </div>

             {errors.server && (
               <div className="p-4 rounded-[20px] bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[11px] uppercase tracking-wider text-center">
                 {errors.server}
               </div>
             )}

            <div className="flex gap-4 pt-6">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-wider shadow-2xl shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Activity size={18} className="animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Register Partner
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-5 bg-[#1c2128] text-slate-400 rounded-[24px] text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 transition-all border-none cursor-pointer"
              >
                Abort
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
