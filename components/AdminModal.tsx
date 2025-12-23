import React, { useState } from 'react';
import { X, Wand2, Loader2, Upload, IndianRupee } from 'lucide-react';
import { Category, MenuItem } from '../types';
import { generateItemDetails, generateItemImage } from '../services/geminiService';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: MenuItem) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>(Category.MAINS);
  const [imageUrl, setImageUrl] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAI = async () => {
    if (!name) return;
    setIsGenerating(true);
    
    try {
      const details = await generateItemDetails(name, category);
      
      if (details) {
        setDescription(details.description);
        setPrice(details.suggestedPrice.toString());
        setIsVegetarian(details.isVegetarian);
        setIsSpicy(details.isSpicy);
        
        const image = await generateItemImage(name, details.description);
        if (image) {
          setImageUrl(image);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name,
      description,
      price: parseFloat(price) || 0,
      category,
      imageUrl,
      isVegetarian,
      isSpicy,
    };
    onAddItem(newItem);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setCategory(Category.MAINS);
    setIsVegetarian(false);
    setIsSpicy(false);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-obsidian-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-obsidian-950/50">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">Curate Menu Item</h2>
            <p className="text-slate-400 text-xs tracking-wider uppercase mt-1">Add a new culinary masterpiece</p>
          </div>
          <button onClick={handleClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          {/* AI Section */}
          <div className="bg-gradient-to-r from-obsidian-900 to-slate-900 border border-gold/20 rounded-xl p-5">
            <label className="block text-sm font-bold text-gold-400 mb-2 uppercase tracking-wider">Dish Name</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Saffron Infused Lobster Risotto"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none"
              />
              <button
                onClick={handleGenerateAI}
                disabled={!name || isGenerating}
                className="px-6 py-2 bg-gold hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-obsidian-950 font-bold rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                <span>Auto-Curate</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-gold outline-none"
                  >
                    {Object.values(Category).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Price (₹)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <IndianRupee size={16} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-gold outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the flavors..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold outline-none resize-none"
              />
            </div>

            <div className="flex gap-8 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isVegetarian ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 group-hover:border-emerald-500'}`}>
                  {isVegetarian && <svg className="w-3 h-3 text-black fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                </div>
                <input type="checkbox" checked={isVegetarian} onChange={(e) => setIsVegetarian(e.target.checked)} className="hidden" />
                <span className="text-slate-300 group-hover:text-white transition-colors">Vegetarian</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSpicy ? 'bg-red-500 border-red-500' : 'border-slate-600 group-hover:border-red-500'}`}>
                  {isSpicy && <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                </div>
                <input type="checkbox" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} className="hidden" />
                <span className="text-slate-300 group-hover:text-white transition-colors">Spicy</span>
              </label>
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-400 mb-2">Presentation Image (Optional)</label>
               
               {imageUrl ? (
                 <div className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-[4/3] bg-slate-900 shadow-lg">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setImageUrl('')}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
                        >
                          Remove Image
                        </button>
                    </div>
                 </div>
               ) : (
                 <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer hover:bg-slate-800/50 hover:border-gold/50 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-gold mb-2" />
                        <p className="text-sm text-slate-400 group-hover:text-slate-300">
                            Upload or Auto-Curate
                        </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
               )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-obsidian-950/80 flex justify-end gap-3">
          <button onClick={handleClose} className="px-6 py-2.5 text-slate-400 hover:text-white font-medium transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!name || !price}
            className="px-8 py-2.5 bg-gold text-obsidian-950 font-bold rounded-lg hover:bg-gold-600 transition-all disabled:opacity-50"
          >
            Add to Menu
          </button>
        </div>
      </div>
    </div>
  );
};