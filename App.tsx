import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import WalletInput from './components/WalletInput';
import AirdropCard from './components/AirdropCard';
import StatsChart from './components/StatsChart';
import { analyzeAirdrops } from './services/geminiService';
import { AirdropItem, SearchResult, WalletType } from './types';
import { Info, Link as LinkIcon, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string>('');

  const handleSearch = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSearchedAddress(address);

    try {
      const data = await analyzeAirdrops(address);
      setResult(data);
    } catch (err) {
      setError("Възникна грешка при анализа на портфейла. Моля, опитайте отново по-късно.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] overflow-x-hidden selection:bg-blue-500/30">
      <Header />

      <main className="flex-grow px-4 md:px-8 pb-16">
        {/* Hero Section */}
        <div className={`${result ? 'py-8' : 'py-20'} transition-all duration-500`}>
          <WalletInput onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto mt-8 text-center animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-slate-800 rounded-xl"></div>
              <div className="h-64 bg-slate-800 rounded-xl"></div>
              <div className="h-64 bg-slate-800 rounded-xl"></div>
            </div>
            <p className="mt-6 text-blue-400 font-mono text-sm">Gemini AI анализира блокчейн екосистемата...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && !loading && (
          <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-up">
            
            {/* Status Banner */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
               <div className="flex-1">
                 <div className="flex items-center space-x-3 mb-4">
                   <div className="bg-slate-700 p-2 rounded-lg">
                     <ShieldCheck className="text-emerald-400 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold text-white">Анализ за: <span className="font-mono text-blue-400">{searchedAddress.slice(0,6)}...{searchedAddress.slice(-4)}</span></h3>
                     <p className="text-sm text-slate-400">Мрежа: {result.walletType}</p>
                   </div>
                 </div>
                 <p className="text-slate-300 italic border-l-4 border-blue-500 pl-4 py-1 bg-slate-900/30 rounded-r">
                   "{result.summary}"
                 </p>
               </div>
               
               {/* Simple Visualization */}
               <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                 <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Разпределение по категория</h4>
                 <StatsChart items={result.airdrops} />
               </div>
            </div>

            {/* Airdrop Grid */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-blue-500 w-1 h-8 mr-3 rounded-full"></span>
                Намерени Възможности
                <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                  {result.airdrops.length}
                </span>
              </h3>
              
              {result.airdrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.airdrops.map((drop, idx) => (
                    <AirdropCard key={idx} item={drop} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                  <p className="text-slate-400">Не са намерени активни публични аердропи за този тип портфейл в момента.</p>
                </div>
              )}
            </div>

            {/* Grounding Sources */}
            {result.groundingLinks && result.groundingLinks.length > 0 && (
              <div className="pt-8 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Източници на информация (Google Search)
                </h4>
                <div className="flex flex-wrap gap-3">
                  {result.groundingLinks.map((link, i) => (
                    <a 
                      key={i} 
                      href={link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-900/50 transition-colors"
                    >
                      <LinkIcon className="w-3 h-3 mr-1.5" />
                      {new URL(link).hostname}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-800">
        <p>© {new Date().getFullYear()} AirdropScout BG. Not financial advice.</p>
        <p className="mt-2 text-xs">Powered by Gemini 2.5 Flash & Google Search Grounding</p>
      </footer>
    </div>
  );
};

export default App;