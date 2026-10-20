// Leadership & Executive Committee Page
// Featuring multiple interactive layout models: Bento Grid, Luxury Editorial Cards & Modern Directory,
// along with an interactive detail modal for each committee leader.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, FiInstagram, FiShield, FiUsers, 
  FiAward, FiArrowUpRight, FiHeart, FiGrid, 
  FiLayout, FiList, FiCheckCircle, FiInfo 
} from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const ROLE_BADGES = {
  President: {
    bg: 'bg-amber-100 text-amber-900 border-amber-300',
    ring: 'ring-4 ring-amber-400/30',
    glow: 'shadow-[0_16px_36px_-12px_rgba(245,158,11,0.4)]',
    accentText: 'text-amber-600',
    tag: 'Executive Head',
    accentGrad: 'from-amber-500/15 via-orange-400/5 to-transparent',
  },
  'General Secretary': {
    bg: 'bg-blue-100 text-blue-900 border-blue-300',
    ring: 'ring-4 ring-blue-400/30',
    glow: 'shadow-[0_16px_36px_-12px_rgba(59,130,246,0.35)]',
    accentText: 'text-blue-600',
    tag: 'General Administration',
    accentGrad: 'from-blue-500/15 via-indigo-400/5 to-transparent',
  },
  Treasurer: {
    bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    ring: 'ring-4 ring-emerald-400/30',
    glow: 'shadow-[0_16px_36px_-12px_rgba(16,185,129,0.35)]',
    accentText: 'text-emerald-600',
    tag: 'Accounts & Budgeting',
    accentGrad: 'from-emerald-500/15 via-teal-400/5 to-transparent',
  },
  'Vice President': {
    bg: 'bg-purple-100 text-purple-900 border-purple-200',
    ring: 'ring-2 ring-purple-300/40',
    glow: 'shadow-md',
    accentText: 'text-purple-600',
    tag: 'Leadership',
    accentGrad: 'from-purple-500/15 via-pink-400/5 to-transparent',
  },
  'Joint Secretary': {
    bg: 'bg-rose-100 text-rose-900 border-rose-200',
    ring: 'ring-2 ring-rose-300/40',
    glow: 'shadow-md',
    accentText: 'text-rose-600',
    tag: 'Operations',
    accentGrad: 'from-rose-500/15 via-red-400/5 to-transparent',
  },
};

