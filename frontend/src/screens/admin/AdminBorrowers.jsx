import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  User, 
  Trash2, 
  Phone, 
  Calendar, 
  MapPin, 
  Activity, 
  Database 
} from 'lucide-react';
import { RiskBadge, Btn, PageHeader, ConfirmDialog, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';
import api from '../../api/axios';

export default function AdminBorrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [viewModal, setViewModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', nrc: '', dob: '', address: '', password: 'Password123!', risk: 'GREEN' });
  const [allLoans, setAllLoans] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchBorrowers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users?role=BORROWER');
      if (res.data.success) {
        setBorrowers(res.data.users);
      }
    } catch (err) {
      console.error('Fetch borrowers error', err);
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
    fetchBorrowers();
    fetchLoans();
  }, []);

  const handleAddBorrower = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const res = await api.post('/admin/users', { ...form, role: 'BORROWER' });
      if (res.data.success) {
        setBorrowers([res.data.user, ...borrowers]);
        setIsAddModalOpen(false);
        setForm({ name: '', email: '', phone: '', nrc: '', dob: '', address: '', password: 'Password123!', risk: 'GREEN' });
      }
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Failed to add borrower' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBorrower = async () => {
    try {
      const res = await api.delete(`/admin/users/${deleteConfirm.id}`);
      if (res.data.success) {
        setBorrowers(p => p.filter(b => b.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Delete borrower error', err);
    }
  };

  const handleToggleVerify = async (id, current) => {
    try {
      const res = await api.patch(`/admin/users/${id}/verify`, { isVerified: !current });
      if (res.data.success) {
        setBorrowers(p => p.map(b => b.id === id ? { ...b, isVerified: !current } : b));
      }
    } catch (err) {
      console.error('Verify error', err);
    }
  };

  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleApprove = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/approve`, { isApproved: true });
      if (res.data.success) {
        setBorrowers(p => p.map(b => b.id === id ? { ...b, isApproved: true, status: 'active' } : b));
      }
    } catch (err) {
      console.error('Approve error', err);
    }
  };

  const filtered = borrowers.filter(b => {
    const matchSearch = (b.name || '').toLowerCase().includes(search.toLowerCase()) || (b.nrc || '').includes(search);
    const matchRisk   = riskFilter === 'ALL' || b.risk === riskFilter;
    const matchStatus = statusFilter === 'ALL' ? true : statusFilter === 'PENDING' ? (!b.isApproved || b.status === 'pending_approval') : (b.isApproved && b.status !== 'pending_approval');
    return matchSearch && matchRisk && matchStatus;
  });

  return (
    <div className="space-y-6 md:space-y-10 pb-16 animate-in fade-in duration-700 px-1">
      <PageHeader 
        title="Borrower Management" 
        subtitle="View and manage borrower credit profiles and risk levels" 
        action={
          <div className="flex gap-3">
             <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 active:scale-95 transition-all shadow-lg cursor-pointer">
                Add Borrower
             </button>
             <button onClick={() => fetchBorrowers()} className="px-6 py-3 bg-[#020617] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 active:scale-95 transition-all shadow-lg cursor-pointer">
                Sync Data
             </button>
          </div>
        } 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#161b22] rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-xl transition-all group overflow-hidden relative w-full h-full">
           <div className="relative z-10 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Globe size={22} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Borrowers</p>
              <h3 className="text-xl font-bold text-white leading-none">{borrowers.length}</h3>
           </div>
        </div>
        <div className="bg-[#161b22] rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-xl transition-all group overflow-hidden relative border-l-4 border-l-emerald-500 w-full h-full">
           <div className="relative z-10 w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <ShieldCheck size={22} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Low Risk Cases</p>
              <h3 className="text-xl font-bold text-white leading-none">{borrowers.filter(b=>b.risk==='GREEN').length}</h3>
           </div>
        </div>
        <div className="bg-[#020617] rounded-3xl p-6 text-white shadow-lg flex items-center gap-4 group overflow-hidden relative border-l-4 border-l-rose-500 w-full h-full">
           <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#161b22]/5 border border-white/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <AlertTriangle size={22} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
              <p className="text-[9px] text-rose-400/60 font-bold uppercase tracking-wider mb-0.5">High Risk Cases</p>
              <h3 className="text-xl font-bold text-white leading-none">{borrowers.filter(b=>b.risk==='RED').length}</h3>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or NRC..."
            className="w-full pl-12 pr-6 py-3.5 bg-[#161b22] border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all shadow-sm"
          />
        </div>
        <select
          value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
          className="px-6 py-3.5 bg-[#161b22] border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-slate-400 focus:border-blue-600 outline-none transition-all shadow-sm cursor-pointer"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="GREEN">Low Risk (Good)</option>
          <option value="AMBER">Medium Risk</option>
          <option value="RED">High Risk (Bad)</option>
        </select>
        <div className="flex bg-[#161b22] p-1 rounded-2xl border border-gray-100 gap-1">
          {[['ALL','All'],['PENDING','Pending'],['ACTIVE','Active']].map(([val, label]) => (
            <button key={val} onClick={() => setStatusFilter(val)}
              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${statusFilter === val ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {label}{val === 'PENDING' ? ` (${borrowers.filter(b => !b.isApproved || b.status === 'pending_approval').length})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#161b22] rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0d1117] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Borrower</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Loans</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Owed</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-4 text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(b => {
                const activeLoans = b.loans || [];
                const totalOwed = activeLoans.reduce((s, l) => s + Number(l.currentPrincipal || 0), 0);
                const isPending = !b.isApproved || b.status === 'pending_approval';
                return (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0d1117] flex items-center justify-center text-slate-400 group-hover:bg-[#1c2128] transition-all shadow-sm">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-white uppercase tracking-tight">{b.name}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{b.nrc || 'No NRC'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-300">{b.phone || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[13px] font-bold ${activeLoans.length > 0 ? 'text-blue-400' : 'text-slate-500'}`}>{activeLoans.length}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[12px] font-bold ${totalOwed > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {totalOwed > 0 ? `K${totalOwed.toLocaleString()}` : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <RiskBadge risk={b.risk} />
                      {isPending && (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-lg text-[8px] font-bold uppercase tracking-wider">Pending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {isPending && (
                         <button
                           onClick={() => handleApprove(b.id)}
                           className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all active:scale-95"
                         >
                           Approve
                         </button>
                       )}
                       <button
                          onClick={() => setViewModal(b)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 active:scale-95"
                       >
                          View
                       </button>
                       <button
                          onClick={() => setDeleteConfirm(b)}
                          className="p-2.5 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Borrower Profile" size="lg">
        {viewModal && (
          <div className="space-y-5 pb-2">
            <div className="bg-[#020617] p-8 rounded-3xl text-white flex flex-col items-center relative overflow-hidden shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-xl">
                {viewModal.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">{viewModal.name}</h3>
              <p className="text-blue-400 text-[9px] font-bold uppercase tracking-wider mt-1 opacity-80">NRC: {viewModal.nrc}</p>
              <div className="mt-5 flex gap-2">
                 <RiskBadge risk={viewModal.risk} />
                 <div className="px-3 py-1.5 bg-[#161b22]/5 rounded-full border border-white/5 text-[8px] font-bold uppercase tracking-wider">Status: Active</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
               {[
                 { icon: Phone, label: 'Phone', value: viewModal.phone || 'N/A', color: 'text-blue-500' },
                 { icon: Calendar, label: 'Birthday', value: viewModal.dob ? new Date(viewModal.dob).toLocaleDateString() : 'Not Set', color: 'text-emerald-500' },
                 { icon: MapPin, label: 'Location', value: viewModal.address || 'Unspecified Node', color: 'text-blue-500' },
                 { icon: Activity, label: 'Loans', value: `${allLoans.filter(l => l.userId === viewModal.id && l.status === 'COMPLETED').length} Paid / ${allLoans.filter(l => l.userId === viewModal.id).length} Total`, color: 'text-amber-500' },
               ].map((item, i) => (
                 <div key={i} className="flex flex-col gap-1 p-4 bg-[#0d1117] rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-0.5">
                       <item.icon size={12} className={item.color} />
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    </div>
                    <p className="text-[11px] font-bold text-white uppercase tracking-tight">{item.value}</p>
                 </div>
               ))}
            </div>

            <div className="bg-[#161b22] rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-4">
               <div className="p-4 border-b border-gray-100 bg-[#0d1117] flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Detailed Loan History</h4>
                  <Database size={14} className="text-slate-400" />
               </div>
               <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                 <table className="w-full">
                    <thead className="bg-[#161b22] sticky top-0 border-b border-gray-100 z-10">
                       <tr>
                          <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Ref / Lender</th>
                          <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Amount (K)</th>
                          <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Schedule</th>
                          <th className="px-4 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {allLoans.filter(l => l.userId === viewModal.id).length === 0 ? (
                          <tr><td colSpan="4" className="px-4 py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">No loan records found</td></tr>
                       ) : (
                          allLoans.filter(l => l.userId === viewModal.id).map((loan) => (
                             <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-white uppercase">{loan.id}</span>
                                      <span className="text-[9px] text-slate-500 font-bold uppercase">{loan.agent?.businessName || 'Direct Node'}</span>
                                   </div>
                                </td>
                                <td className="px-4 py-3">
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-white">K{Number(loan.principalAmount).toLocaleString()}</span>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">Rate: {loan.interestRate}%</span>
                                   </div>
                                </td>
                                <td className="px-4 py-3">
                                   <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-600 uppercase pb-0.5">{loan.duration} Installments</span>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">Due: {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'Awaiting'}</span>
                                   </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                   <div className={`inline-block px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                                      loan.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' :
                                      loan.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                                      'bg-emerald-50 text-emerald-600'
                                   }`}>
                                      {loan.status}
                                   </div>
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
               </div>
            </div>

            <button className="w-full py-4 bg-[#020617] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all shadow-md" onClick={() => setViewModal(null)}>Close</button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteBorrower}
        title="Delete Borrower?"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        isDanger
      />

      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Register New Borrower" size="md">
        <form onSubmit={handleAddBorrower} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white focus:border-blue-600 outline-none"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. John Doe" required
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">NRC Number</label>
                <input 
                  className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white focus:border-blue-600 outline-none"
                  value={form.nrc} onChange={e => setForm({...form, nrc: e.target.value})} placeholder="12345/10/1" required
                />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <input 
                  type="email"
                  className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white focus:border-blue-600 outline-none"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" required
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                <input 
                  className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white focus:border-blue-600 outline-none"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="097..." required
                />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Birthdate</label>
                <input 
                  type="date"
                  className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white focus:border-blue-600 outline-none"
                  value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} required
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Risk Initial</label>
                <select 
                  className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white focus:border-blue-600 outline-none"
                  value={form.risk} onChange={e => setForm({...form, risk: e.target.value})}
                >
                  <option value="GREEN">Low Risk (Green)</option>
                  <option value="AMBER">Medium Risk (Amber)</option>
                  <option value="RED">High Risk (Red)</option>
                </select>
             </div>
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Home Address</label>
             <textarea 
               className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white focus:border-blue-600 outline-none h-20"
               value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Street name, City..." required
             />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
             <input 
                type="text"
                className="w-full px-5 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-bold text-white focus:border-blue-600 outline-none tracking-widest"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
             />
          </div>
          {errors.server && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.server}</p>}
          <div className="flex gap-4 pt-4">
             <button disabled={isSubmitting} type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50 transition-all">
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
             </button>
             <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-gray-200">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
