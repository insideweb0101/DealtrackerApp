import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdHandshake, MdNotifications, MdPerson } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: MdDashboard },
    { path: '/deals', label: 'Deals', icon: MdHandshake },
    { path: '/alerts', label: 'Alerts', icon: MdNotifications },
    { path: '/profile', label: 'Profile', icon: MdPerson },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">DealTracker</h1>
        <p className="text-sm text-slate-400">Deal Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => dispatch(logout())}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
