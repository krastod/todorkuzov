import React, { useState } from 'react';
import { Search, Wallet } from 'lucide-react';

interface WalletInputProps {
  onSearch: (address: string) => void;
  isLoading: boolean;
}

const WalletInput: React.FC<WalletInputProps> = ({ onSearch, isLoading }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim().length > 10) {
      onSearch(address.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
        Провери своя портфейл за <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Скрити Аердропи
        </span>
      </h2>
      <p className="text-slate-400 mb-8 text-lg">
        Използвайте силата на AI, за да сканирате за активни claims и предстоящи възможности за вашия адрес.
      </p>
      
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-700 p-2 shadow-2xl">
            <div className="pl-3 text-slate-500">
                <Wallet className="w-6 h-6" />
            </div>
            <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Въведете адрес (0x... или Solana адрес)"
            className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-3 outline-none placeholder-slate-500 font-mono"
            disabled={isLoading}
            />
            <button
            type="submit"
            disabled={isLoading || address.length < 10}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                <span>Търси</span>
                <Search className="w-4 h-4" />
                </>
            )}
            </button>
        </div>
      </form>
      
      <div className="mt-4 flex justify-center space-x-4 text-xs text-slate-500">
        <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>EVM Compatible</span>
        <span className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Solana</span>
        <span className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Bitcoin</span>
      </div>
    </div>
  );
};

export default WalletInput;