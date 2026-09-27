import React from 'react';
import { FiCalendar, FiClock, FiMapPin, FiHeart } from 'react-icons/fi';
import Chip from './ui/Chip';

export default function EventCard({ event, isFav, onToggleFav, onClick }) {
  if (!event) return null;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer"
    >
      {/* Event Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1526676096777-b65d49bb93c7?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge Top Left */}
        <div className="absolute top-3 left-3">
          <Chip label={event.category || 'Event'} />
        </div>

        {/* Favourite Button Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav && onToggleFav(event.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            isFav 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label="Save event"
        >
          <FiHeart className={`text-base ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Bottom Right */}
        {event.price && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold">
            {event.price}
          </div>
        )}
      </div>

      {/* Event Details Content */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Metadata Chips */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-amber-500 shrink-0" />
            <span className="font-semibold">{event.date}</span>
            {event.time && <span className="text-slate-400">• {event.time}</span>}
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-slate-500 truncate">
              <FiMapPin className="text-sky-500 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
