// Gallery Page Component: Photos and Video Grid
import React, { useState } from 'react';
import { FiImage, FiVideo, FiPlay, FiMaximize2, FiCalendar, FiBookOpen, FiCompass } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

const Gallery = () => {
  const { gallery, loading } = useClubData();

  // Filters State
  const [activeType, setActiveType] = useState('All'); // All, photo, video
  const [activeCategory, setActiveCategory] = useState('All'); // All, Training, Events, Workshops, Social

  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Training', 'Events', 'Workshops', 'Social'];
  const types = [
    { value: 'All', label: 'All Media', icon: null },
    { value: 'photo', label: 'Photos Only', icon: FiImage },
    { value: 'video', label: 'Videos Only', icon: FiVideo }
  ];

  // Filtering Logic
  const filteredGallery = gallery.filter((item) => {
    const matchesType = activeType === 'All' || item.type === activeType;
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesType && matchesCategory;
  });

  const handleOpenItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Universal Moments</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Photo & Video Gallery
        </h1>
        <p className="text-gray-400 text-lg">
          Browse training highlights, competitive events, educational seminars, and social activities.
        </p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/30 border border-gray-850">
        {/* Type Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-950 rounded-xl border border-gray-800 w-full sm:w-auto overflow-x-auto shrink-0">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveType(t.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 uppercase tracking-wider ${
                activeType === t.value
                  ? 'bg-primary text-white shadow-md shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.icon && <t.icon className="text-sm" />}
              {t.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-transparent text-gray-400 hover:text-white border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading.gallery ? (
        <Spinner text="Loading gallery..." />
      ) : filteredGallery.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/10 border border-dashed border-gray-850 rounded-3xl">
          <p className="text-gray-500 text-base">No media items match selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="group relative rounded-2xl overflow-hidden border border-gray-850 bg-gray-900/30 cursor-pointer aspect-video shadow-md hover:-translate-y-1 hover:border-gray-750 transition-all duration-300"
            >
              {/* Cover Image */}
              <img
                src={item.type === 'video' ? item.coverImage : item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {/* Hover Darken Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {item.type === 'video' ? (
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                    <FiPlay className="ml-1" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-white text-lg hover:bg-white/20 transition-all">
                    <FiMaximize2 />
                  </div>
                )}
              </div>

              {/* Bottom Label banner */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex flex-col justify-end">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary mb-1">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white leading-tight truncate">
                  {item.title}
                </h4>
              </div>

              {/* Media indicator badge */}
              <span className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-xs text-white border border-gray-800">
                {item.type === 'video' ? <FiVideo /> : <FiImage />}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Video Modal */}
      {selectedItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${selectedItem.category} - ${selectedItem.title}`}
          maxWidth={selectedItem.type === 'video' ? 'max-w-3xl' : 'max-w-2xl'}
        >
          <div className="space-y-4">
            
            {/* Visual content container */}
            {selectedItem.type === 'video' ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black border border-gray-800">
                <video
                  src={selectedItem.url}
                  poster={selectedItem.coverImage}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden max-h-[70vh] bg-slate-950 border border-gray-850 flex justify-center">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full object-contain max-h-[60vh]"
                />
              </div>
            )}

            {/* Description details */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedItem.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Category: <span className="text-indigo-400 font-semibold uppercase">{selectedItem.category}</span></p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-xs font-semibold text-gray-300 rounded-lg transition-all"
              >
                Close View
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};

export default Gallery;
