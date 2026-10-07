// About Club Page — who the club is, from its own public pages
import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiInstagram, FiFacebook, FiArrowUpRight } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import clubLogo from '../assets/club-logo.webp';

// Instagram story highlights + recent posts
const MILESTONES = [
  { title: 'Onam 2K20', text: 'Onam celebrations for the village.' },
  { title: 'Environment Day', text: 'Environment Day activities with members.' },
  { title: 'Colouring competition', text: 'A colouring competition for the children of Vellur.' },
  { title: 'AvaaZ', text: 'A club cultural programme.' },
  { title: 'Onam 2K23', text: 'Another year of Onam games and celebrations.' },
  { title: 'Ente Vellur, Sundara Vellur', text: 'Aug 2026 — the clean-up mission begins.' },
  { title: 'State kickboxing gold', text: 'Aug 2026 — Muhammed Danish P.P., 51 kg senior full contact.' },
  { title: 'Universalonam 2K26', text: '30 Aug 2026 — Onam games for adults and kids.' },
  { title: 'Super League Kerala', text: 'Sep 2026 — Abdul Samad P.P. joins Thrissur Magic FC.' },
];

export default function About() {
  const { clubInfo } = useClubData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fade-in">

      {/* Header */}
      <div className="glass relative overflow-hidden rounded-[34px] p-8 sm:p-14 text-center">
        <div className="dot-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white p-2 shadow-[0_14px_30px_-12px_rgba(242,104,58,0.5)] mb-6">
            <img src={clubLogo} alt="Universal Arts & Sports Club emblem" className="w-full h-full object-contain" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">About the club</p>
          <h1 className="font-display text-4xl sm:text-5xl font-medium text-ink tracking-tight mt-2">
            Universal <span className="font-bold">Vellur</span>
          </h1>
          <p className="mt-4 text-base text-ink-muted max-w-xl leading-relaxed">{clubInfo.tagline}</p>
          <p className="mt-2 text-sm text-ink-subtle">{clubInfo.taglineMl}</p>
        </div>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="glass lg:col-span-7 rounded-[34px] p-8 sm:p-10 space-y-4 text-sm sm:text-base text-ink-muted leading-relaxed">
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink">
            Arts, sports and <span className="font-bold">community</span>
          </h2>
          <p>
            Universal Arts &amp; Sports Club is a youth club in Vellur. From its clubhouse, members organise matches,
            Onam celebrations, competitions for children and drives that keep the village clean.
          </p>
          <p>
            The club also cheers on its own — like Abdul Samad P.P., now playing for Thrissur Magic FC in the Super
            League Kerala, and Muhammed Danish P.P., state kickboxing gold medallist in 2026.
          </p>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="glass rounded-[34px] p-7 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">Find us</p>
            <p className="flex items-center gap-2.5 text-ink font-semibold">
              <FiMapPin className="text-ember" /> {clubInfo.location}
            </p>
            <a href={clubInfo.socials.instagram} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-ink transition-colors">
              <FiInstagram className="text-ember" /> {clubInfo.socials.instagramHandle} · {clubInfo.instagramFollowers} followers
            </a>
            <a href={clubInfo.socials.facebook} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-ink transition-colors">
              <FiFacebook className="text-ember" /> Universal Arts &amp; Sports Club Vellur
            </a>
          </div>

          <Link to="/membership" className="glass rounded-[34px] p-7 flex items-center justify-between gap-4 group">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">Membership</p>
              <p className="font-display text-2xl font-bold text-ink">{clubInfo.membershipFee}</p>
            </div>
            <span className="w-12 h-12 rounded-full bg-white text-ember flex items-center justify-center group-hover:bg-ember group-hover:text-white transition-all">
              <FiArrowUpRight className="text-xl" />
            </span>
          </Link>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">From our pages</p>
        <h2 className="font-display text-3xl font-medium text-ink tracking-tight mt-1.5 mb-6">
          Moments we're <span className="font-bold">proud of</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MILESTONES.map((m) => (
            <div key={m.title} className="glass rounded-[26px] p-5 flex items-start gap-3">
              <span className="orb w-4 h-4 mt-1 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-display text-base font-semibold text-ink">{m.title}</h3>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
