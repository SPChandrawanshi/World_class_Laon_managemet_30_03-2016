import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ChevronRight,
  Zap,
  Info,
  DollarSign,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Shield,
  Target,
  FileText,
  Lock,
  Wallet,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, StatusBadge } from '../../components/UI';
import Modal from '../../components/Modal';

export default function BorrowerLoans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [acceptTermsModal, setAcceptTermsModal] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ trxId: '', method: 'Mobile Money', paymentType: 'MONTHLY_INTEREST', extraPrincipal: '' });
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const termsRef = React.useRef(null);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/client/loans/my');
      if (res.data.success) setLoans(res.data.loans || []);
    } catch (err) {
      console.error('Fetch loans error', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLoans();
  }, []);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.trxId) return alert('Please enter a Transaction ID');

    const baseAmt = Number(paymentModal.totalCollected || paymentModal.baseAmount || 0);
    const extraPrincipal = Number(paymentForm.extraPrincipal || 0);

    const submissionData = {
      trxId: paymentForm.trxId,
      method: paymentForm.method === 'Mobile Money' ? 'MOBILE_MONEY' :
              paymentForm.method === 'Bank Transfer' ? 'BANK_TRANSFER' : 'CASH',
      paymentType: paymentForm.paymentType,
      principalPaid: paymentForm.paymentType === 'PRINCIPAL_PAYDOWN' ? extraPrincipal
                   : paymentForm.paymentType === 'PAYOFF' ? Number(paymentModal.loan?.currentPrincipal || 0)
                   : 0,
      totalCollected: paymentForm.paymentType === 'PRINCIPAL_PAYDOWN' ? extraPrincipal
                    : paymentForm.paymentType === 'PAYOFF' ? (baseAmt + Number(paymentModal.loan?.currentPrincipal || 0))
                    : baseAmt,
    };

    setIsPaying(true);
    try {
      const res = await api.put(`/client/payments/${paymentModal.id}`, submissionData);
      if (res.data.success) {
        alert('PAYMENT SUBMITTED: Your proof has been logged for registry verification.');
        setPaymentModal(null);
        setViewModal(null);
        fetchLoans();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting payment');
    } finally {
      setIsPaying(false);
    }
  };

  const totalDebt = loans.reduce((sum, l) => sum + (l.status !== 'COMPLETED' ? Number(l.principalAmount || l.amount || 0) : 0), 0);
  const activeLoans = loans.filter(l => l.status !== 'COMPLETED');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <PageHeader title="My Loans" subtitle="Track and manage your active loans and repayments" />

      {/* Small & Attractive Horizontal Exposure Card */}
      <div className="relative bg-[#020617] rounded-[32px] p-6 md:p-8 text-white overflow-hidden shadow-xl group border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#020617] opacity-90 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-600/10 blur-[80px] rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Left: Exposure Data */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-500/10 backdrop-blur-xl rounded-full border border-emerald-500/20 w-fit mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider leading-none">Status: Good</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-wider mb-1 leading-none">Total Amount Due</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-none mb-3">K{totalDebt.toLocaleString()}</h2>
            </div>

            <div className="flex gap-2 justify-center lg:justify-start">
              <div className="px-3 py-1.5 bg-[#161b22]/5 border border-white/5 rounded-xl text-center">
                <p className="text-[10px] font-bold text-white uppercase tracking-tight">{activeLoans.length} Loans</p>
              </div>
            </div>
          </div>

          {/* Right: Small Action Sidebox */}
          <div className="w-full lg:w-[180px]">
            <div className="bg-[#161b22]/5 backdrop-blur-md p-5 rounded-2xl text-white flex flex-col items-center gap-1 shadow-lg text-center border border-white/10">
              <Wallet size={18} className="mb-1 text-blue-200 opacity-60" />
              <h4 className="text-xs font-bold uppercase leading-none">New Offer</h4>
              <p className="text-[10px] font-bold text-blue-100/60 mt-1 uppercase">K15k Credit</p>
              <button onClick={() => navigate('/app/apply')} className="w-full px-4 py-2 bg-[#161b22] text-white rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all mt-3 border-none cursor-pointer relative z-50">Apply</button>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Node Update - Non-overlapping */}
      <div className="bg-[#020617] p-3 px-5 rounded-2xl shadow-lg flex items-center gap-4 text-white border border-white/5 transition-all hover:scale-[1.01] group mx-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white flex-shrink-0 shadow-2xl group-hover:rotate-6 transition-all duration-300">
          <Zap size={16} className="fill-white" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase mb-0.5">Credit Alert</p>
          <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider opacity-80 leading-none">New Credit Limit: K15,000 Available</p>
        </div>
        <button onClick={() => alert('SYNCHRONIZING SECURE CHANNEL: Network authority has authorized a credit limit increase of K15,000 for your node. Visit Apply to initialize.')} className="px-3 py-1 bg-[#161b22]/5 hover:bg-[#1c2128]/10 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer">View</button>
      </div>

      <div className="space-y-4 px-1 pb-16">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Loans</h3>
          <Target size={14} className="text-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {loans.map((loan) => (
            <div
              key={loan.id}
              onClick={() => {
                if (loan.status === 'TERMS_SET') {
                  setAcceptTermsModal(loan);
                } else {
                  setViewModal(loan);
                }
              }}
              className="bg-[#161b22] rounded-2xl p-3 border border-gray-100 shadow-sm transition-all hover:border-blue-500 group cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-600 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0d1117] text-slate-400 group-hover:bg-[#020617] group-hover:text-white transition-all flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white uppercase group-hover:text-blue-600 transition-colors tracking-tight leading-none mb-1">{loan.agent?.name ? `Agent: ${loan.agent.name}` : 'Lender: Global'}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase opacity-70">ID: {loan.id}</p>
                  </div>
                </div>
                <StatusBadge status={loan.status} />
              </div>

              <div className="flex items-end justify-between pt-5 border-t border-gray-50 relative z-10">
                <div>
                  <p className="text-lg font-bold text-white tracking-tight leading-none mb-1 grayscale group-hover:grayscale-0 transition-all">K{Number(loan.principalAmount || loan.amount || 0).toLocaleString()}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none opacity-80">Duration: {loan.duration}m</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="px-3 py-1.5 bg-[#0d1117] rounded-full text-[8px] font-bold text-slate-500 uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {loan.status === 'COMPLETED' ? 'Settled' : loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                  </div>
                  <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Loan Tracking" size="sm">
        {viewModal && (() => {
          const totalPaid = (viewModal.payments || []).reduce((s, i) => i.status === 'VERIFIED' ? (Number(s) + Number(i.totalCollected || 0)) : s, 0);
          const loanAmt = Number(viewModal.principalAmount || viewModal.amount || 0);
          const balance = loanAmt - totalPaid;

          return (
            <div className="space-y-6 pb-2">
              <div className="bg-[#020617] p-6 rounded-[32px] text-center text-white relative overflow-hidden shadow-xl border border-white/5">
                <div className="absolute inset-0 bg-blue-900/10 blur-3xl"></div>
                <p className="relative z-10 text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-1 opacity-70">Remaining Balance</p>
                <h3 className="relative z-10 text-2xl font-bold tracking-tight leading-none mb-3">K{balance.toLocaleString()}</h3>
                <div className="relative z-10 flex gap-2 justify-center">
                  <div className="px-2 py-0.5 bg-[#161b22]/5 border border-white/5 rounded-full">
                    <p className="text-[8px] font-bold text-white uppercase tracking-wider">Paid: K{totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="px-2 py-0.5 bg-[#161b22]/5 border border-white/5 rounded-full">
                    <p className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">Total: K{loanAmt.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-left">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Repayment Schedule</h4>
                 <div className="bg-[#161b22] rounded-3xl border border-[#30363d] shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full border-collapse">
                       <thead>
                          <tr className="bg-[#0d1117]/50">
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">#</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Amount</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Date</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[#30363d]">
                          {viewModal.payments?.map((ins, idx) => {
                             const isMissed = ins.status === 'LATE';
                             const isPaid = ins.status === 'VERIFIED';
                             const isPending = ins.status === 'PENDING';
                             const displayAmount = Number(ins.totalCollected || ins.baseAmount || 0);
                             
                             return (
                                <tr key={ins.id} className={`transition-all ${isMissed ? 'bg-red-500/5' : ''}`}>
                                   <td className="px-4 py-4">
                                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${isMissed ? 'bg-red-600 text-white' : 'bg-[#0d1117] text-white border border-white/5'}`}>
                                         {idx + 1}
                                      </div>
                                   </td>
                                   <td className="px-4 py-4">
                                      <p className={`text-[13px] font-bold tracking-tight ${isMissed ? 'text-red-400' : 'text-white'}`}>K{displayAmount.toLocaleString()}</p>
                                      {ins.penaltyAmount > 0 && (
                                         <div className="mt-1 flex flex-col gap-0.5">
                                           <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider leading-none">
                                              + K{Number(ins.penaltyAmount).toLocaleString()} LATE FEE
                                           </span>
                                         </div>
                                      )}
                                   </td>
                                   <td className="px-4 py-4 text-center">
                                      <StatusBadge 
                                        status={ins.status} 
                                        onClick={isPending ? () => setPaymentModal(ins) : null}
                                      />
                                   </td>
                                   <td className="px-4 py-4 text-right">
                                      <p className={`text-[10px] font-bold uppercase tracking-tight ${isMissed ? 'text-red-600' : 'text-slate-500'}`}>
                                         {isPaid && ins.paidAt ? new Date(ins.paidAt).toLocaleDateString() : 'SCHEDULED'}
                                      </p>
                                      {isPending && (
                                         <p className="text-[7px] font-bold text-blue-400 uppercase tracking-wider mt-1 opacity-60">Click to Settle</p>
                                      )}
                                   </td>
                                </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="flex justify-center pt-2">
                 <button 
                  onClick={() => setViewModal(null)} 
                  className="px-8 py-3 bg-[#0d1117] text-white border border-white/5 rounded-xl text-[9px] font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all text-center"
                 >
                    Close Tracker
                 </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Payment Submission Modal */}
      <Modal isOpen={!!paymentModal} onClose={() => !isPaying && setPaymentModal(null)} title="Commit Installment Payment" size="sm">
         {paymentModal && (
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
               {/* Payment Type Selector */}
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Payment Type</label>
                  <div className="grid grid-cols-3 gap-2">
                     {[
                       { key: 'MONTHLY_INTEREST', label: 'Interest Only', desc: 'Monthly due' },
                       { key: 'PRINCIPAL_PAYDOWN', label: 'Extra Principal', desc: 'Reduce balance' },
                       { key: 'PAYOFF', label: 'Full Payoff', desc: 'Close loan' },
                     ].map(({ key, label, desc }) => (
                       <button
                         key={key}
                         type="button"
                         onClick={() => setPaymentForm({ ...paymentForm, paymentType: key })}
                         className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                           paymentForm.paymentType === key
                             ? 'border-blue-600 bg-blue-600/10 text-blue-400'
                             : 'border-slate-800 bg-[#0d1117] text-slate-400 hover:border-blue-600/40'
                         }`}
                       >
                         <p className="text-[10px] font-bold uppercase tracking-wider leading-none mb-1">{label}</p>
                         <p className="text-[8px] text-slate-500 uppercase">{desc}</p>
                       </button>
                     ))}
                  </div>
               </div>

               {/* Amount Summary */}
               <div className="bg-[#020617] p-5 rounded-[24px] text-center text-white relative border border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-600/5 blur-3xl"></div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">
                     {paymentForm.paymentType === 'MONTHLY_INTEREST' ? 'Interest Due'
                      : paymentForm.paymentType === 'PAYOFF' ? 'Interest + Principal'
                      : 'Extra Principal Amount'}
                  </p>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">
                     {paymentForm.paymentType === 'MONTHLY_INTEREST'
                       ? `K${Number(paymentModal.totalCollected || paymentModal.baseAmount || 0).toLocaleString()}`
                       : paymentForm.paymentType === 'PAYOFF'
                       ? `K${(Number(paymentModal.totalCollected || paymentModal.baseAmount || 0) + Number(paymentModal.loan?.currentPrincipal || 0)).toLocaleString()}`
                       : 'Enter below'}
                  </h3>
               </div>

               {/* Extra principal input for PRINCIPAL_PAYDOWN */}
               {paymentForm.paymentType === 'PRINCIPAL_PAYDOWN' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Principal Amount (K)</label>
                     <input
                        type="number"
                        min="1"
                        placeholder="Enter amount to pay toward principal"
                        value={paymentForm.extraPrincipal}
                        onChange={e => setPaymentForm({ ...paymentForm, extraPrincipal: e.target.value })}
                        className="w-full px-5 py-4 bg-[#0d1117] border-2 border-slate-800 rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                        required
                     />
                  </div>
               )}

               <div className="space-y-3">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Payment Channel</label>
                     <select
                        value={paymentForm.method}
                        onChange={e => setPaymentForm({...paymentForm, method: e.target.value})}
                        className="w-full px-5 py-4 bg-[#0d1117] border-2 border-slate-800 rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                     >
                        <option value="Mobile Money">Mobile Money (Airtel/MTN/Zamtel)</option>
                        <option value="Bank Transfer">Bank Transfer (Standard/FNB/ZANACO)</option>
                        <option value="Cash">Cash Deposit</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">TRX Identifier (ID)</label>
                     <input
                        type="text"
                        placeholder="Enter Transaction Reference Number"
                        value={paymentForm.trxId}
                        onChange={e => setPaymentForm({...paymentForm, trxId: e.target.value})}
                        className="w-full px-5 py-4 bg-[#0d1117] border-2 border-slate-800 rounded-2xl text-[12px] font-bold text-white focus:border-blue-600 outline-none transition-all shadow-inner uppercase"
                        required
                     />
                  </div>
               </div>

               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider text-center bg-[#161b22] p-4 rounded-xl border border-white/5 italic">
                  Registry Update: Once you submit, your payment will enter the verification stage. Please ensure the TRX ID is accurate for rapid ledger synchronization.
               </p>

               <div className="flex gap-4">
                  <button 
                    disabled={isPaying}
                    type="submit"
                    className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] font-bold text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl active:scale-95 border-none cursor-pointer"
                  >
                     {isPaying ? 'Syncing...' : 'Submit Proof'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPaymentModal(null)} 
                    className="px-6 py-4 bg-[#0d1117] text-slate-400 border border-white/5 rounded-[20px] font-bold text-[10px] uppercase tracking-wider transition-all border-none cursor-pointer"
                  >
                     Abort
                  </button>
               </div>
            </form>
         )}
      </Modal>

      {/* Terms Acceptance Modal */}
      <Modal isOpen={!!acceptTermsModal} onClose={() => !isAccepting && setAcceptTermsModal(null)} title="Legal Disclosure & Terms Acceptance" size="md">
         {acceptTermsModal && (
            <div className="space-y-6">
               <div className="bg-[#020617] p-8 rounded-[32px] text-white overflow-hidden relative border border-white/5">
                  <div className="absolute inset-0 bg-blue-600/5 blur-3xl"></div>
                  <div className="relative z-10 flex justify-between items-center mb-6">
                     <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Financial Summary</p>
                     <StatusBadge status={acceptTermsModal.status} />
                  </div>
                  <div className="relative z-10 grid grid-cols-2 gap-6 text-center">
                     <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Principal</p>
                        <p className="text-xl font-bold">K{Number(acceptTermsModal.principalAmount).toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Interest</p>
                        <p className="text-xl font-bold">{acceptTermsModal.interestRate}% Monthly</p>
                     </div>
                     <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Initiation Fee</p>
                        <p className="text-xl font-bold">K{Number(acceptTermsModal.initiationFee).toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Duration</p>
                        <p className="text-xl font-bold">{acceptTermsModal.duration} Months</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-3 px-1">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={14} className="text-blue-500" /> Contract Disclosure
                  </h4>
                  <div 
                    ref={termsRef}
                    onScroll={(e) => {
                      const { scrollTop, scrollHeight, clientHeight } = e.target;
                      if (scrollHeight - scrollTop <= clientHeight + 20) {
                        setScrolledToBottom(true);
                      }
                    }}
                    className="h-48 overflow-y-auto bg-[#0d1117] rounded-2xl p-6 text-[11px] text-slate-300 font-medium leading-relaxed border border-[#30363d] scrollbar-thin scrollbar-thumb-slate-800"
                  >
                     <p className="mb-4">This Loan Agreement is entered into between ARKAD FINANCE and the undersigned Borrower. By accepting these terms, you agree to the following financial conditions:</p>
                     <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>You acknowledge receipt of the principal amount of K{Number(acceptTermsModal.principalAmount).toLocaleString()}.</li>
                        <li>Interest will accrue at a fixed rate of {acceptTermsModal.interestRate}% per month.</li>
                        <li>A late penalty of {acceptTermsModal.latePenaltyRate}% per month will be applied to overdue balances after a {acceptTermsModal.graceDays} day grace period.</li>
                        <li>Payments are due on the {acceptTermsModal.dueDay}th of each month.</li>
                        <li>Default on payments may lead to account suspension and referral to collection authorities.</li>
                     </ul>
                     <p className="font-bold text-blue-400">Please scroll to the bottom to authorize this lifecycle.</p>
                     <div className="h-4"></div>
                     <p className="text-white opacity-40">*** END OF DISCLOSURE ***</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 p-4 bg-[#161b22] rounded-2xl border border-[#30363d]">
                  <input 
                    type="checkbox" 
                    id="accept" 
                    disabled={!scrolledToBottom} 
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="w-5 h-5 rounded accent-blue-600 disabled:opacity-20 cursor-pointer"
                  />
                  <label htmlFor="accept" className={`text-[10px] font-bold uppercase tracking-wider ${scrolledToBottom ? 'text-white' : 'text-slate-500'}`}>
                     {scrolledToBottom ? 'I accept the financial terms and conditions' : 'Scroll to authorize acceptance'}
                  </label>
               </div>

               <button 
                 disabled={!accepted || isAccepting}
                 onClick={async () => {
                    setIsAccepting(true);
                    try {
                       const res = await api.put(`/client/loans/${acceptTermsModal.id}/accept-terms`);
                       if (res.data.success) {
                          alert('TERMS AUTHORIZED: Your loan is now in the final funding stage.');
                          window.location.reload();
                       }
                    } catch (err) {
                       alert(err.response?.data?.message || 'Error accepting terms');
                    } finally {
                       setIsAccepting(false);
                    }
                 }}
                 className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-widest hover:bg-[#020617] disabled:bg-slate-800 disabled:text-slate-600 transition-all shadow-xl active:scale-95 border-none cursor-pointer flex items-center justify-center gap-3"
               >
                  {isAccepting ? 'Synchronizing Signature...' : 'Finalize & Accept'}
               </button>
            </div>
         )}
      </Modal>

    </div>
  );
}
