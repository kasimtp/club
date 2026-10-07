import React, { useState } from 'react';
import { FiCalendar, FiMapPin, FiHeart } from 'react-icons/fi';
import MediaPlaceholder from './ui/MediaPlaceholder';

export default function EventCard({ event, isFav, onToggleFav, onClick }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (!event) return null;

  return (
    <div
      onClick={onClick}
      className="glass group relative flex flex-col rounded-[30px] p-2 cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      {/* Event Image Banner */}
      <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] bg-white">
        {event.image && !imageFailed ? (
          <img
            src={event.image}
            onError={() => setImageFailed(true)}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <MediaPlaceholder />
        )}

        {/* Category Badge Top Left */}
        <span className="absolute top-3 left-3 h-7 px-3 inline-flex items-center rounded-full bg-white/90 text-[11px] font-semibold text-ink">
          {event.category || 'Event'}
        </span>

        {/* Favourite Button Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav && onToggleFav(event.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFav
              ? 'bg-ember text-white shadow-md'
              : 'bg-white/90 hover:bg-white text-ink-muted hover:text-ember'
          }`}
          aria-label="Save event"
        >
          <FiHeart className={`text-sm ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Bottom Left */}
        {event.price && (
          <div className="absolute bottom-3 left-3 max-w-[85%] truncate h-7 px-3 inline-flex items-center rounded-full bg-white/90 text-ink text-[11px] font-semibold">
            {event.price}
          </div>
        )}
      </div>

      {/* Event Details Content */}
      <div className="px-3 pt-4 pb-3 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-semibold text-ink leading-snug line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-1.5 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-ember shrink-0" />
            <span className="font-semibold text-ink">{event.date}</span>
            {event.time && <span className="text-ink-subtle">• {event.time}</span>}
          </div>

          {event.location && (
            <div className="flex items-center gap-2 truncate">
              <FiMapPin className="text-ink-subtle shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
