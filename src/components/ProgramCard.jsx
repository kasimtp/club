import React from 'react';
import { FiCalendar, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import Chip from './ui/Chip';

export default function ProgramCard({ program, onClick }) {
  if (!program) return null;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer"
    >
      {/* Poster Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={program.posterUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Coming Soon Pill Top Left */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-violet-600 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-md">
            Coming Soon
          </span>
        </div>

        {/* Category Badge Top Right */}
        <div className="absolute top-3 right-3">
          <Chip label={program.category || 'Tournament'} />
        </div>
      </div>

      {/* Program Details */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2">
            {program.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {program.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <FiCalendar className="text-violet-500" />
              <span>{program.date}</span>
            </div>
            {program.location && (
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <FiMapPin className="text-slate-400" />
                <span className="truncate max-w-[180px]">{program.location}</span>
              </div>
            )}
          </div>

          <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-black group-hover:text-white text-slate-700 flex items-center justify-center transition-all shrink-0">
            <FiArrowRight className="text-sm" />
          </span>
        </div>
      </div>
    </div>
  );
}
