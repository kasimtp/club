// Contact Us Page Component
import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [sending, setSending] = useState(false);

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
      errors.email = 'Please provide a valid email';
    }

    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message text is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    // Simulate sending email
    setTimeout(() => {
      setSending(false);
      showToast('Thank you! Your message has been received.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Get in Touch</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact Universal Club
        </h1>
        <p className="text-gray-400 text-lg">
          Have queries about membership tiers or training programs? Send us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* Phone Card */}
            <div className="p-5 rounded-2xl bg-gray-900/30 border border-gray-850 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl shrink-0">
                <FiPhone />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Call Representative</h4>
                <p className="text-sm text-gray-300">+91 (483) 273-4567</p>
                <p className="text-[10px] text-gray-500">Universal Helpline, Weekdays 08:00 AM - 08:00 PM</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-gray-900/30 border border-gray-850 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl shrink-0">
                <FiMail />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Send Email</h4>
                <a href="mailto:info@universalclub.com" className="text-sm text-gray-300 hover:text-primary transition-colors block">info@universalclub.com</a>
                <p className="text-[10px] text-gray-500">We respond to tickets within 12 hours</p>
              </div>
            </div>

            {/* Address Card */}
            <div className="p-5 rounded-2xl bg-gray-900/30 border border-gray-850 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl shrink-0">
                <FiMapPin />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Facility Address</h4>
                <p className="text-sm text-gray-300">Vellur, Vellur P.O., Malappuram, Kerala - 676517</p>
                <p className="text-[10px] text-gray-500">Parking lots & bicycle stands available</p>
              </div>
            </div>
          </div>

          {/* Clock hours card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-gray-850 flex items-start gap-4 mt-auto">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 text-xl shrink-0">
              <FiClock />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hours of Operation</h4>
              <p className="text-gray-400">Weekdays: <span className="text-white font-semibold">06:00 AM - 10:00 PM</span></p>
              <p className="text-gray-400">Saturdays: <span className="text-white font-semibold">07:00 AM - 08:00 PM</span></p>
              <p className="text-gray-400">Sundays: <span className="text-white font-semibold">08:00 AM - 06:00 PM</span></p>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-gray-900/20 border border-gray-850">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-lg font-bold text-white">Send Inquiry Message</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label" htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input text-xs sm:text-sm"
                  placeholder="John Doe"
                />
                {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input text-xs sm:text-sm"
                  placeholder="john@example.com"
                />
                {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-input text-xs sm:text-sm"
                placeholder="Inquiry about training sessions..."
              />
              {formErrors.subject && <p className="text-red-500 text-[10px] mt-1">{formErrors.subject}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="form-input text-xs sm:text-sm"
                placeholder="Describe your questions in detail here..."
              ></textarea>
              {formErrors.message && <p className="text-red-500 text-[10px] mt-1">{formErrors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-gray-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {sending ? 'Sending message...' : 'Submit Message'}
              {!sending && <FiSend />}
            </button>
          </form>
        </div>
      </div>

      {/* Vector/CSS Map Segment */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FiMapPin className="text-primary text-lg" />
          <h3 className="text-lg font-bold text-white">Universal Interactive Location</h3>
        </div>

        {/* Custom Premium Map Graphics */}
        <div className="relative rounded-3xl overflow-hidden border border-gray-200 h-96 bg-slate-50 flex items-center justify-center">
          {/* Animated map backdrop grid grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
          
          {/* Glowing routes lanes */}
          <svg className="absolute inset-0 w-full h-full stroke-gray-300/60 fill-none stroke-[2]" xmlns="http://www.w3.org/2000/svg">
            <path d="M-50,150 L350,150 L400,200 L1200,200" />
            <path d="M150,-50 L150,550" />
            <path d="M500,0 L500,450" strokeWidth="3" className="stroke-indigo-500/20" />
            <path d="M0,300 L1200,300" strokeWidth="4" className="stroke-emerald-500/10" />
            <circle cx="500" cy="200" r="140" className="stroke-gray-200" />
          </svg>

          {/* Marker Anchor */}
          <div className="relative z-10 text-center space-y-4">
            <div className="relative flex items-center justify-center mx-auto">
              <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-primary/30 opacity-75"></span>
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white text-3xl border-2 border-white/10 z-10">
                <FiMapPin />
              </div>
            </div>
            <div className="space-y-1 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-150 max-w-xs shadow-xl mx-auto">
              <h4 className="text-sm font-bold text-gray-900">Universal Central Facility</h4>
              <p className="text-xs text-gray-500">Vellur, Malappuram, Kerala - 676517</p>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block pt-1">Open daily 06 AM - 10 PM</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
