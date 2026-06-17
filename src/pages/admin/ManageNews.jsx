// Manage News & Announcements CRUD Page
import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiCalendar, FiBookOpen } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const ManageNews = () => {
  const { news, loading, createNews, updateNews, deleteNews } = useClubData();

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    author: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const categories = ['Announcement', 'Achievement', 'Event Update'];

  const filteredNews = news.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.author.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      category: 'Announcement',
      author: 'Secretary Rostova',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      author: article.author,
      image: article.image
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
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (!formData.author.trim()) errors.author = 'Author name is required';
    if (!formData.image.trim()) errors.image = 'Cover Image URL is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingArticle) {
        await updateNews(editingArticle.id, formData);
      } else {
        await createNews(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await deleteNews(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage News & Bulletins</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Publish, edit, and audit club announcements</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <FiPlus /> Add Announcement
        </button>
      </div>

      {/* Filter search bar */}
      <div className="p-4 rounded-2xl bg-gray-900/30 border border-gray-850">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Search news title, author, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* News Table */}
      {loading.news && news.length === 0 ? (
        <Spinner text="Fetching news feed..." />
      ) : (
        <div className="rounded-2xl border border-gray-850 bg-gray-900/10 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-850/80 bg-slate-900/25">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Announcement Title</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date Posted</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">No news bulletins found.</td>
                </tr>
              ) : (
                filteredNews.map((article) => (
                  <tr key={article.id} className="text-gray-300 hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-sm">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-850 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-white leading-snug truncate">{article.title}</p>
                          <p className="text-[10px] text-gray-500 truncate leading-snug mt-0.5">{article.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-semibold">{article.author}</td>
                    <td className="px-6 py-4 text-gray-400 font-light flex items-center gap-1.5"><FiCalendar className="text-primary text-[10px]" /> {article.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(article)}
                          className="p-2 bg-gray-850 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 border border-gray-800 hover:border-indigo-500/20 rounded-lg transition-all"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
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
        title={editingArticle ? 'Edit News Bulletin' : 'Draft New Announcement'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="news-form-title">Bulletin Title</label>
            <input
              id="news-form-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="Renovations or Achievements..."
            />
            {formErrors.title && <p className="text-red-500 text-[10px] mt-1">{formErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="news-form-category">Category</label>
              <select
                id="news-form-category"
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

            <div>
              <label className="form-label" htmlFor="news-form-author">Author / Poster</label>
              <input
                id="news-form-author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="form-input text-sm"
                placeholder="Secretary Rostova"
              />
              {formErrors.author && <p className="text-red-500 text-[10px] mt-1">{formErrors.author}</p>}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="news-form-image">Cover Banner Image URL</label>
            <input
              id="news-form-image"
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="Unsplash URL"
            />
            {formErrors.image && <p className="text-red-500 text-[10px] mt-1">{formErrors.image}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="news-form-content">Bulletin Content Body</label>
            <textarea
              id="news-form-content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="6"
              className="form-input text-sm"
              placeholder="Draft announcement details here..."
            ></textarea>
            {formErrors.content && <p className="text-red-500 text-[10px] mt-1">{formErrors.content}</p>}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-1/2 py-2.5 border border-gray-850 hover:border-gray-700 text-xs font-bold text-gray-400 hover:text-white rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              {editingArticle ? 'Save Changes' : 'Publish Bulletin'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageNews;
