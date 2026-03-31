import React, { useState, useEffect } from 'react';
import {
  Search, User, Trash2, Globe, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { RiskBadge, PageHeader, ConfirmDialog, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';
import api from '../../api/axios';

export default function LenderBorrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewModal, setViewModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [allLoans, setAllLoans] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, loansRes] = await Promise.all([
        api.get('/admin/users?role=BORROWER'),
        api.get('/admin/loans')
      ]);
      if (usersRes.data.success) setBorrowers(usersRes.data.users);
      if (loansRes.data.success) setAllLoans(loansRes.data.loans || []);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/approve`, { isApproved: true });
      if (res.data.success) {
        setBorrowers(p => p.map(b => b.id === id ? { ...b, isApproved: true, status: 'active' } : b));
      }
    } catch (err) { console.error('Approve error', err); }
  };

  const handleToggleVerify = async (id, current) => {
    try {
      const res = await api.patch(`/admin/users/${id}/verify`, { isVerified: !current });
      if (res.data.success) {
        setBorrowers(p => p.map(b => b.id === id ? { ...b, isVerified: !current } : b));
      }
    } catch (err) { console.error('Verify error', err); }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/admin/users/${deleteConfirm.id}`);
      if (res.data.success) {
        setBorrowers(p => p.filter(b => b.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      }
    } catch (err) { console.error('Delete error', err); }
  };

  const filtered = borrowers.filter(b => {
    const matchSearch = (b.name || '').toLowerCase().includes(search.toLowerCase()) || (b.nrc || '').includes(search);
    const matchRisk = riskFilter === 'ALL' || b.risk === riskFilter;
    const isPending = !b.isApproved || b.status === 'pending_approval';
    const matchStatus = statusFilter === 'ALL' ? true : statusFilter === 'PENDING' ? isPending : !isPending;
    return matchSearch && matchRisk && matchStatus;
  });

  const pendingCount = borrowers.filter(b => !b.isApproved || b.status === 'pending_approval').length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-700 px-1">
      <PageHeader
        title="Borrower Management"
        subtitle="View and manage borrower profiles, risk levels and approvals"
        action={
          <button onClick={fetchData} className="px-6 py-3 bg-[#020617] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 active:scale-95 transition-all shadow-lg cursor-pointer">
            Sync Data
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161b22] rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Globe size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Borrowers</p>
            <h3 className="text-xl font-bold text-white leading-none">{borrowers.length}</h3>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Low Risk</p>
            <h3 className="text-xl font-bold text-white leading-none">{borrowers.filter(b => b.risk === 'GREEN').length}</h3>
          </div>
        </div>
        <div className="bg-[#020617] rounded-3xl p-6 text-white shadow-lg flex items-center gap-4 border-l-4 border-l-rose-500">
          <div className="w-12 h-12 rounded-2xl bg-[#161b22] text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[9px] text-rose-400/60 font-bold uppercase tracking-wider mb-0.5">High Risk</p>
            <h3 className="text-xl font-bold text-white leading-none">{borrowers.filter(b => b.risk === 'RED').length}</h3>
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
          <option value="GREEN">Low Risk</option>
          <option value="AMBER">Medium Risk</option>
          <option value="RED">High Risk</option>
        </select>
        <div className="flex bg-[#161b22] p-1 rounded-2xl border border-gray-100 gap-1">
          {[['ALL', 'All'], ['PENDING', `Pending (${pendingCount})`], ['ACTIVE', 'Active']].map(([val, label]) => (
            <button key={val} onClick={() => setStatusFilter(val)}
              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${statusFilter === val ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {label}
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
              {loading ? (
                <tr><td colSpan="6" className="py-16 text-center text-slate-500 font-bold uppercase text-[10px] animate-pulse">Loading borrowers...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="py-16 text-center text-slate-500 font-bold uppercase text-[10px]">No borrowers found</td></tr>
              ) : filtered.map(b => {
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
                          <button onClick={() => handleApprove(b.id)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all active:scale-95">
                            Approve
                          </button>
                        )}
                        <button onClick={() => setViewModal(b)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-all active:scale-95">
                          View
                        </button>
                        <button onClick={() => setDeleteConfirm(b)}
                          className="p-2.5 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                          <Trash2 size={16} />
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

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Borrower Profile" size="lg">
        {viewModal && (
          <div className="space-y-5 pb-2">
            <div className="bg-[#020617] p-8 rounded-3xl text-white flex flex-col items-center relative overflow-hidden shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-[#161b22] border border-white/10 flex items-center justify-center text-white font-bold text-xl mb-4">
                {viewModal.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">{viewModal.name}</h3>
              <p className="text-blue-400 text-[9px] font-bold uppercase tracking-wider mt-1">NRC: {viewModal.nrc}</p>
              <div className="mt-4 flex gap-2">
                <RiskBadge risk={viewModal.risk} />
                <StatusBadge status={viewModal.isVerified ? 'verified' : 'pending'} onClick={() => handleToggleVerify(viewModal.id, viewModal.isVerified)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Phone', value: viewModal.phone || 'N/A' },
                { label: 'Birthday', value: viewModal.dob ? new Date(viewModal.dob).toLocaleDateString() : 'Not Set' },
                { label: 'Address', value: viewModal.address || 'Unspecified' },
                { label: 'Loans', value: `${allLoans.filter(l => l.userId === viewModal.id && l.status === 'COMPLETED').length} Paid / ${allLoans.filter(l => l.userId === viewModal.id).length} Total` },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-[#0d1117] rounded-2xl border border-gray-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-[11px] font-bold text-white uppercase">{item.value}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-[#020617] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all" onClick={() => setViewModal(null)}>Close</button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Borrower?"
        message={`Are you sure you want to delete ${deleteConfirm?.name}?`}
        confirmLabel="Yes, Delete"
        isDanger
      />
    </div>
  );
}
