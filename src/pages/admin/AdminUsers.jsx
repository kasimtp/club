// Admin Registered Users Directory
import React, { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiEye, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';
import { authService } from '../../services/authService';
import Avatar from '../../components/ui/Avatar';
import Chip from '../../components/ui/Chip';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    authService.getAllUsers().then(setUsers);
  }, []);

  const filterTabs = ['All', 'Not applied', 'Pending', 'Members', 'Expired'];

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.mobile?.includes(q) ||
      u.uid?.toLowerCase().includes(q);

    let matchesFilter = true;
    if (statusFilter === 'Not applied') matchesFilter = u.membershipStatus === 'not_applied';
    if (statusFilter === 'Pending') matchesFilter = u.membershipStatus === 'pending';
    if (statusFilter === 'Members') matchesFilter = u.membershipStatus === 'approved';
    if (statusFilter === 'Expired') matchesFilter = u.membershipStatus === 'expired';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Registered Users Directory</h1>
          <p className="text-xs text-slate-400">Authenticated Google users and member profiles</p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, mobile, UID..."
            className="form-input pl-10 text-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {filterTabs.map((tab) => (
          <Chip
            key={tab}
            label={tab}
            variant="slate"
            active={statusFilter === tab}
            onClick={() => setStatusFilter(tab)}
          />
        ))}
      </div>

      {/* Users List Table / Cards */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <span className="text-xs text-slate-500 font-bold">
          Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
        </span>

        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">UID / ID</th>
                  <th className="pb-3">Membership</th>
                  <th className="pb-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.uid || u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 pr-3 flex items-center gap-3">
                      <Avatar src={u.profilePhoto || u.photoURL} name={u.name} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.role}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <p className="font-medium">{u.email}</p>
                      <p className="text-slate-400">{u.mobile || u.phone || 'No phone'}</p>
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-[11px] text-slate-500">
                      {u.uid?.slice(0, 14)}...
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        u.membershipStatus === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : u.membershipStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.membershipStatus || 'not_applied'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <FiEye /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FiUser className="text-4xl mx-auto text-slate-300" />
            <p className="text-xs">No users matching search filters.</p>
          </div>
        )}
      </div>

      {/* User Details Modal Sheet */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title="User Account Details"
        maxWidth="max-w-md"
      >
        {selectedUser && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Avatar src={selectedUser.profilePhoto} name={selectedUser.name} size="xl" />
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedUser.name}</h4>
                <p className="text-slate-500">{selectedUser.email}</p>
                <p className="font-mono text-[10px] text-slate-400 mt-1">UID: {selectedUser.uid}</p>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-400">Mobile</span>
                <span className="font-bold">{selectedUser.mobile || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-400">DOB</span>
                <span className="font-bold">{selectedUser.dateOfBirth || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-400">Gender</span>
                <span className="font-bold">{selectedUser.gender || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-400">Blood Group</span>
                <span className="font-bold text-rose-500">{selectedUser.bloodGroup || '—'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Membership ID</span>
                <span className="font-mono font-bold text-amber-600">{selectedUser.membershipId || 'None'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
