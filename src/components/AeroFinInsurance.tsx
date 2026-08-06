import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  HeartPulse,
  Car,
  CheckCircle2,
  Umbrella,
  ExternalLink,
  X,
  Send
} from 'lucide-react';

interface AeroFinInsuranceProps {
  googleFormUrl?: string;
}

export const AeroFinInsurance: React.FC<AeroFinInsuranceProps> = ({
  googleFormUrl = 'https://docs.google.com/forms'
}) => {
  const [customFormUrl, setCustomFormUrl] = useState<string>(googleFormUrl);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string>('Health Insurance');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmittedNotice, setIsSubmittedNotice] = useState<boolean>(false);

  const handleOpenForm = (insuranceType: string) => {
    setSelectedInsuranceType(insuranceType);
    setIsSubmittedNotice(false);
    setIsModalOpen(true);
  };

  const handleRedirectToGoogleForm = () => {
    if (customFormUrl && customFormUrl.startsWith('http')) {
      window.open(customFormUrl, '_blank', 'noopener,noreferrer');
    } else {
      setIsSubmittedNotice(true);
    }
  };

  const featuredInsurances = [
    {
      id: 'health',
      title: 'Health & Mediclaim Insurance',
      link: '#insurance-health',
      badge: '10,000+ Cashless Hospitals',
      tagColor: 'bg-rose-100 text-rose-700 border-rose-200',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      icon: <HeartPulse className="text-rose-600" size={24} />,
      shortDesc: 'Cashless hospitalization across leading hospitals, family floater cover, pre/post hospitalization care, and tax savings under Section 80D up to ₹75,000.',
      features: [
        '10,000+ Cashless Network Hospitals',
        'Zero Room Rent Capping Available',
        'Tax Benefit under Section 80D'
      ],
      align: 'left' // Image Left
    },
    {
      id: 'term',
      title: 'Term Life Insurance',
      link: '#insurance-term',
      badge: 'Up to ₹1 Cr - ₹5 Cr Cover',
      tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
      icon: <Umbrella className="text-blue-600" size={24} />,
      shortDesc: 'High sum-assured life protection for your family, critical illness riders, accidental death cover, and tax exemptions under Section 80C & 10(10D).',
      features: [
        'High Sum Assured at Affordable Premiums',
        'Critical Illness & Accidental Death Riders',
        'Tax Exemptions u/s 80C & 10(10D)'
      ],
      align: 'right' // Image Right
    },
    {
      id: 'car',
      title: 'Car & Four-Wheeler Insurance',
      link: '#insurance-car',
      badge: 'Zero Depreciation Cover',
      tagColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      icon: <Car className="text-indigo-600" size={24} />,
      shortDesc: 'Comprehensive car protection with bumper-to-bumper zero depreciation, 24x7 emergency roadside assistance, engine protection, and instant digital renewal.',
      features: [
        'Bumper-to-Bumper Zero Dep Add-On',
        '24x7 Emergency Roadside Assistance',
        'Instant Digital Policy Issuance'
      ],
      align: 'left' // Image Left
    }
  ];

  return (
    <div id="aerofin-insurance-page" className="min-h-screen bg-slate-50 text-slate-900 py-12 px-[5%] relative overflow-hidden font-sans">
      
      {/* Background Soft Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none z-0" />

      {/* TOP HERO BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto pt-6 pb-12 relative z-10 text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Shield size={16} className="text-blue-600 animate-pulse" />
          <span>AeroFin Insurance • Complete Risk Shield</span>
        </div>

        {/* Responsive headline scaling for all devices */}
        <h1 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight text-center max-w-4xl mx-auto">
          Protect Your <span className="text-blue-600">Health, Life & Vehicle</span> With Confidence
        </h1>

        <p className="text-slate-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Comprehensive Health Mediclaim, High Sum-Assured Term Life Insurance, Car & Bike Protection, and Business Risk Solutions — all with 100% dedicated claim assistance.
        </p>
      </motion.div>

      {/* HORIZONTAL ROUNDED RECTANGLE CARDS IN ALTERNATING LAYOUT */}
      <div className="max-w-5xl mx-auto space-y-8 relative z-10 mb-16">
        {featuredInsurances.map((item, idx) => {
          const isImageLeft = item.align === 'left';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
                isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-6 sm:gap-8 overflow-hidden`}
            >
              {/* IMAGE BLOCK */}
              <div className="w-full md:w-1/2 h-56 sm:h-64 rounded-2xl overflow-hidden relative group shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${item.tagColor}`}>
                    {item.badge}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                  <div className="p-2 bg-white/90 rounded-xl text-slate-900 backdrop-blur-md">
                    {item.icon}
                  </div>
                  <span className="font-serif font-bold text-lg drop-shadow-md">{item.title}</span>
                </div>
              </div>

              {/* DETAILS & BUTTONS BLOCK */}
              <div className="w-full md:w-1/2 space-y-4 text-left">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.shortDesc}
                </p>

                <div className="space-y-2 pt-1 border-t border-slate-100">
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-3">
                  <a
                    href={item.link}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all cursor-pointer text-center"
                  >
                    Get Insurance
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* WHY CHOOSE AEROFIN SECTION - WITHOUT 'CONNECT WITH EXPERT' BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto relative z-10 mb-16 text-center space-y-6 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-sm"
      >
        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Unbiased Policy Comparison</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
          Why Get Insurance via AeroFin Advisory?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We help you evaluate coverage gaps, select optimal deductibles, compare premiums across leading insurance brands, and handle all policy documentation and claim filings end-to-end.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-800 pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
            <span>Zero Hidden Brokerage Fees</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
            <span>Dedicated Claim Officer Support</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
            <span>Instant Digital Policy Issuance</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
            <span>Free Annual Coverage Audit</span>
          </div>
        </div>
      </motion.div>

      {/* GOOGLE FORM CONNECTION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Send size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  {selectedInsuranceType}
                </h3>
                <p className="text-xs text-slate-600">
                  Submit your inquiry or connect your custom Google Form link below for lead collection.
                </p>
              </div>

              {isSubmittedNotice ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-center space-y-2 text-xs">
                  <p className="font-bold">Inquiry Registered for {selectedInsuranceType}!</p>
                  <p className="text-[11px] text-emerald-700">
                    Your request has been captured in-app. When you are ready to link your Google Form, paste it below.
                  </p>
                </div>
              ) : null}

              {/* GOOGLE FORM REDIRECT ACTION BOX */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Connected Form URL:</span>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    Google Form
                  </span>
                </div>
                <input
                  type="text"
                  value={customFormUrl}
                  onChange={e => setCustomFormUrl(e.target.value)}
                  placeholder="Paste your Google Form URL here..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono text-xs outline-none focus:border-blue-600"
                />
                <p className="text-[11px] text-slate-500">
                  💡 You can paste your custom Google Form link above, or click below to launch the inquiry form in a new tab.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRedirectToGoogleForm}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Open Google Form</span>
                  <ExternalLink size={16} />
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
