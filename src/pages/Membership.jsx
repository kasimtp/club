// Membership Hub Page
// Dynamic 4-State Screen: Digital ID Card / Pending Review / Application Rejected / Plan & Form
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiAward, FiCheckCircle, FiClock, FiXCircle,
  FiUser, FiUpload, FiLoader, FiLock
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useClubData } from '../context/ClubDataContext';
import DigitalIdCard from '../components/ui/DigitalIdCard';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import Modal from '../components/ui/Modal';
import { uploadMedia } from '../services/uploadService';
import clubLogo from '../assets/club-logo.webp';
import { memberService } from '../services/memberService';

export default function Membership() {
  const { user, isMember, isPending, isRejected, memberData, refreshUser, loginWithGoogle } = useAuth();
  const { applyForMembership } = useClubData();

  // Search by ID state for public lookup
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookedUpMember, setLookedUpMember] = useState(null);
  const [lookupDone, setLookupDone] = useState(false);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    photoURL: '',
  });

  const handleOpenApplyModal = () => {
    setFormData({
      name: user?.name || user?.fullName || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || 'Male',
      bloodGroup: user?.bloodGroup || 'O+',
      address: user?.address || '',
      photoURL: user?.profilePhoto || user?.photoURL || '',
    });
    setPhotoError('');
    setIsApplyModalOpen(true);
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Handle Photo Picker
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    setIsUploadingPhoto(true);

    try {
      const url = await uploadMedia(file, 'members', 'image');
      if (url) {
        setFormData(prev => ({ ...prev, photoURL: url }));
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      setPhotoError(err.message || 'Could not process selected photo. Please try a different image.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must sign in with Google before submitting a membership application.');
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in all required contact information.');
      return;
    }
    if (!formData.photoURL) {
      alert('Please upload a member passport/identity photograph.');
      return;
    }

    setSubmitting(true);
    try {
      // Force email to match authenticated Google user
      const submissionData = {
        ...formData,
        email: user.email,
      };
      await applyForMembership(submissionData, user);
      await refreshUser();
      setIsApplyModalOpen(false);
    } catch (_err) {
      // Toast message shown via context
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    try {
      setLookedUpMember(await memberService.lookup(lookupQuery));
    } catch (err) {
      console.error('Member lookup failed:', err);
      setLookedUpMember(null);
    }
    setLookupDone(true);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE 1: APPROVED MEMBER -> DIGITAL ID CARD
  // ─────────────────────────────────────────────────────────────────────────────
  if (isMember) {
    const currentMember = memberData || user;
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <FiCheckCircle /> Verified Official Member
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Digital Membership Pass
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your official Universal Vellur membership card. Show it at club events or when asked by the committee.
          </p>
        </div>

        {/* Digital ID Card Display */}
        <DigitalIdCard member={currentMember} />

        {/* Member Privileges Checklist */}
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FiAward className="text-amber-500" /> Active Membership Privileges
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Official member of Universal Arts &amp; Sports Club Vellur.</span>
            </li>
            <li className="flex items-start gap-2">
              <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Take part in club matches, Onam games and competitions.</span>
            </li>
            <li className="flex items-start gap-2">
              <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Join clean-up drives and community programmes.</span>
            </li>
            <li className="flex items-start gap-2">
              <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Digital ID card with your CLUB-ID.</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/profile"
              className="text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors"
            >
              View Full Profile →
            </Link>
            <span className="text-[11px] text-slate-400 font-mono">
              {currentMember.membershipId || 'CLUB-000001'}
            </span>
          </div>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE 2: PENDING APPLICANT REVIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center text-3xl mx-auto shadow-md">
          <FiClock />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            Application Pending Review
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            We’re Reviewing Your Application
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you for applying for Universal Club membership. Our administration committee will verify your submission and assign your sequential <strong>CLUB-ID</strong>.
          </p>
        </div>

        {/* Applicant Details Summary Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-4 max-w-md mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <img
              src={user?.profilePhoto || user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
              alt="Applicant"
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{user?.name || user?.fullName}</h4>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <span className="font-bold text-amber-600">Under Review</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Plan</span>
              <span className="font-bold text-slate-900">₹200 / Year</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Once approved by the committee, your official Digital ID Pass will appear right here.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            Browse Club Events in the Meantime →
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE 2B: REJECTED APPLICANT STATUS
  // ─────────────────────────────────────────────────────────────────────────────
  if (isRejected) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 border border-red-200 flex items-center justify-center text-3xl mx-auto shadow-md">
          <FiXCircle />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-black uppercase tracking-wider">
            Application Not Approved
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Membership Application Status
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your previous membership application was not approved by the club committee. If you believe this was in error or you wish to submit updated details, you may submit a new application below.
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="amber"
            size="md"
            onClick={handleOpenApplyModal}
          >
            Re-submit Application
          </Button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE 3: GUEST OR NOT YET APPLIED -> HERO PLAN & APPLICATION FORM
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-600 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
          <FiAward /> Official Club Membership
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Join Universal Vellur
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Become part of Vellur's arts &amp; sports family — club events, matches, community drives and an official digital membership card.
        </p>
      </div>

      {/* Plan Presentation Card */}
      <div className="max-w-lg mx-auto rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 space-y-6 text-center bg-gradient-to-b from-slate-50 to-white">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center mx-auto shadow-md">
            <img src={clubLogo} alt="Club Crest" className="w-full h-full object-contain" />
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Annual Membership</span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-4xl sm:text-5xl font-black text-slate-950">₹200</span>
              <span className="text-sm font-bold text-slate-500">/ year</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-left font-medium text-slate-700 max-w-xs mx-auto">
            <li className="flex items-center gap-2.5">
              <FiCheckCircle className="text-amber-500 text-base shrink-0" />
              <span>Official Digital ID Card with CLUB-ID</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FiCheckCircle className="text-amber-500 text-base shrink-0" />
              <span>Club matches, Onam games &amp; competitions</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FiCheckCircle className="text-amber-500 text-base shrink-0" />
              <span>Clean-up drives &amp; community programmes</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FiCheckCircle className="text-amber-500 text-base shrink-0" />
              <span>Back Vellur's young talent</span>
            </li>
          </ul>

          <div className="pt-4">
            {user ? (
              <Button
                variant="amber"
                size="lg"
                fullWidth
                onClick={handleOpenApplyModal}
              >
                Apply for Membership Now
              </Button>
            ) : (
              <Button
                variant="amber"
                size="lg"
                fullWidth
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-2.5 font-bold"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google to Apply</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 3-Step "How It Works" Guide */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider text-center">
          How Membership Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black mx-auto">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">Sign in with Google</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify your identity instantly. Your email and Google profile are securely bound to your membership.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black mx-auto">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">Submit Application</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fill in your contact and identity details and upload a photo for your official club badge.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black mx-auto">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">Pass Issued</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Once verified by the club committee, your verified digital membership card is issued instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Public Member Verification Lookup */}
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Public Registry
          </span>
          <h3 className="text-xl font-bold tracking-tight">Verify a Club Member</h3>
          <p className="text-xs text-slate-400">
            Check official membership status by entering a CLUB-ID (e.g. CLUB-000001), registered email, or phone number.
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupQuery}
            onChange={(e) => {
              setLookupQuery(e.target.value);
              setLookupDone(false);
            }}
            placeholder="CLUB-000001, phone, or email..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shrink-0"
          >
            Verify
          </button>
        </form>

        {lookupDone && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 animate-fade-in">
            {lookedUpMember ? (
              <div className="flex items-center gap-4">
                <img
                  src={lookedUpMember.photoURL || lookedUpMember.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                  alt="Member"
                  className="w-14 h-14 rounded-xl object-cover border border-white/20"
                />
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm truncate">{lookedUpMember.name || lookedUpMember.fullName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {lookedUpMember.status === 'approved' ? 'Active Member' : lookedUpMember.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-amber-400 font-bold">{lookedUpMember.membershipId}</p>
                  <p className="text-[11px] text-slate-400">
                    Valid until: {lookedUpMember.expiryDate ? new Date(lookedUpMember.expiryDate).toLocaleDateString() : 'Active'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-center text-slate-400 py-2">
                No active official member found matching "{lookupQuery}".
              </p>
            )}
          </div>
        )}
      </div>

      {/* Application Form Modal Dialog */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Universal Club Membership Application"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          
          {/* Member Photo Upload */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl bg-slate-200 overflow-hidden border border-slate-300 shrink-0 flex items-center justify-center">
                {isUploadingPhoto ? (
                  <div className="flex flex-col items-center justify-center gap-1 text-slate-600">
                    <FiLoader className="text-2xl animate-spin text-amber-600" />
                    <span className="text-[9px] font-bold">Processing...</span>
                  </div>
                ) : formData.photoURL ? (
                  <img src={formData.photoURL} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="text-3xl text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="form-label mb-0">ID Photo (Passport / Clear Face) *</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-amber-500 hover:text-amber-600 text-xs font-semibold text-slate-700 shadow-xs transition-colors">
                    <FiUpload className="text-xs" />
                    <span>{formData.photoURL ? 'Change Photo' : 'Choose Photo'}</span>
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp,.jfif,.heic"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className="hidden"
                    />
                  </label>
                  {formData.photoURL && !isUploadingPhoto && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photoURL: '' }))}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Will be displayed on your official digital ID card.</p>
              </div>
            </div>

            {photoError && (
              <p className="text-xs text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                {photoError}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your official full name"
              className="form-input"
              required
            />
          </div>

          {/* Locked Verified Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0 flex items-center gap-1">
                  <FiLock className="text-slate-400 text-xs" /> Verified Google Email
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Verified
                </span>
              </div>
              <input
                type="email"
                value={user?.email || formData.email}
                readOnly
                disabled
                className="form-input bg-slate-100 text-slate-500 cursor-not-allowed select-none font-medium"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Bound to your authenticated Google account.</p>
            </div>

            <div>
              <label className="form-label">10-Digit Mobile Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="9847012345"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Gender</label>
              <div className="flex items-center gap-1.5 pt-1">
                {genderOptions.map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    active={formData.gender === g}
                    onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Blood Group */}
          <div>
            <label className="form-label">Blood Group</label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {bloodGroups.map((bg) => (
                <Chip
                  key={bg}
                  label={bg}
                  active={formData.bloodGroup === bg}
                  onClick={() => setFormData(prev => ({ ...prev, bloodGroup: bg }))}
                />
              ))}
            </div>
          </div>

          {/* Residential Address */}
          <div>
            <label className="form-label">Residential Address (Optional)</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="House name, street, city, pin code..."
              rows={2}
              className="form-textarea"
            />
          </div>

          {/* Fee Notice */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="font-bold">Annual Membership Fee:</span>
            <span className="font-black text-sm text-slate-950">₹200 / Year</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="amber"
              size="md"
              type="submit"
              loading={submitting}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
