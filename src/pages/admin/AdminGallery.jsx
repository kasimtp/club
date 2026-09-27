// Admin Gallery Photo Management Page
import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiImage, FiUploadCloud } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Chip from '../../components/ui/Chip';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { uploadMedia } from '../../services/uploadService';

export default function AdminGallery() {
  const { gallery, addGalleryPhoto, removeGalleryPhoto } = useClubData();
  const [selectedCat, setSelectedCat] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [photoForm, setPhotoForm] = useState({
    title: '',
    description: '',
    category: 'Facilities',
    imageUrl: ''
  });

  const categories = ['All', 'Facilities', 'Sports', 'Events', 'Community', 'General'];
  const uploadCats = ['Facilities', 'Sports', 'Events', 'Community', 'General'];

  const filtered = gallery.filter(p => selectedCat === 'All' || p.category?.toLowerCase() === selectedCat.toLowerCase());

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadMedia(file, 'gallery', 'image');
        setPhotoForm(prev => ({ ...prev, imageUrl: url }));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!photoForm.imageUrl || !photoForm.title.trim()) {
      alert('Title and image are required.');
      return;
    }

    setSaving(true);
    try {
      await addGalleryPhoto(photoForm, 'Admin');
      setIsAddOpen(false);
      setPhotoForm({
        title: '',
        description: '',
        category: 'Facilities',
        imageUrl: ''
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Photo Gallery Management</h1>
          <p className="text-xs text-slate-400">Upload community photos, categorize assets, and delete expired media</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={() => setIsAddOpen(true)}
        >
          Add Photo
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            variant="slate"
            active={selectedCat === cat}
            onClick={() => setSelectedCat(cat)}
          />
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xs"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Category Pill Top Left */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-bold">
                {photo.category}
              </span>
            </div>

            {/* Delete Floating Trash Button Top Right */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete photo "${photo.title}"?`)) {
                  removeGalleryPhoto(photo.id);
                }
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md"
              title="Delete Photo"
            >
              <FiTrash2 className="text-xs" />
            </button>

            {/* Bottom Title Bar */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
              <p className="text-xs font-bold text-white truncate">{photo.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Upload Photo to Gallery"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
          <div>
            <label className="form-label">Photo Title *</label>
            <input
              type="text"
              value={photoForm.title}
              onChange={(e) => setPhotoForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Badminton Final Match"
              className="form-input text-xs"
              required
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {uploadCats.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  active={photoForm.category === cat}
                  onClick={() => setPhotoForm(prev => ({ ...prev, category: cat }))}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Select Image File *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="form-input pt-2.5 text-xs text-slate-600"
            />
          </div>

          <div>
            <label className="form-label">Or Image URL</label>
            <input
              type="url"
              value={photoForm.imageUrl}
              onChange={(e) => setPhotoForm(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://..."
              className="form-input text-xs"
            />
          </div>

          <div>
            <label className="form-label">Description / Caption</label>
            <textarea
              value={photoForm.description}
              onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="form-textarea text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Upload Photo
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
