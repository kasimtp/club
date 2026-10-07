// Admin Programs & Tournaments Publisher Page
import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Chip from '../../components/ui/Chip';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { uploadMedia } from '../../services/uploadService';

export default function AdminPrograms() {
  const { programs, addProgram, removeProgram } = useClubData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [progForm, setProgForm] = useState({
    title: '',
    description: '',
    date: 'Oct 25, 2026',
    time: '08:30 AM',
    location: 'Vellur',
    category: 'Tournament',
    posterUrl: ''
  });

  const handlePosterUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadMedia(file, 'programs', 'image');
        setProgForm(prev => ({ ...prev, posterUrl: url }));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!progForm.title.trim()) {
      alert('Title is required.');
      return;
    }

    setSaving(true);
    try {
      await addProgram(progForm);
      setIsAddOpen(false);
      setProgForm({
        title: '',
        description: '',
        date: 'Oct 25, 2026',
        time: '08:30 AM',
        location: 'Vellur',
        category: 'Tournament',
        posterUrl: ''
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
          <h1 className="font-display text-xl font-bold text-ink">Upcoming Programs & Tournaments Publisher</h1>
          <p className="text-xs text-ink-subtle">Publish upcoming competitions, athletic camps, and community tournaments</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={() => setIsAddOpen(true)}
        >
          New Program
        </Button>
      </div>

      {/* Programs List */}
      {programs.length === 0 && (
        <div className="glass rounded-[30px] p-10 text-center space-y-3">
          <div className="orb w-12 h-12 mx-auto" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-ink">No programs published</h3>
          <p className="text-sm text-ink-muted max-w-sm mx-auto">Announce an upcoming tournament or programme and it will appear on the home page and the Programs page.</p>
          <Button variant="primary" size="sm" icon={FiPlus} onClick={() => setIsAddOpen(true)}>
            New program
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="p-5 rounded-[30px] glass space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-ink">
                <img
                  src={prog.posterUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'}
                  alt={prog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-[10px] font-semibold uppercase">
                  Coming Soon
                </span>
                <Chip label={prog.category || 'Tournament'} size="sm" />
              </div>

              <h3 className="font-display text-base font-bold text-ink line-clamp-1">{prog.title}</h3>
              <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">{prog.description}</p>

              <div className="pt-2 border-t border-black/5 space-y-1 text-xs text-ink-muted">
                <div className="flex items-center gap-1.5 font-bold">
                  <FiCalendar className="text-ember" />
                  <span>{prog.date} • {prog.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink-subtle truncate">
                  <FiMapPin className="text-sky-500 shrink-0" />
                  <span className="truncate">{prog.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete program "${prog.title}"?`)) {
                    removeProgram(prog.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
              >
                <FiTrash2 /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Program Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Publish Upcoming Tournament / Program"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
          <div>
            <label className="form-label">Program Title *</label>
            <input
              type="text"
              value={progForm.title}
              onChange={(e) => setProgForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. All Kerala Badminton Open 2026"
              className="form-input text-xs"
              required
            />
          </div>

          <div>
            <label className="form-label">Poster Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              className="form-input pt-2.5 text-xs text-ink-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date (e.g. Oct 25, 2026)</label>
              <input
                type="text"
                value={progForm.date}
                onChange={(e) => setProgForm(prev => ({ ...prev, date: e.target.value }))}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label">Time (e.g. 08:30 AM)</label>
              <input
                type="text"
                value={progForm.time}
                onChange={(e) => setProgForm(prev => ({ ...prev, time: e.target.value }))}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Location / Venue</label>
              <input
                type="text"
                value={progForm.location}
                onChange={(e) => setProgForm(prev => ({ ...prev, location: e.target.value }))}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <input
                type="text"
                value={progForm.category}
                onChange={(e) => setProgForm(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Tournament / Camp"
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Full Description</label>
            <textarea
              value={progForm.description}
              onChange={(e) => setProgForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="form-textarea text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Publish Program
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
