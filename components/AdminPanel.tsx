
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Tag, 
  Plus, 
  Trash2, 
  Upload, 
  LogOut,
  ChefHat,
  FileImage,
  List,
  Clock,
  Save,
  IndianRupee,
  Image as ImageIcon,
  Search,
  Type
} from 'lucide-react';
import { MenuItem, Banner, Offer, MenuPage, RestaurantSettings } from '../types';
import { AdminModal } from './AdminModal';

interface AdminPanelProps {
  menuItems: MenuItem[];
  banners: Banner[];
  offers: Offer[];
  menuPages: MenuPage[];
  settings: RestaurantSettings;
  onUpdateMenu: (items: MenuItem[]) => void;
  onUpdateBanners: (banners: Banner[]) => void;
  onUpdateOffers: (offers: Offer[]) => void;
  onUpdateMenuPages: (pages: MenuPage[]) => void;
  onUpdateSettings: (settings: RestaurantSettings) => void;
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  menuItems,
  banners,
  offers,
  menuPages,
  settings,
  onUpdateMenu,
  onUpdateBanners,
  onUpdateOffers,
  onUpdateMenuPages,
  onUpdateSettings,
  onExit
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'banners' | 'offers' | 'settings'>('menu');
  const [menuMode, setMenuMode] = useState<'dishes' | 'pages'>('dishes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({});
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [tempSettings, setTempSettings] = useState<RestaurantSettings>(settings);

  // --- Robust Delete Handlers ---

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateMenu(menuItems.filter(item => item.id !== id));
  };

