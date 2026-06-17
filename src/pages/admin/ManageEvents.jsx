// Manage Events CRUD Page
import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiUsers, FiCalendar, FiClock, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const ManageEvents = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useClubData();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewRegistrantsEvent, setViewRegistrantsEvent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Competition',
    price: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Filtering Logic
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Competition',
      price: '$10.00',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      price: event.price,
      image: event.image
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time.trim()) errors.time = 'Time is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.price.trim()) errors.price = 'Price is required (e.g. Free, $15.00)';
    if (!formData.image.trim()) errors.image = 'Cover Image URL is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await createEvent(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This removes all current registrations.')) {
      await deleteEvent(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Events</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Design, edit, and cancel club events</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <FiPlus /> Add New Event
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-900/30 border border-gray-850">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Search event title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold shrink-0">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Competition">Competition</option>
            <option value="Training">Training</option>
            <option value="Workshop">Workshop</option>
            <option value="Community Activities">Community Activities</option>
          </select>
        </div>
      </div>

      {/* Events Table List */}
      {loading.events && events.length === 0 ? (
        <Spinner text="Fetching events schedules..." />
      ) : (
        <div className="rounded-2xl border border-gray-850 bg-gray-900/10 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-850/80 bg-slate-900/25">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Event details</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Venue</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Admission</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Registrants</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">No events found.</td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="text-gray-300 hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-850 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white leading-snug truncate">{event.title}</p>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 mt-0.5 block">{event.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white flex items-center gap-1"><FiCalendar className="text-primary text-[10px]" /> {event.date}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5 flex items-center gap-1"><FiClock className="text-gray-600 text-[10px]" /> {event.time}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className="flex items-center gap-1 truncate max-w-[120px]"><FiMapPin className="text-primary shrink-0" /> {event.location}</span>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">
                      <span className="flex items-center gap-0.5"><FiDollarSign /> {event.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewRegistrantsEvent(event)}
                        className="flex items-center gap-1.5 px-3 py-1 border border-gray-800 hover:border-gray-700 bg-gray-950 text-gray-300 rounded-lg hover:text-white transition-all"
                        title="View list of registrants"
                      >
                        <FiUsers className="text-primary" />
                        <span className="font-semibold">{event.registrations?.length || 0}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(event)}
                          className="p-2 bg-gray-850 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 border border-gray-800 hover:border-indigo-500/20 rounded-lg transition-all"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 bg-gray-850 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-800 hover:border-red-500/20 rounded-lg transition-all"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Modify Event Schedule' : 'Schedule New Event'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="event-form-title">Event Title</label>
            <input
              id="event-form-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="Universal Endurance Cup"
            />
            {formErrors.title && <p className="text-red-500 text-[10px] mt-1">{formErrors.title}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="event-form-desc">Event Description</label>
            <textarea
              id="event-form-desc"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="form-input text-sm"
              placeholder="Describe what the event covers, criteria to join, rewards, etc."
            ></textarea>
            {formErrors.description && <p className="text-red-500 text-[10px] mt-1">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="event-form-date">Event Date</label>
              <input
                id="event-form-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="form-input text-sm"
              />
              {formErrors.date && <p className="text-red-500 text-[10px] mt-1">{formErrors.date}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="event-form-time">Start Time</label>
              <input
                id="event-form-time"
                type="text"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="form-input text-sm"
                placeholder="09:00 AM"
              />
              {formErrors.time && <p className="text-red-500 text-[10px] mt-1">{formErrors.time}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="event-form-category">Category</label>
              <select
                id="event-form-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input text-sm"
              >
                <option value="Competition">Competition</option>
                <option value="Training">Training</option>
                <option value="Workshop">Workshop</option>
                <option value="Community Activities">Community Activities</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="event-form-price">Ticket Price</label>
              <input
                id="event-form-price"
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input text-sm"
                placeholder="E.g. Free, $15.00"
              />
              {formErrors.price && <p className="text-red-500 text-[10px] mt-1">{formErrors.price}</p>}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="event-form-image">Cover Image URL</label>
            <input
              id="event-form-image"
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="Unsplash URL"
            />
            {formErrors.image && <p className="text-red-500 text-[10px] mt-1">{formErrors.image}</p>}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-1/2 py-2.5 border border-gray-800 hover:border-gray-700 text-xs font-bold text-gray-400 hover:text-white rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              {editingEvent ? 'Save Changes' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Registrants Viewer Modal */}
      {viewRegistrantsEvent && (
        <Modal
          isOpen={!!viewRegistrantsEvent}
          onClose={() => setViewRegistrantsEvent(null)}
          title={`Registrants: ${viewRegistrantsEvent.title}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Event Date: <span className="text-white font-medium">{viewRegistrantsEvent.date}</span></span>
              <span>Total Registry: <span className="text-primary font-bold">{viewRegistrantsEvent.registrations?.length || 0}</span></span>
            </div>
            
            <div className="border border-gray-850 rounded-xl overflow-hidden max-h-80 overflow-y-auto custom-scrollbar">
              {(!viewRegistrantsEvent.registrations || viewRegistrantsEvent.registrations.length === 0) ? (
                <p className="text-xs text-gray-500 p-6 text-center">No registrants currently joined this event.</p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-850/80 bg-slate-900/40">
                      <th className="px-4 py-2 font-medium">Name</th>
                      <th className="px-4 py-2 font-medium">Email</th>
                      <th className="px-4 py-2 font-medium">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900/60 text-gray-300">
                    {viewRegistrantsEvent.registrations.map((reg, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/20">
                        <td className="px-4 py-3 font-semibold text-white">{reg.name}</td>
                        <td className="px-4 py-3">{reg.email}</td>
                        <td className="px-4 py-3 text-gray-400">{reg.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setViewRegistrantsEvent(null)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white rounded-lg transition-all"
              >
                Close Listing
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default ManageEvents;
