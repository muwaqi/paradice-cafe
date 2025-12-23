import React from 'react';
import { ChefHat } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gold-500 blur-[40px] opacity-10 rounded-full animate-pulse-slow"></div>
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-full border border-gold-500/20 shadow-2xl">
          <ChefHat className="w-16 h-16 text-gold-500 opacity-80" strokeWidth={1} />
        </div>
      </div>
      <h3 className="text-4xl font-serif text-white mb-4 tracking-tight">
        Awaiting Creation
      </h3>
      <p className="text-slate-400 max-w-lg mx-auto text-lg font-light leading-relaxed">
        Our chefs are currently curating a seasonal menu of exquisite flavors. 
        <br/>Please check back shortly for the reveal.
      </p>
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mt-10"></div>
    </div>
  );
};