import React from 'react';
import { THEME } from '../theme';

export function RiskBadge({ risk }) {
  const s = THEME.risk[risk] || THEME.risk.GREEN;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex-shrink-0"
      style={{ background: s.badge, color: s.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: s.dot }}
      />
      {risk === 'GREEN' ? 'Verified' : risk === 'AMBER' ? 'Warning' : 'Danger'}
    </span>
  );
}

export function StatusBadge({ status, onClick }) {
  const s = THEME.status[status?.toLowerCase()] || THEME.status.active;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm flex-shrink-0 transition-all active:scale-95 ${onClick ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}`}
      style={{ background: s.bg, color: s.text }}
    >
      <span className="w-1 h-1 rounded-full opacity-60 flex-shrink-0" style={{ background: s.dot }} />
      {status}
    </button>
  );
}

export function StatCard({ label, value, color = '#1e40af', accent, icon: Icon, trend }) {
  return (
    <div className="bg-[#161b22] rounded-[24px] md:rounded-[32px] p-5 md:p-6 shadow-sm border border-[#30363d] relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/50 hover:shadow-xl transition-all duration-500">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0">
           <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-none truncate" style={{ color }}>{value}</p>
           <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-2 group-hover:text-slate-600 transition-colors truncate">{label}</p>
        </div>
        {Icon && (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#0d1117] text-slate-300 group-hover:bg-[#020617] group-hover:text-white transition-all shadow-inner group-hover:scale-110">
            <Icon size={20} className="sm:size-24" strokeWidth={2.5} />
          </div>
        )}
      </div>
      {trend && (
         <div className="mt-3 md:mt-4 flex items-center gap-1">
            <span className="text-[8px] sm:text-[10px] font-semibold text-emerald-500">{trend}</span>
         </div>
      )}
    </div>
  );
}

export function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
      {children}
      {error && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider ml-1">{error}</p>}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-[20px] text-[13px] font-bold text-white
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-[#1c2128] focus:border-blue-500
        transition-all placeholder:text-[#6e7681] ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <div className="relative">
       <select
         className={`w-full px-6 py-4 bg-[#0d1117] border border-[#30363d] rounded-[20px] text-[13px] font-bold text-white
           focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-[#1c2128] focus:border-blue-500
           transition-all appearance-none ${className}`}
         {...props}
       >
         {children}
       </select>
       <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
       </div>
    </div>
  );
}

export function Btn({ children, variant = 'primary', size = 'md', className = '', roleColor, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider rounded-2xl transition-all duration-500 active:scale-95 disabled:opacity-50 cursor-pointer text-center';
  const sizes = { sm: 'px-5 py-2.5 text-[9px]', md: 'px-8 py-4 text-[11px]', lg: 'px-10 py-5 text-[13px]' };

  const variants = {
    primary:  'bg-blue-600 text-white hover:bg-[#020617] shadow-xl shadow-blue-600/20 hover:shadow-black/20',
    danger:   'bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20',
    success:  'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20',
    ghost:    'bg-[#0d1117] text-slate-400 hover:bg-[#1c2128] hover:text-slate-900',
    outline:  'border-2 border-[#30363d] bg-[#161b22] text-slate-400 hover:border-blue-500 hover:text-blue-600',
    amber:    'bg-amber-500 text-white hover:bg-amber-600 shadow-xl shadow-amber-500/20',
  };

  const style = roleColor
    ? { background: roleColor, color: '#fff', boxShadow: `0 10px 30px ${roleColor}30` }
    : {};

  return (
    <button
      className={`${base} ${sizes[size]} ${roleColor ? '' : variants[variant]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle, action, back, onBack }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-3 md:mb-5 p-0.5">
      <div className="flex items-center gap-3 md:gap-5">
        {back && (
          <button
            onClick={onBack}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-[#161b22] border border-[#30363d] text-slate-400 hover:bg-[#020617] hover:text-white hover:border-[#020617] transition-all shadow-sm active:scale-90 flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight uppercase tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1 truncate opacity-80">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0 w-full md:w-auto mt-2 md:mt-0">{action}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center bg-[#161b22] rounded-[48px] border border-[#30363d] shadow-sm animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 rounded-3xl bg-[#0d1117] flex items-center justify-center text-4xl mb-8 shadow-inner grayscale opacity-50">{icon || '📋'}</div>
      <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-2">{title}</h3>
      {description && <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-10 max-w-[280px] leading-relaxed">{description}</p>}
      {action}
    </div>
  );
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', isDanger = false }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#161b22] rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10" style={{ animation: 'slideUp 0.25s ease' }}>
        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white transition-colors ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform:translateY(20px);opacity:0 } to { transform:translateY(0);opacity:1 } }`}</style>
    </div>
  );
}
