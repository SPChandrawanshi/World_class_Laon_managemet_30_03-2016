import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Zap,
  CreditCard,
  FileText,
  Globe,
  Activity,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge, StatCard } from '../../components/UI';
import Modal from '../../components/Modal';

export default function StaffPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING, VERIFIED, LATE

  const stats = {
    totalPrincipal: (payments || []).filter(Boolean).reduce((sum, p) => sum + Number(p.totalCollected || p.baseAmount || 0), 0),
    pendingLoans: (payments || []).filter(Boolean).filter(p => (p.status || '').toUpperCase() === 'PENDING').length,
    overdueLoans: (payments || []).filter(Boolean).filter(p => (p.status || '').toUpperCase() === 'LATE').length,
    totalUsers: [...new Set((payments || []).filter(Boolean).map(p => p.loan?.userId))].filter(Boolean).length
  };

  const fetchData = async () => {
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
    fetchData();
  }, []);

  const filtered = (payments || []).filter(Boolean).filter(p => {
    const name = p.loan?.user?.name || '';
    const trx = p.trxId || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
                         trx.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'ALL' ? true : (p.status || '').toUpperCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleVerify = async (id) => {
    if (!window.confirm('Verify this payment?')) return;
    try {
      const res = await api.put(`/admin/payments/${id}/verify`);
      if (res.data.success) {
        fetchData();
        setViewModal(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error verifying payment');
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 pt-4">
        <PageHeader 
          title="Payment Verification" 
          subtitle="Audit and authorize network capital inflows"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        <StatCard label="Live Portfolio" value={`K${(stats.totalPrincipal || 0).toLocaleString()}`} color="#ffffff" icon={Globe} trend="Capital Value" />
        <StatCard label="Pending Approval" value={stats.pendingLoans || 0} color="#2563eb" icon={Activity} trend="Action Required" />
        <StatCard label="Late Collections" value={stats.overdueLoans || 0} color="#ef4444" icon={AlertTriangle} trend="Immediate Follow-up" />
        <StatCard label="Verified Clients" value={stats.totalUsers || 0} color="#10b981" icon={BarChart3} trend="Network Growth" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Awaiting Proof</p>
            <h3 className="text-2xl font-bold text-white leading-none">{(payments || []).filter(Boolean).filter(p => (p.status || '').toUpperCase() === 'PENDING').length}</h3>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-emerald-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Verified Today</p>
            <h3 className="text-2xl font-bold text-white leading-none">{(payments || []).filter(Boolean).filter(p => (p.status || '').toUpperCase() === 'VERIFIED').length}</h3>
          </div>
        </div>
        <div className="bg-[#020617] rounded-[32px] p-6 text-white border border-white/5 shadow-2xl flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-all"></div>
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#161b22] text-blue-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider leading-none mb-1">Integrity Node</p>
            <h3 className="text-2xl font-bold text-white leading-none uppercase">Secured</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#161b22] p-2 rounded-[28px] border border-[#30363d] mx-4">
        <div className="flex gap-1 w-full md:w-auto">
          {['PENDING', 'VERIFIED', 'ALL'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-[#1c2128]'}`}
            >
              {tab === 'PENDING' ? 'New Proofs' : tab === 'VERIFIED' ? 'Cleared' : 'Audit Trail'}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or Reference..."
            className="w-full pl-14 pr-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="space-y-4 px-4">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse italic">Synchronizing Ledger...</div>
        ) : filtered.length > 0 ? filtered.map(p => (
          <div
            key={p.id}
            onClick={() => setViewModal(p)}
            className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer hover:border-blue-600 hover:shadow-2xl transition-all gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all flex items-center justify-center border border-white/5 shadow-inner">
                <DollarSign size={24} />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-2">{p.loan?.user?.name || "Member Node"}</h4>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-80">
                  <span>TRX: {p.trxId || 'N/A'}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span className="text-blue-600">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Pending"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 pt-6 sm:pt-0 border-white/5">
              <div className="text-right">
                <p className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-2">K{Number(p.totalCollected || p.baseAmount || 0).toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">{p.method || "System Out"}</p>
              </div>
              <div className="flex items-center gap-6">
                <StatusBadge status={p.status?.toLowerCase() || 'pending'} />
                <ChevronRight size={20} className="text-slate-100 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-[#161b22] rounded-[40px] border border-dashed border-[#30363d]">
            <CheckCircle2 size={40} className="text-slate-600 mb-4 opacity-20" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">All nodes cleared</p>
          </div>
        )}
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Node Transaction Review" size="lg">
        {viewModal && (
          <div className="space-y-8 pb-4">
            <div className="bg-[#020617] p-8 md:p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl group border border-white/5">
              <div className="absolute inset-0 bg-blue-900/10 blur-3xl group-hover:bg-blue-900/20 transition-all"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2 opacity-60 leading-none">Inflow Capital</p>
                <h3 className="text-5xl font-bold tracking-tight leading-none mb-6">K{Number(viewModal.totalCollected || viewModal.baseAmount || 0).toLocaleString()}</h3>
                <div className="inline-flex px-5 py-2.5 bg-[#161b22] border border-white/5 rounded-2xl text-emerald-400 text-[12px] font-bold uppercase tracking-wider">
                  Method: {viewModal.method || "Manual"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Customer Identity</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-md font-bold text-white uppercase">{viewModal.loan?.user?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Email Node</p>
                    <p className="text-md font-bold text-white lowercase">{viewModal.loan?.user?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Loan ID Reference</p>
                    <p className="text-md font-bold text-blue-400 uppercase">#{viewModal.loanId || 'Generic'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Transaction Evidence</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">TRX ID Reference</p>
                    <p className="text-md font-bold text-white uppercase">{viewModal.trxId || 'SYSTEM_GEN'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Receipt Image</p>
                    {viewModal.receipt ? (
                      <a href={viewModal.receipt} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                        <FileText size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">View Attachment</span>
                      </a>
                    ) : (
                      <p className="text-[10px] text-slate-600 font-bold uppercase italic">No Proof Attached</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Node Timestamp</p>
                    <p className="text-md font-bold text-slate-400 uppercase tracking-tight">{viewModal.createdAt ? new Date(viewModal.createdAt).toLocaleString() : "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {viewModal.status === 'PENDING' && (
              <div className="grid grid-cols-1 pt-4">
                <button 
                  onClick={() => handleVerify(viewModal.id)}
                  className="py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 border-none cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap size={14} /> Clear Funds
                </button>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setViewModal(null)} 
                className="px-10 py-5 bg-[#161b22] text-slate-400 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:text-white transition-all border-none cursor-pointer"
              >
                Exit Entry
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
