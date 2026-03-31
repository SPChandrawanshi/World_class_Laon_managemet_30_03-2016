import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  User, 
  DollarSign, 
  Clock, 
  Zap, 
  ShieldAlert,
  Search,
  Hash,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';

import { useAuth } from '../../context/AuthContext';

export default function PaymentCalendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const fetchLoans = async () => {
    if (!user || !user.role) return;
    try {
      setLoading(true);
      const role = user.role.toUpperCase();
      const endpoint = (role === 'ADMIN' || role === 'STAFF')
        ? '/admin/loans'
        : '/client/loans/my';
        
      const res = await api.get(endpoint);
      if (res.data.success) {
        setLoans(res.data.loans || []);
      }
    } catch (err) {
      console.error('Fetch loans for calendar error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  const daysInMonth = (month) => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const startDay = (month) => new Date(month.getFullYear(), month.getMonth(), 1).getDay();

  const handlePrev = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNext = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getLoanStatus = (loan) => {
    if (!loan.dueDate) return 'pending';
    if (loan.status === 'PAID' || loan.status === 'COMPLETED') return 'paid';
    const dueDate = new Date(loan.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate.getTime() < today.getTime()) return 'overdue';
    if (dueDate.toDateString() === today.toDateString()) return 'due-today';
    return 'upcoming';
  };

  const monthLoans = loans.filter(l => {
    if (!l.dueDate) return false;
    const d = new Date(l.dueDate);
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  });

  const alerts = loans.filter(l => {
    if (l.status === 'COMPLETED' || l.status === 'REJECTED') return false;
    if (!l.dueDate) return l.status === 'PENDING' || l.status === 'TERMS_SET' || l.status === 'TERMS_ACCEPTED' || l.status === 'ACTIVE';
    const status = getLoanStatus(l);
    return status === 'overdue' || status === 'due-today' || status === 'upcoming';
  }).sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const selectedLoans = selectedDate ? loans.filter(l => {
    if (!l.dueDate) return false;
    const d = new Date(l.dueDate);
    return d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
  }) : [];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20 px-2 lg:px-4">
      <div className="bg-[#020617] rounded-3xl md:rounded-[40px] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl group border border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <PageHeader 
              title={user?.role?.toUpperCase() === 'BORROWER' ? "My Payment Schedule" : "Capital Timeline"} 
              subtitle={user?.role?.toUpperCase() === 'BORROWER' ? "Track your personal repayment milestones" : "Daily tracking of scheduled returns and network liquidity"} 
            />
          </div>
          
          <div className="flex items-center gap-4 bg-[#161b22] p-2 rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-xl">
            <button onClick={handlePrev} className="w-10 h-10 rounded-xl bg-[#0d1117] flex items-center justify-center text-white hover:bg-blue-600 transition-all active:scale-90 shadow-xl border-none cursor-pointer"><ChevronLeft size={20}/></button>
            <div className="px-4 md:px-6 text-center min-w-[120px] md:min-w-[150px]">
               <p className="text-[12px] md:text-[14px] font-bold text-white uppercase leading-none">{currentMonth.toLocaleDateString('en-US', { month: 'long' })}</p>
               <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mt-1">{currentMonth.getFullYear()}</p>
            </div>
            <button onClick={handleNext} className="w-10 h-10 rounded-xl bg-[#0d1117] flex items-center justify-center text-white hover:bg-blue-600 transition-all active:scale-90 shadow-xl border-none cursor-pointer"><ChevronRight size={20}/></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#161b22] rounded-[40px] p-6 md:p-10 border border-[#30363d] shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-7 mb-6">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, idx) => (
                  <div key={idx} className="text-center text-[10px] font-bold text-slate-400 tracking-widest py-4 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                {Array.from({ length: startDay(currentMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-2xl md:rounded-3xl bg-[#0d1117]/30" />
                ))}
                {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
                  const day = i + 1;
                  const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dayLoans = monthLoans.filter(l => new Date(l.dueDate).getDate() === day);
                  const isToday = today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
                  const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth();
                  
                  return (
                    <div key={day} 
                      onClick={() => setSelectedDate(dayDate)}
                      className={`aspect-square p-2 md:p-4 rounded-2xl md:rounded-[32px] border-2 transition-all relative group flex flex-col justify-between cursor-pointer ${
                        isSelected ? 'border-blue-600 bg-blue-600/10' :
                        isToday ? 'border-blue-600/30 bg-blue-600/5 shadow-lg shadow-blue-500/10' : 
                        dayLoans.length > 0 ? 'border-[#30363d] bg-[#0d1117] hover:border-blue-400' : 'border-[#30363d]/50 bg-[#0d1117]/20'
                      }`}
                    >
                      <span className={`text-[12px] md:text-[14px] font-bold ${isToday ? 'text-blue-500' : dayLoans.length > 0 ? 'text-white' : 'text-slate-500'}`}>{day}</span>
                      
                      {dayLoans.length > 0 && (
                         <div className="flex gap-1 flex-wrap">
                            {dayLoans.slice(0, 3).map((l, idx) => (
                               <div key={idx} className={`w-2 h-2 rounded-full ${
                                  getLoanStatus(l) === 'overdue' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                                  getLoanStatus(l) === 'paid' ? 'bg-emerald-500' : 'bg-blue-500'
                               }`} />
                            ))}
                            {dayLoans.length > 3 && <span className="text-[8px] text-slate-400 font-bold">+{dayLoans.length - 3}</span>}
                         </div>
                      )}

                      {dayLoans.length > 0 && (
                         <div className="absolute inset-x-0 bottom-[-10px] bg-[#020617] text-white opacity-0 group-hover:opacity-100 group-hover:bottom-full mb-2 transition-all duration-300 rounded-2xl p-4 flex flex-col items-start justify-center z-20 shadow-2xl border border-white/10 mx-[-10px] pointer-events-none min-w-[150px]">
                            {dayLoans.slice(0, 2).map((l, idx) => (
                               <div key={idx} className="w-full mb-2 last:mb-0 border-l-2 border-blue-500 pl-2">
                                  <p className="text-[9px] font-bold uppercase truncate leading-none mb-1">{user?.role?.toUpperCase() === 'BORROWER' ? 'My Loan' : l.user?.name}</p>
                                  <p className="text-[10px] font-bold text-blue-400 leading-none">K{Number(l.principalAmount || l.amount || 0).toLocaleString()}</p>
                               </div>
                            ))}
                            {dayLoans.length > 2 && <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">And more...</p>}
                         </div>
                      )}
                    </div>
                  );
                })}
              </div>
           </div>

           {selectedDate && (
              <div className="bg-[#161b22] rounded-[40px] p-10 border border-[#30363d] animate-in slide-in-from-bottom-5 duration-500">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-xl font-bold text-white tracking-tight">Schedule for {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Daily Liquidity Node</p>
                    </div>
                    <button onClick={() => setSelectedDate(null)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors border-none bg-transparent cursor-pointer">Close Info</button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedLoans.length > 0 ? selectedLoans.map(l => (
                       <div key={l.id} className="bg-[#0d1117] p-6 rounded-3xl border border-[#30363d] flex items-center justify-between group hover:border-blue-600 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold">
                                {l.id}
                             </div>
                             <div>
                                <p className="text-[11px] font-bold text-white uppercase">{user?.role?.toUpperCase() === 'BORROWER' ? 'My Installment' : l.user?.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold">K{Number(l.principalAmount || l.amount || 0).toLocaleString()}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <StatusBadge status={getLoanStatus(l)} />
                             <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">{new Date(l.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                       </div>
                    )) : (
                       <div className="col-span-2 py-10 text-center bg-[#0d1117]/30 rounded-3xl border border-dashed border-[#30363d]">
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No entries for this node</p>
                       </div>
                    )}
                 </div>
              </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-[#161b22] p-8 md:p-10 rounded-[40px] border border-[#30363d] shadow-sm flex flex-col h-full relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 border-b border-[#30363d] pb-6">
                 <div className="flex flex-col">
                    <h2 className="text-[12px] font-bold text-white uppercase tracking-wider leading-none">{user?.role === 'BORROWER' ? 'My Alerts' : 'Daily Alerts'}</h2>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{user?.role === 'BORROWER' ? 'Repayment Schedule' : 'Active Exposure'}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-blue-600 shadow-xl shadow-blue-600/20 flex items-center justify-center text-white">
                    <ShieldAlert size={20} strokeWidth={2.5} />
                 </div>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[500px]">
                {loading ? (
                   <div className="py-20 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing...</div>
                ) : alerts.length > 0 ? alerts.map((l) => (
                  <div key={l.id} className="flex gap-4 p-5 rounded-[28px] bg-[#0d1117] border border-[#30363d] hover:border-blue-600 transition-all group relative overflow-hidden">
                    <div className={`w-12 h-12 rounded-[20px] flex flex-col items-center justify-center font-bold text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform ${
                      getLoanStatus(l) === 'due-today' ? 'bg-blue-600' :
                      getLoanStatus(l) === 'overdue' ? 'bg-rose-600 shadow-rose-600/20' :
                      getLoanStatus(l) === 'pending' ? 'bg-slate-600 shadow-slate-600/20' :
                      'bg-emerald-500 shadow-emerald-500/20'
                    }`}>
                      {l.dueDate ? (
                        <>
                          <span className="text-[13px] leading-none">{new Date(l.dueDate).getDate()}</span>
                          <span className="text-[7px] leading-none opacity-80 mt-0.5">{new Date(l.dueDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                        </>
                      ) : (
                        <span className="text-[8px] leading-tight text-center px-1 uppercase">{l.status?.replace(/_/g, ' ')}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[12px] font-bold text-white uppercase leading-none group-hover:text-blue-500 transition-colors mb-1.5">{user?.role === 'BORROWER' ? 'My Payment' : (l.user?.name || 'Unknown')}</h3>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[14px] font-bold text-slate-200 tracking-tight leading-none">K{Number(l.principalAmount || l.amount || 0).toLocaleString()}</p>
                        <span className={`text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${
                          getLoanStatus(l) === 'overdue' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                          getLoanStatus(l) === 'due-today' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          getLoanStatus(l) === 'pending' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                          'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>{getLoanStatus(l).replace(/-/g, ' ')}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center flex flex-col items-center">
                     <CheckCircle2 size={32} className="text-emerald-500 mb-4 opacity-20" />
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">All settled</p>
                  </div>
                )}
              </div>

               {(user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'STAFF') && (
                 <div className="mt-8 space-y-4 pt-6 border-t border-[#30363d]">
                   <button 
                    onClick={() => alert("Initiating automated payment notifications to all overdue borrowers...")}
                    className="w-full py-5 bg-[#020617] text-white rounded-[24px] font-bold text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl border-none cursor-pointer group">
                      Nudge Late Assets <Zap size={16} className="group-hover:animate-bounce" />
                   </button>
                 </div>
               )}
               <div className="flex items-center justify-center gap-2 mt-4 opacity-60">
                  <Clock size={12} className="text-slate-500" />
                  <p className="text-[8px] text-slate-500 text-center font-bold uppercase tracking-wider">Synchronized</p>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}

const CheckCircle2 = ({ size, className }) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);
