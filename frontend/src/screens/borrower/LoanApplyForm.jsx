import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Calendar, FileText, MapPin, 
  MessageCircle, Building, Info, ChevronRight, ChevronLeft, CheckCircle
} from 'lucide-react';
import api from '../../api/axios';

export default function LoanApplyForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [durationMode, setDurationMode] = useState('monthly'); // monthly | quarterly | yearly
  const [form, setForm] = useState({
    amount: '',
    duration: 1,
    description: '',
    method: 'cash',
    address: '',
    whatsapp: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-8 animate-in zoom-in-95 duration-700">
        <div className="w-24 h-24 rounded-[40px] bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
           <CheckCircle size={48} strokeWidth={3} />
        </div>
        <div className="space-y-4">
           <h2 className="text-4xl font-bold text-white uppercase tracking-tight leading-none">Application Submitted!</h2>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider max-w-sm mx-auto leading-loose">
              Your loan application has been received and is being processed. Admin verification is in progress.
           </p>
        </div>
        <button 
          onClick={() => navigate('/app/dashboard')}
          className="px-12 py-5 bg-[#020617] text-white rounded-[24px] font-bold text-[12px] uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 border-none cursor-pointer"
        >
           Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
        {[1, 2, 3].map(s => (
          <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
            step === s ? 'bg-blue-600 text-white scale-110' : 
            step > s ? 'bg-green-500 text-white' : 'bg-[#161b22] text-gray-400 border border-gray-100'
          }`}>
            {step > s ? <CheckCircle size={18} /> : s}
          </div>
        ))}
      </div>

      <div className="bg-[#161b22] rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 p-8 md:p-12">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Loan Details</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">How much do you need?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Amount Requested ($)</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold pointer-events-none z-10">$</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={form.amount} 
                    onChange={e => update('amount', e.target.value)}
                    className="w-full pl-10 pr-6 py-4 bg-[#0d1117] border-2 border-transparent rounded-2xl text-lg font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 focus:bg-[#161b22] outline-none transition-all cursor-text text-white" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</label>

                {/* Mode Tabs */}
                <div className="flex p-1 bg-[#0d1117] rounded-2xl gap-1">
                  {[
                    { key: 'monthly',   label: 'Monthly' },
                    { key: 'quarterly', label: 'Quarterly' },
                    { key: 'yearly',    label: 'Yearly' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setDurationMode(key);
                        update('duration', key === 'monthly' ? 1 : key === 'quarterly' ? 3 : 12);
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${
                        durationMode === key ? 'bg-blue-600 text-white shadow' : 'text-gray-400 bg-transparent hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Monthly: slider 1–12 */}
                {durationMode === 'monthly' && (
                  <div className="flex items-center gap-4 pt-1">
                    <input type="range" min="1" max="12" step="1" value={form.duration}
                      onChange={e => update('duration', Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <span className="w-14 text-center font-bold text-blue-600 text-sm">{form.duration}m</span>
                  </div>
                )}

                {/* Quarterly: 3, 6, 9, 12 months */}
                {durationMode === 'quarterly' && (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[3, 6, 9, 12].map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => update('duration', q)}
                        className={`py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer border-2 ${
                          form.duration === q
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[#0d1117] text-gray-400 border-[#30363d] hover:border-blue-600 hover:text-white'
                        }`}
                      >
                        {q === 3 ? 'Q1' : q === 6 ? 'Q2' : q === 9 ? 'Q3' : 'Q4'}
                        <span className="block text-[8px] opacity-60 mt-0.5">{q} mo</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Yearly: 1–5 years */}
                {durationMode === 'yearly' && (
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {[12, 24, 36, 48, 60].map(y => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => update('duration', y)}
                        className={`py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer border-2 ${
                          form.duration === y
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[#0d1117] text-gray-400 border-[#30363d] hover:border-blue-600 hover:text-white'
                        }`}
                      >
                        {y / 12}Y
                        <span className="block text-[8px] opacity-60 mt-0.5">{y} mo</span>
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider text-center">
                  Selected: <span className="text-blue-500">{form.duration} months</span>
                  {durationMode === 'yearly' && <span className="text-slate-400"> ({form.duration / 12} year{form.duration > 12 ? 's' : ''})</span>}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Why do you need this loan?</label>
                <textarea 
                  rows="3" 
                  placeholder="Description..." 
                  value={form.description} 
                  onChange={e => update('description', e.target.value)}
                  className="w-full px-6 py-4 bg-[#0d1117] border-2 border-transparent rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 focus:bg-[#161b22] outline-none transition-all cursor-text text-white" 
                />
              </div>
            </div>

            <button 
              onClick={() => {
                if (!form.amount || parseFloat(form.amount) <= 0) {
                  alert('REGISTRATION ERROR: Please input a valid capital amount to initialize this loan stream.');
                  return;
                }
                setStep(2);
              }}
              className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold text-[12px] uppercase tracking-wider shadow-2xl shadow-blue-200 hover:bg-[#020617] transition-all active:scale-95 flex items-center justify-center gap-3 border-none cursor-pointer group"
            >
              Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Disbursement Method</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">How should we send the money?</p>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-2xl">
               <button onClick={() => update('method', 'cash')}
                 className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${form.method === 'cash' ? 'bg-[#161b22] text-blue-600 shadow-sm' : 'text-gray-400 bg-transparent'}`}>
                 Cash Delivery
               </button>
               <button onClick={() => update('method', 'wire')}
                 className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${form.method === 'wire' ? 'bg-[#161b22] text-blue-600 shadow-sm' : 'text-gray-400 bg-transparent'}`}>
                 Wire Transfer
               </button>
            </div>

            <div className="space-y-6">
              {form.method === 'cash' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery Address</label>
                    <input type="text" placeholder="House No, Street, City" value={form.address} onChange={e => update('address', e.target.value)}
                      className="w-full px-6 py-4 bg-[#0d1117] border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-text text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">WhatsApp Contact</label>
                    <input type="tel" placeholder="+123..." value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)}
                      className="w-full px-6 py-4 bg-[#0d1117] border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-text text-white" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Bank Name</label>
                    <input type="text" placeholder="e.g. Chase" value={form.bankName} onChange={e => update('bankName', e.target.value)}
                      className="w-full px-6 py-4 bg-[#0d1117] border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-text text-white" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Account (CLABE)</label>
                      <input type="text" placeholder="Account #" value={form.accountNumber} onChange={e => update('accountNumber', e.target.value)}
                        className="w-full px-6 py-4 bg-[#0d1117] border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-text text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Account Name</label>
                      <input type="text" placeholder="Full Name" value={form.accountName} onChange={e => update('accountName', e.target.value)}
                        className="w-full px-6 py-4 bg-[#0d1117] border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-text text-white" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="w-1/3 py-5 bg-[#1c2128] text-slate-400 rounded-[24px] font-bold text-[11px] uppercase tracking-wider hover:text-slate-900 transition-all active:scale-95 flex items-center justify-center gap-2 border-none cursor-pointer"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button 
                onClick={() => {
                  const isCash = form.method === 'cash';
                  if (isCash ? !form.address : (!form.bankName || !form.accountNumber)) {
                    alert('VALIDATION ERROR: Please complete the disbursement details to proceed.');
                    return;
                  }
                  setStep(3);
                }}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-wider shadow-2xl shadow-blue-200 hover:bg-[#020617] transition-all active:scale-95 flex items-center justify-center gap-3 border-none cursor-pointer group"
              >
                Review <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-6">
              <Info size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Review Application</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Almost there!</p>
            </div>
            
            {(() => {
               const amt = parseFloat(form.amount) || 0;
               const fees = { initiation: amt * 0.01, delivery: amt * 0.02, total: amt * 0.03 };
               return (
                 <div className="bg-[#0d1117] rounded-3xl p-6 text-left space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Requested Amount</span>
                       <span className="text-lg font-bold text-white">K{amt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                       <span className="text-sm font-bold text-white">{form.duration} months {form.duration >= 12 ? `(${form.duration / 12}yr${form.duration > 12 ? 's' : ''})` : ''}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Initiation Fee (1%)</span>
                       <span className="text-sm font-bold text-gray-600">${fees.initiation.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Method Fee (2%)</span>
                       <span className="text-sm font-bold text-gray-600">${fees.delivery.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-[11px] font-bold text-white uppercase tracking-wider">Total Fees Due</span>
                       <span className="text-lg font-bold text-blue-600">${fees.total.toFixed(2)}</span>
                    </div>
                 </div>
               );
            })()}

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(2)}
                className="w-1/3 py-5 bg-[#1c2128] text-slate-400 rounded-[24px] font-bold text-[11px] uppercase tracking-wider hover:text-slate-900 transition-all active:scale-95 border-none cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={async () => {
                  console.log("Button clicked", form);
                  setSubmitting(true);
                  setError('');
                  try {
                    console.log("Sending request");
                    const res = await api.post('/client/loans/apply', {
                      ...form,
                      amount: parseFloat(form.amount),
                      duration: parseInt(form.duration)
                    });
                    console.log("Response received", res);
                    if (res.data.success) {
                      setSubmitted(true);
                      setForm({
                        amount: '', duration: 1, description: '', method: 'cash', 
                        address: '', whatsapp: '', bankName: '', accountNumber: '', accountName: ''
                      });
                    }
                  } catch (err) {
                    console.error("API Error:", err);
                    setError(err.response?.data?.message || 'Failed to submit loan');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                disabled={submitting}
                className="flex-[2] py-5 bg-[#020617] relative text-white rounded-[24px] font-bold text-[11px] uppercase tracking-wider shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 border-none cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
                {error && <p className="text-red-500 text-[10px] text-center w-full absolute -top-8 left-0">{error}</p>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
