import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Save, RefreshCw, Layers, Shield, 
  Percent, Clock, Briefcase, Zap, AlertTriangle, CheckCircle2,
  Sliders, Activity, Database
} from 'lucide-react';
import { PageHeader } from '../../components/UI';
import api from '../../api/axios';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    default_interest: '10',
    default_late_fee: '2',
    default_agent_percentage: '5',
    default_grace_days: '3'
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/config');
      if (res.data.success) {
        setSettings(prev => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("[SETTINGS SAVE CLICKED]", settings);
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/admin/config', { settings });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Protocol parameters updated successfully.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleWipe = async () => {
    if (!window.confirm("CRITICAL WARNING: This will permanently eradicate all Borrowers, Agents, Loans, and Payments from the system. Admin accounts will remain. Are you absolutely sure?")) return;
    if (!window.confirm("FINAL CONFIRMATION: Verify system wipe?")) return;
    
    console.log("[SYSTEM WIPE CLICKED] - NUCLEAR OPTION");
    setIsSaving(true);
    try {
      const res = await api.post('/admin/config/reset');
      if (res.data.success) {
        alert("SYSTEM WIPED. Protocol returned to initial state.");
        window.location.reload();
      }
    } catch (err) {
      alert("Wipe failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-2 lg:px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="System Control Protocol" 
          subtitle="Configure default financial coefficients and network-wide logic." 
        />
        <button 
          onClick={fetchData}
          className="p-4 rounded-2xl bg-[#161b22] text-slate-400 hover:text-blue-500 border border-[#30363d] transition-all active:scale-95"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-[#161b22] rounded-[40px] border border-[#30363d] shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-[#30363d] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
                <Sliders size={24} />
              </div>
              <div>
                <h4 className="text-[12px] font-bold text-white uppercase tracking-widest">Financial Coefficients</h4>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Primary default configuration</p>
              </div>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Percent size={16} className="text-blue-500" />
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Interest Rate (%)</label>
                  </div>
                  <input 
                    type="number"
                    value={settings.default_interest}
                    onChange={(e) => handleChange('default_interest', e.target.value)}
                    className="w-full px-8 py-5 bg-[#0d1117] border-2 border-slate-800 rounded-[28px] text-[13px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                    placeholder="10"
                    required
                  />
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider pl-4">Standard monthly yield for new loan issuing.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Late Fee Penalty (%)</label>
                  </div>
                  <input 
                    type="number"
                    value={settings.default_late_fee}
                    onChange={(e) => handleChange('default_late_fee', e.target.value)}
                    className="w-full px-8 py-5 bg-[#0d1117] border-2 border-slate-800 rounded-[28px] text-[13px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                    placeholder="2"
                    required
                  />
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider pl-4">Monthly penalty rate applied to overdue capital.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase size={16} className="text-emerald-500" />
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agent Commission (%)</label>
                  </div>
                  <input 
                    type="number"
                    value={settings.default_agent_percentage}
                    onChange={(e) => handleChange('default_agent_percentage', e.target.value)}
                    className="w-full px-8 py-5 bg-[#0d1117] border-2 border-slate-800 rounded-[28px] text-[13px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                    placeholder="5"
                    required
                  />
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider pl-4">Revenue share for mapped agents on loan yields.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={16} className="text-indigo-500" />
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default Grace Days</label>
                  </div>
                  <input 
                    type="number"
                    value={settings.default_grace_days}
                    onChange={(e) => handleChange('default_grace_days', e.target.value)}
                    className="w-full px-8 py-5 bg-[#0d1117] border-2 border-slate-800 rounded-[28px] text-[13px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                    placeholder="3"
                    required
                  />
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider pl-4">Extension period before late fee activation.</p>
                </div>
              </div>

              {message.text && (
                 <div className={`p-6 rounded-3xl border flex items-center gap-4 animate-in zoom-in-95 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                    <p className="text-[11px] font-bold uppercase tracking-widest">{message.text}</p>
                 </div>
              )}

              <div className="pt-6 border-t border-[#30363d] flex justify-end">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#020617] text-white px-12 py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95 border-none cursor-pointer flex items-center gap-4"
                >
                  {isSaving ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving ? 'Synchronizing State...' : 'Commit Settings'}
                </button>
              </div>
            </div>
          </form>

          <div className="bg-blue-600/10 border border-blue-600/20 rounded-[40px] p-8 flex gap-6 items-start">
             <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30">
                <Zap size={24} strokeWidth={2.5} />
             </div>
             <div>
                <h4 className="text-[12px] font-bold text-white uppercase tracking-widest mb-2">Protocol Note</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase">Changing these coefficients will only affect NEW loan applications. Existing active loans will maintain their original contracts and yields signed at the time of approval.</p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#020617] rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl border border-white/5 h-full">
              <div className="absolute inset-0 bg-blue-600/10 blur-[80px]"></div>
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-blue-500">
                      <Activity size={22} />
                    </div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#e6edf3]">Node Status</h3>
                 </div>

                 <div className="space-y-10 flex-1">
                    {[
                      { label: 'Network Stability', value: 'OPTIMAL', color: 'emerald' },
                      { label: 'Database Latency', value: loading ? '...' : '0.4ms', color: 'blue' },
                      { label: 'Security Ledger', value: 'VERIFIED', color: 'emerald' },
                      { label: 'Config Integrity', value: loading ? 'SYNCING' : 'SYNCED', color: 'blue' }
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-[#30363d] pb-6 last:border-0">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                         <span className={`text-[12px] font-bold text-${s.color}-500 uppercase tracking-widest`}>{s.value}</span>
                      </div>
                    ))}
                 </div>

                 <div className="mt-10 pt-10 border-t border-[#30363d]">
                    <div className="flex items-center gap-4 mb-2">
                       <Database size={16} className="text-slate-500" />
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Main Node Distribution</span>
                    </div>
                    <p className="text-[14px] font-bold text-white uppercase opacity-80 leading-none">MySQL v8.0.32</p>
                 </div>
              </div>
           </div>

           <div className="bg-[#161b22] rounded-[40px] p-10 border border-rose-500/20 shadow-2xl relative overflow-hidden group h-full flex flex-col justify-center items-center text-center">
              <div className="absolute inset-0 bg-rose-600/5 group-hover:bg-rose-600/10 transition-colors pointer-events-none"></div>
              <AlertTriangle size={32} className="text-rose-500 mb-4" />
              <h3 className="text-[14px] font-bold text-white uppercase tracking-widest mb-2">Danger Zone</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-8 max-w-[200px]">Execute a complete system cleanse. Irreversible operation.</p>
              
              <button 
                onClick={handleWipe} 
                disabled={isSaving}
                className="w-full py-5 bg-rose-600/20 text-rose-500 border border-rose-500/30 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Executing Wipe...' : 'Format Ledger'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
