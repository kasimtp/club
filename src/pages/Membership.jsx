// Membership Page Component
import React, { useState, useRef } from 'react';
import { FiCheck, FiAward, FiCheckCircle, FiSearch, FiDownload, FiUser } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import { useToast } from '../context/ToastContext';

const Membership = () => {
  const { createMembershipRequest, members } = useClubData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('apply'); // 'apply' or 'search'
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', comments: '' });
  const [formErrors, setFormErrors] = useState({});

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const formRef = useRef(null);

  const plans = [
    {
      name: 'Universal Membership',
      price: '₹200',
      billing: '/ month',
      badge: 'All-Access Pass',
      icon: FiAward,
      color: 'border-primary/40 bg-primary/5 shadow-xl shadow-emerald-500/5',
      textColor: 'text-primary',
      features: [
        'Unrestricted access to weights & cardio facilities',
        'Extended facility hours (06:00 AM - 10:00 PM)',
        'Full access to lockers, showers, and lounge areas',
        'Free entry to all seasonal tournaments & workshops',
        'Downloadable official membership ID card & profile'
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[0-9\s-]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Valid phone format is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        plan: 'Universal Membership',
        message: formData.comments
      };
      await createMembershipRequest(payload);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', comments: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Please enter a name, email, or phone number to search.', 'warning');
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const matches = members.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      (m.phone && m.phone.includes(query)) ||
      m.id.toLowerCase().includes(query)
    );

    setSearchResults(matches);
    setHasSearched(true);
    if (matches.length > 0) {
      setSelectedMember(matches[0]); // Select first match by default
      showToast(`Found ${matches.length} matching member(s)!`, 'success');
    } else {
      setSelectedMember(null);
      showToast('No active membership found.', 'info');
    }
  };

  const downloadCardAsSVG = (member) => {
    const svgContent = `
      <svg width="450" height="280" viewBox="0 0 450 280" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#f8fafc" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#4f46e5" />
          </linearGradient>
          <style>
            .card-title { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 22px; fill: #0f172a; letter-spacing: 2px; }
            .card-subtitle { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 600; font-size: 9px; fill: #10b981; letter-spacing: 1.5px; }
            .label { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 700; font-size: 10px; fill: #64748b; letter-spacing: 1px; }
            .value { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 700; font-size: 15px; fill: #1e293b; }
            .id-value { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 16px; fill: #4f46e5; }
            .status-badge { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 10px; fill: #10b981; }
          </style>
        </defs>
        <!-- Background Card -->
        <rect width="450" height="280" rx="24" fill="url(#cardGrad)" stroke="#e2e8f0" stroke-width="1.5"/>
        
        <!-- Subtle Vector Grids -->
        <circle cx="410" cy="40" r="80" fill="url(#accentGrad)" opacity="0.04"/>
        <circle cx="40" cy="240" r="60" fill="#10b981" opacity="0.03"/>

        <!-- Top Accent Bar -->
        <rect width="450" height="8" rx="0" fill="url(#accentGrad)"/>
        
        <!-- Brand Name -->
        <text x="35" y="52" class="card-title">UNIVERSAL CLUB</text>
        <text x="35" y="68" class="card-subtitle">VELLUR, KERALA - 676517</text>
        
        <!-- Chip Icon Placeholder -->
        <rect x="375" y="32" width="40" height="30" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
        <circle cx="395" cy="47" r="7" fill="#10b981" opacity="0.8"/>
        
        <!-- Divider Line -->
        <line x1="35" y1="95" x2="415" y2="95" stroke="#e2e8f0" stroke-width="1"/>
        
        <!-- Row 1: Name & ID -->
        <text x="35" y="130" class="label">MEMBER NAME</text>
        <text x="35" y="152" class="value">\${member.name}</text>
        
        <text x="280" y="130" class="label">MEMBER ID</text>
        <text x="280" y="152" class="id-value">\${member.id.toUpperCase()}</text>
        
        <!-- Row 2: Email & Date -->
        <text x="35" y="200" class="label">EMAIL ADDRESS</text>
        <text x="35" y="220" class="value">\${member.email}</text>
        
        <text x="280" y="200" class="label">JOINED DATE</text>
        <text x="280" y="220" class="value">\${member.joinedDate || '2026-06-16'}</text>
        
        <!-- Footer Accent Status -->
        <rect x="35" y="245" width="85" height="20" rx="10" fill="#ecfdf5"/>
        <text x="45" y="259" class="status-badge">● ACTIVE</text>
      </svg>
    `;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `universal_membership_\${member.id.toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Membership Card (SVG) downloaded successfully!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Club Access Portal</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Universal Club Membership
        </h1>
        <p className="text-gray-400 text-lg">
          Join our elite community or search and download your official digital membership ID.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 p-1 bg-gray-950 rounded-2xl border border-gray-850">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'apply'
                ? 'bg-primary text-white shadow-md shadow-emerald-500/10'
                : 'text-gray-400 hover:text-white bg-transparent'
            }`}
          >
            Apply for Membership
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'search'
                ? 'bg-primary text-white shadow-md shadow-emerald-500/10'
                : 'text-gray-400 hover:text-white bg-transparent'
            }`}
          >
            Search & Download Card
          </button>
        </div>
      </div>

      {/* Tab 1 Content: Apply */}
      {activeTab === 'apply' && (
        <div className="space-y-20 animate-fade-in">
          {/* Centered Pricing Card */}
          <section className="flex justify-center">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`max-w-md w-full rounded-3xl border p-8 flex flex-col justify-between space-y-8 transition-all duration-300 relative ${plan.color}`}
              >
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-[10px] font-bold text-white uppercase tracking-wider shadow-md shadow-emerald-500/10">
                  {plan.badge}
                </span>

                <div className="space-y-6 text-left">
                  {/* Header Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Official Plan</span>
                    </div>
                    <plan.icon className={`text-3xl ${plan.textColor}`} />
                  </div>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.billing}</span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-800/80"></div>

                  {/* Features List */}
                  <ul className="space-y-3.5 pt-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <FiCheck className="text-primary text-lg shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Scroll to Form Button */}
                <button
                  onClick={() => {
                    if (formRef.current) {
                      formRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/15 cursor-pointer"
                >
                  Apply For Membership
                </button>
              </div>
            ))}
          </section>

          {/* Online Application Form */}
          <section 
            ref={formRef}
            className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 bg-gray-900/20 border border-gray-850 space-y-8 scroll-mt-24"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Online Application Form</h2>
              <p className="text-xs text-gray-400">Complete details below and submit. Our executive committee will review your application.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl mx-auto animate-bounce">
                  <FiCheckCircle />
                </div>
                <h3 className="text-lg font-bold text-white">Application Submitted!</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Your registration has been successfully logged. The committee will examine your request and follow up via email within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="form-label" htmlFor="member-name">Full Name</label>
                    <input
                      id="member-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input text-sm"
                      placeholder="Jane Doe"
                    />
                    {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="form-label" htmlFor="member-email">Email Address</label>
                    <input
                      id="member-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input text-sm"
                      placeholder="jane.doe@gmail.com"
                    />
                    {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="form-label" htmlFor="member-phone">Phone Number</label>
                    <input
                      id="member-phone"
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input text-sm"
                      placeholder="+91 (483) 273-4567"
                    />
                    {formErrors.phone && <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="form-label" htmlFor="member-plan">Selected Plan</label>
                    <input
                      id="member-plan"
                      type="text"
                      readOnly
                      className="form-input text-sm bg-gray-950/40 text-gray-400 border-gray-800"
                      value="Universal Membership (₹200/month)"
                    />
                  </div>

                </div>

                <div>
                  <label className="form-label" htmlFor="member-comments">Additional Comments / Health Focus</label>
                  <textarea
                    id="member-comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows="4"
                    className="form-input text-sm"
                    placeholder="Let us know about your training history or goals..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-500 hover:to-primary text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {submitting ? 'Submitting Application...' : 'Send Membership Request'}
                </button>
              </form>
            )}
          </section>
        </div>
      )}

      {/* Tab 2 Content: Search and Download Card */}
      {activeTab === 'search' && (
        <div className="space-y-12 animate-fade-in">
          <section className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 bg-gray-900/20 border border-gray-850 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
                <FiSearch className="text-primary text-2xl" /> Search Membership Card
              </h2>
              <p className="text-xs text-gray-400">
                Enter your registered name, email address, or phone number to retrieve your active membership details.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto text-left">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="text"
                  className="form-input pl-10 text-sm"
                  placeholder="E.g., Alexander Wright or alex.wright@universalclub.com"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              >
                Search Card
              </button>
            </form>
          </section>

          {/* Results Display */}
          {hasSearched && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
              {searchResults.length === 0 ? (
                <div className="text-center p-8 rounded-2xl bg-gray-900/10 border border-dashed border-gray-850 text-gray-400 space-y-2">
                  <p className="text-sm font-semibold">No active membership found.</p>
                  <p className="text-xs text-gray-500">
                    Double-check the search query or spelling. If you recently registered online, the committee may still be reviewing your request.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {searchResults.length > 1 && (
                    <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3 text-left">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Multiple Matches Found ({searchResults.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => setSelectedMember(member)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              selectedMember?.id === member.id
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'bg-gray-900 border-gray-850 text-gray-400 hover:text-white'
                            }`}
                          >
                            {member.name} ({member.id})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedMember && (
                    <div className="space-y-6">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Membership Card Preview</p>
                      
                      {/* Membership Card graphic */}
                      <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-gray-800 shadow-2xl relative overflow-hidden space-y-8 text-left transition-all hover:scale-[1.01]">
                        {/* Glow gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[70px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none"></div>

                        {/* Top bar accent */}
                        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-primary to-indigo-600"></div>

                        {/* Card Header */}
                        <div className="flex justify-between items-start pt-2">
                          <div className="space-y-1">
                            <h3 className="text-xl font-black text-white tracking-widest leading-none">UNIVERSAL CLUB</h3>
                            <p className="text-[10px] text-primary font-bold tracking-widest">VELLUR, KERALA - 676517</p>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/15">
                            U
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-850/30"></div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                          <div>
                            <span className="text-[9px] uppercase text-gray-500 font-extrabold tracking-widest block">Member Name</span>
                            <span className="text-sm font-bold text-white mt-1 block">{selectedMember.name}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-gray-500 font-extrabold tracking-widest block">Member ID</span>
                            <span className="text-sm font-extrabold text-indigo-400 mt-1 block uppercase">{selectedMember.id}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-gray-500 font-extrabold tracking-widest block">Email Address</span>
                            <span className="text-xs font-semibold text-gray-300 mt-1 block truncate" title={selectedMember.email}>{selectedMember.email}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-gray-500 font-extrabold tracking-widest block">Joined Date</span>
                            <span className="text-xs font-semibold text-gray-300 mt-1 block">{selectedMember.joinedDate || '2026-06-16'}</span>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-850/30">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {selectedMember.status || 'Active'}
                          </span>
                          
                          <button
                            onClick={() => downloadCardAsSVG(selectedMember)}
                            className="px-5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/15 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <FiDownload className="text-sm" /> Download Card (SVG)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Membership;

