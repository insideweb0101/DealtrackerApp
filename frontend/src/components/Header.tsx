import React from 'react';
import { MdOutlineInfo } from 'react-icons/md';

const Header: React.FC = () => (
  <header className="flex min-h-[68px] items-center justify-between border-b border-[#e8ece6] bg-white px-5 md:px-8">
    <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#739080]">Infrastructure intelligence</p><p className="mt-0.5 text-sm font-medium text-[#18332f]">Global data center landscape</p></div>
    <div className="hidden items-center gap-2 rounded-full bg-[#f2f6f1] px-3 py-2 text-[11px] text-[#527264] sm:flex"><MdOutlineInfo className="text-base" /> Sample data · verify before use</div>
  </header>
);

export default Header;
