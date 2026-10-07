// Activities Page — what the club does (from its own posts; no facility claims)
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { MdSportsSoccer, MdSportsCricket, MdPalette, MdVolunteerActivism } from 'react-icons/md';
import { useClubData } from '../context/ClubDataContext';

const ICONS = {
  football: MdSportsSoccer,
  cricket: MdSportsCricket,
  arts: MdPalette,
  community: MdVolunteerActivism,
};

export default function Services() {
  const { services, clubInfo } = useClubData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fade-in">

      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">Arts & sports</p>
        <h1 className="font-display text-4xl sm:text-5xl font-medium text-ink tracking-tight mt-2">
          What we <span className="font-bold">do</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
          Matches, celebrations and community work — everything Universal Vellur gets up to through the year.
        </p>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((svc) => {
          const Icon = ICONS[svc.icon] || MdVolunteerActivism;
          return (
            <div key={svc.id} className="glass rounded-[34px] p-7 sm:p-9 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="pill !h-8 !text-[11px]">{svc.category}</span>
                <span className="w-12 h-12 rounded-full bg-white text-ember flex items-center justify-center text-2xl">
                  <Icon />
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{svc.title}</h2>
              <p className="text-sm text-ink-muted leading-relaxed">{svc.description}</p>
              {svc.features?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {svc.features.map((feat) => (
                    <span key={feat} className="h-8 px-3 inline-flex items-center rounded-full bg-white/70 text-xs font-medium text-ink">
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="glass relative overflow-hidden rounded-[34px] p-8 sm:p-12 text-center">
        <div className="dot-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative space-y-5">
          <div className="orb w-14 h-14 mx-auto" aria-hidden="true" />
          <h3 className="font-display text-2xl sm:text-3xl font-medium text-ink tracking-tight">
            Want to be part of it? <span className="font-bold">Join the club.</span>
          </h3>
          <p className="text-sm text-ink-muted">Membership is {clubInfo.membershipFee} with an official digital ID card.</p>
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 h-12 pl-6 pr-1.5 rounded-full bg-white text-ink text-sm font-bold shadow-[0_12px_28px_-14px_rgba(70,50,90,0.5)]"
          >
            Apply for membership
            <span className="w-9 h-9 rounded-full bg-ember text-white flex items-center justify-center">
              <FiArrowUpRight />
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
}
