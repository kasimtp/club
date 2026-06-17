// Manage Membership Requests Page
import React, { useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiSearch, FiFileText, FiEye, FiClock, FiCalendar } from 'react-icons/fi';
import { useClubData } from '../../context/ClubDataContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const ManageRequests = () => {
  const { requests, loading, updateRequestStatus, deleteRequest } = useClubData();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Detail Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filter Logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application record?')) {
      await deleteRequest(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Membership Requests</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Approve, reject, or delete member intake requests</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-900/30 border border-gray-850">
        
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Search applicant name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      </div>

      {/* Requests Table */}
      {loading.requests && requests.length === 0 ? (
        <Spinner text="Loading membership requests..." />
      ) : (
        <div className="rounded-2xl border border-gray-850 bg-gray-900/10 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-850/80 bg-slate-900/25">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Applicant Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Plan Requested</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date Sent</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50 text-gray-300">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">No applications found.</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{req.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{req.email}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{req.phone}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-indigo-400">{req.plan}</td>
                    <td className="px-6 py-4 text-gray-400 font-light flex items-center gap-1.5"><FiCalendar className="text-primary text-[10px]" /> {req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        req.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        {/* Message inspect */}
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-2 bg-gray-850 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-lg transition-all"
                          title="Inspect application statement"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        
                        {req.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent rounded-lg transition-all"
                              title="Approve Member Application"
                            >
                              <FiCheck className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-transparent rounded-lg transition-all"
                              title="Reject Member Application"
                            >
                              <FiX className="text-sm" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDelete(req.id)}
                            className="p-2 bg-gray-850 hover:bg-red-500/15 text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-500/10 rounded-lg transition-all"
                            title="Delete record"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Message Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Application: ${selectedRequest.name}`}
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-850 pb-4">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold">Plan Type</p>
                <p className="text-white font-bold text-sm mt-0.5 text-indigo-400">{selectedRequest.plan}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold">Contact Phone</p>
                <p className="text-white font-medium text-xs mt-0.5">{selectedRequest.phone}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] uppercase font-bold">Application Statement / Goals</p>
              <p className="text-gray-300 leading-relaxed font-light bg-gray-950 p-4 rounded-xl border border-gray-900 mt-1 whitespace-pre-wrap">
                {selectedRequest.message || 'No additional statement provided by the applicant.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-850/80">
              <span className="text-[10px] text-gray-500 flex items-center gap-1"><FiClock /> Submitted {selectedRequest.date}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-gray-900 border border-gray-850 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-all"
                >
                  Close
                </button>
                {selectedRequest.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-all"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default ManageRequests;
