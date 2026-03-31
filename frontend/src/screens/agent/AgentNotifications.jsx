import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Zap
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';

export default function AgentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/agent/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Fetch notifications error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [filterMode, setFilterMode] = useState('ALL');

  const filtered = notifications.filter(n => {
    const matchesSearch = n.message.toLowerCase().includes(search.toLowerCase()) || n.title.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'UNREAD') return !n.isRead;
    return true;
  });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 pt-4">
        <PageHeader 
          title="Agent Alerts" 
          subtitle="Real-time network updates and referral milestones"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Unread Alerts</p>
            <h3 className="text-2xl font-bold text-white leading-none">{notifications.filter(n => !n.isRead).length}</h3>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-violet-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Total Logs</p>
            <h3 className="text-2xl font-bold text-white leading-none">{notifications.length}</h3>
          </div>
        </div>
        <div className="bg-[#020617] rounded-[32px] p-6 text-white border border-white/5 shadow-2xl flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-600/5 blur-xl group-hover:bg-emerald-600/10 transition-all"></div>
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#161b22] text-emerald-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-wider leading-none mb-1">Node Security</p>
            <h3 className="text-2xl font-bold text-white leading-none uppercase">Encrypted</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#161b22] p-2 rounded-[28px] border border-[#30363d] mx-4">
        <div className="flex gap-1 w-full md:w-auto">
          <button 
            onClick={() => setFilterMode('ALL')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${filterMode === 'ALL' ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:bg-white/5'}`}
          >
            Network Alerts
          </button>
          <button 
            onClick={() => setFilterMode('UNREAD')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${filterMode === 'UNREAD' ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:bg-white/5'}`}
          >
            Unread Logs
          </button>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search alerts..."
            className="w-full pl-14 pr-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="space-y-4 px-4">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse italic">Connecting to Alert Node...</div>
        ) : filtered.length > 0 ? filtered.map(n => (
          <div
            key={n.id}
            onClick={() => setViewModal(n)}
            className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer hover:border-blue-600 hover:shadow-2xl transition-all gap-6"
          >
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[24px] bg-[#0d1117] transition-all flex items-center justify-center border border-white/5 shadow-inner ${!n.isRead ? 'text-blue-500 border-blue-500/50' : 'text-slate-300 group-hover:text-blue-400'}`}>
                <Bell size={24} />
              </div>
              <div className="max-w-md">
                <h4 className="text-[18px] font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-2">{n.title}</h4>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-1 group-hover:text-slate-200 transition-colors">{n.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 pt-6 sm:pt-0 border-white/5">
              <div className="text-right">
                <p className="text-xl font-bold text-white leading-none mb-2">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-6">
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>}
                <ChevronRight size={20} className="text-slate-100 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-[#161b22] rounded-[40px] border border-dashed border-[#30363d]">
            <Bell size={40} className="text-slate-600 mb-4 opacity-20" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Stable frequency</p>
          </div>
        )}
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="System Message Terminal" size="md">
        {viewModal && (
          <div className="space-y-8 pb-4">
            <div className="bg-[#020617] p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl group border border-white/5">
              <div className="absolute inset-0 bg-blue-900/10 blur-3xl group-hover:bg-blue-900/20 transition-all"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[28px] bg-blue-600/10 text-blue-400 flex items-center justify-center mb-6">
                  <Bell size={32} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight leading-none mb-2">{viewModal.title}</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-60 leading-none">Global Network Alert</p>
              </div>
            </div>

            <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Transmission Content</h4>
              <p className="text-md font-medium text-slate-200 leading-relaxed bg-[#0d1117] p-6 rounded-3xl border border-white/5 italic">
                "{viewModal.message}"
              </p>
              <div className="flex justify-between items-center px-2">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Source</p>
                  <p className="text-[11px] font-bold text-white uppercase">Network Core</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Identity</p>
                  <p className="text-[11px] font-bold text-white uppercase">ID: #{viewModal.id}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setViewModal(null)} 
                className="px-10 py-5 bg-[#161b22] text-slate-400 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:text-white transition-all border-none cursor-pointer"
              >
                Close Terminal
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
