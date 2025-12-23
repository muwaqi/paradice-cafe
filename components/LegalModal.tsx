
import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'accessibility' | null;
  onClose: () => void;
}

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    body: `Your privacy is of the utmost importance to us at Paradise Cafe and Restaurant. This policy outlines how we handle your personal data. 

We only collect information that is necessary to fulfill your reservations or improve your digital experience. This may include your name, contact details, and dining preferences. 

We do not share your personal information with third parties for marketing purposes. All data is stored securely and processed in accordance with global data protection standards.`
  },
  terms: {
    title: 'Terms of Service',
    body: `Welcome to the Paradise Cafe and Restaurant digital experience. By accessing this site, you agree to comply with the following terms.

Our digital menu and branding are the intellectual property of Paradise. Unauthorized use or reproduction is strictly prohibited. 

Reservations made through our platform are subject to availability. We reserve the right to modify our service schedule or menu offerings without prior notice to maintain our standard of excellence.`
  },
  accessibility: {
    title: 'Accessibility Statement',
    body: `Paradise Cafe and Restaurant is committed to ensuring that our digital services are accessible to everyone, including individuals with disabilities.

We continuously strive to improve the user experience for all guests by applying relevant accessibility standards, including WCAG 2.1 guidelines. 

If you encounter any barriers while using our digital menu, please contact our concierge team so we can assist you and improve our interface.`
  }
};

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const { title, body } = CONTENT[type];

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="bg-paradise-950 border border-gold-500/20 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-4xl font-serif text-white tracking-tight italic">{title}</h2>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-12 overflow-y-auto max-h-[60vh] scrollbar-hide">
          <p className="text-slate-400 text-xl font-light leading-relaxed whitespace-pre-line">
            {body}
          </p>
        </div>
        <div className="p-10 bg-white/5 border-t border-white/5 text-center">
          <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
            Paradise Cafe and Restaurant &copy; 2024
          </p>
        </div>
      </div>
    </div>
  );
};
