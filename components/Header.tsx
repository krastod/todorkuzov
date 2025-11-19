import React from 'react';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <Zap className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AirdropScout BG
        </h1>
      </div>
      <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-400">
        <a href="#" className="hover:text-blue-400 transition-colors">Начало</a>
        <a href="#" className="hover:text-blue-400 transition-colors">За Нас</a>
      </nav>
    </header>
  );
};

export default Header;