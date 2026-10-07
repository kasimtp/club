// Programs & Tournaments List Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiAward } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import ProgramCard from '../components/ProgramCard';

export default function Programs() {
  const { programs } = useClubData();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            Tournaments & programmes
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Upcoming Programs
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Tournaments, competitions and programmes the club is planning next. Follow us on Instagram to hear first.
        </p>
      </div>

      {/* Programs Grid */}
      {programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <ProgramCard
              key={prog.id}
              program={prog}
              onClick={() => navigate(`/programs/${prog.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-[30px] p-10 text-center space-y-2">
          <div className="orb w-12 h-12 mx-auto" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-ink">Nothing announced yet</h3>
          <p className="text-sm text-ink-muted">New tournaments and programmes will appear here as soon as they're announced.</p>
        </div>
      )}

    </div>
  );
}