export default function Team() {
  const { team, clubInfo } = useClubData();
  const [layoutModel, setLayoutModel] = useState('bento'); // 'bento' | 'editorial' | 'directory'
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);

  const categories = ['All', 'Core Executive', 'Vice Presidents', 'Joint Secretaries'];

  const coreOfficers = team.filter((m) => m.category === 'Core Executive');
  const vicePresidents = team.filter((m) => m.category === 'Vice Presidents');
  const jointSecretaries = team.filter((m) => m.category === 'Joint Secretaries');

  const filteredMembers =
    activeTab === 'All'
      ? team
      : team.filter((m) => m.category === activeTab);

  const president = coreOfficers.find((m) => m.position === 'President');
  const otherCore = coreOfficers.filter((m) => m.position !== 'President');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-fade-in">
      
      {/* ── 1. Hero Header ── */}
      <div className="glass relative overflow-hidden rounded-[34px] p-8 sm:p-14 text-center">
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-80" aria-hidden="true" />
        <div className="relative flex flex-col items-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-soft text-ember text-[11px] font-bold uppercase tracking-wider">
            <FiShield /> Official Leadership
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-ink tracking-tight">
            Executive <span className="font-bold">Committee</span>
          </h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-xl">
            The dedicated team of 9 office-bearers driving Universal Arts &amp; Sports Club Vellur across sports, arts, youth development, and community welfare.
          </p>

          {/* Quick stats pills */}
          <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs font-semibold text-ink-muted">
            <span className="pill !h-8 !px-3.5 bg-white/80">1 President</span>
            <span className="pill !h-8 !px-3.5 bg-white/80">1 General Secretary</span>
            <span className="pill !h-8 !px-3.5 bg-white/80">1 Treasurer</span>
            <span className="pill !h-8 !px-3.5 bg-white/80">3 Vice Presidents</span>
            <span className="pill !h-8 !px-3.5 bg-white/80">3 Joint Secretaries</span>
          </div>
        </div>
      </div>

      {/* ── 2. Interactive Control Bar (Model Switcher & Category Filters) ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-3xl bg-white/60 border border-white shadow-xs backdrop-blur-md">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`pill cursor-pointer !h-9 text-xs transition-all ${
                activeTab === cat ? 'pill-active shadow-sm font-bold' : 'hover:text-ink'
              }`}
            >
              {cat === 'All' ? `All (${team.length})` : cat}
            </button>
          ))}
        </div>

        {/* Layout Model Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-2xl shrink-0">
          <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider px-2 hidden sm:inline">
            Design:
          </span>
          <button
            type="button"
            onClick={() => setLayoutModel('bento')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              layoutModel === 'bento'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
            title="Bento Grid Layout"
          >
            <FiLayout /> <span>Bento</span>
          </button>

          <button
            type="button"
            onClick={() => setLayoutModel('editorial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              layoutModel === 'editorial'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
            title="Editorial Photo Cards"
          >
            <FiGrid /> <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setLayoutModel('directory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              layoutModel === 'directory'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
            title="Modern Directory List"
          >
            <FiList /> <span>List</span>
          </button>
        </div>
      </div>

      {/* ── 3. Committee Presentation Areas ── */}
      {team.length > 0 ? (
        <>
          {/* =========================================================================
              MODEL 1: BENTO SHOWCASE GRID
              ========================================================================= */}
          {layoutModel === 'bento' && (
            <div className="space-y-10">
              {/* Asymmetric Core Leadership Bento (President Spotlight + Secretary & Treasurer) */}
              {(activeTab === 'All' || activeTab === 'Core Executive') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ember">Executive Tier</p>
                      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Core Officers</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Presidential Hero Bento Card */}
                    {president && (
                      <div
                        onClick={() => setSelectedMember(president)}
                        className="glass group relative lg:col-span-6 rounded-[34px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_45px_-18px_rgba(245,158,11,0.35)] border-2 border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white/80 to-white"
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-radial from-amber-400/20 to-transparent blur-2xl pointer-events-none" />

                        <div className="flex items-start justify-between gap-4 mb-6">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs uppercase tracking-wider border border-amber-300 shadow-xs">
                            <FiAward className="text-amber-600" /> Club President
                          </span>
                          <span className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center shadow-xs group-hover:bg-ember group-hover:text-white transition-colors">
                            <FiArrowUpRight />
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 my-4">
                          <div className="relative shrink-0">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-amber-400/40 shadow-xl border-4 border-white bg-slate-100 group-hover:scale-105 transition-transform duration-500">
                              <img
                                src={president.image}
                                alt={president.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                              President
                            </span>
                          </div>

                          <div className="space-y-1 text-center sm:text-left">
                            <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                              Head of Executive Committee
                            </p>
                            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                              {president.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-3 pt-1">
                              {president.bio}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-900">
                          <span>Click to view executive profile</span>
                          <span className="text-amber-600 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    )}

                    {/* General Secretary & Treasurer Side-by-Side */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {otherCore.map((member) => {
                        const badge = ROLE_BADGES[member.position] || ROLE_BADGES.President;
                        return (
                          <div
                            key={member.id}
                            onClick={() => setSelectedMember(member)}
                            className={`glass group rounded-[32px] p-6 flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-all duration-300 ${badge.glow}`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                                  {member.position}
                                </span>
                                <span className="w-8 h-8 rounded-full bg-white text-ink-muted group-hover:text-ember flex items-center justify-center shadow-xs">
                                  <FiArrowUpRight />
                                </span>
                              </div>

                              <div className="text-center my-3">
                                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-md mb-3 group-hover:scale-105 transition-transform">
                                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-display text-lg font-bold text-ink">{member.name}</h3>
                                <p className="text-xs text-ink-muted line-clamp-3 mt-1.5 leading-relaxed">
                                  {member.bio}
                                </p>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-black/5 text-center">
                              <span className="text-[11px] font-semibold text-ink-subtle group-hover:text-ember transition-colors">
                                View details →
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Vice Presidents Rail */}
              {(activeTab === 'All' || activeTab === 'Vice Presidents') && (
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-purple-600">Leadership Support</p>
                      <h2 className="font-display text-2xl font-semibold text-ink">Vice Presidents</h2>
                    </div>
                    <span className="text-xs text-ink-muted font-medium">3 Office Bearers</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {vicePresidents.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className="glass group rounded-[30px] p-5 sm:p-6 text-center cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between gap-3"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-white shadow-md group-hover:scale-105 transition-transform">
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-ink">{member.name}</h3>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            {member.position}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Joint Secretaries Rail */}
              {(activeTab === 'All' || activeTab === 'Joint Secretaries') && (
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-600">Operations & Execution</p>
                      <h2 className="font-display text-2xl font-semibold text-ink">Joint Secretaries</h2>
                    </div>
                    <span className="text-xs text-ink-muted font-medium">3 Office Bearers</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {jointSecretaries.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className="glass group rounded-[30px] p-5 sm:p-6 text-center cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between gap-3"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-white shadow-md group-hover:scale-105 transition-transform">
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-ink">{member.name}</h3>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-200">
                            {member.position}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              MODEL 2: EDITORIAL PHOTO CARDS
              ========================================================================= */}
          {layoutModel === 'editorial' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => {
                const badge = ROLE_BADGES[member.position] || ROLE_BADGES.President;
                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="group relative rounded-[32px] overflow-hidden bg-white border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-1.5"
                  >
                    {/* Top Portrait Frame */}
                    <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                      />
                      {/* Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Position pill in top right */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${badge.bg}`}>
                          {member.position}
                        </span>
                      </div>

                      {/* Name sitting on photo bottom */}
                      <div className="absolute bottom-4 left-4 right-4 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                          {member.category}
                        </span>
                        <h3 className="font-display text-xl font-black text-white leading-tight drop-shadow-sm">
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Official Committee</span>
                        <span className="text-ember group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          View profile <FiArrowUpRight />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =========================================================================
              MODEL 3: MODERN DIRECTORY LIST
              ========================================================================= */}
          {layoutModel === 'directory' && (
            <div className="space-y-3 max-w-4xl mx-auto">
              {filteredMembers.map((member, idx) => {
                const badge = ROLE_BADGES[member.position] || ROLE_BADGES.President;
                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-white/90 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span className="text-xs font-mono font-bold text-ink-subtle w-5 shrink-0 hidden sm:inline">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-display text-base font-bold text-ink">{member.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                            {member.position}
                          </span>
                          <span className="text-[11px] text-ink-subtle hidden sm:inline">
                            · {member.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <p className="text-xs text-ink-muted line-clamp-1 max-w-xs text-left hidden lg:block">
                        {member.bio}
                      </p>
                      <button
                        type="button"
                        className="pill !h-8 text-xs font-bold shrink-0 hover:bg-ember hover:text-white"
                      >
                        Profile <FiArrowUpRight />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="glass rounded-[30px] p-10 text-center space-y-3">
          <div className="orb w-12 h-12 mx-auto" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-ink">Committee details coming soon</h3>
          <p className="text-sm text-ink-muted">Reach out to the club directly on Instagram.</p>
        </div>
      )}

      {/* ── 4. Interactive Detail Modal (opens on click of ANY committee member) ── */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title="Office Bearer Profile"
        maxWidth="max-w-md"
      >
        {selectedMember && (
          <div className="space-y-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-black/5">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-ember text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
                  <FiShield />
                </span>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                  {selectedMember.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-ink leading-tight">
                  {selectedMember.name}
                </h3>
                <div>
                  <span
                    className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${
                      ROLE_BADGES[selectedMember.position]?.bg || 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {selectedMember.position}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
                Leadership Responsibilities
              </h4>
              <p className="text-xs sm:text-sm text-ink leading-relaxed bg-white/70 p-4 rounded-2xl border border-white">
                {selectedMember.bio}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/70 border border-white text-left">
                <p className="text-ink-subtle text-[11px] font-semibold">Club Tenure</p>
                <p className="font-bold text-ink mt-0.5">Active Term 2026</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/70 border border-white text-left">
                <p className="text-ink-subtle text-[11px] font-semibold">Jurisdiction</p>
                <p className="font-bold text-ink mt-0.5">Vellur, Kerala</p>
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 flex items-center justify-end gap-3">
              <Button variant="outline" size="md" onClick={() => setSelectedMember(null)}>
                Close
              </Button>
              <a
                href={clubInfo.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ember text-white text-xs font-bold shadow-md hover:bg-ember/90 transition-all"
              >
                <FiInstagram /> Message Club
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* ── 5. Community Volunteer Callout ── */}
      <div className="glass relative overflow-hidden rounded-[34px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ember uppercase tracking-wider">
            <FiHeart /> Connect With Us
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Want to support or volunteer with Universal Club?
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed">
            Our committee welcomes youth ideas, sports coaching volunteers, and community organizers from Vellur and beyond.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-ink font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            <span>Send a Message</span>
            <FiArrowUpRight className="text-ember" />
          </Link>
          <a
            href={clubInfo.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ember text-white font-bold text-xs shadow-md hover:bg-ember/90 transition-all"
          >
            <FiInstagram />
            <span>DM on Instagram</span>
          </a>
        </div>
      </div>

    </div>
  );
}
