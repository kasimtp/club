import React from 'react';
import { FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { ikUrl } from '../services/imagekitService';

export default function ProgramCard({ program, onClick }) {
  if (!program) return null;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col cursor-pointer"
    >
      {/* Rimmed poster */}
      <div className="rim rounded-[32px] transition-transform duration-300 group-hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] bg-white">
          <img
            src={ikUrl(program.posterUrl, { width: 800 }) || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'}
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 fade-light opacity-70" />

          {/* Coming Soon Pill Top Left */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white/90 text-ink text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-ember" />
            Coming soon
          </span>

          {/* Arrow Bottom Right */}
          <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-ember group-hover:bg-ember group-hover:text-white flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(242,104,58,0.6)] transition-all">
            <FiArrowUpRight className="text-lg" />
          </span>
        </div>
      </div>

      {/* Caption under the card */}
      <div className="px-2 pt-4 space-y-1">
        <h3 className="font-display text-lg font-semibold text-ink leading-snug line-clamp-2">
          {program.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span>{program.category || 'Tournament'}</span>
          <span className="w-1 h-1 rounded-full bg-ink-subtle" />
          <span>{program.date}</span>
        </div>
        {program.location && (
          <div className="flex items-center gap-1.5 text-[11px] text-ink-subtle pt-0.5">
            <FiMapPin className="shrink-0" />
            <span className="truncate">{program.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
