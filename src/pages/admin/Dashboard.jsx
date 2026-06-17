// Admin Dashboard Overview Component
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiCalendar, FiImage, FiFileText, 
  FiArrowRight, FiCheck, FiX, FiClock 
} from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';

const Dashboard = () => {
  const { 
    members, events, gallery, requests, 
    updateRequestStatus, deleteRequest 
  } = useClubData();

  // 1. Calculate stats metrics
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  
  const stats = [
    {
      name: 'Total Members',
      value: members.length,
      detail: `${activeMembers} Active • ${members.length - activeMembers} Inactive`,
      icon: FiUsers,
      color: 'text-primary bg-primary/10 border-primary/20',
      link: '/admin/members'
    },
    {
      name: 'Club Events',
      value: events.length,
      detail: 'Registered competitions & training',
      icon: FiCalendar,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      link: '/admin/events'
    },
    {
      name: 'Gallery Media',
      value: gallery.length,
      detail: 'Uploaded photos and videos',
      icon: FiImage,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      link: '/admin/gallery'
    },
    {
      name: 'Pending Requests',
      value: pendingRequests.length,
      detail: 'Applications awaiting review',
      icon: FiFileText,
      color: pendingRequests.length > 0 ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-gray-400 bg-gray-800/10 border-gray-800/20',
      link: '/admin/requests'
    }
  ];

  // Get recent 5 requests and recent 3 events
  const recentRequests = requests.slice(0, 5);
  const activeEvents = events.slice(0, 3);

  const handleApprove = async (id) => {
    try {
      await updateRequestStatus(id, 'Approved');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateRequestStatus(id, 'Rejected');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Real-time metrics and administration controls</p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.name}
            className="p-6 rounded-2xl bg-gray-900/30 border border-gray-850 flex items-center justify-between hover:border-gray-800 transition-all shadow-xs"
          >
            <div className="space-y-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{stat.name}</span>
              <p className="text-3xl font-extrabold text-white leading-none">{stat.value}</p>
              <p className="text-[10px] text-gray-400 font-medium">{stat.detail}</p>
            </div>
            <Link 
              to={stat.link}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl hover:scale-105 transition-transform shrink-0 ${stat.color}`}
            >
              <stat.icon />
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Membership Requests (CRUD requests links) */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-850 bg-gray-900/10 p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-gray-850 pb-4 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Applications</h3>
              <p className="text-[10px] text-gray-500">Awaiting status modifications</p>
            </div>
            <Link to="/admin/requests" className="text-xs text-primary hover:text-white flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentRequests.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No membership requests logged in store.</p>
            ) : (
              <table className="w-full text-left text-xs min-w-[450px]">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-900">
                    <th className="pb-3 font-semibold uppercase tracking-wider">Applicant</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider">Plan</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/60">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="text-gray-300">
                      <td className="py-3">
                        <p className="font-semibold text-white">{req.name}</p>
                        <p className="text-[10px] text-gray-500">{req.email}</p>
                      </td>
                      <td className="py-3 font-medium text-indigo-400">{req.plan}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                          req.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                          'bg-amber-500/10 text-amber-400 animate-pulse'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {req.status === 'Pending' ? (
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="p-1.5 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                              title="Approve Applicant"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-1.5 rounded bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              title="Reject Applicant"
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500">Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Club Events Overview */}
        <div className="lg:col-span-5 rounded-2xl border border-gray-850 bg-gray-900/10 p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-gray-850 pb-4 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Scheduled Events</h3>
              <p className="text-[10px] text-gray-500">Registry size & date checks</p>
            </div>
            <Link to="/admin/events" className="text-xs text-primary hover:text-white flex items-center gap-1">
              Manage <FiArrowRight />
            </Link>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar">
            {activeEvents.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No scheduled events listed.</p>
            ) : (
              activeEvents.map((evt) => (
                <div key={evt.id} className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-950 border border-gray-900">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-850 shrink-0"
                  />
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-white truncate leading-snug">{evt.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                      <span className="flex items-center gap-0.5"><FiClock /> {evt.date}</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-semibold">{evt.registrations?.length || 0} Regs</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
