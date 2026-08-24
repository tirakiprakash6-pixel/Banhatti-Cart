import React from 'react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  return (
    <header id="main-header" className="w-full bg-white pt-5 pb-4 px-4 text-center border-b border-gray-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-center gap-2.5">
        {/* Brand Logo & Title */}
        <div className="w-10 h-10 rounded-xl bg-orange-500 shadow-sm flex items-center justify-center text-white text-xl shrink-0">
          <span>🛵</span>
        </div>
        <div className="text-left">
          <h1 className="text-lg font-black text-gray-900 tracking-tight leading-tight">
            {settings.storeName || 'Banhatti Cart'}
          </h1>
          <p className="text-[11px] text-gray-500 font-medium">
            Fast Local Delivery in Banhatti
          </p>
        </div>
      </div>
    </header>
  );
};



