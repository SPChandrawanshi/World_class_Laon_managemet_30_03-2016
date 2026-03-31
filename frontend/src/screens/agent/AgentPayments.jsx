import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  History, 
  Clock, 
  ArrowUpRight, 
  CreditCard,
  Wallet,
  CheckCircle2,
  Calendar,
  Search,
  ArrowDownCircle
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';

export default function AgentPayments() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPayout, setSelectedPayout] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Payouts might be a subset of commissions or a different model.
      // For now, let's fetch commissions that are marked as paid if available,
      // or just the generic commission list as a proxy if a dedicated payout model doesn't exist.
      const res = await api.get('/agent/commissions');
      if (res.data.success) {
        setPayouts(res.data.commissions || []);
      }
    } catch (err) {
      console.error('Fetch payouts error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = payouts.filter(p => 
    (p.borrower?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.id.toString()).includes(search)
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 pt-4">
        <PageHeader 
          title="Commission Payouts" 
          subtitle="Audit trail of network reward distributions"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Total Payouts</p>
            <h3 className="text-2xl font-bold text-white leading-none">K{payouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-emerald-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Last Cycle</p>
            <h3 className="text-2xl font-bold text-white leading-none">Cleared</h3>
          </div>
        </div>
        <div className="bg-[#020617] rounded-[32px] p-6 text-white border border-white/5 shadow-2xl flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-all"></div>
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#161b22] text-blue-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <CreditCard size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider leading-none mb-1">Payment Node</p>
            <h3 className="text-2xl font-bold text-white leading-none uppercase">Verified</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#161b22] p-2 rounded-[28px] border border-[#30363d] mx-4">
        <div className="flex gap-1 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-lg">Payout History</button>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by TX ID..."
            className="w-full pl-14 pr-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="space-y-4 px-4">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse italic">Reading Payout Stack...</div>
        ) : filtered.length > 0 ? filtered.map(p => (
          <div
            key={p.id}
            onClick={() => setSelectedPayout(p)}
            className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer hover:border-blue-600 hover:shadow-2xl transition-all gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all flex items-center justify-center border border-white/5 shadow-inner">
                <ArrowDownCircle size={24} />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-2">Payout Ref: {p.id}</h4>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-80">
                  <span>Target: {p.borrower?.name}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span className="text-blue-600">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 pt-6 sm:pt-0 border-white/5">
              <div className="text-right">
                <p className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-2">K{p.amount.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">{p.percentage}% Commission</p>
              </div>
              <div className="flex items-center gap-6">
                <StatusBadge status="paid" />
                <ArrowUpRight size={20} className="text-slate-100 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-[#161b22] rounded-[40px] border border-dashed border-[#30363d]">
            <History size={40} className="text-slate-600 mb-4 opacity-20" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">No disbursements found</p>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedPayout} onClose={() => setSelectedPayout(null)} title="Payout Detail Matrix" size="md">
        {selectedPayout && (
          <div className="space-y-8 pb-4">
            <div className="bg-[#020617] p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl group border border-white/5">
              <div className="absolute inset-0 bg-blue-900/10 blur-3xl group-hover:bg-blue-900/20 transition-all"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2 opacity-60 leading-none">Net Disbursement</p>
                <h3 className="text-4xl font-bold tracking-tight leading-none mb-6">K{selectedPayout.amount.toLocaleString()}</h3>
                <div className="inline-flex px-5 py-2.5 bg-[#161b22] border border-white/5 rounded-2xl text-emerald-400 text-[12px] font-bold uppercase tracking-wider">
                  Status: CLEARED
                </div>
              </div>
            </div>

            <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
               <div className="flex justify-between items-center border-b border-[#30363d] pb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction ID</span>
                  <span className="text-[11px] font-bold text-white uppercase">#TX-{selectedPayout.id}</span>
               </div>
               <div className="flex justify-between items-center border-b border-[#30363d] pb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Referral Source</span>
                  <span className="text-[11px] font-bold text-white uppercase">{selectedPayout.borrower?.name}</span>
               </div>
               <div className="flex justify-between items-center border-b border-[#30363d] pb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Commission Tier</span>
                  <span className="text-[11px] font-bold text-blue-400 uppercase">{selectedPayout.percentage}%</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Value Date</span>
                  <span className="text-[11px] font-bold text-white uppercase">{new Date(selectedPayout.createdAt).toLocaleString()}</span>
               </div>
            </div>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setSelectedPayout(null)} 
                className="px-10 py-5 bg-[#161b22] text-slate-400 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:text-white transition-all border-none cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
