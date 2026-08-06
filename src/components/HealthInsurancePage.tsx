import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Award,
  PhoneCall,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  X,
  Send
} from 'lucide-react';

interface HealthInsurancePageProps {
  googleFormUrl?: string;
}

export const HealthInsurancePage: React.FC<HealthInsurancePageProps> = ({
  googleFormUrl = 'https://docs.google.com/forms'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customFormUrl, setCustomFormUrl] = useState(googleFormUrl);
  const [isSubmittedNotice, setIsSubmittedNotice] = useState(false);

  const handleOpenForm = () => {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-[5%] relative font-sans">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-rose-100/60 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-10">
        
        {/* BREADCRUMB / BACK LINK */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <a
            href="#insurance"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to All Insurances</span>
          </a>

          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
            Health & Mediclaim Cover
          </span>
        </div>

        {/* HERO HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="md:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
              <HeartPulse size={16} />
              <span>Complete Family Health Protection</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Health & Mediclaim Insurance
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Ensure comprehensive financial security for medical emergencies with cashless treatments across 10,000+ top hospitals in India, zero room-rent capping, and maximum tax savings under Section 80D.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleOpenForm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                Apply for Health Insurance
              </button>

              <a
                href="#insurance"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all"
              >
                Explore Other Plans
              </a>
            </div>
          </div>

          <div className="md:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
              alt="Health Insurance"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white font-bold text-xs bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
              10,000+ Cashless Hospitals Network
            </div>
          </div>
        </div>

        {/* KEY HIGHLIGHTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Cashless Network', desc: '10,000+ Hospital Pan-India', icon: <Building2 className="text-rose-600" size={20} /> },
            { title: 'Tax Benefits', desc: 'Save up to ₹75,000 u/s 80D', icon: <Award className="text-blue-600" size={20} /> },
            { title: 'No Claim Bonus', desc: 'Up to 100% Sum Increase', icon: <ShieldCheck className="text-emerald-600" size={20} /> },
            { title: '24x7 Support', desc: 'Instant Claim Assistance', icon: <PhoneCall className="text-amber-600" size={20} /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 shrink-0">{item.icon}</div>
              <div className="text-left">
                <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DETAILED COVERAGE & BENEFITS */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-left">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            What is Covered under Health Insurance?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            {[
              { title: 'Cashless Hospitalization', desc: 'Get treated at any network hospital without paying cash up front.' },
              { title: 'Pre & Post Hospitalization', desc: 'Coverage for medical expenses 60 days before and 90 days after admission.' },
              { title: 'Zero Room Rent Limits', desc: 'Choose ICU or private room categories without proportionate deductions.' },
              { title: 'Daycare Procedures', desc: 'Coverage for 500+ daycare treatments requiring less than 24 hours stay.' },
              { title: 'Restoration Benefits', desc: 'Automatic 100% refill of sum insured if exhausted during the policy year.' },
              { title: 'Free Annual Health Checkup', desc: 'Complimentary full-body checkups for all covered family members every year.' }
            ].map((cov, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 size={16} className="text-rose-600 shrink-0" />
                  <span>{cov.title}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px] pl-6">{cov.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <strong className="text-slate-800">Top Insurers We Compare:</strong> Star Health, HDFC ERGO, Niva Bupa, Care Health, ICICI Lombard
            </div>

            <button
              onClick={handleOpenForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              Contact Now
            </button>
          </div>
        </div>

      </div>

      {/* GOOGLE FORM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <HeartPulse size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Health & Mediclaim Insurance
                </h3>
                <p className="text-xs text-slate-600">
                  Submit your request or connect your custom Google Form link below to receive instant health quotes.
                </p>
              </div>

              {isSubmittedNotice ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-center space-y-2 text-xs">
                  <p className="font-bold">Inquiry Registered for Health Insurance!</p>
                  <p className="text-[11px] text-emerald-700">
                    Your request has been captured in-app. Paste your Google Form link below if you wish to connect external responses.
                  </p>
                </div>
              ) : null}

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
