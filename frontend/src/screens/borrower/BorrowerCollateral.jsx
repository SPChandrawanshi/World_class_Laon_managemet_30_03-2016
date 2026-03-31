import React, { useState, useEffect, useRef } from 'react';
import { Camera, FileText, CheckCircle2, AlertCircle, Upload, ArrowUpRight, Loader2 } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/UI';
import api from '../../api/axios';

export default function BorrowerCollateral() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, VERIFIED, PENDING
  const fileInputRef = useRef(null);

  const fetchCollaterals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/client/collateral/my');
      if (res.data.success) {
        setUploads(res.data.collaterals);
      }
    } catch (err) {
      console.error('Failed to fetch collaterals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaterals();
  }, []);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      // In a real app, we'd use FormData to send the actual file.
      // For now, we'll notify the backend to create a record.
      const res = await api.post('/client/collateral', {
        name: file.name,
        type: file.type.split('/')[1]?.toUpperCase() || 'FILE'
      });

      if (res.data.success) {
        alert('Asset uploaded successfully and is now pending verification.');
        fetchCollaterals();
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*,.pdf"
      />

      <PageHeader 
        title="Collateral & Documents" 
        subtitle="Manage assets and legal documents for your loans" 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Upload Card */}
        <div 
          onClick={handleFileClick}
          className={`bg-[#161b22] p-8 rounded-[32px] border-2 border-dashed transition-all cursor-pointer h-full min-h-[180px] flex flex-col items-center justify-center text-center group ${
            uploading ? 'border-blue-500/50 opacity-50 pointer-events-none' : 'border-[#30363d] hover:border-blue-500 hover:bg-blue-600/5'
          }`}
        >
           <div className={`w-14 h-14 rounded-2xl bg-[#0d1117] text-slate-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl ${uploading ? 'animate-pulse' : ''}`}>
              {uploading ? <Loader2 className="animate-spin" size={28} /> : <Upload size={28} />}
           </div>
           <h3 className="text-[13px] font-bold text-white uppercase tracking-tight mb-1">{uploading ? 'Processing Stream...' : 'Upload New Asset'}</h3>
           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider max-w-[200px]">Securely link logbooks, NRC, or property deeds</p>
        </div>

        {/* Status Card */}
        <div className="bg-[#020617] p-8 rounded-[32px] text-white overflow-hidden relative shadow-2xl flex flex-col justify-center min-h-[180px] border border-white/5">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full" />
           <div className="relative z-10 w-full">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Global Asset Vault</p>
              </div>
              <h3 className="text-[18px] font-bold uppercase tracking-tighter mb-1">Network Safety <span className="text-blue-500 text-xl">99.9%</span></h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed opacity-70">Military-grade encryption for all collateral nodes.</p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Assets Ledger</h4>
            <div className="flex items-center gap-2 bg-[#161b22] p-1 rounded-2xl border border-[#30363d]">
               {[
                 { key: 'ALL', label: `All (${uploads.length})` },
                 { key: 'VERIFIED', label: `Verified (${uploads.filter(u => u.verified).length})` },
                 { key: 'PENDING', label: `Pending (${uploads.filter(u => !u.verified).length})` },
               ].map(({ key, label }) => (
                 <button
                   key={key}
                   onClick={() => setStatusFilter(key)}
                   className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${
                     statusFilter === key
                       ? key === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400'
                         : key === 'PENDING' ? 'bg-blue-500/20 text-blue-400'
                         : 'bg-[#0d1117] text-white'
                       : 'text-slate-500 hover:text-white'
                   }`}
                 >
                   {label}
                 </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {loading ? (
               <div className="py-20 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Vault...</div>
            ) : uploads.filter(doc => statusFilter === 'ALL' ? true : statusFilter === 'VERIFIED' ? doc.verified : !doc.verified).length > 0 ? uploads.filter(doc => statusFilter === 'ALL' ? true : statusFilter === 'VERIFIED' ? doc.verified : !doc.verified).map(doc => (
               <div key={doc.id} className="bg-[#161b22] p-6 rounded-[32px] border border-[#30363d] flex items-center justify-between group hover:border-blue-500 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-5">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${doc.verified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        <FileText size={24} />
                     </div>
                     <div>
                         <h5 className="text-[14px] font-bold text-white uppercase tracking-tight leading-none mb-2 group-hover:text-blue-500 transition-colors">{doc.name}</h5>
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Registered: {new Date(doc.createdAt).toLocaleDateString()}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-700" />
                           <span className="text-[9px] font-bold text-blue-400/70 uppercase tracking-widest">Format: {doc.type}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     {doc.verified ? (
                        <button onClick={() => setStatusFilter('VERIFIED')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer border-none">
                           <CheckCircle2 size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
                        </button>
                     ) : (
                        <button onClick={() => setStatusFilter('PENDING')} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer border-none">
                           <Clock className="animate-spin-slow" size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
                        </button>
                     )}
                     <button
                        onClick={() => doc.imageUrl ? window.open(doc.imageUrl, '_blank') : alert('No document URL available for this asset.')}
                        className="p-3 rounded-2xl bg-[#0d1117] text-slate-400 hover:bg-blue-600 hover:text-white transition-all border-none cursor-pointer active:scale-95 shadow-lg shadow-black/20"
                      >
                        <ArrowUpRight size={20} />
                     </button>
                  </div>
               </div>
            )) : (
               <div className="py-20 text-center bg-[#0d1117]/50 rounded-[40px] border border-dashed border-[#30363d]">
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">{statusFilter === 'ALL' ? 'Vault is empty. Initiate first upload.' : `No ${statusFilter.toLowerCase()} assets found.`}</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

const Clock = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
