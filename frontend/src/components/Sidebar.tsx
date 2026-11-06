import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdPublic, MdStorage } from 'react-icons/md';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/', label: 'Overview', icon: MdDashboard },
    { path: '/facilities', label: 'Facilities', icon: MdStorage },
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#102c2a] text-white md:min-h-screen md:w-[244px]">
      <Link to="/" className="flex items-center gap-3 border-b border-white/10 px-5 py-5 md:px-6 md:py-7">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c4f06b] text-xl text-[#17372f]"><MdPublic /></span>
        <span><span className="block text-sm font-semibold tracking-wide">DATA CENTERS</span><span className="mt-0.5 block text-[10px] uppercase tracking-[0.19em] text-emerald-100/60">Global tracker</span></span>
      </Link>
      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:gap-1 md:p-4">
        <p className="hidden px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100/45 md:block">Workspace</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path || (item.path === '/' && location.pathname === '/facilities');
          return <Link key={item.path} to={item.path} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? 'bg-white/10 font-medium text-[#d0f28f]' : 'text-emerald-50/70 hover:bg-white/5 hover:text-white'}`}><Icon className="text-lg" /><span>{item.label}</span></Link>;
        })}
      </nav>
      <div className="mt-auto hidden border-t border-white/10 p-5 text-[11px] leading-5 text-emerald-100/50 md:block">A growing view of digital infrastructure and its energy footprint.</div>
    </aside>
  );
};

export default Sidebar;
