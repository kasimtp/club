// Admin Dashboard Overview Page
// Live KPIs, Secondary Metric Bar, Control Shortcuts, and Recent Applications Pipeline
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiAward, FiFileText, FiClock, FiActivity, 
  FiSliders, FiCalendar, FiImage, FiCheck, FiX, FiEye, FiArrowRight 
} from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import { authService } from '../../services/authService';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import Modal from '../../components/ui/Modal';

export default function Dashboard() {
  const { 
    members, requests, slides, programs, gallery, 
    approveRequest, rejectRequest 
  } = useClubData();
  
  const [usersCount, setUsersCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    authService.getAllUsers().then(u => setUsersCount(u.length));
  }, []);

  // Compute live KPIs
  const activeMembers = members.filter(m => {
    const isNotExpired = !m.expiryDate || new Date(m.expiryDate) >= new Date();
    return m.status === 'approved' && isNotExpired;
  }).length;

  const expiredMembers = members.filter(m => {
    return m.expiryDate && new Date(m.expiryDate) < new Date();
  }).length;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const oldRecordsCount = members.filter(m => m.source === 'old_record').length;
  const newApprovedCount = members.filter(m => m.source !== 'old_record' && m.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const kpis = [
    {
      title: 'Total Users',
      value: Math.max(usersCount, members.length),
      detail: 'Registered Google & Admin accounts',
      icon: FiUsers,
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      link: '/admin/users'
    },
    {
      title: 'Active Members',
      value: activeMembers,
      detail: 'Verified 1-year active terms',
      icon: FiAward,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      link: '/admin/members'
    },
    {
      title: 'Pending Applications',
      value: pendingRequests.length,
      detail: 'Awaiting admin review & ID issue',
      icon: FiFileText,
      color: pendingRequests.length > 0 ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse' : 'bg-slate-50 text-slate-600 border-slate-200',
      link: '/admin/requests'
    },
    {
      title: 'Expired Members',
      value: expiredMembers,
      detail: 'Eligible for 1-year renewal',
      icon: FiClock,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      link: '/admin/members'
    },
  ];

  const shortcuts = [
    { title: 'User Management', desc: 'Browse all registered Google accounts', link: '/admin/users', icon: FiUsers },
    { title: 'Application Queue', desc: 'Approve or reject membership forms', link: '/admin/requests', icon: FiFileText },
    { title: 'Member Directory', desc: 'Add old records, renewals & account links', link: '/admin/members', icon: FiAward },
    { title: 'Hero Slider CMS', desc: 'Manage video & image banners', link: '/admin/slides', icon: FiSliders },
    { title: 'Programs CMS', desc: 'Publish upcoming tournaments', link: '/admin/programs', icon: FiCalendar },
    { title: 'Gallery CMS', desc: 'Upload and organize club photos', link: '/admin/gallery', icon: FiImage },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.title}
              to={kpi.link}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-start justify-between gap-4 group"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  {kpi.title}
                </span>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">
                  {kpi.value}
                </p>
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  {kpi.detail}
                </p>
              </div>

              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform ${kpi.color}`}>
                <Icon />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Secondary Metric Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-3 gap-4 text-center divide-x divide-slate-100 text-xs">
        <div>
          <span className="text-slate-400 font-bold block">Paper / Old Records</span>
          <span className="text-lg font-black text-slate-900">{oldRecordsCount}</span>
        </div>
        <div>
          <span className="text-slate-400 font-bold block">New Approved Online</span>
          <span className="text-lg font-black text-emerald-600">{newApprovedCount}</span>
        </div>
        <div>
          <span className="text-slate-400 font-bold block">Rejected Applications</span>
          <span className="text-lg font-black text-slate-500">{rejectedCount}</span>
        </div>
      </div>

      {/* Recent Membership Applications Pipeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Recent Membership Applications</h2>
            <p className="text-xs text-slate-400">Quick decision pipeline for pending and recently processed submissions</p>
          </div>

          <Link
            to="/admin/requests"
            className="text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors"
          >
            Full Queue ({requests.length}) →
          </Link>
        </div>

        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Applicant</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Applied Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pr-3 flex items-center gap-3">
                      <Avatar src={req.photoURL || req.profilePhoto} name={req.name || req.fullName} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 block">{req.name || req.fullName}</span>
                        <span className="text-[10px] text-slate-400">{req.gender} • Blood {req.bloodGroup || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <p className="font-medium">{req.email}</p>
                      <p className="text-slate-400">{req.phone || req.mobile}</p>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-500">
                      {new Date(req.appliedAt || req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        req.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : req.status === 'pending' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="View Full Details"
                        >
                          <FiEye className="text-sm" />
                        </button>

                        {req.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => approveRequest(req.id, 'Admin')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-all flex items-center gap-1"
                            >
                              <FiCheck /> Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => rejectRequest(req.id, 'Admin')}
                              className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[10px] transition-all"
                            >
                              <FiX />
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
          <p className="text-xs text-slate-400 text-center py-6">No membership applications recorded yet.</p>
        )}
      </div>

      {/* 6 Admin Module Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
          Admin Management Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shortcuts.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                to={mod.link}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-black group-hover:text-amber-400 text-slate-800 flex items-center justify-center text-xl shrink-0 transition-colors">
                  <Icon />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Application Details Modal Sheet */}
      <Modal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title="Application Full Inspection"
        maxWidth="max-w-lg"
      >
        {selectedRequest && (
          <div className="space-y-5 text-xs text-slate-700">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Avatar src={selectedRequest.photoURL || selectedRequest.profilePhoto} name={selectedRequest.name} size="xl" />
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-base font-bold text-slate-900 truncate">{selectedRequest.name || selectedRequest.fullName}</h4>
                <p className="text-slate-500">{selectedRequest.email}</p>
                <p className="font-semibold text-slate-800">{selectedRequest.phone || selectedRequest.mobile}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Birth</span>
                <span className="font-semibold">{selectedRequest.dateOfBirth || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Gender</span>
                <span className="font-semibold">{selectedRequest.gender || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
                <span className="font-semibold text-rose-500">{selectedRequest.bloodGroup || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="font-extrabold uppercase text-amber-600">{selectedRequest.status}</span>
              </div>
            </div>

            {selectedRequest.address && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Address</span>
                <p className="leading-relaxed">{selectedRequest.address}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </Button>

              {selectedRequest.status === 'pending' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={async () => {
                    await approveRequest(selectedRequest.id, 'Admin');
                    setSelectedRequest(null);
                  }}
                >
                  Approve (Issue 1-Yr Pass)
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
