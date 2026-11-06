import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => (
  <div className="min-h-screen bg-[#f7f8f5] md:flex">
    <Sidebar />
    <div className="flex min-w-0 flex-1 flex-col"><Header /><main className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8"><Outlet /></main></div>
  </div>
);

export default Layout;
