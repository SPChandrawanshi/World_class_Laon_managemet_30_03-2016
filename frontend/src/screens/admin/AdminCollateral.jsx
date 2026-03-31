import React, { useState, useEffect } from 'react';
import { Search, Image, CheckCircle2, Clock, Eye, ShieldCheck, FileText } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/UI';
import api from '../../api/axios';

export default function AdminCollateral() {
  const [collaterals, setCollaterals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [isVerifying, setIsVerifying] = useState(null);

  const fetchCollateral = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/collateral');
      if (res.data.success) setCollaterals(res.data.collaterals || []);
    } catch (err) {
      console.error('Fetch collateral error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollateral(); }, []);

  const handleVerify = async (id) => {
    setIsVerifying(id);
    try {
      const res = await api.patch(`/admin/collateral/${id}/verify`);
      if (res.data.success) {
        setCollaterals(prev => prev.map(c => c.id === id ? { ...c, verified: true } : c));
      }
    } catch (err) {
      console.error('Verify error', err);
      throw err;
    } finally {
      setIsVerifying(null);
    }
  };

  const filtered = collaterals.filter(c => {
    const matchSearch = (c.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.name || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' ? true : filter === 'VERIFIED' ? c.verified : !c.verified;
    return matchSearch && matchFilter;
  });

  const verifiedCount = collaterals.filter(c => c.verified).length;
  const pendingCount = collaterals.filter(c => !c.verified).length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-700 px-1">
      <PageHeader
        title="Collateral Registry"
        subtitle="Verify and manage borrower-submitted collateral documents"
        action={
          <button onClick={fetchCollateral} className="px-6 py-3 bg-[#020617] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 active:scale-95 transition-all shadow-lg cursor-pointer">
            Refresh
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161b22] rounded-3xl p-6 border border-[#30363d] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Submitted</p>
            <h3 className="text-xl font-bold text-white">{collaterals.length}</h3>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-3xl p-6 border border-[#30363d] border-l-4 border-l-emerald-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Verified</p>
            <h3 className="text-xl font-bold text-white">{verifiedCount}</h3>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-3xl p-6 border border-[#30363d] border-l-4 border-l-amber-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Pending Review</p>
            <h3 className="text-xl font-bold text-white">{pendingCount}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by borrower name or document..."
            className="w-full pl-12 pr-6 py-3.5 bg-[#161b22] border border-[#30363d] rounded-2xl text-[11px] font-bold uppercase tracking-wider text-white focus:border-blue-600 outline-none transition-all"
          />
        </div>
        <div className="flex bg-[#161b22] p-1 rounded-2xl border border-[#30363d] gap-1">
          {[['ALL', 'All'], ['PENDING', `Pending (${pendingCount})`], ['VERIFIED', `Verified (${verifiedCount})`]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === val
                  ? val === 'VERIFIED' ? 'bg-emerald-600 text-white' : val === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#161b22] rounded-3xl border border-[#30363d] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0d1117] border-b border-[#30363d]">
              <tr>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Borrower</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Document / Name</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-4 text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]/40">
              {loading ? (
                <tr><td colSpan="6" className="py-16 text-center text-slate-500 font-bold uppercase text-[10px] animate-pulse">Loading collateral...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <Image size={32} className="mx-auto text-slate-700 mb-3 opacity-30" />
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">No collateral records found</p>
                  </td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-blue-600/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-blue-400 font-bold text-xs">
                        {(c.user?.name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-white uppercase group-hover:text-blue-400 transition-colors">{c.user?.name || 'Unknown'}</p>
                        <p className="text-[9px] text-slate-500 font-bold">{c.user?.phone || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-bold text-white uppercase">{c.name || 'Unnamed Document'}</p>
                    {c.description && (
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5 truncate max-w-[180px]">{c.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                      {c.type || 'FILE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-bold text-slate-300">{new Date(c.createdAt).toLocaleDateString()}</p>
                    <p className="text-[9px] text-slate-500 font-bold">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={c.verified ? 'verified' : 'pending'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {c.imageUrl && (
                        <button
                          onClick={() => {
                            const url = c.imageUrl.startsWith('http') ? c.imageUrl : `http://${c.imageUrl}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-[#0d1117] border border-[#30363d] text-slate-300 rounded-xl text-[9px] font-bold uppercase tracking-wider hover:border-blue-500 hover:text-blue-400 transition-all active:scale-95 cursor-pointer"
                        >
                          <Eye size={13} /> View
                        </button>
                      )}
                      {!c.verified && (
                        <button
                          onClick={async () => {
                            try {
                              await handleVerify(c.id);
                              alert('NETWORK REGISTRY UPDATED: Asset node verified successfully.');
                            } catch (err) {
                              alert('VERIFICATION ERROR: Failed to update node registry. Please check network connectivity.');
                            }
                          }}
                          disabled={isVerifying === c.id}
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                        >
                          <ShieldCheck size={13} />
                          {isVerifying === c.id ? 'Verifying...' : 'Verify'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
