// Member Profile & Self-Management Dashboard Page
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiUser, FiMail, FiPhone, FiCalendar, FiDroplet, 
  FiMapPin, FiEdit2, FiLogOut, FiAward, FiCheckCircle, FiClock 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import DigitalIdCard from '../components/ui/DigitalIdCard';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import Modal from '../components/ui/Modal';
import { uploadMedia } from '../services/uploadService';

export default function MemberProfile() {
  const { user, isMember, isPending, memberData, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user?.name || user?.fullName || '',
    mobile: user?.mobile || user?.phone || '',
    whatsapp: user?.whatsapp || '',
    bloodGroup: user?.bloodGroup || 'O+',
    address: user?.address || '',
    profilePhoto: user?.profilePhoto || user?.photoURL || ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <FiUser className="text-5xl text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">Sign in to view your profile and digital membership pass.</p>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Sign In Now
        </Button>
      </div>
    );
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadMedia(file, 'members', 'image');
        setEditForm(prev => ({ ...prev, profilePhoto: url }));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(editForm);
      setIsEditOpen(false);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const displayMember = memberData || user;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={user.profilePhoto || user.photoURL}
            name={user.name}
            size="2xl"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                isMember ? 'bg-emerald-100 text-emerald-800' : isPending ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {isMember ? 'Active Member' : isPending ? 'Application Pending' : 'Registered User'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user.email}</p>
            {user.membershipId && (
              <p className="text-xs font-mono font-bold text-amber-600">{user.membershipId}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            icon={FiEdit2}
            onClick={() => {
              setEditForm({
                name: user.name || '',
                mobile: user.mobile || user.phone || '',
                whatsapp: user.whatsapp || '',
                bloodGroup: user.bloodGroup || 'O+',
                address: user.address || '',
                profilePhoto: user.profilePhoto || user.photoURL || ''
              });
              setIsEditOpen(true);
            }}
          >
            Edit Profile
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={FiLogOut}
            onClick={handleSignOut}
            className="text-red-600 hover:bg-red-50"
          >
            Log Out
          </Button>
        </div>
      </div>

      {/* Member Details Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Personal Information
          </h3>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Mobile Phone</span>
              <span className="font-bold">{user.mobile || user.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">WhatsApp Number</span>
              <span className="font-bold">{user.whatsapp || user.mobile || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Date of Birth</span>
              <span className="font-bold">{user.dateOfBirth || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Gender</span>
              <span className="font-bold">{user.gender || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Blood Group</span>
              <span className="font-bold text-rose-500">{user.bloodGroup || '—'}</span>
            </div>
            <div className="flex items-start justify-between py-2">
              <span className="text-slate-400">Address</span>
              <span className="font-bold text-right max-w-[200px]">{user.address || '—'}</span>
            </div>
          </div>
        </div>

        {/* Membership Status & ID Card Preview */}
        <div className="space-y-4">
          {isMember ? (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                Digital Pass
              </h3>
              <DigitalIdCard member={displayMember} />
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto">
                <FiAward />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {isPending ? 'Membership Under Review' : 'No Active Membership'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                {isPending 
                  ? 'Your application is awaiting committee confirmation. Check back soon.'
                  : 'Get unlimited access to gyms, courts, and tournaments for ₹200 / Year.'
                }
              </p>
              <div>
                <Button
                  variant="amber"
                  size="md"
                  onClick={() => navigate('/membership')}
                >
                  {isPending ? 'Check Application Status' : 'Apply for Membership (₹200)'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile Information"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Photo */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <Avatar src={editForm.profilePhoto} name={editForm.name} size="lg" />
            <div className="flex-1 space-y-1">
              <label className="form-label mb-0">Update Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-xs text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              value={editForm.mobile}
              onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">WhatsApp Number</label>
            <input
              type="tel"
              value={editForm.whatsapp}
              onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="Same as mobile if blank"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Blood Group</label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {bloodGroups.map((bg) => (
                <Chip
                  key={bg}
                  label={bg}
                  active={editForm.bloodGroup === bg}
                  onClick={() => setEditForm(prev => ({ ...prev, bloodGroup: bg }))}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Residential Address</label>
            <textarea
              value={editForm.address}
              onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
              className="form-textarea"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
