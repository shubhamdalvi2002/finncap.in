import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Award,
  PhoneCall,
  ExternalLink,
  X,
  Send
} from 'lucide-react';

interface CarInsurancePageProps {
  googleFormUrl?: string;
}

export const CarInsurancePage: React.FC<CarInsurancePageProps> = ({
  googleFormUrl = 'https://forms.gle/mnC4LFNZMtRZ1MPd9'
}) => {
  const handleOpenForm = () => {
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-[5%] relative font-sans">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-100/60 rounded-full blur-3xl pointer-events-none z-0" />

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

          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
            Motor Protection Cover
          </span>
        </div>

        {/* HERO HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="md:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
              <Car size={16} />
              <span>Comprehensive Bumper-to-Bumper Protection</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Car & Four-Wheeler Insurance
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Protect your car against accident damages, theft, natural disasters, and third-party liabilities with zero-depreciation add-ons, 24x7 roadside assistance, and instant digital policy issuance.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleOpenForm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                Apply for Car Insurance
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
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
              alt="Car Insurance"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white font-bold text-xs bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
              Cashless Repairs at 5,000+ Garages
            </div>
          </div>
        </div>

        {/* KEY HIGHLIGHTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Zero Depreciation', desc: 'Bumper-to-Bumper Claim Payout', icon: <ShieldCheck className="text-indigo-600" size={20} /> },
            { title: '24x7 Roadside Help', desc: 'Breakdown & Towing Support', icon: <PhoneCall className="text-amber-600" size={20} /> },
            { title: 'Engine Protect', desc: 'Hydraulic Lock & Water Damage', icon: <Building2 className="text-blue-600" size={20} /> },
            { title: 'Instant Renewal', desc: 'Zero Paperwork Policy Issuance', icon: <Award className="text-emerald-600" size={20} /> }
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

        {/* DETAILED COVERAGE & ADD-ONS */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-left">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            Key Features & Popular Add-Ons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            {[
              { title: 'Zero Depreciation Add-On', desc: 'Claim full cost of replacement parts without depreciation deductions on fiber, rubber, or glass.' },
              { title: 'Engine & Gearbox Protection', desc: 'Covers expensive engine repair costs caused by water ingression or lubricant leakage.' },
              { title: '24x7 Emergency Roadside Assistance', desc: 'Free battery jumpstart, flat tire replacement, fuel delivery, and towing support.' },
              { title: 'Consumables Cover', desc: 'Covers cost of engine oils, nuts, bolts, screws, and brake fluid during claims.' },
              { title: 'Key & Lock Replacement', desc: 'Reimbursement for lost car keys and lock cylinder replacements.' },
              { title: 'Personal Accident Cover', desc: 'Mandatory ₹15 Lakhs driver owner personal accident protection.' }
            ].map((cov, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                  <span>{cov.title}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px] pl-6">{cov.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              <strong className="text-slate-800">Top Insurers We Compare:</strong> Tata AIG, HDFC ERGO, ICICI Lombard, Bajaj Allianz, Go Digit, Reliance General
            </div>

            <a
              href="tel:+917218918236"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-blue-500/20 inline-block text-center"
            >
              Contact Now
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
