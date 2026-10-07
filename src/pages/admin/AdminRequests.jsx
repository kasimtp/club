// Admin Applications Queue Page
import React, { useState } from 'react';
import { FiSearch, FiCheck, FiX, FiEye, FiFileText, FiCalendar, FiDroplet } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Avatar from '../../components/ui/Avatar';
import Chip from '../../components/ui/Chip';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function AdminRequests() {
  const { requests, approveRequest, rejectRequest } = useClubData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedReq, setSelectedReq] = useState(null);

  const tabs = ['Pending', 'Approved', 'Rejected', 'All'];

  const filteredRequests = requests.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      r.name?.toLowerCase().includes(q) ||
      r.fullName?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.includes(q) ||
      r.membershipId?.toLowerCase().includes(q);

    let matchesTab = true;
    if (activeTab === 'Pending') matchesTab = r.status === 'pending';
    if (activeTab === 'Approved') matchesTab = r.status === 'approved';
    if (activeTab === 'Rejected') matchesTab = r.status === 'rejected';

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">Membership Applications Queue</h1>
          <p className="text-xs text-ink-subtle">Review incoming submissions, verify IDs, and approve official digital passes</p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, ID..."
            className="form-input pl-10 text-xs"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {tabs.map((tab) => {
          const count = tab === 'All' 
            ? requests.length 
            : requests.filter(r => r.status === tab.toLowerCase()).length;

          return (
            <Chip
              key={tab}
              label={`${tab} (${count})`}
              variant="slate"
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          );
        })}
      </div>

      {/* Queue Table */}
      <div className="p-6 rounded-[30px] glass space-y-4">
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink">
              <thead>
                <tr className="border-b border-black/5 text-ink-subtle font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Applicant</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Applied Date</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Status / ID</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/50 transition-colors">
                    <td className="py-3.5 pr-3 flex items-center gap-3">
                      <Avatar src={req.photoURL || req.profilePhoto} name={req.name} size="md" />
                      <div>
                        <span className="font-bold text-ink block">{req.name || req.fullName}</span>
                        <span className="text-[10px] text-ink-subtle">{req.gender} • Blood {req.bloodGroup || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <p className="font-medium text-ink">{req.email}</p>
                      <p className="text-ink-subtle font-mono">{req.phone || req.mobile}</p>
                    </td>
                    <td className="py-3.5 pr-3 text-ink-muted">
                      {new Date(req.appliedAt || req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold uppercase">
                        {req.authProvider || 'Google'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3">
                      {req.membershipId ? (
                        <span className="font-mono font-bold text-ember bg-ember-soft px-2 py-0.5 rounded-md text-[11px]">
                          {req.membershipId}
                        </span>
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : req.status === 'pending' ? 'bg-ember-soft text-ember' : 'bg-white/70 text-ink-muted'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReq(req)}
                          className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-ink font-bold text-[11px] transition-colors flex items-center gap-1"
                        >
                          <FiEye /> View
                        </button>

                        {req.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => approveRequest(req.id, 'Admin')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex items-center gap-1"
                            >
                              <FiCheck /> Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => rejectRequest(req.id, 'Admin')}
                              className="p-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                              title="Reject Application"
                            >
                              <FiX className="text-base" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-ink-subtle space-y-2">
            <FiFileText className="text-4xl mx-auto text-ink-subtle" />
            <p className="text-xs">No applications in this category.</p>
          </div>
        )}
      </div>

      {/* Review Modal Sheet */}
      <Modal
        isOpen={Boolean(selectedReq)}
        onClose={() => setSelectedReq(null)}
        title="Application Review & Verification"
        maxWidth="max-w-lg"
      >
        {selectedReq && (
          <div className="space-y-4 text-xs text-ink">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-white">
              <img
                src={selectedReq.photoURL || selectedReq.profilePhoto}
                alt="Member"
                className="w-16 h-20 rounded-xl object-cover border border-white"
              />
              <div className="space-y-1 min-w-0">
                <h4 className="font-display text-base font-bold text-ink">{selectedReq.name || selectedReq.fullName}</h4>
                <p className="text-ink-muted">{selectedReq.email}</p>
                <p className="font-bold text-ink">{selectedReq.phone || selectedReq.mobile}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/60 border border-white">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-subtle block">DOB</span>
                <span className="font-bold">{selectedReq.dateOfBirth || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-subtle block">Gender</span>
                <span className="font-bold">{selectedReq.gender || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-subtle block">Blood Group</span>
                <span className="font-bold text-rose-500">{selectedReq.bloodGroup || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-subtle block">Applied At</span>
                <span className="font-bold">{new Date(selectedReq.appliedAt || selectedReq.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {selectedReq.address && (
              <div className="p-4 rounded-2xl bg-white/60 border border-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-subtle block">Residential Address</span>
                <p className="leading-relaxed">{selectedReq.address}</p>
              </div>
            )}

            <div className="pt-3 border-t border-black/5 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedReq(null)}>
                Close
              </Button>

              {selectedReq.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      await rejectRequest(selectedReq.id, 'Admin');
                      setSelectedReq(null);
                    }}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      await approveRequest(selectedReq.id, 'Admin');
                      setSelectedReq(null);
                    }}
                  >
                    Approve (1 Year Pass)
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
