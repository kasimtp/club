// Admin Hero Slider CMS Page
import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiVideo, FiImage, FiEye, FiEyeOff, FiLink, FiEdit2 } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { uploadMedia, measureMedia } from '../../services/uploadService';
import { videoPosterUrl } from '../../services/imagekitService';
import { isVideoSlide } from '../../utils/media';

export default function AdminSlides() {
  const { slides, addSlide, updateSlide, toggleSlideStatus, removeSlide } = useClubData();
  const [editingId, setEditingId] = useState(null); // null = closed, 'new' = add, otherwise slide id
  const isAddOpen = editingId !== null;
  const isEditing = isAddOpen && editingId !== 'new';
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const blankSlide = () => ({
    title: '',
    mediaType: 'image',
    mediaUrl: '',
    aspectRatio: null,
    posterUrl: '',
    ctaLabel: 'View events',
    ctaType: 'screen', // 'none' | 'url' | 'screen'
    ctaUrl: '',
    ctaScreen: '/events',
    order: slides.length,
    active: true,
  });
  const [slideForm, setSlideForm] = useState(blankSlide);

  const openNew = () => {
    setSlideForm(blankSlide());
    setEditingId('new');
  };

  const openEdit = (slide) => {
    // Slides made in the mobile app store screen names ("Membership") — show them as web paths
    const screen = slide.ctaScreen || '/events';
    setSlideForm({
      ...blankSlide(),
      ...slide,
      ctaType: slide.ctaType || 'screen',
      ctaScreen: screen.startsWith('/') ? screen : `/${screen.toLowerCase()}`,
    });
    setEditingId(slide.id);
  };

  const closeForm = () => setEditingId(null);

  const screenOptions = [
    { label: 'Events', value: '/events' },
    { label: 'Programs', value: '/programs' },
    { label: 'Gallery', value: '/gallery' },
    { label: 'Membership', value: '/membership' },
    { label: 'What We Do', value: '/services' },
    { label: 'About', value: '/about' },
    { label: 'Committee', value: '/team' },
    { label: 'Contact', value: '/contact' },
  ];

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      const kind = isVid ? 'video' : 'image';
      setUploading(true);
      setUploadProgress(0);
      try {
        const [url, aspectRatio] = await Promise.all([
          uploadMedia(file, 'slides', kind, { onProgress: setUploadProgress }),
          measureMedia(file, kind),
        ]);
        setSlideForm(prev => ({
          ...prev,
          mediaUrl: url,
          mediaType: kind,
          aspectRatio,
          posterUrl: kind === 'video' ? videoPosterUrl(url) : '',
        }));
      } catch (err) {
        e.target.value = '';
        alert(err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  // Pasted URLs: guess the type from the extension, then read the real orientation
  const handleUrlBlur = async () => {
    const url = slideForm.mediaUrl.trim();
    if (!url || url.startsWith('data:')) return;
    const kind = isVideoSlide({ mediaUrl: url }) ? 'video' : slideForm.mediaType;
    const aspectRatio = await measureMedia(url, kind);
    setSlideForm(prev => (prev.mediaUrl.trim() === url ? { ...prev, mediaType: kind, aspectRatio } : prev));
  };

  const formIsPortrait = slideForm.aspectRatio && slideForm.aspectRatio < 0.9;

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!slideForm.mediaUrl) {
      alert('Please upload an image or video banner, or enter a media URL.');
      return;
    }
    if (slideForm.ctaType === 'url' && !/^https?:\/\//.test(slideForm.ctaUrl.trim())) {
      alert('Please enter a full link starting with https://');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateSlide(editingId, {
          title: slideForm.title.trim(),
          mediaType: slideForm.mediaType,
          mediaUrl: slideForm.mediaUrl.trim(),
          aspectRatio: Number(slideForm.aspectRatio) || null,
          posterUrl: slideForm.posterUrl || '',
          ctaType: slideForm.ctaType,
          ctaLabel: slideForm.ctaType === 'none' ? '' : slideForm.ctaLabel.trim(),
          ctaScreen: slideForm.ctaType === 'screen' ? slideForm.ctaScreen : '',
          ctaUrl: slideForm.ctaType === 'url' ? slideForm.ctaUrl.trim() : '',
          order: Number(slideForm.order) || 0,
        });
      } else {
        await addSlide({ ...slideForm, title: slideForm.title.trim() });
      }
      closeForm();
    } catch {
      // the error is already shown as a toast; keep the form open so nothing is lost
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">Hero Slider Banner CMS</h1>
          <p className="text-xs text-ink-subtle">Landscape banners, portrait posters and reels (9:16 / 4:5) for the home hero. Videos play to the end before the next slide.</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={openNew}
        >
          Add New Slide
        </Button>
      </div>

      {slides.length === 0 && (
        <div className="glass rounded-[30px] p-10 text-center space-y-3">
          <div className="orb w-12 h-12 mx-auto" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-ink">No slides yet</h3>
          <p className="text-sm text-ink-muted max-w-sm mx-auto">
            Add a poster, photo or reel to show it in the hero on the home page.
          </p>
          <Button variant="primary" size="sm" icon={FiPlus} onClick={openNew}>
            Add your first slide
          </Button>
        </div>
      )}

      {/* Slides Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide) => {
          const isVideo = isVideoSlide(slide);
          const isPortrait = slide.aspectRatio && slide.aspectRatio < 0.9;

          return (
            <div
              key={slide.id}
              className={`glass p-3 rounded-[30px] transition-all space-y-4 ${
                slide.active === false ? 'opacity-60' : ''
              }`}
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[16/9] rounded-[24px] overflow-hidden bg-[#E9E6EC]">
                {isVideo ? (
                  <video
                    src={slide.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full ${isPortrait ? 'object-contain' : 'object-cover'}`}
                  />
                ) : (
                  <img
                    src={slide.mediaUrl}
                    alt={slide.title}
                    className={`w-full h-full ${isPortrait ? 'object-contain' : 'object-cover'}`}
                  />
                )}

                {/* Media Type Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 text-ink text-[10px] font-bold uppercase">
                  {isVideo ? <FiVideo /> : <FiImage />}
                  <span>{isVideo ? 'Video' : 'Image'}{isPortrait ? ' · Portrait' : ''}</span>
                </div>

                {/* Order Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-ember text-white font-mono text-[10px] font-bold">
                  Order #{slide.order || 1}
                </div>
              </div>

              {/* Title & CTA details */}
              <div className="space-y-2 px-2">
                <h3 className="font-display text-base font-bold text-ink line-clamp-1">{slide.title || <span className="text-ink-subtle font-medium">No headline</span>}</h3>
                
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <div className="flex items-center gap-1.5">
                    <FiLink className="text-ink-subtle" />
                    <span>
                      {slide.ctaType === 'none' || (!slide.ctaScreen && !slide.ctaUrl)
                        ? 'No button'
                        : <>Button: <strong>{slide.ctaLabel || 'Open'}</strong> → {slide.ctaType === 'url' ? slide.ctaUrl : slide.ctaScreen}</>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mx-2 mb-1 pt-3 border-t border-black/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleSlideStatus(slide.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    slide.active !== false 
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                      : 'bg-white/70 text-ink-muted hover:bg-white'
                  }`}
                >
                  {slide.active !== false ? <FiEye /> : <FiEyeOff />}
                  <span>{slide.active !== false ? 'Active' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(slide)}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-white text-ink text-xs font-semibold hover:shadow-[0_6px_14px_-8px_rgba(70,50,90,0.4)] transition-all"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this slide banner?')) {
                        removeSlide(slide.id);
                      }
                    }}
                    className="w-9 h-9 rounded-full bg-white text-ink-muted hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Delete slide"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slide Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={closeForm}
        title={isEditing ? 'Edit slide' : 'Add hero slide'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
          <div>
            <label className="form-label">Headline (optional)</label>
            <input
              type="text"
              value={slideForm.title}
              onChange={(e) => setSlideForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Universalonam — Onam 2K26"
              className="form-input text-xs"
            />
          </div>

          <div>
            <label className="form-label">{isEditing ? 'Replace photo, poster or video' : 'Upload photo, poster or video *'}</label>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              onChange={handleMediaUpload}
              disabled={uploading}
              className="form-input pt-2.5 text-xs text-ink-muted"
            />
            <p className="mt-1.5 text-[11px] text-ink-subtle">
              Portrait posters (4:5) and reels (9:16) are framed automatically. {uploading && <strong className="text-ember">Uploading… {uploadProgress}%</strong>}
            </p>
          </div>

          <div>
            <label className="form-label">Or Direct Media URL</label>
            <input
              type="url"
              value={slideForm.mediaUrl}
              onChange={(e) => setSlideForm(prev => ({ ...prev, mediaUrl: e.target.value, aspectRatio: null }))}
              onBlur={handleUrlBlur}
              placeholder="https://..."
              className="form-input text-xs"
            />
          </div>

          <div>
            <label className="form-label">Media Type</label>
            <div className="flex gap-2">
              {['image', 'video'].map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setSlideForm(prev => ({ ...prev, mediaType: kind }))}
                  className={`flex-1 h-11 rounded-full text-xs font-bold inline-flex items-center justify-center gap-1.5 border transition-colors ${
                    slideForm.mediaType === kind
                      ? 'bg-white text-ink border-white shadow-[0_8px_18px_-10px_rgba(70,50,90,0.4)] [&>svg]:text-ember'
                      : 'bg-white/40 text-ink-muted border-white/70 hover:bg-white/70'
                  }`}
                >
                  {kind === 'video' ? <FiVideo /> : <FiImage />}
                  {kind === 'video' ? 'Video' : 'Image'}
                </button>
              ))}
            </div>
          </div>

          {slideForm.mediaUrl && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-white">
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-ink shrink-0">
                {slideForm.mediaType === 'video' ? (
                  <video src={slideForm.mediaUrl} muted autoPlay loop playsInline className="w-full h-full object-contain" />
                ) : (
                  <img src={slideForm.mediaUrl} alt="" className="w-full h-full object-contain" />
                )}
              </div>
              <div className="text-xs text-ink-muted">
                <p className="font-bold text-ink">
                  {slideForm.aspectRatio ? (formIsPortrait ? 'Portrait' : 'Landscape') : 'Checking size…'}
                </p>
                <p>
                  {formIsPortrait
                    ? 'Shown as a framed poster on desktop, full-screen on phones.'
                    : 'Fills the hero card edge to edge.'}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Button on the slide</label>
            <div className="grid grid-cols-3 gap-2">
              {[['none', 'No button'], ['screen', 'Website page'], ['url', 'Other link']].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSlideForm(prev => ({ ...prev, ctaType: value }))}
                  className={`h-11 rounded-full text-xs font-bold border transition-colors ${
                    slideForm.ctaType === value
                      ? 'bg-white text-ink border-white shadow-[0_8px_18px_-10px_rgba(70,50,90,0.4)]'
                      : 'bg-white/40 text-ink-muted border-white/70 hover:bg-white/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {slideForm.ctaType !== 'none' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label">Button text</label>
                <input
                  type="text"
                  value={slideForm.ctaLabel}
                  onChange={(e) => setSlideForm(prev => ({ ...prev, ctaLabel: e.target.value }))}
                  placeholder="View events"
                  className="form-input text-xs"
                />
              </div>
              {slideForm.ctaType === 'screen' ? (
                <div>
                  <label className="form-label">Opens page</label>
                  <select
                    value={slideForm.ctaScreen}
                    onChange={(e) => setSlideForm(prev => ({ ...prev, ctaScreen: e.target.value }))}
                    className="form-input text-xs"
                  >
                    {[...screenOptions, ...(screenOptions.some(o => o.value === slideForm.ctaScreen) ? [] : [{ label: slideForm.ctaScreen, value: slideForm.ctaScreen }])].map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="form-label">Link</label>
                  <input
                    type="url"
                    value={slideForm.ctaUrl}
                    onChange={(e) => setSlideForm(prev => ({ ...prev, ctaUrl: e.target.value }))}
                    placeholder="https://instagram.com/…"
                    className="form-input text-xs"
                  />
                </div>
              )}
            </div>
          )}

          <div className="w-32">
            <label className="form-label">Position</label>
            <input
              type="number"
              min="0"
              value={slideForm.order}
              onChange={(e) => setSlideForm(prev => ({ ...prev, order: e.target.value }))}
              className="form-input text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={closeForm}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving} disabled={uploading}>
              {isEditing ? 'Save changes' : 'Publish slide'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
