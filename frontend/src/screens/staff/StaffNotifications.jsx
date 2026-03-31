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
  Mail
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';

export default function StaffNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // SMS, EMAIL, SYSTEM, ALL

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/notifications');
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

  const filtered = notifications.filter(n => {
    const searchLow = search.toLowerCase();
    const matchesSearch = !searchLow ||
                         (n.user?.name || '').toLowerCase().includes(searchLow) ||
                         (n.user?.email || '').toLowerCase().includes(searchLow) ||
                         (n.message || '').toLowerCase().includes(searchLow);
    const matchesTab = activeTab === 'ALL' || (n.type || '').toUpperCase() === activeTab.toUpperCase();
    return matchesSearch && matchesTab;
  });

  const getIcon = (type) => {
    switch(type) {
      case 'SMS': return <Smartphone size={18} />;
      case 'EMAIL': return <Mail size={18} />;
      default: return <Bell size={18} />;
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 pt-4">
        <PageHeader 
          title="Communication Logs" 
          subtitle="Monitor automated and manual network notifications"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Smartphone size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">SMS Logs</p>
            <h3 className="text-2xl font-bold text-white leading-none">{notifications.filter(n => (n.type || '').toUpperCase() === 'SMS').length}</h3>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-emerald-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Email Logs</p>
            <h3 className="text-2xl font-bold text-white leading-none">{notifications.filter(n => (n.type || '').toUpperCase() === 'EMAIL').length}</h3>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-[32px] p-6 border border-[#30363d] shadow-sm flex items-center gap-5 hover:border-violet-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">System Alerts</p>
            <h3 className="text-2xl font-bold text-white leading-none">{notifications.filter(n => (n.type || '').toUpperCase() === 'SYSTEM').length}</h3>
          </div>
        </div>
        <div className="bg-[#020617] rounded-[32px] p-6 text-white border border-white/5 shadow-2xl flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-all"></div>
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#161b22] text-blue-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider leading-none mb-1">Node Watcher</p>
            <h3 className="text-2xl font-bold text-white leading-none uppercase">Active</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#161b22] p-2 rounded-[28px] border border-[#30363d] mx-4">
        <div className="flex gap-1 w-full md:w-auto">
          {['SMS', 'EMAIL', 'SYSTEM', 'ALL'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-[#1c2128]'}`}
            >
              {tab === 'SYSTEM' ? 'Nodes' : tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search logs by keyword..."
            className="w-full pl-14 pr-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="space-y-4 px-4">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse italic">Reading Communication Stack...</div>
        ) : filtered.length > 0 ? filtered.map(n => (
          <div
            key={n.id}
            onClick={() => setViewModal(n)}
            className="bg-[#161b22] rounded-[40px] p-8 border border-[#30363d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer hover:border-blue-600 hover:shadow-2xl transition-all gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all flex items-center justify-center border border-white/5 shadow-inner">
                {getIcon(n.type)}
              </div>
              <div className="max-w-md">
                <h4 className="text-[18px] font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-1">{n.user?.name || 'System Auto'}</h4>
                <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider mb-2">{n.user?.email || 'internal@system.node'}</p>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-1 group-hover:text-slate-200 transition-colors">{n.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 pt-6 sm:pt-0 border-white/5">
              <div className="text-right">
                <p className="text-xl font-bold text-white leading-none mb-2">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                  n.type === 'SMS' ? 'bg-blue-500/10 text-blue-500' : 
                  n.type === 'EMAIL' ? 'bg-emerald-500/10 text-emerald-500' :
                  'bg-violet-500/10 text-violet-500'
                }`}>
                  {n.type}
                </div>
                <ChevronRight size={20} className="text-slate-100 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-[#161b22] rounded-[40px] border border-dashed border-[#30363d]">
            <Bell size={40} className={`mb-4 opacity-20 ${notifications.length > 0 ? 'text-amber-500' : 'text-slate-600'}`} />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
              {notifications.length === 0 ? 'Quiet frequency' : 'No matches found in logs'}
            </p>
            {notifications.length > 0 && (
               <p className="text-[8px] text-slate-600 mt-2 uppercase font-bold">Total {notifications.length} alerts are hidden by filters.</p>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Full Message Header" size="md">
        {viewModal && (
          <div className="space-y-8 pb-4">
            <div className="bg-[#020617] p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl group border border-white/5">
              <div className="absolute inset-0 bg-blue-900/10 blur-3xl group-hover:bg-blue-900/20 transition-all"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[28px] bg-blue-600/10 text-blue-400 flex items-center justify-center mb-6">
                  {getIcon(viewModal.type)}
                </div>
                <h3 className="text-2xl font-bold tracking-tight leading-none mb-2">{viewModal.user?.name || 'Network Core'}</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-60 leading-none">{viewModal.user?.phone || 'Internal Node'}</p>
              </div>
            </div>

            <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Raw Payload</h4>
              <p className="text-md font-medium text-slate-200 leading-relaxed bg-[#0d1117] p-6 rounded-3xl border border-white/5 italic">
                "{viewModal.message}"
              </p>
              <div className="flex justify-between items-center px-2">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Transmission</p>
                  <p className="text-[11px] font-bold text-white uppercase">{viewModal.type} Node</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Local Identity</p>
                  <p className="text-[11px] font-bold text-white uppercase">ID: #{viewModal.id}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setViewModal(null)} 
                className="px-10 py-5 bg-[#161b22] text-slate-400 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:text-white transition-all border-none cursor-pointer"
              >
                Close Log Entry
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
