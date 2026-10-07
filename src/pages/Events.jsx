// Events Directory & Calendar Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCalendar, FiClock, FiMapPin, FiX } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import EventCard from '../components/EventCard';
import Chip from '../components/ui/Chip';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import MediaPlaceholder from '../components/ui/MediaPlaceholder';

export default function Events() {
  const { events, toggleFavourite, isFavourite } = useClubData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const categories = ['All', ...new Set(events.map((e) => e.category).filter(Boolean))];

  const filteredEvents = events.filter((evt) => {
    const matchesCategory = selectedCategory === 'All' || evt.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      evt.title.toLowerCase().includes(query) ||
      evt.description.toLowerCase().includes(query) ||
      (evt.location || '').toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            Club calendar
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Club Events & Calendar
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Celebrations, matches and community drives organised by Universal Arts &amp; Sports Club in Vellur.
        </p>
      </div>

      {/* Search & Category Filter Rail */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="form-input pl-11 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Horizontal Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              variant={cat === 'All' ? 'slate' : 'auto'}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Events Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3 font-semibold">
        <span>Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</span>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-amber-600 hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Events Responsive Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <FiCalendar className="text-4xl text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching events found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Try adjusting your search criteria or category filter to find club activities.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </Button>
        </div>
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
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-amber-500 text-base" />
                <span><strong>Date:</strong> {selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-amber-500 text-base" />
                <span><strong>Day / time:</strong> {selectedEvent.time || '—'}</span>
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

    </div>
  );
}
