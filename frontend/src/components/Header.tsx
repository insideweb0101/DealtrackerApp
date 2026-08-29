import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MdNotifications, MdPersonCircle } from 'react-icons/md';

const Header: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.alerts);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Deal Tracker</h2>
        <p className="text-sm text-gray-500">Manage your sales pipeline</p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <MdNotifications size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <MdPersonCircle size={32} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
