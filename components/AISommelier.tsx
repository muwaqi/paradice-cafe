
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, X, ChefHat, Music } from 'lucide-react';
import { getAISuggestions } from '../services/geminiService';
import { MenuItem } from '../types';

interface AISommelierProps {
  menuItems: MenuItem[];
}

export const AISommelier: React.FC<AISommelierProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [recommendations, setRecommendations] = useState<{item: MenuItem, reason: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [recommendations, isThinking]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || isThinking) return;

    setIsThinking(true);
    setRecommendations([]);
    
    try {
      const suggestions = await getAISuggestions(query, menuItems);
      const recs = suggestions.map((s: any) => {
        const item = menuItems.find(i => i.id === s.itemId);
        return item ? { item, reason: s.reason } : null;
      }).filter(Boolean);
      
      setRecommendations(recs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-8 z-[90] bg-emerald-500 text-paradise-950 p-5 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:scale-110 active:scale-95 transition-all group animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <Sparkles size={28} className="group-hover:rotate-45 transition-transform duration-500" />
      </button>

      {/* Sommelier Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
          <div className="bg-paradise-950 border border-emerald-500/30 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-emerald-950/20">
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <ChefHat size={32} />
                  <div className="absolute inset-0 bg-emerald-500 opacity-10 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-serif text-white tracking-tight">AI Concierge</h2>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase">Private Consultation</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Chat/Content Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              {!recommendations.length && !isThinking ? (
                <div className="text-center py-20 space-y-12">
                  <p className="text-slate-300 text-2xl font-serif italic max-w-md mx-auto leading-relaxed">
                    "Allow me to curate your journey. Tell me about your mood, your cravings, or the occasion."
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'A Romantic Evening', query: 'I want something romantic and delicate' },
                      { label: 'Bold & Spicy', query: 'Something bold and intensely spicy' },
                      { label: 'Chef\'s Best', query: 'Show me the signature masterpieces' },
                      { label: 'Light Garden Fresh', query: 'Something very light and vegetable forward' }
                    ].map(mood => (
                      <button 
                        key={mood.label}
                        onClick={() => setQuery(mood.query)}
                        className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-slate-400 hover:border-emerald-500/50 hover:text-white hover:bg-emerald-500/5 transition-all uppercase"
                      >
                        {mood.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-16">
                  {isThinking && (
                    <div className="flex flex-col items-center py-20 animate-pulse">
                      <Loader2 className="animate-spin text-emerald-500 mb-6" size={48} strokeWidth={1} />
                      <p className="text-emerald-500/70 text-[11px] tracking-[0.5em] uppercase font-black">Consulting the Gastronomic Archives...</p>
                    </div>
                  )}
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-10 animate-fade-in-up group" style={{ animationDelay: `${idx * 300}ms` }}>
                      <div className="w-full md:w-48 aspect-square rounded-[2rem] overflow-hidden shrink-0 border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-105">
                        <img src={rec.item.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-emerald-500/50 font-mono text-xs">0{idx+1}</span>
                            <div className="h-[1px] w-8 bg-emerald-500/20"></div>
                            <h4 className="text-gold-500 font-serif text-3xl tracking-tight">{rec.item.name}</h4>
                        </div>
                        <p className="text-slate-300 text-lg leading-relaxed italic font-light">"{rec.reason}"</p>
                        <div className="pt-4">
                            <span className="text-slate-600 text-[10px] font-black tracking-widest uppercase">In the {rec.item.category} Section</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!isThinking && recommendations.length > 0 && (
                    <div className="text-center pt-10">
                        <button 
                          onClick={() => { setRecommendations([]); setQuery(''); }}
                          className="text-slate-600 text-[10px] font-black tracking-[0.4em] uppercase hover:text-emerald-500 transition-colors"
                        >
                            Reset Consultation
                        </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleAsk} className="p-10 bg-black/40 border-t border-white/5 backdrop-blur-3xl">
              <div className="relative group">
                <input 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="E.g. I am in the mood for something rich yet balanced..."
                  className="w-full bg-paradise-950 border border-white/10 rounded-[2rem] pl-8 pr-24 py-7 text-white text-lg font-light focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 shadow-inner group-hover:border-white/20"
                />
                <button 
                  type="submit"
                  disabled={!query || isThinking}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-500 text-paradise-950 rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
