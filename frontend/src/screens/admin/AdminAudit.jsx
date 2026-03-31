import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, Clock, User, Globe, ShieldCheck, Activity, 
  ChevronRight, Download, Calendar, Zap, ArrowUpRight, Lock, Hash, 
  Fingerprint, Database, Server, Network, Cpu, LayoutDashboard, Settings, Sliders, Bell
} from 'lucide-react';
import { PageHeader } from '../../components/UI';
import api from '../../api/axios';

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  // System Settings States
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    neural_risk_scoring: true,
    auto_reminders: true,
    debug_mode: false
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [auditRes, configRes] = await Promise.all([
        api.get('/admin/audit'),
        api.get('/admin/config')
      ]);
      
      if (auditRes.data.success) {
        setLogs(auditRes.data.logs || []);
      }
      if (configRes.data.success) {
        setSettings(prev => ({
          ...prev,
          maintenance_mode: configRes.data.settings.maintenance_mode ?? false,
          neural_risk_scoring: configRes.data.settings.neural_risk_scoring ?? true,
          auto_reminders: configRes.data.settings.auto_reminders ?? true,
          debug_mode: configRes.data.settings.debug_mode ?? false
        }));
      }
    } catch (err) {
      console.error('Failed to fetch audit data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSetting = async (key) => {
    try {
      const newValue = !settings[key];
      const res = await api.put('/admin/config', { 
        settings: { [key]: String(newValue) } 
      });
      if (res.data.success) {
        setSettings(p => ({ ...p, [key]: newValue }));
      }
    } catch (err) {
      console.error('Failed to update setting', err);
    }
  };

  const filtered = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                         log.performedBy.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'admin' && log.performedBy.toLowerCase().includes('admin')) ||
                         (filterType === 'system' && !log.performedBy.toLowerCase().includes('admin'));
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    if (logs.length === 0) return alert('No records found to export.');
    
    setIsExporting(true);
    try {
      const headers = ['ID', 'Action', 'Performed By', 'Timestamp'];
      const rows = filtered.map(log => [
        log.id, 
        `"${log.action}"`, 
        `"${log.performedBy}"`, 
        `"${new Date(log.timestamp).toLocaleString()}"`
      ]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `audit_records_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-10 pb-20 px-2 lg:px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="System Settings & Audit" 
          subtitle="Configure core network parameters and monitor administrative activity." 
        />
        <button 
          onClick={handleExportCSV}
          disabled={isExporting}
          className={`bg-[#020617] text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl active:scale-95 border-none cursor-pointer group ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Download size={16} /> {isExporting ? 'Exporting...' : 'Export Audit Records'}
        </button>
      </div>

      {/* QUICK SETTINGS PANEL - Added New Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
          <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
             {[
               { id: 'maintenance', label: 'Maintenance Mode', icon: Server, desc: 'Block public access' },
               { id: 'aiScoring', label: 'Neural Risk Assessment', icon: Cpu, desc: 'Auto credit scoring' },
               { id: 'autoReminders', label: 'Autonomous Alerts', icon: Bell, desc: 'Auto payment nudges' },
               { id: 'debugMode', label: 'Developer Logs', icon: Database, desc: 'Verbose system trace' },
               { id: 'shield', label: 'Global Encryption', icon: ShieldCheck, desc: 'AES-256 Protocol', static: true },
               { id: 'globe', label: 'Multi-Region Support', icon: Globe, desc: 'Zonal Redundancy', static: true },
             ].map((s, i) => (
                <div key={i} className="bg-[#161b22] p-6 rounded-[32px] border border-[#30363d] shadow-sm flex flex-col justify-between group hover:border-blue-600 transition-all">
                   <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0d1117] text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center">
                         <s.icon size={18} />
                      </div>
                      {!s.static ? (
                        <div 
                          onClick={() => toggleSetting(s.id)}
                          className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${settings[s.id] ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-[#161b22] rounded-full shadow-md transition-all ${settings[s.id] ? 'right-1' : 'left-1'}`} />
                        </div>
                      ) : (
                        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full">Active</span>
                      )}
                   </div>
                   <div>
                      <h4 className="text-[12px] font-bold text-white uppercase tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">{s.label}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider opacity-70 truncate">{s.desc}</p>
                   </div>
                </div>
             ))}
          </div>
          
          <div className="bg-[#020617] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full" />
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <Activity size={20} className="text-blue-500" />
                   <h3 className="text-[11px] font-bold uppercase tracking-wider">System Pulse</h3>
                </div>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                         <span className="text-slate-500">Node Storage</span>
                         <span>42% Used</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#161b22]/5 rounded-full overflow-hidden">
                         <div className="h-full w-[42%] bg-blue-500 rounded-full" />
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                         <span className="text-slate-500">Credit Score AI</span>
                         <span>98.4% Acc</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#161b22]/5 rounded-full overflow-hidden">
                         <div className="h-full w-[98%] bg-emerald-500 rounded-full" />
                      </div>
                   </div>
                </div>
                <button className="w-full mt-10 py-4 bg-[#161b22]/5 border border-white/10 rounded-2xl text-[9px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">Flush Logs</button>
             </div>
          </div>
      </div>

      <div className="pt-6">
         <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Administrative Trace Ledger</h3>
            <div className="flex bg-[#161b22] p-1.5 rounded-2xl border border-[#30363d] shadow-sm">
                {['all', 'admin', 'system'].map((s) => (
                  <button key={s} onClick={() => setFilterType(s)} className={`px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${filterType === s ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-blue-600'}`}>{s}</button>
                ))}
            </div>
         </div>

         <div className="space-y-4">
            {filtered.slice(0, 8).map((log) => (
               <div key={log.id} className="bg-[#161b22] p-6 rounded-[32px] border border-slate-50 flex items-center justify-between group hover:border-blue-600 hover:shadow-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-xl bg-[#0d1117] text-slate-400 group-hover:bg-[#020617] group-hover:text-blue-400 flex items-center justify-center border border-[#30363d] transition-all">
                        <Fingerprint size={22} />
                     </div>
                     <div>
                        <h4 className="text-[14px] font-bold text-white group-hover:text-blue-600 transition-colors uppercase leading-none mb-1.5">{log.action}</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{log.performedBy}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-200" />
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                     </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
