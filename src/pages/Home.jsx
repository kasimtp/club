// Home Page Component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, FiAward, FiCalendar, FiUsers, 
  FiTarget, FiCheckCircle, FiChevronRight, FiMapPin, FiClock 
} from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';
import HomeSlider from '../components/HomeSlider';
import EventCard from '../components/EventCard';
import ProgramCard from '../components/ProgramCard';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import Modal from '../components/ui/Modal';

export default function Home() {
  const { slides, programs, events, news, toggleFavourite, isFavourite } = useClubData();
  const { isMember } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const navigate = useNavigate();

  // Filter top programs & upcoming events
  const comingSoonPrograms = programs.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);
  const latestNews = news.slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 animate-fade-in">
      
      {/* 1. Hero Media Slider Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <HomeSlider slides={slides} />
      </section>

      {/* 2. Quick Highlight Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0 font-bold">
              <FiAward />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">500+</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Members</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl shrink-0 font-bold">
              <FiCalendar />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">15+</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Annual Events</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-mint-50 bg-[#E3F9F0] text-[#0FA968] flex items-center justify-center text-xl shrink-0 font-bold">
              <FiTarget />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">4</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sports Arenas</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl shrink-0 font-bold">
              <FiUsers />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">100%</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Community Synergized</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Programs Rail ("Coming Soon") */}
      {comingSoonPrograms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  Exclusive Tournaments & Camps
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Coming Soon Programs
              </h2>
            </div>

            <Link
              to="/programs"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-slate-600 transition-colors"
            >
              See all ({programs.length}) <FiChevronRight />
            </Link>
          </div>

          {/* Desktop/Tablet Grid & Mobile Horizontal Snapping Rail */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-2">
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

      {/* 4. Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Official Calendar
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Upcoming Club Events
            </h2>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-slate-600 transition-colors"
          >
            All Events <FiChevronRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              isFav={isFavourite(evt.id)}
              onToggleFav={() => toggleFavourite(evt.id)}
              onClick={() => setSelectedEvent(evt)}
            />
          ))}
        </div>
      </section>

      {/* 5. Membership Promo Card (₹200 / Year Hero Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0B] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Background Ambient Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
                <FiAward /> Annual Club Membership
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Unlock Full Club Access for Just <span className="text-amber-400">₹200 / Year</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                Become an official member of Universal Sports & Arts Club. Gain immediate entry to our athletic training zones, priority court bookings, tournament participation, and an official Digital Membership ID Pass.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <FiCheckCircle className="text-amber-400 text-base shrink-0" />
                  <span>Official Digital Pass with CLUB-ID</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <FiCheckCircle className="text-amber-400 text-base shrink-0" />
                  <span>Free entry to club fitness workshops</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <FiCheckCircle className="text-amber-400 text-base shrink-0" />
                  <span>Badminton synthetic court privileges</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <FiCheckCircle className="text-amber-400 text-base shrink-0" />
                  <span>Community tournaments & social events</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Button
                  onClick={() => navigate('/membership')}
                  variant="amber"
                  size="lg"
                  iconRight={FiArrowRight}
                >
                  {isMember ? 'View My Membership ID' : 'Apply for Membership (₹200)'}
                </Button>

                <Link
                  to="/about"
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Explore club mission & history →
                </Link>
              </div>
            </div>

            {/* Right Mini ID Card Graphic */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-4 shadow-xl select-none">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                      USAC
                    </div>
                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">Universal Pass</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">2026-27</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-xl bg-slate-800 border border-amber-400/50 flex items-center justify-center text-amber-400 font-bold text-xs">
                    PHOTO
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-white">YOUR NAME</p>
                    <p className="text-[10px] font-mono text-amber-400">CLUB-XXXXXX</p>
                    <p className="text-[9px] text-slate-400">Valid: 1 Year</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-center">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                    ★ OFFICIAL MEMBER PASS ★
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Latest News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Bulletin & Achievements
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Latest Club News
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-900">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Author: {item.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Event Details Modal Dialog */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
        maxWidth="max-w-2xl"
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip label={selectedEvent.category} />
              {selectedEvent.price && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-bold text-xs">
                  {selectedEvent.price}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-amber-500 text-base" />
                <span><strong>Date:</strong> {selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-amber-500 text-base" />
                <span><strong>Time:</strong> {selectedEvent.time || 'TBA'}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <FiMapPin className="text-sky-500 text-base shrink-0" />
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
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={selectedProgram.posterUrl}
                alt={selectedProgram.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-violet-600 text-white font-extrabold text-xs uppercase tracking-wider">
                Coming Soon
              </span>
              <Chip label={selectedProgram.category} />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-violet-500 text-base" />
                <span><strong>Scheduled:</strong> {selectedProgram.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-violet-500 text-base" />
                <span><strong>Time:</strong> {selectedProgram.time}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <FiMapPin className="text-sky-500 text-base shrink-0" />
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