  const handleDeleteBanner = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateBanners(banners.filter(b => b.id !== id));
  };

  const handleDeleteOffer = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateOffers(offers.filter(o => o.id !== id));
  };

  const handleDeleteMenuPage = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateMenuPages(menuPages.filter(p => p.id !== id));
  };

  const handleAddItem = (item: MenuItem) => {
    onUpdateMenu([...menuItems, item]);
  };

  const handleUpdateBannerText = (id: string, field: 'title' | 'subtitle', value: string) => {
    const updatedBanners = banners.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    );
    onUpdateBanners(updatedBanners);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'offer' | 'menuPage') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'offer') {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewOffer(prev => ({ ...prev, imageUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
      });
      return;
    }
    
    const fileReaders: Promise<string>[] = Array.from(files).map((file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
    });

    Promise.all(fileReaders).then(images => {
        const timestamp = Date.now();
        if (type === 'banner') {
            const newBanners = images.map((img, i) => ({ id: `${timestamp}-${i}`, imageUrl: img }));
            onUpdateBanners([...banners, ...newBanners]);
        } else if (type === 'menuPage') {
            const newPages = images.map((img, i) => ({ id: `${timestamp}-${i}`, imageUrl: img }));
            onUpdateMenuPages([...menuPages, ...newPages]);
        }
    });
  };

  const handleSingleImageUploadForOffer = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setNewOffer(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setTempSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
      reader.readAsDataURL(file);
  }

  const handleAddOffer = () => {
    if (newOffer.title && newOffer.description) {
      onUpdateOffers([...offers, {
        id: Date.now().toString(),
        title: newOffer.title!,
        description: newOffer.description!,
        code: newOffer.code,
        discountAmount: newOffer.discountAmount,
        imageUrl: newOffer.imageUrl
      } as Offer]);
      setNewOffer({});
      setShowOfferForm(false);
    }
  };

  const handleSaveSettings = () => {
    onUpdateSettings(tempSettings);
    alert('Settings Saved!');
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSidebar = () => (
    <div className="w-64 bg-paradise-950 border-r border-white/5 flex flex-col h-full fixed left-0 top-0 z-[100]">
      <div className="p-8 border-b border-white/5 flex flex-col items-center text-center">
        <div className="flex items-center justify-center text-gold-500 mb-4">
            {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-gold-500/30 shadow-lg" />
            ) : (
                <ChefHat size={48} />
            )}
        </div>
        <span className="font-serif font-bold text-xl text-white">Paradise</span>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">Admin Control</div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
          { id: 'banners', label: 'Hero Banners', icon: LayoutDashboard },
          { id: 'offers', label: 'Discount Offers', icon: Tag },
          { id: 'settings', label: 'Settings', icon: Clock },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-gold-500 text-paradise-950 font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          type="button"
          onClick={onExit}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Exit Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paradise-900 text-slate-200 font-sans">
      {renderSidebar()}
      
      <div className="ml-64 p-8 min-h-screen bg-paradise-900/50">
        <header className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-serif text-white uppercase tracking-wider">
            {activeTab === 'menu' && 'Menu Management'}
            {activeTab === 'banners' && 'Hero Banners'}
            {activeTab === 'offers' && 'Special Offers'}
            {activeTab === 'settings' && 'Restaurant Settings'}
          </h1>
          
          {activeTab === 'menu' && menuMode === 'dishes' && (
            <button 
              type="button"
              onClick={() => setIsItemModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-paradise-500 text-paradise-950 rounded-lg font-bold hover:bg-paradise-400 transition-colors shadow-lg shadow-paradise-500/20"
            >
              <Plus size={18} />
              <span>Add Dish</span>
            </button>
          )}
          
          {activeTab === 'offers' && !showOfferForm && (
             <button 
             type="button"
             onClick={() => setShowOfferForm(true)}
             className="flex items-center gap-2 px-6 py-2.5 bg-gold-500 text-paradise-950 rounded-lg font-bold hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
           >
             <Plus size={18} />
             <span>New Offer</span>
           </button>
          )}
        </header>

        {activeTab === 'menu' && (
          <div className="animate-fade-in-up">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex gap-4 bg-paradise-950/50 p-1.5 rounded-lg w-fit border border-white/5">
                    <button 
                      type="button"
                      onClick={() => setMenuMode('dishes')}
                      className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${menuMode === 'dishes' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                       <List size={16} /> Manage Dishes
                    </button>
                    <button 
                      type="button"
                      onClick={() => setMenuMode('pages')}
                      className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${menuMode === 'pages' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                       <FileImage size={16} /> Full Menu Pages
                    </button>
                </div>

                {menuMode === 'dishes' && (
                   <div className="relative w-full md:w-64">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                       <input 
                         type="text" 
                         placeholder="Search dishes..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full bg-paradise-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:border-gold-500 outline-none transition-colors"
                       />
                   </div>
                )}
             </div>

             {menuMode === 'dishes' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMenuItems.map(item => (
                    <div key={item.id} className="bg-paradise-950 border border-white/5 rounded-xl p-4 flex gap-4 group hover:border-gold-500/30 transition-all">
                        <div className="w-20 h-20 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                              <UtensilsCrossed size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                              <h3 className="font-serif text-white truncate pr-2">{item.name}</h3>
                              <button 
                                type="button"
                                onClick={(e) => handleDeleteItem(e, item.id)} 
                                className="text-slate-600 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                          </div>
                          <p className="text-gold-500 text-sm mb-1">₹{item.price}</p>
                          <p className="text-slate-500 text-xs truncate">{item.category}</p>
                        </div>
                    </div>
                  ))}
                  {filteredMenuItems.length === 0 && (
                      <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                          {searchTerm ? 'No dishes found matching your search.' : 'No dishes added yet.'}
                      </div>
                  )}
                </div>
             ) : (
                <div className="space-y-8">
                    <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:bg-white/5 hover:border-gold-500/50 transition-all group cursor-pointer relative bg-paradise-950/30">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleImageUpload(e, 'menuPage')}
                        />
                        <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="text-gold-500" />
                        </div>
                        <h3 className="text-white font-serif text-xl mb-2">Upload Menu Pages</h3>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">Drag & drop scanned menu pages here.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {menuPages.map(page => (
                          <div key={page.id} className="relative aspect-[1/1.4] rounded-xl overflow-hidden group border border-white/10 bg-slate-900 shadow-xl">
                            <img src={page.imageUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20">
                              <button 
                                type="button"
                                onClick={(e) => handleDeleteMenuPage(e, page.id)}
                                className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110 shadow-xl"
                              >
                                <Trash2 size={24} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                </div>
             )}
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-8 animate-fade-in-up">
             <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:bg-white/5 hover:border-gold-500/50 transition-all group cursor-pointer relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                />
                <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-gold-500" />
                </div>
                <h3 className="text-white font-serif text-xl mb-2">Upload Hero Banners</h3>
                <p className="text-slate-400 text-sm">Upload high-res images for the home page slideshow.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {banners.map(banner => (
                  <div key={banner.id} className="bg-paradise-950 border border-white/5 rounded-xl overflow-hidden group hover:border-gold-500/30 transition-all flex flex-col">
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img src={banner.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20">
                        <button 
                          type="button"
                          onClick={(e) => handleDeleteBanner(e, banner.id)}
                          className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110 shadow-xl"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-4 border-t border-white/5">
                        <div>
                            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Banner Title</label>
                            <input 
                                type="text" 
                                value={banner.title || ''}
                                onChange={(e) => handleUpdateBannerText(banner.id, 'title', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-gold-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Banner Subtitle</label>
                            <textarea 
                                rows={2}
                                value={banner.subtitle || ''}
                                onChange={(e) => handleUpdateBannerText(banner.id, 'subtitle', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-gold-500 outline-none resize-none"
                            />
                        </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-8 animate-fade-in-up">
            {showOfferForm && (
              <div className="bg-paradise-950 border border-gold-500/30 rounded-2xl p-6 mb-8 shadow-2xl">
                <h3 className="text-gold-500 font-serif text-xl mb-4">Create New Offer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                       <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Title</label>
                       <input 
                         value={newOffer.title || ''}
                         onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                         placeholder="e.g. Summer Special"
                       />
                     </div>
                     <div>
                       <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Description</label>
                       <textarea 
                         value={newOffer.description || ''}
                         onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                         rows={2}
                       />
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Discount</label>
                          <input 
                            value={newOffer.discountAmount || ''}
                            onChange={e => setNewOffer({...newOffer, discountAmount: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                            placeholder="e.g. 20% OFF"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Code</label>
                          <input 
                            value={newOffer.code || ''}
                            onChange={e => setNewOffer({...newOffer, code: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                          />
                        </div>
                     </div>
                  </div>

                  <div className="relative border-2 border-dashed border-slate-700 rounded-xl h-full min-h-[200px] flex items-center justify-center group hover:bg-slate-900/50 hover:border-gold-500/30 transition-all cursor-pointer">
                      {newOffer.imageUrl ? (
                          <div className="relative w-full h-full">
                              <img src={newOffer.imageUrl} className="w-full h-full object-cover rounded-lg" />
                              <button 
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setNewOffer({...newOffer, imageUrl: undefined});
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                              >
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      ) : (
                          <>
                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleSingleImageUploadForOffer} />
                             <div className="text-center">
                                 <FileImage className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                                 <p className="text-slate-400 text-sm">Upload Background</p>
                             </div>
                          </>
                      )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setShowOfferForm(false)} className="px-6 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button 
                      type="button"
                      onClick={handleAddOffer}
                      disabled={!newOffer.title || !newOffer.description}
                      className="px-6 py-2 bg-gold-500 text-paradise-950 font-bold rounded-lg hover:bg-gold-400 disabled:opacity-50"
                    >
                        Create Offer
                    </button>
                </div>
              </div>
            )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map(offer => (
                   <div key={offer.id} className="bg-paradise-950 border border-white/5 rounded-xl overflow-hidden group hover:border-gold-500/30 transition-all flex h-40">
                      <div className="w-1/3 bg-slate-900 relative">
                          {offer.imageUrl ? (
                              <img src={offer.imageUrl} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-700"><Tag size={24} /></div>
                          )}
                      </div>
                      <div className="flex-1 p-5 relative">
                          <button 
                            type="button"
                            onClick={(e) => handleDeleteOffer(e, offer.id)} 
                            className="absolute top-4 right-4 text-slate-600 hover:text-red-500 p-1"
                          >
                              <Trash2 size={18} />
                          </button>
                          {offer.discountAmount && (
                              <span className="bg-gold-500 text-paradise-950 text-[10px] font-bold px-2 py-1 rounded-full uppercase mb-2 inline-block">
                                  {offer.discountAmount}
                              </span>
                          )}
                          <h4 className="font-serif text-white text-lg mb-1">{offer.title}</h4>
                          <p className="text-slate-400 text-xs line-clamp-2">{offer.description}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-fade-in-up">
              <div className="bg-paradise-950 border border-white/5 rounded-2xl p-8 space-y-8">
                  <div className="border-b border-white/5 pb-8">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-gold-500">
                              <ImageIcon size={24} />
                          </div>
                          <div>
                              <h3 className="font-serif text-2xl text-white">Branding</h3>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                          <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden hover:border-gold-500/50 transition-colors group cursor-pointer">
                              {tempSettings.logoUrl ? (
                                  <>
                                    <img src={tempSettings.logoUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                       <Upload size={20} className="text-white" />
                                    </div>
                                  </>
                              ) : (
                                  <div className="text-center p-2">
                                      <Upload size={16} className="text-slate-500 mx-auto mb-1" />
                                      <span className="text-[10px] text-slate-500 font-bold">Logo</span>
                                  </div>
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleLogoUpload}
                              />
                          </div>
                          
                          {tempSettings.logoUrl && (
                              <button 
                                type="button"
                                onClick={() => setTempSettings(prev => ({ ...prev, logoUrl: undefined }))}
                                className="text-red-400 text-sm hover:text-red-300 flex items-center gap-2"
                              >
                                  <Trash2 size={14} /> Remove Logo
                              </button>
                          )}
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div>
                          <label className="block text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Days</label>
                          <input 
                              value={tempSettings.days}
                              onChange={(e) => setTempSettings({...tempSettings, days: e.target.value})}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:border-gold-500 outline-none transition-colors"
                          />
                      </div>
                      <div>
                          <label className="block text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Hours</label>
                          <input 
                              value={tempSettings.hours}
                              onChange={(e) => setTempSettings({...tempSettings, hours: e.target.value})}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:border-gold-500 outline-none transition-colors"
                          />
                      </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                      <button 
                        type="button"
                        onClick={handleSaveSettings}
                        className="flex items-center gap-2 px-8 py-3 bg-paradise-500 text-paradise-950 font-bold rounded-lg hover:bg-paradise-400 transition-all shadow-lg hover:scale-105"
                      >
                          <Save size={20} />
                          Save Settings
                      </button>
                  </div>
              </div>
          </div>
        )}
      </div>
      
      <AdminModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
};
