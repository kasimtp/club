// Manage Gallery CRUD Page
import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiVideo, FiImage, FiExternalLink, FiFilter } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const ManageGallery = () => {
  const { gallery, loading, createGalleryItem, deleteGalleryItem } = useClubData();

  // Filter State
  const [activeType, setActiveType] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'photo',
    url: '',
    coverImage: '',
    category: 'Training'
  });
  const [formErrors, setFormErrors] = useState({});

  const categories = ['Training', 'Events', 'Workshops', 'Social'];

  const filteredItems = gallery.filter((item) => {
    const matchesType = activeType === 'All' || item.type === activeType;
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesType && matchesCategory;
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
      category: 'Training'
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
    if (!formData.url.trim()) errors.url = 'Media URL link is required';
    if (formData.type === 'video' && !formData.coverImage.trim()) {
      errors.coverImage = 'Video cover image placeholder URL is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = { ...formData };
      if (formData.type === 'photo') {
        delete payload.coverImage; // Only store on video
      }
      await createGalleryItem(payload);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      await deleteGalleryItem(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Gallery</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Upload and catalog photographs and video logs</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <FiPlus /> Add Media Item
        </button>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-900/30 border border-gray-850">
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold shrink-0">Type:</span>
          <select
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="photo">Photos Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold shrink-0">Category:</span>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Media Listings Grid */}
      {loading.gallery && gallery.length === 0 ? (
        <Spinner text="Loading gallery contents..." />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/10 border border-dashed border-gray-850 rounded-3xl">
          <p className="text-gray-500 text-xs">No media items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-gray-850 bg-gray-900/30 aspect-video shadow-md hover:border-gray-750 transition-all flex flex-col justify-end"
            >
              {/* Media Content */}
              <img
                src={item.type === 'video' ? item.coverImage : item.url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {/* Cover Shadow */}
              <div className="absolute inset-0 bg-black/60 opacity-60 group-hover:opacity-80 transition-opacity"></div>

              {/* Actions Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-950/80 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 text-white text-xs transition-all flex items-center justify-center"
                  title="Open Source Link"
                >
                  <FiExternalLink />
                </a>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-gray-950/80 hover:bg-red-500/80 border border-gray-800 hover:border-red-500/20 text-red-400 hover:text-white text-xs transition-all flex items-center justify-center"
                  title="Remove Item"
                >
                  <FiTrash2 />
                </button>
              </div>

              {/* Bottom detail tag */}
              <div className="p-4 relative z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase text-gray-400">
                    {item.type === 'video' ? <><FiVideo /> Video</> : <><FiImage /> Photo</>}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight truncate">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Media Content"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="gallery-form-title">Media Title</label>
            <input
              id="gallery-form-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="E.g. Weightlifting Masterclass"
            />
            {formErrors.title && <p className="text-red-500 text-[10px] mt-1">{formErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="gallery-form-type">Media Type</label>
              <select
                id="gallery-form-type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-input text-sm"
              >
                <option value="photo">Photo / Image</option>
                <option value="video">Video Log</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="gallery-form-category">Category</label>
              <select
                id="gallery-form-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="gallery-form-url">Media Source Link</label>
            <input
              id="gallery-form-url"
              type="text"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="E.g. https://images.unsplash.com/... or mp4 file link"
            />
            {formErrors.url && <p className="text-red-500 text-[10px] mt-1">{formErrors.url}</p>}
          </div>

          {formData.type === 'video' && (
            <div>
              <label className="form-label" htmlFor="gallery-form-cover">Video Poster Cover URL</label>
              <input
                id="gallery-form-cover"
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                className="form-input text-sm"
                placeholder="Unsplash thumbnail for the video poster image"
              />
              {formErrors.coverImage && <p className="text-red-500 text-[10px] mt-1">{formErrors.coverImage}</p>}
            </div>
          )}

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
              className="w-1/2 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageGallery;
