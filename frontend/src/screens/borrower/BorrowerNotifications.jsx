import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, Filter, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, MessageSquare, Send, Shield, History, Info,
  Mail, MessageCircle
} from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/UI';
import api from '../../api/axios';
import Modal from '../../components/Modal';

export default function BorrowerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/client/notifications/my');
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

  const filtered = notifications.filter(n => 
    n.message.toLowerCase().includes(search.toLowerCase()) || 
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-2 lg:px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="Alerts & Notifications" 
          subtitle="View automated reminders, status updates, and system communications." 
        />
        <button 
          onClick={fetchNotifications}
          className="p-4 rounded-2xl bg-[#161b22] text-slate-400 hover:text-blue-500 border border-[#30363d] transition-all active:scale-95"
        >
          <History size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-4">
            <div className="bg-[#161b22] rounded-[40px] border border-[#30363d] p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[18px] bg-blue-600/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-inner">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-tight">Recent Activity</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{notifications.length} Messages in Registry</p>
                  </div>
                </div>
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Synchronizing with Node...</div>
            ) : filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => setViewModal(n)}
                    className="bg-[#161b22] p-8 rounded-[44px] border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-600 hover:shadow-2xl transition-all relative overflow-hidden active:scale-[0.99] cursor-pointer"
                  >
                     <div className="flex items-center gap-8 relative z-10">
                        <div className={`w-16 h-16 rounded-[24px] bg-[#0d1117] flex items-center justify-center transition-all shadow-inner border border-[#30363d] flex-shrink-0 ${n.status === 'SENT' ? 'text-blue-500 group-hover:bg-blue-600 group-hover:text-white' : 'text-rose-500'}`}>
                           {n.type === 'SMS' ? <MessageCircle size={28} /> : <Info size={28} />}
                        </div>
                        <div className="min-w-0">
                           <h4 className="text-[18px] font-bold text-[#e6edf3] uppercase tracking-tight leading-none mb-3 group-hover:text-blue-600 transition-colors uppercase">{n.title}</h4>
                           <p className="text-[12px] text-slate-400 font-medium leading-relaxed max-w-xl italic">"{n.message}"</p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between md:justify-end gap-10 relative z-10 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-none border-slate-50">
                        <div className="text-right">
                           <p className="text-[12px] font-bold text-white tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</p>
                           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <ChevronRight size={20} className="text-slate-100 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                     </div>
                     <div className="absolute left-0 top-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-[#0d1117] rounded-[44px] border border-dashed border-[#30363d]">
                 <Bell size={40} className="text-slate-700 mb-4 opacity-30" />
                 <p className="text-[11px] text-slate-600 font-bold uppercase tracking-widest">No matching alerts in your registry</p>
              </div>
            )}
         </div>

         <div className="space-y-6">
            <div className="bg-blue-600 rounded-[44px] p-10 text-white relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#161b22]/10 blur-[50px] rounded-full" />
               <Shield size={40} className="mb-6 opacity-60 group-hover:rotate-12 transition-transform" />
               <h4 className="text-xl font-bold uppercase tracking-tight mb-4 leading-tight">Identity & Privacy</h4>
               <p className="text-[10px] font-bold uppercase tracking-wider leading-loose opacity-80">
                  Your communications are end-to-end encrypted. System reminders are sent via verified Twilio nodes to ensure 100% delivery reliability.
               </p>
            </div>

            <div className="bg-[#161b22] rounded-[40px] border border-[#30363d] p-8 shadow-sm">
               <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6">Communication Hub</h4>
               <div className="space-y-6">
                  {[
                    { icon: Mail, label: 'Email Node', status: 'Inactive', color: 'slate' },
                    { icon: MessageSquare, label: 'SMS Gateway', status: 'Online', color: 'blue' },
                    { icon: Send, label: 'Push Hub', status: 'Offline', color: 'slate' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <s.icon size={16} className={`text-${s.color}-500`} />
                          <span className="text-[11px] font-bold text-white uppercase tracking-wider">{s.label}</span>
                       </div>
                       <span className={`text-[9px] font-bold uppercase tracking-widest text-${s.color}-500/60`}>{s.status}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="System Message Hub" size="md">
        {viewModal && (
          <div className="space-y-8 pb-4">
            <div className="bg-[#020617] p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl group border border-white/5">
              <div className="absolute inset-0 bg-blue-900/10 blur-3xl group-hover:bg-blue-900/20 transition-all"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[28px] bg-blue-600/10 text-blue-400 flex items-center justify-center mb-6">
                  {viewModal.type === 'SMS' ? <MessageCircle size={32} /> : <Bell size={32} />}
                </div>
                <h3 className="text-2xl font-bold tracking-tight leading-none mb-2">{viewModal.title}</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-60 leading-none">Global Notification</p>
              </div>
            </div>

            <div className="bg-[#161b22] p-8 rounded-[40px] border border-[#30363d] space-y-6">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Transmission Payload</h4>
              <p className="text-md font-medium text-slate-200 leading-relaxed bg-[#0d1117] p-6 rounded-3xl border border-white/5 italic">
                "{viewModal.message}"
              </p>
              <div className="flex justify-between items-center px-2">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Channel</p>
                  <p className="text-[11px] font-bold text-white uppercase">{viewModal.type} Connection</p>
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
                Close Hub
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
