// Home Page Component — "Sense" soft-glass bento landing
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight, FiCalendar, FiMapPin, FiClock, FiPlay,
  FiCreditCard, FiStar, FiHeart, FiUsers, FiInstagram, FiSend
} from 'react-icons/fi';
import { MdSportsSoccer, MdSportsCricket, MdPalette, MdVolunteerActivism } from 'react-icons/md';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';
import HomeSlider from '../components/HomeSlider';
import EventCard from '../components/EventCard';
import ProgramCard from '../components/ProgramCard';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import Modal from '../components/ui/Modal';
import MediaPlaceholder from '../components/ui/MediaPlaceholder';
import clubLogo from '../assets/club-logo.webp';

// Activity tiles: abstract pastel gradients (like the reference's Music / Move / Sleep cards)
const ACTIVITY_TILES = {
  football: { icon: MdSportsSoccer, gradient: 'linear-gradient(140deg, #FFB08A 0%, #F7C9A8 35%, #C9E7C4 70%, #9FD7A8 100%)' },
  cricket: { icon: MdSportsCricket, gradient: 'linear-gradient(150deg, #B7C8F5 0%, #D9C6F2 45%, #F6B7C6 100%)' },
  arts: { icon: MdPalette, gradient: 'linear-gradient(140deg, #FFD08A 0%, #FFB0A0 45%, #F49AC1 100%)' },
  community: { icon: MdVolunteerActivism, gradient: 'linear-gradient(150deg, #A9E2D0 0%, #C9E3F2 50%, #D8C4F4 100%)' },
};

// Facts from the club's own posts
const STATS = [
  { value: '3,000+', label: 'Instagram followers' },
  { value: 'Onam', label: 'Celebrated since 2K20' },
  { value: 'Gold', label: 'State kickboxing 2026' },
  { value: 'SLK', label: 'Player in Super League Kerala' },
];

const MEMBER_PERKS = [
  { icon: FiCreditCard, label: 'Official digital ID card' },
  { icon: FiStar, label: 'Onam games, matches & club events' },
  { icon: FiHeart, label: 'Clean-up & community drives' },
  { icon: FiUsers, label: "Back Vellur's young talent" },
];

function SectionHeading({ eyebrow, title, strong, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">{eyebrow}</p>
        <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink tracking-tight mt-1.5">
          {title} <span className="font-bold">{strong}</span>
        </h2>
      </div>
      {action}
    </div>
  );
}

function SeeAll({ to, children }) {
  return (
    <Link to={to} className="pill shrink-0">
      {children} <FiArrowUpRight className="text-ember" />
    </Link>
  );
}

