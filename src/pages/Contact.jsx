// Contact & Enquiry Form Page
import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Button from '../components/ui/Button';

export default function Contact() {
  const { clubInfo } = useClubData();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please complete all form fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
          <FiMapPin /> Connect With USAC
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Have queries about tournament registrations, synthetic court bookings, or membership verification? Drop us a message or visit our sports complex.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Coordinates Card */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-950 text-white space-y-6 shadow-xl">
          <h2 className="text-xl font-black text-white">Complex Coordinates</h2>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-lg shrink-0 mt-0.5 font-bold">
                <FiMapPin />
              </div>
              <div>
                <strong className="text-white block font-bold mb-0.5">Physical Address</strong>
                <span>{clubInfo.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center text-lg shrink-0 mt-0.5 font-bold">
                <FiPhone />
              </div>
              <div>
                <strong className="text-white block font-bold mb-0.5">Phone Enquiry</strong>
                <a href={`tel:${clubInfo.phone}`} className="text-amber-400 hover:underline">
                  {clubInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500 text-white flex items-center justify-center text-lg shrink-0 mt-0.5 font-bold">
                <FiMail />
              </div>
              <div>
                <strong className="text-white block font-bold mb-0.5">Official Email</strong>
                <a href={`mailto:${clubInfo.email}`} className="text-amber-400 hover:underline">
                  {clubInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0FA968] text-white flex items-center justify-center text-lg shrink-0 mt-0.5 font-bold">
                <FiClock />
              </div>
              <div>
                <strong className="text-white block font-bold mb-0.5">Facility Hours</strong>
                <p>Weekdays: {clubInfo.openingHours.weekdays}</p>
                <p>Weekends: {clubInfo.openingHours.weekends}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 text-[11px] text-slate-400">
            {clubInfo.affiliation}
          </div>
        </div>

        {/* Right Interactive Enquiry Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900">Send an Online Enquiry</h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fade-in">
              <FiCheckCircle className="text-4xl text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you for contacting Universal Club. A coordinator will respond to your enquiry shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
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
                <label className="form-label">Message / Question</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="How can we help you regarding membership, coaching, or court bookings?"
                  rows={4}
                  className="form-textarea"
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  loading={loading}
                  icon={FiSend}
                >
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
