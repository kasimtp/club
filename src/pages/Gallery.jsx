// Photo Gallery & Lightbox Page
import React, { useState } from 'react';
import { 
  FiPlus, FiX, FiChevronLeft, FiChevronRight, 
  FiImage, FiUploadCloud, FiTag, FiFileText 
} from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';
import Chip from '../components/ui/Chip';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { uploadMedia } from '../services/uploadService';
import { ikUrl } from '../services/imagekitService';

export default function Gallery() {
  const { gallery, addGalleryPhoto } = useClubData();
  const { user, isMember, isAdmin } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  
  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'Events',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = ['All', 'Sports', 'Events', 'Arts', 'Community'];
  const uploadCategories = ['Sports', 'Events', 'Arts', 'Community', 'General'];

  const filteredPhotos = gallery.filter((photo) => {
    if (selectedCategory === 'All') return true;
    return photo.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleOpenLightbox = (index) => {
    setActiveLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const handleNextPhoto = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrevPhoto = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = await uploadMedia(file, 'gallery', 'image');
      setUploadData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.imageUrl) {
      alert('Please select an image file or provide a photo URL.');
      return;
    }
    if (!uploadData.title.trim()) {
      alert('Please enter a photo title.');
      return;
    }

    setUploading(true);
    try {
      await addGalleryPhoto(uploadData, user?.name || 'Club Member');
      setIsUploadOpen(false);
      setUploadData({ title: '', description: '', category: 'Events', imageUrl: '' });
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const currentLightboxPhoto = activeLightboxIndex !== null ? filteredPhotos[activeLightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Visual Archive
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Club Photo Gallery
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Matches, celebrations and community moments from Universal Vellur.
          </p>
        </div>

        {/* Upload Button visible to Members & Admins */}
        {(isMember || isAdmin) && (
          <Button
            variant="primary"
            size="md"
            icon={FiPlus}
            onClick={() => setIsUploadOpen(true)}
          >
            Upload Photo
          </Button>
        )}
      </div>

      {/* Category Filter Rail */}
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

      {/* Photos CSS Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
            >
              <img
                src={ikUrl(photo.imageUrl, { width: 700 })}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] w-fit mb-1">
                  {photo.category || 'General'}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1">{photo.title}</h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <FiImage className="text-4xl text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No photos in this category</h3>
          <p className="text-xs text-slate-400">Try selecting a different filter category to view photos.</p>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {currentLightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
          {/* Close Button */}
          <button
            type="button"
            onClick={handleCloseLightbox}
            className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center transition-all"
            aria-label="Close Lightbox"
          >
            <FiX className="text-2xl" />
          </button>

          {/* Previous Arrow */}
          <button
            type="button"
            onClick={handlePrevPhoto}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center transition-all"
            aria-label="Previous photo"
          >
            <FiChevronLeft className="text-3xl" />
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={handleNextPhoto}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center transition-all"
            aria-label="Next photo"
          >
            <FiChevronRight className="text-3xl" />
          </button>

          {/* Lightbox Center Content */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-4">
            <img
              src={ikUrl(currentLightboxPhoto.imageUrl, { width: 1600 })}
              alt={currentLightboxPhoto.title}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10 animate-scale-in"
            />

            <div className="text-center space-y-1 max-w-lg text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                {currentLightboxPhoto.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold">{currentLightboxPhoto.title}</h3>
              {currentLightboxPhoto.description && (
                <p className="text-xs text-slate-400">{currentLightboxPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Member/Admin Upload Photo Modal Sheet */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Photo to Club Gallery"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="form-label">Photo Title</label>
            <input
              type="text"
              value={uploadData.title}
              onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Badminton Tournament Semi-Finals"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {uploadCategories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  active={uploadData.category === cat}
                  onClick={() => setUploadData(prev => ({ ...prev, category: cat }))}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Select Photo File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-input pt-2.5 text-xs text-slate-600"
            />
          </div>

          <div>
            <label className="form-label">Or Image URL</label>
            <input
              type="url"
              value={uploadData.imageUrl}
              onChange={(e) => setUploadData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://..."
              className="form-input"
            />
          </div>

          {uploadData.imageUrl && (
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={uploadData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="form-label">Description / Caption (Optional)</label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Write a brief note about this photo..."
              rows={2}
              className="form-textarea"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setIsUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={uploading}
            >
              Upload to Gallery
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
