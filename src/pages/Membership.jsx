// Membership Hub Page
// Dynamic 3-State Screen: Digital ID Card / Pending Review Status / Application Plan & Form
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiAward, FiCheckCircle, FiClock, 
  FiUser 
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
  const { user, isMember, isPending, memberData, refreshUser } = useAuth();
  const { applyForMembership } = useClubData();
  const navigate = useNavigate();

  // Search by ID state for public lookup
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookedUpMember, setLookedUpMember] = useState(null);
  const [lookupDone, setLookupDone] = useState(false);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.mobile || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || 'Male',
    bloodGroup: user?.bloodGroup || 'O+',
    address: user?.address || '',
    photoURL: user?.profilePhoto || '',
  });

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Handle Photo Picker
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadMedia(file, 'members', 'image');
        setFormData(prev => ({ ...prev, photoURL: url }));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in all required contact information.');
      return;
    }
    if (!formData.photoURL) {
      alert('Please upload a member passport/identity photograph.');
      return;
    }

    setSubmitting(true);
    try {
      await applyForMembership(formData, user);
      await refreshUser();
      setIsApplyModalOpen(false);
    } catch (_err) {
      // toast shown in context
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
            Once approved, your Digital ID Pass will immediately appear here.
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
  // STATE 3: GUEST / NOT APPLIED -> HERO PLAN & APPLICATION FORM
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
            <Button
              variant="amber"
              size="lg"
              fullWidth
              onClick={() => setIsApplyModalOpen(true)}
            >
              Apply for Membership Now
            </Button>
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
            <h4 className="text-sm font-bold text-slate-900">Submit Application</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fill out your basic identity details and upload a photo for your official club card.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black mx-auto">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">Admin Approval</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              The club committee reviews your submission and generates your unique sequential CLUB-ID.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black mx-auto">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">Digital Pass Issued</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your 1-year verified digital membership card goes live instantly in your portal and app.
            </p>
          </div>
        </div>
      </div>

      {/* Membership Public Card Lookup / Search */}
      <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Already a Member? Search Official Pass
        </h3>
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            placeholder="Enter CLUB-ID (e.g. CLUB-000001) or Email..."
            className="form-input flex-1"
          />
          <Button variant="primary" size="md" type="submit">
            Search
          </Button>
        </form>

        {lookupDone && (
          lookedUpMember ? (
            <div className="pt-4 border-t border-slate-100">
              <DigitalIdCard member={lookedUpMember} />
            </div>
          ) : (
            <p className="text-xs text-red-500 font-medium pt-2">
              No verified membership found for "{lookupQuery}".
            </p>
          )
        )}
      </div>

      {/* Application Form Modal Dialog / Sliding Sheet */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Universal Club Membership Application"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          
          {/* Member Photo Upload */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-200 overflow-hidden border border-slate-300 shrink-0 flex items-center justify-center">
              {formData.photoURL ? (
                <img src={formData.photoURL} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-3xl text-slate-400" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <label className="form-label mb-1">ID Photo (Passport / Clear Face) *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-xs text-slate-600"
              />
              <p className="text-[10px] text-slate-400">Will be printed on your digital membership card.</p>
            </div>
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

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@gmail.com"
                className="form-input"
                required
              />
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