export default function Home() {
  const { clubInfo, slides, programs, events, news, services, toggleFavourite, isFavourite } = useClubData();
  const { isMember } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [eventFilter, setEventFilter] = useState('All');
  const navigate = useNavigate();

  const comingSoonPrograms = programs.slice(0, 3);
  const latestNews = news.slice(0, 3);
  const nextEvent = events[0];
  const hasSlides = slides.some((s) => s.active !== false);

  const eventCategories = useMemo(
    () => ['All', ...new Set(events.map((e) => e.category).filter(Boolean))].slice(0, 5),
    [events]
  );
  const filteredEvents = (eventFilter === 'All' ? events : events.filter((e) => e.category === eventFilter)).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 space-y-16 sm:space-y-24 animate-fade-in">

      {/* 1. Hero Bento */}
      <section className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

          {/* Club identity card */}
          <div className={`glass relative overflow-hidden ${hasSlides ? 'lg:col-span-5' : 'lg:col-span-12'} rounded-[34px] p-7 sm:p-10 flex flex-col items-center justify-center text-center min-h-[420px]`}>
            <div className="dot-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
            {/* warm glow behind the crest, echoing the reference's orb */}
            <div className="absolute left-1/2 top-[22%] -translate-x-1/2 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(255,160,120,0.45),transparent_68%)] pointer-events-none" aria-hidden="true" />

            <div className="relative flex flex-col items-center">
              <div className="animate-orb w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white p-3 border-4 border-white shadow-[0_18px_40px_-14px_rgba(242,104,58,0.55)] mb-7">
                <img src={clubLogo} alt={`${clubInfo.name} crest`} className="w-full h-full object-contain" />
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                Vellur · Kerala
              </p>

              <h1 className="mt-3 font-display text-[38px] sm:text-[52px] leading-[1.02] font-medium text-ink tracking-tight">
                <span className="font-bold">Universal</span>
                <br />
                Arts &amp; Sports Club
              </h1>

              <p className="mt-5 text-sm sm:text-base text-ink-muted max-w-sm leading-relaxed">
                {clubInfo.tagline}
              </p>
              <p className="mt-1.5 text-xs text-ink-subtle max-w-sm">{clubInfo.taglineMl}</p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 h-12 pl-6 pr-1.5 rounded-full bg-white text-ink text-sm font-bold shadow-[0_12px_28px_-14px_rgba(70,50,90,0.5)] hover:shadow-[0_14px_30px_-12px_rgba(242,104,58,0.55)] transition-all"
                >
                  Club events
                  <span className="w-9 h-9 rounded-full bg-ember text-white flex items-center justify-center">
                    <FiArrowUpRight />
                  </span>
                </Link>
                <Link to="/services" className="text-sm font-semibold text-ink-muted hover:text-ink transition-colors px-3">
                  What we do
                </Link>
              </div>
            </div>
          </div>

          {/* Slider card */}
          {hasSlides && (
            <div className="lg:col-span-7 flex">
              <HomeSlider slides={slides} />
            </div>
          )}
        </div>

        {/* Up-next pill + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {nextEvent && (
            <button
              type="button"
              onClick={() => setSelectedEvent(nextEvent)}
              className="glass lg:col-span-5 rounded-full p-2.5 pr-3 flex items-center gap-4 text-left group"
            >
              {nextEvent.image ? (
                <img
                  src={nextEvent.image}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-white"
                />
              ) : (
                <span className="orb w-14 h-14 shrink-0 border-2 border-white" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">Latest event</p>
                <p className="font-display text-base font-semibold text-ink truncate">{nextEvent.title}</p>
                <p className="text-xs text-ink-muted truncate">
                  {nextEvent.category} <span className="mx-1.5 text-ink-subtle">|</span> {nextEvent.date}
                </p>
              </div>
              <span className="w-11 h-11 shrink-0 rounded-full bg-white text-ember flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(242,104,58,0.6)] group-hover:bg-ember group-hover:text-white transition-all">
                <FiPlay className="fill-current ml-0.5" />
              </span>
            </button>
          )}

          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ${nextEvent ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-[26px] px-5 py-4">
                <p className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-none">{s.value}</p>
                <p className="text-[11px] font-medium text-ink-muted mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Activities — abstract gradient tiles */}
      {services.length > 0 && (
        <section>
          <SectionHeading
            eyebrow="Arts & sports"
            title="What we"
            strong="do"
            action={<SeeAll to="/services">All activities</SeeAll>}
          />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {services.slice(0, 4).map((svc, i) => {
              const tile = ACTIVITY_TILES[svc.id] || ACTIVITY_TILES.community;
              const Icon = tile.icon;
              return (
                <Link
                  key={svc.id}
                  to="/services"
                  className={`rim group relative rounded-[32px] ${i === 0 ? 'col-span-2' : ''} ${i === 3 ? 'col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className="relative h-56 sm:h-72 overflow-hidden rounded-[26px]" style={{ background: tile.gradient }}>
                    {/* soft blurred blobs give the painterly feel of the reference tiles */}
                    <div className="absolute -top-10 -left-6 w-48 h-48 rounded-full bg-white/40 blur-3xl" aria-hidden="true" />
                    <div className="absolute bottom-6 right-0 w-40 h-40 rounded-full bg-white/30 blur-2xl group-hover:scale-125 transition-transform duration-700" aria-hidden="true" />
                    <Icon className="absolute top-5 right-5 text-5xl sm:text-6xl text-white/80 drop-shadow-sm" aria-hidden="true" />
                    <div className="absolute inset-0 fade-light" />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-ink-muted">{svc.category}</p>
                        <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink leading-tight">{svc.title}</h3>
                      </div>
                      <span className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-white text-ember items-center justify-center group-hover:bg-ember group-hover:text-white transition-all">
                        <FiArrowUpRight />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Coming Soon Programs */}
      {comingSoonPrograms.length > 0 && (
        <section>
          <SectionHeading
            eyebrow="Tournaments & camps"
            title="Coming"
            strong="soon"
            action={<SeeAll to="/programs">See all ({programs.length})</SeeAll>}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {comingSoonPrograms.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onClick={() => setSelectedProgram(prog)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Upcoming Events with pill filters */}
      <section>
        <SectionHeading
          eyebrow="Club calendar"
          title="Club"
          strong="events"
          action={<SeeAll to="/events">All events</SeeAll>}
        />

        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-5 -mx-1 px-1">
          {eventCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setEventFilter(cat)}
              className={`pill ${eventFilter === cat ? 'pill-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                isFav={isFavourite(evt.id)}
                onToggleFav={() => toggleFavourite(evt.id)}
                onClick={() => setSelectedEvent(evt)}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-[30px] p-10 text-center text-sm text-ink-muted">
            No events in this category yet.
          </div>
        )}
      </section>

      {/* 5. Membership — pass card + conversation card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

        <div className="glass relative overflow-hidden lg:col-span-7 rounded-[34px] p-7 sm:p-10">
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,170,140,0.45),transparent_70%)] pointer-events-none" aria-hidden="true" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="orb w-10 h-10" aria-hidden="true" />
                <span className="font-display text-xl font-bold text-ink">Membership</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink tracking-tight leading-[1.1]">
                The whole club for <span className="font-bold">₹200</span> a year.
              </h2>
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                Be part of Vellur's arts &amp; sports family — club events, matches, community drives and an official digital ID card.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/membership"
                  className="inline-flex items-center gap-2 h-12 pl-6 pr-1.5 rounded-full bg-white text-ink text-sm font-bold shadow-[0_12px_28px_-14px_rgba(70,50,90,0.5)] hover:shadow-[0_14px_30px_-12px_rgba(242,104,58,0.55)] transition-all"
                >
                  {isMember ? 'View my ID card' : 'Apply now'}
                  <span className="w-9 h-9 rounded-full bg-ember text-white flex items-center justify-center">
                    <FiArrowUpRight />
                  </span>
                </Link>
                <Link to="/about" className="text-sm font-semibold text-ink-muted hover:text-ink transition-colors px-2">
                  Our story
                </Link>
              </div>
            </div>

            {/* "Others"-style perk menu */}
            <div className="rounded-[28px] bg-white/55 border border-white p-3">
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">Included</p>
              <ul>
                {MEMBER_PERKS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3.5 px-3 py-3.5 text-sm font-medium text-ink">
                    <Icon className="text-lg text-ink-muted shrink-0" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Conversation card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass relative overflow-hidden rounded-[34px] p-6 sm:p-7 flex-1">
            <div className="dot-grid absolute inset-0 pointer-events-none opacity-70" aria-hidden="true" />
            <div className="relative space-y-5">
              <div className="text-right">
                <p className="inline-flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="orb w-5 h-5" aria-hidden="true" /> You
                </p>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                  I'd love to get involved with the club, but I don't know anyone yet. Where do I start?
                </p>
              </div>
              <div className="h-px bg-black/5" />
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="orb w-5 h-5" aria-hidden="true" /> Universal Club
                </p>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                  Just come along 🌿 Our Onam games, matches and clean-up drives are open to everyone in Vellur.
                  Message us on Instagram and we'll tell you what's coming up next.
                </p>
              </div>
            </div>
          </div>

          <a
            href={clubInfo.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-strong rounded-full h-14 pl-6 pr-2 flex items-center justify-between gap-3 text-sm text-ink-subtle hover:text-ink transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <FiInstagram /> Message us on Instagram…
            </span>
            <span className="w-10 h-10 rounded-full bg-ember-soft text-ember flex items-center justify-center">
              <FiSend />
            </span>
          </a>
        </div>
      </section>

      {/* 6. Latest News */}
      {latestNews.length > 0 && (
        <section>
          <SectionHeading eyebrow="Proud moments" title="Latest" strong="news" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {latestNews.map((item) => (
              <article key={item.id} className="glass rounded-[30px] p-2 flex flex-col">
                <div className="aspect-[16/10] overflow-hidden rounded-[24px] bg-white">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <MediaPlaceholder label={item.category} />
                  )}
                </div>

                <div className="px-3 pt-4 pb-3 flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                    <span className="font-semibold text-ink">{item.category}</span>
                    <span className="w-1 h-1 rounded-full bg-ink-subtle" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>
                  <p className="mt-auto pt-2 text-[11px] text-ink-subtle">{item.author}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Event Details Modal Dialog */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
        maxWidth="max-w-2xl"
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div className="aspect-[16/9] rounded-[24px] overflow-hidden bg-slate-100">
              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MediaPlaceholder label={selectedEvent.category} />
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip label={selectedEvent.category} />
              {selectedEvent.price && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-bold text-xs">
                  {selectedEvent.price}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-ember text-base" />
                <span><strong>Date:</strong> {selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-ember text-base" />
                <span><strong>Day / time:</strong> {selectedEvent.time || '—'}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <FiMapPin className="text-ember text-base shrink-0" />
                <span><strong>Venue:</strong> {selectedEvent.location}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Event</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSelectedEvent(null);
                  navigate('/membership');
                }}
              >
                Become a Member to Join
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Program Details Modal */}
      <Modal
        isOpen={Boolean(selectedProgram)}
        onClose={() => setSelectedProgram(null)}
        title={selectedProgram?.title || 'Program Overview'}
        maxWidth="max-w-2xl"
      >
        {selectedProgram && (
          <div className="space-y-5">
            <div className="aspect-[16/9] rounded-[24px] overflow-hidden bg-slate-900">
              <img
                src={selectedProgram.posterUrl}
                alt={selectedProgram.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-ember-soft text-ember font-bold text-xs">
                Coming soon
              </span>
              <Chip label={selectedProgram.category} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-ember text-base" />
                <span><strong>Scheduled:</strong> {selectedProgram.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-ember text-base" />
                <span><strong>Time:</strong> {selectedProgram.time}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <FiMapPin className="text-ember text-base shrink-0" />
                <span><strong>Venue:</strong> {selectedProgram.location}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedProgram.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  alert('Thank you for your interest! We will notify you once registrations go live.');
                  setSelectedProgram(null);
                }}
              >
                Register Interest
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
