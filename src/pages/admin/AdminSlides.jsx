// Admin Hero Slider CMS Page
import React, { useState } from 'react';
import { 
  FiPlus, FiTrash2, FiVideo, FiImage, FiSliders, 
  FiCheck, FiEye, FiEyeOff, FiLink, FiArrowRight 
} from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Chip from '../../components/ui/Chip';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { uploadMedia } from '../../services/uploadService';

export default function AdminSlides() {
  const { slides, addSlide, toggleSlideStatus, removeSlide } = useClubData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [slideForm, setSlideForm] = useState({
    title: '',
    mediaType: 'image',
    mediaUrl: '',
    ctaLabel: 'Learn More',
    ctaType: 'screen', // 'none' | 'url' | 'screen'
    ctaUrl: '',
    ctaScreen: '/membership',
    order: slides.length + 1,
    active: true
  });

  const screenOptions = [
    { label: 'Membership (Apply / ID)', value: '/membership' },
    { label: 'Events & Calendar', value: '/events' },
    { label: 'Upcoming Programs', value: '/programs' },
    { label: 'Club Gallery', value: '/gallery' },
    { label: 'Heritage & About', value: '/about' },
    { label: 'Sports Facilities', value: '/services' },
    { label: 'Team Leadership', value: '/team' },
    { label: 'Contact Coordinates', value: '/contact' },
  ];

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      try {
        const url = await uploadMedia(file, 'slides', isVid ? 'video' : 'image');
        setSlideForm(prev => ({
          ...prev,
          mediaUrl: url,
          mediaType: isVid ? 'video' : 'image'
        }));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!slideForm.mediaUrl) {
      alert('Please upload an image or video banner, or enter a media URL.');
      return;
    }
    if (!slideForm.title.trim()) {
      alert('Please enter a headline title.');
      return;
    }

    setSaving(true);
    try {
      await addSlide(slideForm);
      setIsAddOpen(false);
      setSlideForm({
        title: '',
        mediaType: 'image',
        mediaUrl: '',
        ctaLabel: 'Learn More',
        ctaType: 'screen',
        ctaUrl: '',
        ctaScreen: '/membership',
        order: slides.length + 2,
        active: true
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
          <h1 className="text-xl font-black text-slate-900">Hero Slider Banner CMS</h1>
          <p className="text-xs text-slate-400">Configure looping videos, images, ordering, and action buttons on the home screen</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={() => setIsAddOpen(true)}
        >
          Add New Slide
        </Button>
      </div>

      {/* Slides Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide) => {
          const isVideo = slide.mediaType === 'video' || slide.mediaUrl?.endsWith('.mp4');

          return (
            <div
              key={slide.id}
              className={`p-5 rounded-3xl bg-white border transition-all shadow-xs space-y-4 ${
                slide.active === false ? 'opacity-60 border-slate-200' : 'border-slate-200'
              }`}
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950">
                {isVideo ? (
                  <video
                    src={slide.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={slide.mediaUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Media Type Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                  {isVideo ? <FiVideo /> : <FiImage />}
                  <span>{isVideo ? 'MP4 Video' : 'Image'}</span>
                </div>

                {/* Order Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] font-black">
                  Order #{slide.order || 1}
                </div>
              </div>

              {/* Title & CTA details */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{slide.title}</h3>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <FiLink className="text-slate-400" />
                    <span>CTA: <strong>{slide.ctaLabel || 'None'}</strong> → {slide.ctaScreen || slide.ctaUrl || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleSlideStatus(slide.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    slide.active !== false 
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {slide.active !== false ? <FiEye /> : <FiEyeOff />}
                  <span>{slide.active !== false ? 'Active' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this slide banner?')) {
                      removeSlide(slide.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                  aria-label="Delete Slide"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slide Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Hero Slider Banner"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
          <div>
            <label className="form-label">Banner Headline Title *</label>
            <input
              type="text"
              value={slideForm.title}
              onChange={(e) => setSlideForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. State-of-the-Art Athletic Complex"
              className="form-input text-xs"
              required
            />
          </div>

          <div>
            <label className="form-label">Upload Video (MP4) or Photo Banner *</label>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm"
              onChange={handleMediaUpload}
              className="form-input pt-2.5 text-xs text-slate-600"
            />
          </div>

          <div>
            <label className="form-label">Or Direct Media URL</label>
            <input
              type="url"
              value={slideForm.mediaUrl}
              onChange={(e) => setSlideForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
              placeholder="https://..."
              className="form-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Button Label Text</label>
              <input
                type="text"
                value={slideForm.ctaLabel}
                onChange={(e) => setSlideForm(prev => ({ ...prev, ctaLabel: e.target.value }))}
                placeholder="Apply Now"
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label">Display Order #</label>
              <input
                type="number"
                value={slideForm.order}
                onChange={(e) => setSlideForm(prev => ({ ...prev, order: e.target.value }))}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Destination Link Target</label>
            <select
              value={slideForm.ctaScreen}
              onChange={(e) => setSlideForm(prev => ({ ...prev, ctaScreen: e.target.value }))}
              className="form-input text-xs"
            >
              {screenOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Save Slide
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
