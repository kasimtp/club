// Events Listing and Detail Page
import React, { useState } from 'react';
import { FiSearch, FiCalendar, FiMapPin, FiDollarSign, FiClock, FiCheck, FiArrowRight, FiUsers } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

const Events = () => {
  const { events, loading, registerForEvent } = useClubData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [formErrors, setFormErrors] = useState({});
  const [regSuccess, setRegSuccess] = useState(false);

  const categories = ['All', 'Competition', 'Workshop', 'Training', 'Community Activities'];

  // Handle Search & Filter logic
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenDetails = (event) => {
    setSelectedEvent(event);
    setFormData({ name: '', email: '', phone: '' });
    setFormErrors({});
    setRegSuccess(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[0-9\s-]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsRegistering(true);
    try {
      await registerForEvent(selectedEvent.id, formData);
      setRegSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Club Calendar</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Events & Tournaments
        </h1>
        <p className="text-gray-400 text-lg">
          Reserve your slot for training programs, seasonal competitions, workshops, and team gatherings.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/30 border border-gray-850">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 uppercase tracking-wider ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-gray-950 text-gray-400 hover:text-white hover:bg-gray-850 border border-gray-800'
              }`}
            >
              {cat === 'Community Activities' ? 'Community' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading.events ? (
        <Spinner text="Loading club events..." />
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/10 border border-dashed border-gray-850 rounded-3xl">
          <p className="text-gray-500 text-base">No events matches your filters. Adjust search parameters or view other categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="group flex flex-col md:flex-row bg-gray-900/30 rounded-3xl border border-gray-850 overflow-hidden hover-lift h-full"
            >
              {/* Event Image */}
              <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] uppercase tracking-wider font-extrabold text-primary border border-primary/20">
                  {event.category}
                </span>
              </div>

              {/* Event Info */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><FiCalendar /> {event.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><FiClock /> {event.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-850/45">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FiMapPin className="text-primary" />
                    <span className="truncate max-w-[120px] sm:max-w-xs">{event.location}</span>
                  </div>
                  <button
                    onClick={() => handleOpenDetails(event)}
                    className="px-4 py-2 bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white text-xs font-bold text-primary rounded-lg transition-all"
                  >
                    View & Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details & Registration Modal */}
      {selectedEvent && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Event Details & Registration"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            
            {/* Banner details */}
            <div className="rounded-xl overflow-hidden h-48 relative border border-gray-850">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-[10px] uppercase tracking-wider font-extrabold text-primary border border-primary/20">
                {selectedEvent.category}
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-950 border border-gray-850">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Date</span>
                <p className="text-xs text-white font-semibold flex items-center gap-1"><FiCalendar className="text-primary" /> {selectedEvent.date}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Time</span>
                <p className="text-xs text-white font-semibold flex items-center gap-1"><FiClock className="text-primary" /> {selectedEvent.time}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Location</span>
                <p className="text-xs text-white font-semibold flex items-center gap-1 truncate"><FiMapPin className="text-primary" /> {selectedEvent.location}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Ticket Cost</span>
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-0.5"><FiDollarSign /> {selectedEvent.price}</p>
              </div>
            </div>

            {/* Title & description */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{selectedEvent.description}</p>
              {selectedEvent.registrations && selectedEvent.registrations.length > 0 && (
                <p className="text-xs text-indigo-400 flex items-center gap-1 pt-1">
                  <FiUsers /> Joined by {selectedEvent.registrations.length} competitors
                </p>
              )}
            </div>

            {/* Registration Form / Success */}
            <div className="border-t border-gray-850/80 pt-6">
              {regSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl mx-auto">
                    <FiCheck />
                  </div>
                  <h4 className="text-base font-bold text-white">Registration Complete!</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Congratulations, your spot has been secured. A confirmation email with credentials has been dispatched.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-all"
                  >
                    Return to Listing
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300">Submit Slot Reservation</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label" htmlFor="reg-name">Full Name</label>
                      <input
                        id="reg-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input text-sm"
                        placeholder="John Doe"
                      />
                      {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="form-label" htmlFor="reg-email">Email Address</label>
                      <input
                        id="reg-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input text-sm"
                        placeholder="john@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="reg-phone">Phone Number</label>
                    <input
                      id="reg-phone"
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                    {formErrors.phone && <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-gray-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    {isRegistering ? 'Processing Reservation...' : 'Complete Free Registration'}
                    {!isRegistering && <FiArrowRight />}
                  </button>
                </form>
              )}
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};

export default Events;
