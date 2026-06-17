// Manage Team Members CRUD Page
import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiMail, FiUser } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const ManageTeam = () => {
  const { team, loading, createTeamMember, updateTeamMember, deleteTeamMember } = useClubData();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    position: 'Committee Member',
    bio: '',
    image: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const positions = ['President', 'Secretary', 'Vice President', 'Treasurer', 'Head Coach', 'Committee Member'];

  const filteredTeam = team.filter((member) => {
    return member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
           member.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      position: 'Committee Member',
      bio: '',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      email: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      image: member.image,
      email: member.email
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
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.bio.trim()) errors.bio = 'Profile bio is required';
    if (!formData.image.trim()) errors.image = 'Profile avatar image URL is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData);
      } else {
        await createTeamMember(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      await deleteTeamMember(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Team & Committee</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Audit executive leadership and coaching profiles</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <FiPlus /> Add Team Member
        </button>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-gray-900/30 border border-gray-850">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Search staff by name, position, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Team Listings Table */}
      {loading.team && team.length === 0 ? (
        <Spinner text="Fetching executive listings..." />
      ) : (
        <div className="rounded-2xl border border-gray-850 bg-gray-900/10 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-850/80 bg-slate-900/25">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Representative</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Position Role</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Short Bio</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50 text-gray-300">
              {filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">No team members found.</td>
                </tr>
              ) : (
                filteredTeam.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-800 shrink-0"
                        />
                        <span className="font-bold text-white text-sm shrink-0">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px] font-bold shrink-0">
                        {member.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${member.email}`} className="text-primary hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
                        <FiMail /> {member.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate text-gray-400 leading-relaxed font-light">{member.bio}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-2 bg-gray-850 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 border border-gray-800 hover:border-indigo-500/20 rounded-lg transition-all"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
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
        title={editingMember ? 'Modify Leadership Member' : 'Register New Executive Member'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="team-form-name">Representative Full Name</label>
            <input
              id="team-form-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="Nicholas Vance"
            />
            {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="team-form-position">Leadership Position</label>
              <select
                id="team-form-position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="form-input text-sm"
              >
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="team-form-email">Contact Email Address</label>
              <input
                id="team-form-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input text-sm"
                placeholder="nicholas@universalclub.com"
              />
              {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="team-form-image">Profile Photo URL</label>
            <input
              id="team-form-image"
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
            <label className="form-label" htmlFor="team-form-bio">Biographical Summary</label>
            <textarea
              id="team-form-bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              className="form-input text-sm"
              placeholder="Describe their athletic expertise, coaching timeline, or corporate responsibilities..."
            ></textarea>
            {formErrors.bio && <p className="text-red-500 text-[10px] mt-1">{formErrors.bio}</p>}
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
              {editingMember ? 'Save Profile' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageTeam;
