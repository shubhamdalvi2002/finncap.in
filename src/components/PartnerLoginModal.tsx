import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Shield, ArrowUpRight } from 'lucide-react';

interface PartnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerLoginModal: React.FC<PartnerLoginModalProps> = ({ isOpen, onClose }) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const portals = [
    {
      id: 'pdesk-v2',
      title: 'NJ Partner Desk 2.0',
      version: 'New Portal',
      url: 'https://pdesk.njwealth.in/pdesk/login',
      isNew: true,
      displayUrl: 'pdesk.njwealth.in',
      description: 'The modernized distributor suite featuring enhanced client tracking, upgraded digital onboarding tools, and real-time portfolio insights.'
    },
    {
      id: 'pdesk-classic',
      title: 'NJ Partner Desk Classic',
      version: 'Legacy Portal',
      url: 'https://www.njindiaonline.in/pdesk/login.fin?cmdAction=login',
      isNew: false,
      displayUrl: 'njindiaonline.in',
      description: 'The classic legacy dashboard supporting daily mutual fund operations, historical report extraction, and traditional transaction feeds.'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="partner-login-modal-wrapper" className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020408] cursor-pointer"
            id="partner-modal-backdrop"
          />

          {/* Modal Content Dialog */}
          <motion.div
            initial={{ scale: 0.98, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 8, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-[#0a0d14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 text-white p-6 sm:p-7"
            id="partner-login-card"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5 relative">
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-tight">Partner Portal Directory</h3>
                <p className="text-xs text-stone-400 mt-1">Select the version of the NJ Partner Desk you want to sign in to:</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 -mr-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Close portal modal"
                id="close-partner-modal-btn"
              >
                <X size={16} />
              </button>
            </div>

            {/* Simple stacked items for maximum professional impact */}
            <div className="space-y-3 mb-5">
              {portals.map((portal) => (
                <div 
                  key={portal.id}
                  id={`portal-box-${portal.id}`}
                  className={`group relative flex flex-col md:flex-row md:items-center justify-between p-4.5 rounded-xl border transition-all duration-200 ${
                    portal.isNew 
                      ? 'border-gold/25 bg-[#0e121c] hover:border-gold/50' 
                      : 'border-white/5 bg-[#0a0d14] hover:bg-[#0c1019] hover:border-white/10'
                  }`}
                >
                  <div className="flex-1 pr-3 mb-3.5 md:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-sans text-[14px] font-bold text-white group-hover:text-gold transition-colors">
                        {portal.title}
                      </h4>
                      <span className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded ${
                        portal.isNew 
                          ? 'bg-gold/10 text-gold border border-gold/20' 
                          : 'bg-white/5 text-stone-400 border border-white/5'
                      }`}>
                        {portal.version}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed mb-1.5">
                      {portal.description}
                    </p>
                    <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
                      Target: <span className="text-stone-400 font-medium">{portal.displayUrl}</span>
                    </span>
                  </div>

                  <a
                    id={`link-redirect-${portal.id}`}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-xs font-bold font-sans transition-all shrink-0 ${
                      portal.isNew 
                        ? 'bg-gold text-bg-dark hover:bg-gold-light shadow-md shadow-gold/5' 
                        : 'bg-white/5 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    <span>Open Desk</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              ))}
            </div>

            {/* Disclaimer Security Panel (Slimmer & direct) */}
            <div className="p-3.5 bg-[#07090e] border border-white/5 rounded-xl flex items-start gap-2.5">
              <Shield size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 font-mono">
                  Secure Direct Directing
                </span>
                <p className="text-[10px] text-stone-400 leading-relaxed font-sans">
                  You are being securely navigated to official NJ India servers. FinAura Capital never accesses or retains partner passwords or authorization certificates.
                </p>
              </div>
            </div>

            {/* Footer containing quick close button */}
            <div className="flex justify-end mt-5 pt-4 border-t border-white/5">
              <button 
                id="btn-partner-cancel"
                onClick={onClose}
                className="text-[11px] font-bold uppercase tracking-wider text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
