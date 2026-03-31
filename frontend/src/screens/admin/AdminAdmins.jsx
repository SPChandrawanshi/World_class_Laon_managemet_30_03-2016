import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  UserPlus, 
  Trash2, 
  Mail, 
  Phone, 
  Lock,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { StatusBadge, PageHeader, ConfirmDialog } from '../../components/UI';
import Modal from '../../components/Modal';
import api from '../../api/axios';

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm]               = useState({ name: '', email: '', phone: '', password: 'AdminPassword123!' });
  const [errors, setErrors]           = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users?role=ADMIN');
      if (res.data.success) {
        setAdmins(res.data.users);
      }
    } catch (err) {
      console.error('Fetch admins error', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const res = await api.post('/admin/users', { ...form, role: 'ADMIN' });
      if (res.data.success) {
        setAdmins([res.data.user, ...admins]);
        setShowSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setShowSuccess(false);
          setForm({ name: '', email: '', phone: '', password: 'AdminPassword123!' });
        }, 2000);
      }
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Failed to add admin' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      const res = await api.delete(`/admin/users/${deleteConfirm.id}`);
      if (res.data.success) {
        setAdmins(p => p.filter(a => a.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const filtered = admins.filter(a => 
    (a.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (a.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in duration-700 px-2 lg:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="System Administration" 
          subtitle="Manage root authority accounts and security permissions" 
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#020617] text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl cursor-pointer border-none"
        >
          <UserPlus size={16} /> Add Administrator
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="Search Admin Name or Identity..."
            className="w-full pl-14 pr-10 py-5 bg-[#161b22] border border-[#30363d] rounded-[28px] text-[11px] font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(a => (
          <div key={a.id} className="bg-[#161b22] rounded-[40px] border border-slate-50 shadow-sm p-8 hover:border-blue-600 hover:shadow-2xl transition-all group relative flex flex-col justify-between h-full overflow-hidden">
             <div className="mb-8 relative z-10">
                <div className="flex items-start justify-between mb-6">
                   <div className="w-16 h-16 rounded-[24px] bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-blue-400 transition-all shadow-inner border border-[#30363d] flex items-center justify-center text-xl font-bold">
                      <ShieldCheck />
                   </div>
                    <div className="flex flex-col items-end gap-2">
                       <StatusBadge status="ADMIN" />
                    </div>
                 </div>
                <div>
                   <h4 className="text-[17px] font-bold text-white leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight mb-2">{a.name}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider opacity-80">{a.email}</p>
                   <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1">{a.phone}</p>
                </div>
             </div>
  
             <div className="flex gap-3 mt-auto relative z-10">
                  <button 
                     onClick={() => setDeleteConfirm(a)}
                     className="w-full py-4 rounded-2xl bg-[#0d1117] text-slate-400 hover:bg-red-600 hover:text-white flex items-center justify-center gap-3 active:scale-95 transition-all border-none cursor-pointer text-[9px] font-bold uppercase tracking-wider"
                  >
                     <Trash2 size={16} /> Revoke Authority
                  </button>
              </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Provision New Admin" size="md">
        {showSuccess ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-24 h-24 rounded-[32px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xl">
                <CheckCircle2 size={56} />
             </div>
             <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Authority Handover Complete</h3>
          </div>
        ) : (
          <form onSubmit={handleAddAdmin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
              <input 
                className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Admin Name" required
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
                <input 
                  type="email"
                  className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="admin@system.com" required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Direct Line</label>
                <input 
                  className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="097..." required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">System Access Code</label>
              <input 
                type="text"
                className="w-full px-6 py-4 border-2 border-[#30363d] bg-[#0d1117] rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none tracking-widest"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
              />
            </div>
            {errors.server && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.server}</p>}
            <div className="flex gap-4 pt-4">
               <button disabled={isSubmitting} type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-wider shadow-xl border-none cursor-pointer">
                  {isSubmitting ? 'Provisioning...' : 'Confirm Provisioning'}
               </button>
               <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-5 bg-gray-100 text-gray-500 rounded-2xl font-bold text-[10px] uppercase tracking-wider border-none cursor-pointer">Abort</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteAdmin}
        title="Revoke Authority?"
        message={`Are you sure you want to permanently revoke ${deleteConfirm?.name}'s administrative access?`}
        confirmLabel="Revoke Access"
        isDanger
      />
    </div>
  );
}
