import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, CreditCard, User,
  Shield, ClipboardList, LogOut, Menu, X, ChevronRight, Search, Gift, Star,
  Calendar, Briefcase, DollarSign, Bell, Sliders, History, Target, Image
} from 'lucide-react';
import logo from '../assets/finance_logo.png';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../theme';

const NAV = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, detail: 'Network Overview' },
  { path: '/admin/staff', label: 'Nodes / Staff', icon: Briefcase, detail: 'Partner Registry' },
  { path: '/admin/borrowers', label: 'Borrowers', icon: Users, detail: 'Client Ledger' },
  { path: '/admin/loans', label: 'Loans', icon: CreditCard, detail: 'Asset Management' },
  { path: '/admin/payments', label: 'Payments', icon: DollarSign, detail: 'Global Treasury' },
  { path: '/admin/calendar', label: 'Calendar', icon: Calendar, detail: 'Due Windows' },
  { path: '/admin/commission', label: 'Commission', icon: Target, detail: 'Yield Tracking' },
  { path: '/admin/collateral', label: 'Collateral', icon: Image, detail: 'Document Registry' },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell, detail: 'Message Nodes' },
  { path: '/admin/settings', label: 'Settings', icon: Sliders, detail: 'System Config' },
  { path: '/admin/admins', label: 'System Control', icon: Shield, detail: 'Governance' },
];

