import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, Filter, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, Download, MessageSquare, Send, Shield, History
} from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/UI';
import api from '../../api/axios';
import Modal from '../../components/Modal';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewModal, setViewModal] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // SMS, EMAIL, SYSTEM, ALL

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered = notifications.filter(n => {
    const searchLow = search.toLowerCase();
    const matchesSearch = !searchLow ||
                         (n.user?.name || '').toLowerCase().includes(searchLow) || 
                         (n.message || '').toLowerCase().includes(searchLow);
    const matchesFilter = filter === 'all' || (n.status || '').toLowerCase() === filter.toLowerCase();
    const matchesTab = activeTab === 'ALL' || (n.type || '').toUpperCase() === activeTab.toUpperCase();
    return matchesSearch && matchesFilter && matchesTab;
  });

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'SENT').length,
    failed: notifications.filter(n => n.status === 'FAILED').length,
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-2 lg:px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="SMS Communication Logs" 
          subtitle="Monitor automated reminders and system-to-client message status." 
        />
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchNotifications}
            className="p-4 rounded-2xl bg-[#161b22] text-slate-400 hover:text-blue-500 border border-[#30363d] transition-all active:scale-95"
          >
            <History size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Messages', value: stats.total, icon: MessageSquare, color: 'blue' },
          { label: 'Successfully Sent', value: stats.sent, icon: CheckCircle2, color: 'emerald' },
          { label: 'Failed Attempts', value: stats.failed, icon: AlertCircle, color: 'rose' },
        ].map((s, i) => (
          <div key={i} className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] shadow-sm flex items-center gap-6 group hover:border-blue-500 transition-all">
             <div className={`w-16 h-16 rounded-[22px] bg-${s.color}-500/10 text-${s.color}-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                <s.icon size={32} />
             </div>
             <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</h3>
                <p className="text-3xl font-bold text-white tracking-tight">{s.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-[#161b22] rounded-[40px] border border-[#30363d] shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-[#30363d] flex flex-col xl:flex-row xl:items-center justify-between gap-6 sticky top-0 z-10 bg-[#161b22]/90 backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
               <div className="flex bg-[#0d1117] p-1 rounded-2xl border border-[#30363d]">
                  {['ALL', 'SMS', 'EMAIL', 'SYSTEM'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                      {tab === 'SYSTEM' ? 'Nodes' : tab}
                    </button>
                  ))}
               </div>
               <div className="flex bg-[#0d1117] p-1 rounded-xl border border-[#30363d]">
                  {['all', 'sent', 'failed'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
               </div>
            </div>
            
            <div className="relative w-full md:w-96">
               <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                 type="text"
                 placeholder="Search registry by keyword..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-600 shadow-inner"
               />
            </div>
          </div>

         <div className="overflow-x-auto custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing with Twilio Node...</div>
            ) : filtered.length > 0 ? (
              <table className="w-full text-left">
                 <thead className="bg-[#0d1117]/50">
                    <tr>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recipient</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message Payload</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                       <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#30363d]/30">
                    {filtered.map(n => (
                       <tr 
                         key={n.id} 
                         onClick={() => setViewModal(n)}
                         className="hover:bg-blue-600/5 transition-all group cursor-pointer"
                       >
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0d1117] flex items-center justify-center text-blue-500 font-bold text-xs border border-[#30363d]">
                                   {n.user?.name?.substring(0,2).toUpperCase() || 'SYS'}
                                </div>
                                <div>
                                   <p className="text-[12px] font-bold text-white group-hover:text-blue-500 transition-colors uppercase">{n.user?.name || 'System'}</p>
                                   <p className="text-[9px] text-slate-500 font-bold tracking-widest">{n.user?.phone || 'N/A'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6 max-w-md">
                             <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic line-clamp-2">"{n.message}"</p>
                             <p className="text-[9px] text-blue-500/60 font-bold uppercase tracking-widest mt-1">{n.title}</p>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex justify-center">
                                <StatusBadge status={n.status === 'SENT' ? 'verified' : 'rejected'} />
                             </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <p className="text-[12px] font-bold text-white tracking-tighter">{new Date(n.createdAt).toLocaleDateString()}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                 <Bell size={40} className="text-[#30363d] mb-4 opacity-20" />
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No matching logs in registry</p>
              </div>
            )}
         </div>
      </div>
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Full Transmission Log" size="md">
        {viewModal && (
          <div className="space-y-8 pb-4">
             <div className="bg-[#020617] p-10 rounded-[40px] text-white flex flex-col items-center relative overflow-hidden group shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-blue-600/10 blur-[80px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                <div className="w-20 h-20 rounded-[28px] bg-[#161b22]/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 shadow-2xl backdrop-blur-sm">
                   <Bell size={32} className="group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight leading-none mb-2">{viewModal.user?.name || 'System Auto'}</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-60 leading-none">{viewModal.title}</p>
             </div>

             <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-4 mb-6">Message Payload</h4>
                <p className="text-md font-medium text-slate-200 leading-relaxed bg-[#0d1117] p-6 rounded-3xl border border-white/5 italic">
                  "{viewModal.message}"
                </p>
                <div className="grid grid-cols-2 gap-8 px-4">
                   <div>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Status</p>
                       <p className="text-xl font-bold text-white tracking-tight uppercase">{viewModal.status}</p>
                   </div>
                   <div>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Type</p>
                       <p className="text-xl font-bold text-white tracking-tight uppercase">{viewModal.type}</p>
                   </div>
                </div>
             </div>

             <button onClick={() => setViewModal(null)} className="w-full py-5 bg-[#020617] text-white rounded-[24px] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 border-none cursor-pointer">Close Registry Entry</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
