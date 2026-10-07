// Admin Members Directory & Manual Record Management Page
import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiPlus, FiRefreshCw, FiLink, FiEye, 
  FiAward, FiCalendar, FiUser, FiCheckCircle, FiClock 
} from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import { authService } from '../../services/authService';
import Avatar from '../../components/ui/Avatar';
import Chip from '../../components/ui/Chip';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import DigitalIdCard from '../../components/ui/DigitalIdCard';
import { uploadMedia } from '../../services/uploadService';

export default function AdminMembers() {
  const { 
    members, renewMemberRecord, addManualMember, 
    linkMember, unlinkMember 
  } = useClubData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [memberToLink, setMemberToLink] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Manual record form
  const [addForm, setAddForm] = useState({
    membershipNumber: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    joiningDate: new Date().toISOString().split('T')[0],
    address: '',
    photoURL: ''
  });
  const [savingMember, setSavingMember] = useState(false);

  useEffect(() => {
    authService.getAllUsers().then(setAllUsers);
  }, []);

  const filterTabs = ['All', 'Active', 'Expired', 'Old records', 'New members'];

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      m.name?.toLowerCase().includes(q) ||
      m.fullName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.phone?.includes(q) ||
      m.membershipId?.toLowerCase().includes(q);

    const isExpired = m.expiryDate && new Date(m.expiryDate) < new Date();

    let matchesTab = true;
    if (filterTab === 'Active') matchesTab = !isExpired && m.status === 'approved';
    if (filterTab === 'Expired') matchesTab = isExpired;
    if (filterTab === 'Old records') matchesTab = m.source === 'old_record';
    if (filterTab === 'New members') matchesTab = m.source !== 'old_record';

    return matchesSearch && matchesTab;
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadMedia(file, 'members', 'image');
        setAddForm(prev => ({ ...prev, photoURL: url }));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim()) {
      alert('Name and email are required.');
      return;
    }

    setSavingMember(true);
    try {
      await addManualMember(addForm, 'Admin');
      setIsAddOpen(false);
      setAddForm({
        membershipNumber: '',
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: 'O+',
        joiningDate: new Date().toISOString().split('T')[0],
        address: '',
        photoURL: ''
      });
    } finally {
      setSavingMember(false);
    }
  };

  const openLinkModal = (member) => {
    setMemberToLink(member);
    setIsLinkOpen(true);
  };

  const handleLinkUser = async (targetUser) => {
    if (!memberToLink) return;
    await linkMember(memberToLink.id, targetUser);
    setIsLinkOpen(false);
    setMemberToLink(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">Official Members Roster</h1>
          <p className="text-xs text-ink-subtle">Directory of verified club members, renewals, and offline record transcription</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, email..."
              className="form-input pl-10 text-xs"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={FiPlus}
            onClick={() => setIsAddOpen(true)}
          >
            Add Old Record
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {filterTabs.map((tab) => (
          <Chip
            key={tab}
            label={tab}
            variant="slate"
            active={filterTab === tab}
            onClick={() => setFilterTab(tab)}
          />
        ))}
      </div>

      {/* Members Table */}
      <div className="p-6 rounded-[30px] glass space-y-4">
        {filteredMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink">
              <thead>
                <tr className="border-b border-black/5 text-ink-subtle font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Member & ID</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Term Validity</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Linked User</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredMembers.map((m) => {
                  const isExpired = m.expiryDate && new Date(m.expiryDate) < new Date();
                  const isLinked = Boolean(m.userId);

                  return (
                    <tr key={m.id} className="hover:bg-white/50 transition-colors">
                      <td className="py-3.5 pr-3 flex items-center gap-3">
                        <Avatar src={m.photoURL || m.profilePhoto} name={m.name} size="md" />
                        <div>
                          <span className="font-bold text-ink block">{m.name || m.fullName}</span>
                          <span className="font-mono font-bold text-ember text-[10px]">{m.membershipId || 'No ID'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="font-medium text-ink">{m.email}</p>
                        <p className="text-ink-subtle font-mono">{m.phone || m.mobile}</p>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          isExpired ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isExpired ? 'Expired' : 'Active Pass'}
                        </span>
                        <p className="text-[10px] text-ink-subtle mt-0.5">
                          Exp: {m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : '1 Year'}
                        </p>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="text-[10px] text-ink-muted font-bold uppercase">
                          {m.source === 'old_record' ? 'Paper Archive' : 'Online Form'}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        {isLinked ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                            <FiCheckCircle /> Linked
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openLinkModal(m)}
                            className="text-ember hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <FiLink /> Link Account
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedMember(m)}
                            className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-ink transition-colors"
                            title="View Digital Pass"
                          >
                            <FiEye />
                          </button>

                          <button
                            type="button"
                            onClick={() => renewMemberRecord(m.id, 'Admin')}
                            className="px-2.5 py-1 rounded-full bg-ember hover:bg-[#E0582B] text-white font-bold text-[10px] transition-all flex items-center gap-1"
                            title="Extend 1 Year"
                          >
                            <FiRefreshCw /> +1 Yr
                          </button>

                          {isLinked && (
                            <button
                              type="button"
                              onClick={() => unlinkMember(m.id)}
                              className="px-2 py-1 rounded-lg bg-white/70 hover:bg-red-50 text-ink-muted hover:text-red-600 text-[10px] font-bold transition-all"
                            >
                              Unlink
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-ink-subtle space-y-2">
            <FiAward className="text-4xl mx-auto text-ink-subtle" />
            <p className="text-xs">No members found.</p>
          </div>
        )}
      </div>

      {/* View Digital Pass Modal */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title="Digital Membership Pass View"
        maxWidth="max-w-md"
      >
        {selectedMember && (
          <div className="space-y-4">
            <DigitalIdCard member={selectedMember} />
            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Old / Paper Member Record Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Transcribe Offline Member Record"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
          
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/60 border border-white">
            <div className="w-16 h-16 rounded-xl bg-white overflow-hidden flex items-center justify-center shrink-0">
              {addForm.photoURL ? (
                <img src={addForm.photoURL} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-2xl text-ink-subtle" />
              )}
            </div>
            <div className="flex-1">
              <label className="form-label mb-1">Member Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-xs text-ink-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Membership ID (e.g. CLUB-000001)</label>
              <input
                type="text"
                value={addForm.membershipNumber}
                onChange={(e) => setAddForm(prev => ({ ...prev, membershipNumber: e.target.value }))}
                placeholder="Leave blank for auto ID"
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                className="form-input text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                className="form-input text-xs"
                required
              />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={addForm.phone}
                onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date of Joining</label>
              <input
                type="date"
                value={addForm.joiningDate}
                onChange={(e) => setAddForm(prev => ({ ...prev, joiningDate: e.target.value }))}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label">Gender</label>
              <select
                value={addForm.gender}
                onChange={(e) => setAddForm(prev => ({ ...prev, gender: e.target.value }))}
                className="form-input text-xs"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={savingMember}>
              Save Member Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Link Account Modal */}
      <Modal
        isOpen={isLinkOpen}
        onClose={() => setIsLinkOpen(false)}
        title={`Link Google Account to ${memberToLink?.name || 'Member'}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search registered Google user by email/name..."
            className="form-input text-xs"
          />

          <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
            {allUsers
              .filter(u => !userSearch || u.email?.toLowerCase().includes(userSearch.toLowerCase()) || u.name?.toLowerCase().includes(userSearch.toLowerCase()))
              .map((u) => (
                <div
                  key={u.uid}
                  onClick={() => handleLinkUser(u)}
                  className="p-3 rounded-xl bg-white/60 hover:bg-ember-soft border border-white hover:border-ember flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={u.profilePhoto} name={u.name} size="sm" />
                    <div>
                      <span className="font-bold text-ink block text-xs">{u.name}</span>
                      <span className="text-[10px] text-ink-subtle">{u.email}</span>
                    </div>
                  </div>
                  <span className="text-ember font-bold text-xs">Select →</span>
                </div>
              ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsLinkOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
