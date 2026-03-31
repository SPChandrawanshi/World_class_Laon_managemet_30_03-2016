import React from 'react';
import { Star } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';
import { PageHeader } from '../../components/UI';

export default function AdminMembership() {
  const { membershipConfig, updateConfig } = useConfig();

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader 
        title="Membership Plans" 
        subtitle="Manage the pricing, duration, and trial offers for platform memberships" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {['monthly', 'yearly'].map(plan => (
           <div key={plan} className="bg-[#161b22] p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner overflow-hidden relative">
                       <div className={`absolute inset-0 opacity-20 ${plan === 'monthly' ? 'bg-blue-600' : 'bg-blue-600'}`}></div>
                       <Star size={18} className={plan === 'monthly' ? 'text-blue-600 relative z-10' : 'text-blue-600 relative z-10'} />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-white uppercase tracking-tight">{plan} Plan</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">Platform Access</p>
                    </div>
                 </div>
                 <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${plan === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-blue-50 text-blue-600'}`}>
                    {plan === 'monthly' ? 'Standard' : 'Value'}
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Price (K)</label>
                    <input 
                       type="number"
                       value={membershipConfig[plan].price}
                       onChange={(e) => updateConfig(plan, 'price', Number(e.target.value))}
                       className="w-full px-4 py-3 bg-[#0d1117] border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-[#1c2128] transition-all shadow-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Days</label>
                    <input 
                       type="number"
                       value={membershipConfig[plan].duration}
                       onChange={(e) => updateConfig(plan, 'duration', Number(e.target.value))}
                       className="w-full px-4 py-3 bg-[#0d1117] border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-[#1c2128] transition-all shadow-sm"
                    />
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0d1117] rounded-2xl border border-gray-100 mt-2">
                 <div>
                    <div className="flex items-center gap-1.5 mb-1">
                       <Star size={12} className="text-amber-500" />
                       <p className="text-[11px] font-bold text-white uppercase tracking-tight leading-none">Free Trial Offer</p>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-tight">Enable 14-day trial for new users</p>
                 </div>
                 <div 
                   onClick={() => updateConfig(plan, 'trial', !membershipConfig[plan].trial)}
                   className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 shadow-inner ${membershipConfig[plan].trial ? 'bg-blue-600' : 'bg-gray-300'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 bg-[#161b22] rounded-full transition-all duration-300 shadow-sm ${membershipConfig[plan].trial ? 'right-1' : 'left-1'}`}></div>
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
