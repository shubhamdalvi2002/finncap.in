import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface PartnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerLoginModal: React.FC<PartnerLoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setErrorMsg('');
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const targetUser = 'finnauracapital@gmail.com';
    const targetPass = 'India@11';

    const normalizedEmail = email.trim().toLowerCase();
    
    // Validate credentials
    if (
      (normalizedEmail === targetUser || normalizedEmail === 'finnauracapital' || normalizedEmail === 'admin') &&
      password === targetPass
    ) {
      // SUCCESS
      sessionStorage.setItem('finaura_partner_auth', 'true');
      
      // Close modal and redirect to Partner Portal page
      onClose();
      window.location.hash = '#partner';
    } else {
      // FAILURE
      setTimeout(() => {
        setErrorMsg('Invalid credentials. Please verify your Partner Identity/Password and try again.');
        setIsSubmitting(false);
      }, 400);
    }
  };

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
            className="relative w-full max-w-md bg-[#0a0d14] border border-gold/20 rounded-2xl overflow-hidden shadow-2xl z-10 text-white p-6 sm:p-8"
            id="partner-login-card"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6 relative">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gold/10 border border-gold/20 rounded-xl text-gold" id="partner-lock-icon-container">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white tracking-tight">Partner Portal Login</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Access your advisor dashboard securely</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 -mr-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Close modal"
                id="close-partner-modal-btn"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error Message banner */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 p-3.5 bg-red-950/40 border border-red-500/20 text-red-200 text-xs rounded-xl flex items-start gap-2"
                  id="partner-login-error"
                >
                  <ShieldAlert size={14} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block">
                  Partner Identity / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. finnauracapital@gmail.com"
                    autoComplete="username"
                    className="w-full bg-[#0d1017] border border-gold/15 rounded-xl py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-stone-600"
                    id="partner-login-email-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full bg-[#0d1017] border border-gold/15 rounded-xl py-3 pl-10 pr-10 text-sm text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-stone-600"
                    id="partner-login-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground/60 hover:text-white transition-colors cursor-pointer"
                    id="partner-toggle-pwd-visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-light text-bg-dark font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-gold/5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  id="partner-login-submit-btn"
                >
                  <span>{isSubmitting ? 'Verifying...' : 'Authorize Partner'}</span>
                  {!isSubmitting && <ArrowRight size={14} />}
                </button>
              </div>
            </form>

            <div className="mt-5 text-center">
              <button 
                type="button"
                id="btn-partner-cancel"
                onClick={onClose}
                className="text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-white transition-colors cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
