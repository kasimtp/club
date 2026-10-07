// Admin CMS for Events and News (Firestore `events` / `news`)
import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCalendar, FiMapPin, FiDatabase } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import MediaPlaceholder from '../../components/ui/MediaPlaceholder';
import { uploadMedia } from '../../services/uploadService';
import { ikUrl } from '../../services/imagekitService';

const CONFIG = {
  events: {
    title: 'Club events',
    intro: 'Celebrations, matches and community drives shown on the Events page and the home page.',
    noun: 'event',
    folder: 'gallery',
    categories: ['Celebrations', 'Sports', 'Community Service', 'Arts', 'Competitions', 'Meeting'],
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Day / time', placeholder: 'e.g. Sunday, 4:00 PM' },
      { name: 'location', label: 'Venue', placeholder: 'Vellur' },
      { name: 'category', label: 'Category', type: 'category' },
      { name: 'price', label: 'Entry', placeholder: 'e.g. Open to all' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
    empty: { location: 'Vellur', category: 'Celebrations', price: 'Open to all' },
    imageField: 'image',
    meta: (item) => [item.date, item.location].filter(Boolean),
  },
  news: {
    title: 'News',
    intro: 'Achievements and announcements shown under "Latest news" on the home page.',
    noun: 'news post',
    folder: 'gallery',
    categories: ['Achievement', 'Football', 'Community', 'Announcement', 'Arts'],
    fields: [
      { name: 'title', label: 'Headline', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'category', label: 'Category', type: 'category' },
      { name: 'author', label: 'Posted by', placeholder: 'Universal Arts & Sports Club' },
      { name: 'content', label: 'Story', type: 'textarea', required: true },
    ],
    empty: { category: 'Achievement', author: 'Universal Arts & Sports Club' },
    imageField: 'image',
    meta: (item) => [item.date, item.author].filter(Boolean),
  },
};

const today = () => new Date().toISOString().slice(0, 10);

export default function AdminContent({ kind }) {
  const cfg = CONFIG[kind];
  const data = useClubData();
  const items = kind === 'events' ? data.events : data.news;
  const add = kind === 'events' ? data.addEvent : data.addNews;
  const update = kind === 'events' ? data.updateEvent : data.updateNews;
  const remove = kind === 'events' ? data.removeEvent : data.removeNews;
  const importBuiltIn = kind === 'events' ? data.importBuiltInEvents : data.importBuiltInNews;

  const showingBuiltIn = items.length > 0 && items.every((i) => i.builtIn);

  const blankForm = () => ({ ...cfg.empty, date: today(), [cfg.imageField]: '' });
  const [editing, setEditing] = useState(null); // null | 'new' | item id
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0); // 0 = idle, otherwise percent + 1

  const openNew = () => { setForm(blankForm()); setEditing('new'); };
  const openEdit = (item) => { setForm({ ...blankForm(), ...item }); setEditing(item.id); };
  const close = () => setEditing(null);
  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(1);
    try {
      const url = await uploadMedia(file, cfg.folder, 'image', { onProgress: (p) => setUploading(p + 1) });
      setField(cfg.imageField, url);
    } catch (err) {
      e.target.value = '';
      alert(err.message);
    } finally {
      setUploading(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = cfg.fields.find((f) => f.required && !String(form[f.name] || '').trim());
    if (missing) {
      alert(`Please fill in “${missing.label}”.`);
      return;
    }
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        [...cfg.fields.map((f) => f.name), cfg.imageField].map((k) => [k, form[k] ?? ''])
      );
      if (editing === 'new') await add(payload);
      else await update(editing, payload);
      close();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">{cfg.title}</h1>
          <p className="text-xs text-ink-subtle">{cfg.intro}</p>
        </div>
        <Button variant="primary" size="sm" icon={FiPlus} onClick={openNew}>
          New {cfg.noun}
        </Button>
      </div>

      {showingBuiltIn && (
        <div className="glass rounded-[26px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-full bg-ember-soft text-ember flex items-center justify-center shrink-0">
              <FiDatabase />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">These are built-in posts, not saved in the database yet</p>
              <p className="text-xs text-ink-muted">
                They came from the club's Facebook / Instagram. Save them to the database to edit or remove them here.
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={importBuiltIn}>Save to database</Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass rounded-[30px] p-10 text-center space-y-3">
          <div className="orb w-12 h-12 mx-auto" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-ink">No {cfg.noun}s yet</h3>
          <Button variant="primary" size="sm" icon={FiPlus} onClick={openNew}>New {cfg.noun}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-[30px] p-2 flex flex-col">
              <div className="aspect-[16/10] overflow-hidden rounded-[24px] bg-white">
                {item[cfg.imageField] ? (
                  <img src={ikUrl(item[cfg.imageField], { width: 600 })} alt="" className="w-full h-full object-cover" />
                ) : (
                  <MediaPlaceholder label={item.category} />
                )}
              </div>
              <div className="px-3 pt-4 pb-3 flex-1 flex flex-col gap-2">
                <span className="pill !h-7 !text-[11px] self-start">{item.category || 'General'}</span>
                <h3 className="font-display text-lg font-semibold text-ink leading-snug">{item.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  {cfg.meta(item).map((m, i) => (
                    <span key={m} className="inline-flex items-center gap-1.5">
                      {i === 0 ? <FiCalendar className="text-ember" /> : <FiMapPin className="text-ink-subtle" />}
                      {m}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between">
                  {item.builtIn ? (
                    <span className="text-[11px] text-ink-subtle">Built-in — save to database to edit</span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-white text-ink text-xs font-semibold hover:shadow-[0_6px_14px_-8px_rgba(70,50,90,0.4)] transition-all"
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => window.confirm(`Delete “${item.title}”?`) && remove(item.id)}
                        className="w-9 h-9 rounded-full bg-white text-ink-muted hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                        aria-label={`Delete ${item.title}`}
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={editing !== null}
        onClose={close}
        title={editing === 'new' ? `New ${cfg.noun}` : `Edit ${cfg.noun}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {cfg.fields.map((f) => (
            <div key={f.name}>
              <label className="form-label">{f.label}{f.required ? ' *' : ''}</label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={form[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  className="form-textarea text-sm"
                />
              ) : f.type === 'category' ? (
                <select value={form[f.name] || ''} onChange={(e) => setField(f.name, e.target.value)} className="form-input text-sm">
                  {[...new Set([...cfg.categories, form[f.name]].filter(Boolean))].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className="form-input text-sm"
                />
              )}
            </div>
          ))}

          <div>
            <label className="form-label">Photo / poster (optional)</label>
            <input type="file" accept="image/*" onChange={handleImage} disabled={uploading > 0} className="form-input pt-2.5 text-xs" />
            {uploading > 0 && <p className="mt-1.5 text-[11px] font-semibold text-ember">Uploading… {uploading - 1}%</p>}
            {form[cfg.imageField] && !uploading && (
              <div className="mt-3 flex items-center gap-3">
                <img src={ikUrl(form[cfg.imageField], { width: 200 })} alt="" className="w-20 h-14 rounded-xl object-cover" />
                <button type="button" onClick={() => setField(cfg.imageField, '')} className="text-xs font-semibold text-red-600">
                  Remove photo
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={close}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit" loading={saving} disabled={uploading > 0}>
              {editing === 'new' ? 'Publish' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