const C = THEME.role.admin;

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Reset scroll on navigation
  React.useEffect(() => {
    
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.scrollTop = 0;
  }, [location.pathname]);

  const isActive = (p) => location.pathname.startsWith(p);

  const handleLogout = () => { logout(); navigate('/login'); setIsSidebarOpen(false); };

  const SidebarContent = ({ onLinkClick, isCollapsed = false }) => (
    <>
      <div className={`flex items-center gap-3 px-6 py-6 border-b border-[#30363d] ${isCollapsed ? 'flex-col gap-6 justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 shadow-lg shadow-blue-600/20 text-white font-bold text-sm flex-shrink-0">
          <LayoutDashboard size={20} />
        </div>
        {!isCollapsed ? (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
            <h1 className="text-lg font-bold text-white tracking-tight uppercase leading-none">Global <span className='text-blue-500'>Loan</span></h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mt-1 opacity-80 leading-none">Admin Control</p>
          </div>
        ) : null}
        
        {/* Desktop Toggle Button inside Sidebar */}
        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="relative z-10 cursor-pointer hidden lg:flex w-8 h-8 items-center justify-center rounded-xl bg-[#161b22]/10 text-white hover:bg-blue-600 transition-all border border-[#30363d] active:scale-95 group"
        >
          <Menu size={16} className={`${isSidebarCollapsed ? '' : 'rotate-180'} transition-transform duration-500`} />
        </button>
      </div>

      {!isCollapsed && (
        <div className="mx-4 mt-6 mb-3 p-4 rounded-3xl bg-[#0d1117] border border-[#30363d] flex items-center gap-4 group transition-all hover:bg-[#1c2128] animate-in fade-in zoom-in-95 duration-300 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
            {user?.initials || 'AD'}
          </div>
          <div className="min-w-0">
            <p className="text-[#e6edf3] text-xs font-bold uppercase tracking-tight truncate">{user?.name}</p>
            <p className="text-[#8b949e] text-[9px] font-bold uppercase tracking-wider">Super Control</p>
          </div>
        </div>
      )}

      <nav className={`flex-1 px-3 py-4 space-y-2 overflow-y-auto min-h-0 custom-scrollbar mt-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {NAV.map(({ path, label, icon: Icon, detail }) => {
          const active = isActive(path);
          return (
            <Link key={path} to={path} onClick={onLinkClick}
              title={isCollapsed ? label : ''}
              className={`flex items-center gap-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${isCollapsed ? 'w-12 h-12 justify-center px-0 py-0' : 'px-4 py-4'} ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 active:scale-95 border-blue-700' : 'text-[#8b949e] hover:bg-[#1c2128]/10 hover:text-white'
                }`}>
              <Icon size={18} className={active ? 'text-white' : 'text-[#6e7681]'} />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{label}</span>}
                  {!isCollapsed && active && <ChevronRight size={14} className="ml-auto text-white/50" />}
                </div>
                {!isCollapsed && <span className="text-[7px] text-white/40 font-bold uppercase tracking-widest mt-0.5 leading-none">{detail}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={`px-4 pb-8 pt-4 border-t border-[#30363d] mt-auto ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button onClick={handleLogout}
          title={isCollapsed ? 'Sign Out' : ''}
          className={`relative z-10 cursor-pointer flex items-center gap-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-[11px] font-bold uppercase tracking-wider ${isCollapsed ? 'w-12 h-12 justify-center px-0' : 'w-full px-4 py-4'}`}>
          <LogOut size={18} /> 
          {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#0d1117] overflow-hidden">
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-50 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-[240px] z-[60] lg:hidden transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col bg-[#161b22] border-r border-[#30363d] shadow-2xl ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'
          }`}
      >
        <SidebarContent onLinkClick={() => setIsSidebarOpen(false)} />
        <button onClick={() => setIsSidebarOpen(false)} className="relative z-10 cursor-pointer absolute top-6 right-4 w-10 h-10 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 flex items-center justify-center hover:bg-blue-500 hover:scale-110 transition-all border border-blue-400"
        >
          <X size={20} />
        </button>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-[#161b22] shadow-2xl border-r border-[#30363d] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 ${isSidebarCollapsed ? 'w-20' : 'w-[240px]'}`}>
        {SidebarContent({ onLinkClick: () => {}, isCollapsed: isSidebarCollapsed })}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 ">
        {/* Topbar */}
        <header className="flex items-center justify-between px-5 md:px-10 py-1 bg-[#161b22]/95 border-b border-[#30363d] sticky top-0 z-40 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="relative z-10 cursor-pointer lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-[#0d1117] text-[#e6edf3] hover:bg-blue-600 hover:text-white transition-all border border-[#30363d] active:scale-95 group"
            >
              <Menu size={22} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>

            <div className="flex items-center gap-2 lg:hidden">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-lg font-bold text-white tracking-tight uppercase leading-none">GLOBAL<span className="text-blue-500"> LOAN</span></h1>
      </div>
            {/* Desktop Brand indicator if collapsed */}
            {isSidebarCollapsed && (
              <div className="hidden lg:flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-xl font-bold text-white tracking-tight uppercase leading-none">LOAN<span className="text-blue-500">APP</span></h1>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex relative group md:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Records..." 
                onKeyDown={(e) => e.key === 'Enter' && alert(`SEARCHING RECORODS: Query "${e.target.value}" submitted to network registry.`)}
                className="pl-11 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-2xl text-[10px] font-bold uppercase tracking-wider text-[#e6edf3] placeholder:text-[#6e7681] focus:border-blue-600 focus:bg-[#1c2128] outline-none w-full transition-all shadow-sm cursor-text"
              />
            </div>
            <Link to="/admin/profile" className="flex items-center gap-2 p-1 md:p-1.5 pr-4 md:pr-5 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-blue-500/50 transition-all active:scale-95 group shadow-sm">
              <div className="w-7.5 h-7.5 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xl shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
                {user?.initials || 'AD'}
              </div>
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-[#e6edf3] uppercase tracking-tight leading-none mb-0.5 whitespace-nowrap">{user?.name?.split(' ')[0]}</span>
                <span className="text-[8px] font-bold text-blue-500 uppercase tracking-wider leading-none">Admin</span>
              </div>
            </Link>
          </div>
        </header>



        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-32 lg:pb-8 overflow-y-auto w-full max-w-[1600px] mx-auto not-italic bg-[#0d1117]">
          <div className="animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>

        {/* Improved Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#161b22]/95 backdrop-blur-xl border-t border-[#30363d] shadow-lg z-40 px-2 pb-safe-area-inset-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto h-16">
            {[...NAV.slice(0, 4), { path: '/admin/profile', label: 'Me', icon: User }].map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              const displayLabel = label.toLowerCase().includes('profile') ? 'Me' : label.split(' ')[0];
              return (
                <Link key={path} to={path}
                  className={`relative flex flex-col items-center justify-center w-14 h-12 transition-all duration-300 ${active ? 'text-blue-500 translate-y-[-2px]' : 'text-[#6e7681]'}`}>
                  {active && <div className="absolute top-[-8px] w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
                  <Icon size={20} strokeWidth={active ? 3 : 2} />
                  <span className={`text-[8px] font-bold mt-1 uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-60'}`}>{displayLabel}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
