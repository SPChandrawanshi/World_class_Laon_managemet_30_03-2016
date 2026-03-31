import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Activity, 
  ChevronRight, 
  Plus, 
  Globe, 
  Lock, 
  Hash, 
  Mail, 
  Phone, 
  Briefcase,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent
} from 'lucide-react';
import { StatusBadge, Btn, PageHeader, ConfirmDialog } from '../../components/UI';
import Modal from '../../components/Modal';
import api from '../../api/axios';

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModal, setViewModal]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm]               = useState({ name: '', email: '', phone: '', password: 'Password123!', address: '' });
  const [errors, setErrors]           = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [payoutModal, setPayoutModal] = useState(null);
  const [payoutData, setPayoutData]   = useState({ amount: '', method: 'BANK', trxId: '' });

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const [agentsRes, commRes, loansRes] = await Promise.all([
        api.get('/admin/users?role=AGENT'),
        api.get('/admin/commissions'),
        api.get('/admin/loans')
      ]);
      if (agentsRes.data.success) setAgents(agentsRes.data.users);
      if (commRes.data.success) setCommissions(commRes.data.commissions || []);
      if (loansRes.data.success) setLoans(loansRes.data.loans || []);
    } catch (err) {
      console.error('Fetch agents error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayout = async () => {
    if (!payoutModal) return;
    try {
      await api.post('/admin/payouts', {
        agentId: payoutModal.id,
        amount: Number(payoutData.amount),
        method: payoutData.method,
        trxId: payoutData.trxId
      });
      setPayoutModal(null);
      setPayoutData({ amount: '', method: 'BANK', trxId: '' });
      fetchAgents();
    } catch (err) {
      console.error('Payout error', err);
    }
  };

  React.useEffect(() => {
    fetchAgents();
  }, []);

  const handleAddAgent = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Agent name is required';
    if (!form.email) newErrors.email = 'Valid email required';
    if (!form.phone) newErrors.phone = 'Contact number required';
    if (!form.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/admin/users', { ...form, role: 'AGENT' });
      if (res.data.success) {
        setAgents([res.data.user, ...agents]);
        setShowSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setShowSuccess(false);
          setForm({ name: '', email: '', phone: '', password: 'Password123!', address: '' });
          setErrors({});
        }, 2000);
      }
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Failed to register agent' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAgent = async () => {
    try {
      const res = await api.delete(`/admin/users/${deleteConfirm.id}`);
      if (res.data.success) {
        setAgents(p => p.filter(a => a.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleToggleVerify = async (id, current) => {
    try {
      const res = await api.put(`/admin/users/${id}/approve`, { isApproved: !current });
      if (res.data.success) {
        setAgents(p => p.map(a => a.id === id ? { ...a, isApproved: !current, isVerified: !current } : a));
      }
    } catch (err) {
      console.error('Verify error', err);
    }
  };

  const filtered = agents.filter(a => 
    (a.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (a.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in duration-700 px-2 lg:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="Agent Network Management" 
          subtitle="Oversee independent agents and commission structures" 
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#020617] text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl cursor-pointer border-none"
        >
          <UserPlus size={16} /> Register New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
               <Briefcase size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Active Agents</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{agents.length}</h3>
            </div>
         </div>
         <div className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:-rotate-12 transition-transform shadow-inner">
               <ShieldCheck size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 leading-none">Verified Status</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{agents.filter(a=>a.isApproved).length}</h3>
            </div>
         </div>
         <div className="bg-[#020617] rounded-[40px] p-8 text-white shadow-2xl flex items-center gap-6 group overflow-hidden relative border-l-4 border-l-orange-500">
            <div className="absolute inset-0 bg-orange-500/10 blur-[40px]"></div>
            <div className="relative z-10 w-14 h-14 rounded-[22px] bg-[#161b22]/5 border border-white/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
               <TrendingUp size={26} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-orange-400/60 font-bold uppercase tracking-wider mb-1 leading-none">Total Commissions</p>
               <h3 className="text-3xl font-bold text-white tracking-tight leading-none">K{commissions.reduce((s,c) => s + Number(c.amount || 0), 0).toLocaleString()}</h3>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="Search by Agent Name or Email..."
            className="w-full pl-14 pr-10 py-5 bg-[#161b22] border border-[#30363d] rounded-[28px] text-[11px] font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-200"
          />
        </div>
      </div>

      <div className="bg-[#161b22] rounded-3xl border border-[#30363d] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0d1117] border-b border-[#30363d]">
              <tr>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Clients</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Earned</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Commission %</th>
                <th className="px-6 py-4 text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]/40">
              {loading ? (
                <tr><td colSpan="7" className="py-16 text-center text-slate-500 font-bold uppercase text-[10px] animate-pulse">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="py-16 text-center text-slate-500 font-bold uppercase text-[10px]">No agents found</td></tr>
              ) : filtered.map(a => {
                const agentComms = commissions.filter(c => c.agentId === a.id);
                const totalEarned = agentComms.reduce((s, c) => s + Number(c.amount || 0), 0);
                const activeClients = loans.filter(l => l.agentId === a.id && l.status === 'ACTIVE').length;
                const maxPossible = loans.filter(l => l.agentId === a.id).length;
                const progressPct = maxPossible > 0 ? Math.round((activeClients / maxPossible) * 100) : 0;
                return (
                  <tr key={a.id} className="hover:bg-blue-600/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-blue-400 font-bold text-sm">
                          {(a.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-white uppercase group-hover:text-blue-400 transition-colors">{a.name}</p>
                          <p className="text-[9px] text-slate-500 font-bold">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-slate-300">{a.phone || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-bold text-blue-400">{activeClients}</span>
                        <div className="w-20 h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-bold ${totalEarned > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {totalEarned > 0 ? `K${totalEarned.toLocaleString()}` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-amber-400">
                        {loans.find(l => l.agentId === a.id)?.agentCommissionRate ?? '—'}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge
                        status={a.isVerified ? 'verified' : 'pending'}
                        onClick={() => handleToggleVerify(a.id, a.isVerified)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setPayoutModal(a); setPayoutData({ amount: '', method: 'BANK', trxId: '' }); }}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all active:scale-95"
                        >
                          Payout
                        </button>
                        <button
                          onClick={() => setViewModal(a)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-all active:scale-95"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(a)}
                          className="p-2.5 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Register Agent" size="md">
        {showSuccess ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-24 h-24 rounded-[32px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xl">
                <CheckCircle2 size={56} />
             </div>
             <h3 className="text-2xl font-bold text-white uppercase">Agent registered</h3>
          </div>
        ) : (
          <form onSubmit={handleAddAgent} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input 
                className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Agent Name"
              />
              {errors.name && <p className="text-red-500 text-[9px] font-bold">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                <input 
                  type="email"
                  className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="agent@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                <input 
                  className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="097..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <input 
                type="text"
                className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none tracking-widest"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Home Address</label>
              <textarea 
                className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none h-24"
                value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address..."
              />
            </div>
            {errors.server && <p className="text-red-500 text-[10px] font-bold">{errors.server}</p>}
            <div className="flex gap-4 pt-4">
               <button disabled={isSubmitting} type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-wider shadow-xl border-none cursor-pointer">
                  {isSubmitting ? 'Registering...' : 'Complete Registration'}
               </button>
               <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-5 bg-gray-100 text-gray-500 rounded-2xl font-bold text-[10px] uppercase tracking-wider border-none cursor-pointer">Abort</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Agent Protocol Profile" size="md">
        {viewModal && (
          <div className="space-y-8 pb-4">
             <div className="bg-[#020617] p-10 rounded-[40px] text-white flex flex-col items-center relative overflow-hidden group shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-blue-600/20 blur-[80px]"></div>
                <div className="w-20 h-20 rounded-[28px] bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 shadow-2xl backdrop-blur-sm text-3xl font-bold">
                   {viewModal.name[0]}
                </div>
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2 opacity-70 leading-none">Registered Agent</p>
                <h3 className="text-3xl font-bold tracking-tight leading-none mb-4 uppercase">{viewModal.name}</h3>
                
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest mb-8">
                   <span className="text-emerald-400">Verified Node</span>
                   <span className="text-white/20">/</span>
                   <span className="text-blue-300">Level 1 Authority</span>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mt-4">
                   <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Network Yield</p>
                      <p className="text-xl font-bold text-white tracking-tight leading-none">K45,200</p>
                   </div>
                   <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Agent Load</p>
                      <p className="text-xl font-bold text-white tracking-tight leading-none">12 Loans</p>
                   </div>
                </div>
             </div>

             <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-4 mb-6">Credential Details</h4>
                <div className="grid grid-cols-1 gap-6 px-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400"><Mail size={18} /></div>
                      <div>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Primary Link</p>
                         <p className="text-[13px] font-bold text-white tracking-tight truncate">{viewModal.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400"><Phone size={18} /></div>
                      <div>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Secure Comms</p>
                         <p className="text-[13px] font-bold text-white tracking-tight">{viewModal.phone}</p>
                      </div>
                   </div>
                   {viewModal.address && (
                     <div className="flex items-start gap-4 pt-2 border-t border-white/5 mt-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0"><Globe size={18} /></div>
                        <div>
                           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Registry Location</p>
                           <p className="text-[11px] font-bold text-slate-300 leading-relaxed uppercase">{viewModal.address}</p>
                        </div>
                     </div>
                   )}
                </div>
             </div>
             
             <button onClick={() => setViewModal(null)} className="w-full py-5 bg-[#020617] text-white rounded-[24px] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 border-none cursor-pointer shadow-xl">Return to Network Registry</button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteAgent}
        title="Remove Agent?"
        message={`Are you sure you want to remove ${deleteConfirm?.name} from the network?`}
        confirmLabel="Remove"
        isDanger
      />

      <Modal isOpen={!!payoutModal} onClose={() => setPayoutModal(null)} title="Record Commission Payout" size="sm">
        {payoutModal && (
          <div className="space-y-5 pb-2">
            <div className="bg-[#0d1117] p-5 rounded-2xl border border-[#30363d]">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Agent</p>
              <p className="text-[14px] font-bold text-white uppercase">{payoutModal.name}</p>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">
                Total earned: K{commissions.filter(c => c.agentId === payoutModal.id).reduce((s, c) => s + Number(c.amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Payout Amount (K)</label>
              <input
                type="number"
                className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-bold text-white focus:border-emerald-500 outline-none"
                value={payoutData.amount}
                onChange={e => setPayoutData({ ...payoutData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Method</label>
              <select
                className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-bold text-white focus:border-emerald-500 outline-none cursor-pointer"
                value={payoutData.method}
                onChange={e => setPayoutData({ ...payoutData, method: e.target.value })}
              >
                <option value="BANK">Bank Transfer</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Transaction ID</label>
              <input
                className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-bold text-white focus:border-emerald-500 outline-none"
                value={payoutData.trxId}
                onChange={e => setPayoutData({ ...payoutData, trxId: e.target.value })}
                placeholder="TXN-..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleRecordPayout}
                disabled={!payoutData.amount}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                Record Payout
              </button>
              <button onClick={() => setPayoutModal(null)} className="px-6 py-4 bg-[#0d1117] text-slate-400 rounded-xl text-[10px] font-bold uppercase cursor-pointer hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
