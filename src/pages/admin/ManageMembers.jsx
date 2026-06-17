// Manage Members CRUD Page
import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiUserCheck, FiFilter } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const ManageMembers = () => {
  const { members, loading, createMember, updateMember, deleteMember } = useClubData();

  // Search, Filter, Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Member', status: 'Active' });
  const [formErrors, setFormErrors] = useState({});

  // Filtering Logic
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({ name: '', email: '', phone: '', role: 'Member', status: 'Active' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status
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
    if (!formData.name.trim()) errors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[0-9\s-]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Please provide a valid phone';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingMember) {
        await updateMember(editingMember.id, formData);
      } else {
        await createMember(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      await deleteMember(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Members</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Audit, edit, and create member records</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <FiPlus /> Add New Member
        </button>
      </div>

      {/* Search and Filter Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-900/30 border border-gray-850">
        
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filter Role */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold shrink-0">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Member">Member</option>
            <option value="Coach">Coach</option>
            <option value="Secretary">Secretary</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

      </div>

      {/* Members Table */}
      {loading.members && members.length === 0 ? (
        <Spinner text="Fetching members database..." />
      ) : (
        <div className="rounded-2xl border border-gray-850 bg-gray-900/10 overflow-x-auto">
          
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-850/80 bg-slate-900/25">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Member Details</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">No members found.</td>
                </tr>
              ) : (
                paginatedMembers.map((member) => (
                  <tr key={member.id} className="text-gray-300 hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-extrabold uppercase border border-primary/20">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-bold text-white text-sm">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{member.email}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{member.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px] font-bold">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        member.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-light">{member.joinedDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-2 bg-gray-850 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 border border-gray-800 hover:border-indigo-500/20 rounded-lg transition-all"
                          title="Edit member details"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 bg-gray-850 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-800 hover:border-red-500/20 rounded-lg transition-all"
                          title="Delete member"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-850 bg-slate-900/10">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} records</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white disabled:opacity-40 transition-all bg-gray-950"
                >
                  Previous
                </button>
                <span className="px-3 text-xs text-gray-300">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white disabled:opacity-40 transition-all bg-gray-950"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Modify Member Profile' : 'Register New Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="member-form-name">Full Name</label>
            <input
              id="member-form-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="E.g. David Sterling"
            />
            {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="member-form-email">Email Address</label>
            <input
              id="member-form-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="E.g. david@universalclub.com"
            />
            {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="member-form-phone">Phone Number</label>
            <input
              id="member-form-phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input text-sm"
              placeholder="+1 (555) 123-4567"
            />
            {formErrors.phone && <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="member-form-role">Club Role</label>
              <select
                id="member-form-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-input text-sm"
              >
                <option value="Member">Member</option>
                <option value="Coach">Coach</option>
                <option value="Secretary">Secretary</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="member-form-status">Activity Status</label>
              <select
                id="member-form-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-input text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

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
              {editingMember ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageMembers;
