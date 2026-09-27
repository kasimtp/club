// Sports Facilities & Services Directory Page
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiAward } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Chip from '../components/ui/Chip';
import Button from '../components/ui/Button';

export default function Services() {
  const { services } = useClubData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-50 bg-[#E3F9F0] text-[#0FA968] text-xs font-black uppercase tracking-wider">
          <FiAward /> State-of-the-Art Infrastructure
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Facilities & Services
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From Olympic free weight bays to synthetic badminton courts, explore the high-grade sporting amenities included with your ₹200/year membership.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Chip label={svc.category} />
                <span className="text-xs font-mono font-bold text-slate-400">USAC FACILITY</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900">
                {svc.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {svc.description}
              </p>

              <div className="pt-2 space-y-2.5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Key Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {svc.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <FiCheckCircle className="text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Open Daily 05:30 AM – 10:00 PM</span>
              <Link
                to="/membership"
                className="inline-flex items-center gap-1 text-xs font-black text-amber-600 hover:text-amber-700"
              >
                Join to Access →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-black text-white text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Ready to Train at Universal Sports Complex?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Get unlimited access to all training arenas with an official digital ID card for only ₹200 / Year.
        </p>
        <Link
          to="/membership"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-all shadow-md"
        >
          Apply for Membership Pass <FiArrowRight />
        </Link>
      </div>

    </div>
  );
}
