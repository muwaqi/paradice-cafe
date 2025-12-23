import React, { useState, useEffect, useMemo } from 'react';
import { Coffee, MapPin, Phone, Clock, Star, Mail, Menu as MenuIcon, ArrowRight } from 'lucide-react';
import { MenuItem, Category, Banner, Offer, MenuPage, RestaurantSettings } from './types';
import { MenuItemCard } from './components/MenuItemCard';
import { EmptyState } from './components/EmptyState';
import { AdminPanel } from './components/AdminPanel';
import { LegalModal } from './components/LegalModal';
import { AISommelier } from './components/AISommelier';
import { subscribeToData, updateData } from './services/firebaseService';

const App: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>({
    days: 'Monday - Sunday',
    hours: '11:00 AM - 11:30 PM'
  });
  
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [scrolled, setScrolled] = useState(false);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [isLoading, setIsLoading] = useState(true);
  const [activeLegal, setActiveLegal] = useState<'privacy' | 'terms' | 'accessibility' | null>(null);

  useEffect(() => {
    // Consolidated subscriptions for robustness
    const unsubItems = subscribeToData('menuItems', (data) => {
      setItems(data ? (Array.isArray(data) ? data : Object.values(data)) : []);
      setIsLoading(false);
    });
    const unsubBanners = subscribeToData('banners', (data) => setBanners(data ? (Array.isArray(data) ? data : Object.values(data)) : []));
    const unsubOffers = subscribeToData('offers', (data) => setOffers(data ? (Array.isArray(data) ? data : Object.values(data)) : []));
    const unsubPages = subscribeToData('menuPages', (data) => setMenuPages(data ? (Array.isArray(data) ? data : Object.values(data)) : []));
    const unsubSettings = subscribeToData('settings', (data) => data && setSettings(data));

    return () => {
      unsubItems(); unsubBanners(); unsubOffers(); unsubPages(); unsubSettings();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') setView(v => v === 'admin' ? 'customer' : 'admin');
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => setCurrentBannerIdx(i => (i + 1) % banners.length), 8000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const filteredItems = useMemo(() => 
    activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory)
  , [items, activeCategory]);

  if (view === 'admin') {
    return (
      <AdminPanel 
        menuItems={items} banners={banners} offers={offers} menuPages={menuPages} settings={settings}
        onUpdateMenu={(d) => updateData('menuItems', d)}
        onUpdateBanners={(d) => updateData('banners', d)}
        onUpdateOffers={(d) => updateData('offers', d)}
        onUpdateMenuPages={(d) => updateData('menuPages', d)}
        onUpdateSettings={(d) => updateData('settings', d)}
        onExit={() => setView('customer')}
      />
    );
  }

  const currentBanner = banners[currentBannerIdx];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 selection:bg-gold/20 scroll-smooth selection:text-gold">
      <LegalModal type={activeLegal} onClose={() => setActiveLegal(null)} />
      <AISommelier menuItems={items} />

      {/* Navigation */}
      <nav className={`fixed w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-obsidian-950/80 backdrop-blur-2xl py-4 border-b border-white/5' : 'bg-transparent py-10'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center bg-black/40 group-hover:scale-110 transition-transform">
              <Coffee className="text-gold" size={24} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black text-white leading-none">Paradise</span>
              <span className="text-[8px] font-black tracking-[0.4em] uppercase text-gold mt-1">Cafe & Restaurant</span>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-12 items-center">
            {['Home', 'Menu', 'Gallery', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors relative group py-2">
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500"></span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {banners.length > 0 ? banners.map((b, i) => (
            <div key={b.id} className={`absolute inset-0 transition-opacity duration-[3s] ${i === currentBannerIdx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}>
              <img src={b.imageUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-transparent to-obsidian-950"></div>
            </div>
          )) : <div className="absolute inset-0 bg-obsidian-950"></div>}
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-gold/20 bg-black/40 backdrop-blur-md mb-8">
            <Star size={10} className="text-gold fill-gold" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold">Award Winning Excellence</span>
            <Star size={10} className="text-gold fill-gold" />
          </div>
          <h1 className="text-6xl md:text-[9rem] font-serif font-black leading-none mb-10 text-white drop-shadow-2xl">
            {currentBanner?.title || 'Paradise'}
          </h1>
          <p className="text-xl md:text-2xl font-light italic text-slate-300 max-w-3xl mx-auto mb-16 leading-relaxed">
            {currentBanner?.subtitle || 'Defining the modern era of culinary luxury in Jammu & Kashmir.'}
          </p>
          <div className="flex gap-6 justify-center">
            <a href="#menu" className="px-12 py-5 bg-gold text-obsidian-950 font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-gold/20">Explore Menu</a>
          </div>
        </div>
      </header>

      {/* Menu Section */}
      <section id="menu" className="py-40 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-32">
            <span className="text-gold text-[10px] font-black tracking-[0.5em] uppercase mb-6 block opacity-50">Our Collection</span>
            <h2 className="text-5xl md:text-8xl font-serif font-bold mb-10 text-white">Culinary Menu</h2>
            <div className="w-24 h-px bg-gold/30 mx-auto"></div>
          </div>

          <div className="min-h-[60vh]">
            {menuPages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {menuPages.map(page => (
                  <div key={page.id} className="relative aspect-[1/1.4] rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
                    <img src={page.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Menu" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex justify-center flex-wrap gap-4 mb-24">
                  {['All', 'Starters', 'Mains', 'Desserts', 'Drinks'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-10 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border transition-all ${activeCategory === cat ? 'bg-gold border-gold text-obsidian-950 shadow-xl' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/30'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-20"><div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div></div>
                ) : filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredItems.map(item => <MenuItemCard key={item.id} item={item} />)}
                  </div>
                ) : <EmptyState />}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-40 border-t border-white/5 bg-black/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 mb-32">
            <div className="space-y-10">
              <div className="flex items-center gap-5">
                <Coffee className="text-gold" size={32} />
                <h3 className="font-serif text-4xl font-bold text-white">Paradise</h3>
              </div>
              <p className="text-lg text-slate-400 font-light italic leading-relaxed">"Experience a sanctuary where flavor and elegance meet in perfect harmony."</p>
              <div className="flex gap-6">
                {[Mail, Phone, MapPin].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-gold hover:border-gold transition-all"><Icon size={20} /></a>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="text-[10px] font-black tracking-[0.5em] uppercase text-gold/60">Find Us</h5>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="text-gold mt-1" size={18} />
                  <p className="text-slate-300 font-light leading-relaxed">NH444 BK Pora, Suthsoo, <br/> Jammu and Kashmir 192121</p>
                </div>
                <div className="flex gap-4 items-center">
                  <Phone className="text-gold" size={18} />
                  <p className="text-2xl font-serif text-white tracking-tight">+91 7889966218</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <h5 className="text-[10px] font-black tracking-[0.5em] uppercase text-gold/60">Service Hours</h5>
               <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2 block">{settings.days}</span>
                  <p className="text-3xl font-serif text-white mb-6">{settings.hours}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Last order 30m before close</p>
               </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
            <span>&copy; 2024 Paradise Cafe & Restaurant.</span>
            <div className="flex gap-8">
              {['privacy', 'terms', 'accessibility'].map(d => (
                <button key={d} onClick={() => setActiveLegal(d as any)} className="hover:text-white transition-colors">{d}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;