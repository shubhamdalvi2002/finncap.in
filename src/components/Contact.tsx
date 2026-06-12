import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Instagram, ExternalLink, Facebook, Linkedin } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.service) {
      setStatus({ type: 'error', msg: 'Please fill in all required fields (*)' });
      return;
    }

    // Format message for WhatsApp
    const whatsappNumber = '919423669236'; // Standard international format without '+'
    const text = `*New Wealth Enquiry - FinAura Capital* 🌟\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email || 'Not provided'}\n` +
      `💼 *Service:* ${formData.service}\n` +
      `📝 *Message:* ${formData.message || 'No additional message'}\n\n` +
      `_Submitted via website form_`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

    // Show success status
    setStatus({ type: 'success', msg: '✅ Redirecting to WhatsApp to send your enquiry...' });
    
    // Redirect / Open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setFormData({ name: '', phone: '', email: '', service: '', message: '' });
      setStatus(null);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-bg-dark-2 relative overflow-hidden">
      <div className="text-center mb-14 relative z-10">
        <div className="text-[0.72rem] tracking-[0.14em] uppercase text-gold mb-2">Get In Touch</div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Let's Start Your Wealth Journey</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Have questions about investing? Reach out — we're always happy to help.</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">
        <div className="flex flex-col gap-4">
          <ContactItem icon={<Phone size={18} />} label="Call Us" value="+91 72189 18236" href="tel:7218918236" />
          <ContactItem icon={<MessageCircle size={18} />} label="WhatsApp Support" value="+91 94236 69236" href="https://wa.me/919423669236" />
          <ContactItem icon={<Mail size={18} />} label="Email Desk" value="finauracapital@gmail.com" href="mailto:finauracapital@gmail.com" />
          <ContactItem icon={<ExternalLink size={18} />} label="Start Investing" value="Open your account now →" href="http://p.njw.bz/103924" />
          <ContactItem icon={<ExternalLink size={18} />} label="Client Desk" value="Login to existing account →" href="https://ewa.njindiaonline.com/ewa/login" />
          
          {/* Social Media Channels Panel */}
          <div className="mt-2 bg-bg-dark-3/40 border border-gold/10 rounded-xl p-5">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#9ca3af] block mb-4">Follow Us On Social Media</div>
            <div className="grid grid-cols-3 gap-3">
              <a 
                href="https://www.instagram.com/finnauracapital" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-gold/5 bg-bg-dark-3/60 hover:border-gold/30 hover:bg-gold/5 transition-all text-center gap-2 group"
              >
                <Instagram size={20} className="text-gold group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-gold transition-colors">Instagram</span>
              </a>
              <a 
                href="https://www.facebook.com/share/18ehkCsPPh/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-gold/5 bg-bg-dark-3/60 hover:border-gold/30 hover:bg-gold/5 transition-all text-center gap-2 group"
              >
                <Facebook size={20} className="text-gold group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-gold transition-colors">Facebook</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/finaura-capital-813770388/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-gold/5 bg-bg-dark-3/60 hover:border-gold/30 hover:bg-gold/5 transition-all text-center gap-2 group"
              >
                <Linkedin size={20} className="text-gold group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-gold transition-colors">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Your Name *" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="Rahul Sharma" />
          <Input label="Phone Number *" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} type="tel" placeholder="+91 XXXXX XXXXX" />
          <Input label="Email Address" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} type="email" placeholder="you@example.com" />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">I'm interested in *</label>
            <select
              value={formData.service}
              onChange={e => setFormData({ ...formData, service: e.target.value })}
              className="bg-bg-dark-3 border border-gold/20 rounded-lg text-foreground text-sm p-3 outline-none focus:border-gold transition-all"
            >
              <option value="">Select a service...</option>
              <option>Stocks</option>
              <option>Mutual Funds</option>
              <option>ETFs</option>
              <option>SIP – Systematic Investment Plan</option>
              <option>SWP – Systematic Withdrawal Plan</option>
              <option>STP – Systematic Transfer Plan</option>
              <option>General Advisory</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Message (optional)</label>
            <textarea
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your financial goals..."
              className="bg-bg-dark-3 border border-gold/20 rounded-lg text-foreground text-sm p-3 outline-none focus:border-gold transition-all min-h-[110px] resize-vertical"
            />
          </div>

          <button type="submit" className="bg-gold text-bg-dark py-4 rounded-full font-bold hover:bg-gold-light transition-all flex items-center justify-center gap-2">
            Send Enquiry
          </button>

          {status && (
            <div className={`p-3 rounded-lg border text-center text-sm ${status.type === 'success' ? 'bg-gold/10 border-gold text-gold' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

const ContactItem = ({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string, href: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className="flex items-start gap-4 bg-bg-dark-3 border border-gold/10 rounded-xl p-5 hover:border-gold/40 hover:translate-x-2 transition-all group">
    <div className="text-gold mt-1 group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <div className="text-[0.72rem] tracking-widest uppercase text-gold mb-1">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  </a>
);

const Input = ({ label, value, onChange, type = 'text', placeholder }: { label: string, value: string, onChange: (v: string) => void, type?: string, placeholder: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-muted-foreground">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-bg-dark-3 border border-gold/20 rounded-lg text-foreground text-sm p-3 outline-none focus:border-gold transition-all"
    />
  </div>
);
