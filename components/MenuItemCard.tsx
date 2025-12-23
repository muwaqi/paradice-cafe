
import React from 'react';
import { Leaf, Flame, ArrowRight, Star } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  return (
    <div className="group relative bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-white/5 hover:border-gold-500/40 transition-all duration-1000 hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col h-full">
      {/* Visual Canvas */}
      <div className="aspect-[1/1] w-full overflow-hidden relative shrink-0">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2.5s] ease-out" 
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-800">
             <span className="font-serif italic text-xl opacity-20 tracking-[0.3em] uppercase">The Collection</span>
          </div>
        )}
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-paradise-950 via-paradise-950/20 to-transparent opacity-90 transition-opacity"></div>

        {/* Status Indicators */}
        <div className="absolute top-8 right-8 flex flex-col gap-5">
          {item.isVegetarian && (
            <div className="bg-emerald-500/20 backdrop-blur-3xl border border-emerald-500/30 text-emerald-400 p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform" title="Vegetarian">
              <Leaf size={18} fill="currentColor" className="opacity-90" />
            </div>
          )}
          {item.isSpicy && (
            <div className="bg-red-500/20 backdrop-blur-3xl border border-red-500/30 text-red-400 p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform" title="Spicy">
              <Flame size={18} fill="currentColor" className="opacity-90" />
            </div>
          )}
        </div>

        {/* Recommendation Badge */}
        <div className="absolute top-8 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
             <div className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 backdrop-blur-md border border-gold-500/30 rounded-full text-gold-500 text-[9px] font-black tracking-[0.2em] uppercase">
                 <Star size={10} fill="currentColor" />
                 <span>Chef's Selection</span>
             </div>
        </div>

        {/* Price Embossment */}
        <div className="absolute bottom-10 left-10 flex flex-col gap-3">
             <span className="text-gold-500 font-serif text-4xl italic tracking-tighter drop-shadow-2xl">₹{item.price}</span>
             <div className="w-12 h-[1px] bg-gold-500/50 rounded-full group-hover:w-20 transition-all duration-1000"></div>
        </div>
      </div>
      
      {/* Information Section */}
      <div className="p-12 relative flex-1 flex flex-col">
        <div className="mb-8">
          <span className="text-[11px] font-black tracking-[0.5em] text-slate-600 uppercase mb-4 block group-hover:text-gold-500/60 transition-colors duration-700">{item.category}</span>
          <h3 className="font-serif text-4xl text-white leading-[1.1] tracking-tight group-hover:text-gold-500 transition-colors duration-1000">
            {item.name}
          </h3>
        </div>
        
        <p className="text-slate-400 text-[17px] font-light leading-relaxed mb-auto line-clamp-3 group-hover:text-slate-200 transition-colors duration-1000 italic">
          "{item.description}"
        </p>
        
        <div className="flex justify-between items-center pt-10 border-t border-white/5 mt-10">
            <button className="flex items-center gap-6 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.4em] group/btn transition-all duration-700">
                <span>The Narrative</span>
                <div className="w-10 h-[1px] bg-slate-800 group-hover/btn:w-20 group-hover/btn:bg-gold-500 transition-all duration-700"></div>
                <ArrowRight size={16} className="group-hover/btn:translate-x-3 transition-transform duration-700 text-gold-500" />
            </button>
        </div>
      </div>

      {/* Luxury Radiance Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-[2s] bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.4),transparent_70%)]"></div>
    </div>
  );
};
