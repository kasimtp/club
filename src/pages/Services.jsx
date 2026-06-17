// Services Page Component
import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiCalendar, FiBookOpen, FiSmile, FiCheck, FiArrowRight } from 'react-icons/fi';

const Services = () => {
  const serviceList = [
    {
      id: 's-1',
      title: 'Training Programs',
      icon: FiTrendingUp,
      accent: 'text-primary border-primary/20 bg-primary/10',
      description: 'Structured workout regimes designed by Olympic athletes. Includes athletic conditioning, strength training, flexibility enhancement, and cardiorespiratory improvement.',
      features: [
        'Customized heart-zone performance plans',
        'One-on-one professional athletic counseling',
        'Advanced posture and body mechanics feedback',
        'Access to standard weights & premium gym facilities'
      ],
      linkText: 'Become a Member',
      linkUrl: '/membership'
    },
    {
      id: 's-2',
      title: 'Events & Competitions',
      icon: FiCalendar,
      accent: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
      description: 'Test your stamina and push boundaries in our seasonal tournaments and races. Open to both members and registered community competitors.',
      features: [
        'Annual Autumn & Summer Marathons',
        'Inter-club volleyball and tennis tournaments',
        'Accredited race timers and physical support stations',
        'Medals, podium accolades, and community cash pools'
      ],
      linkText: 'Explore Calendar',
      linkUrl: '/events'
    },
    {
      id: 's-3',
      title: 'Workshops & Seminars',
      icon: FiBookOpen,
      accent: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
      description: 'Theoretical and practical classes covering sports science, recovery habits, performance nutrition, and mental focus practices.',
      features: [
        'Cardiovascular optimization theory',
        'Myofascial release & self-massage recovery guides',
        'Science-backed custom macro meal preparation',
        'Mindfulness, breathing work, and sleep consulting'
      ],
      linkText: 'Check Schedules',
      linkUrl: '/events'
    },
    {
      id: 's-4',
      title: 'Community Activities',
      icon: FiSmile,
      accent: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
      description: 'Fostering peer connections outside training blocks. From charity fundraisers to family picnics, we emphasize social wellness and volunteer work.',
      features: [
        'Charity relay runs and community clinic donations',
        'Annual summer barbecue & winter awards gala',
        'Youth athletic drive and school outreach plans',
        'Weekend social hiking trips and outdoor camping'
      ],
      linkText: 'Contact Representative',
      linkUrl: '/contact'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">What We Offer</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Universal Club Services
        </h1>
        <p className="text-gray-400 text-lg">
          A comprehensive ecosystem designed to optimize physical capacity, build knowledge, and cultivate connections.
        </p>
      </div>

      {/* Services Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {serviceList.map((service) => (
          <div 
            key={service.id} 
            className="bg-gray-900/30 border border-gray-850 hover:border-gray-800 rounded-3xl p-8 hover-lift flex flex-col justify-between space-y-8"
          >
            <div className="space-y-5">
              {/* Header block with Icon */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl ${service.accent}`}>
                  <service.icon />
                </div>
                <h3 className="text-2xl font-bold text-white">{service.title}</h3>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
              
              {/* Bullet Features */}
              <ul className="space-y-2.5 pt-2">
                {service.features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <FiCheck className="text-primary text-base shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions Link */}
            <div className="pt-4 border-t border-gray-850/60">
              <Link 
                to={service.linkUrl} 
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-all group"
              >
                <span>{service.linkText}</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Highlight */}
      <section className="p-8 rounded-3xl bg-slate-900/40 border border-gray-850 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Need a Tailored Team Package?</h3>
          <p className="text-sm text-gray-400 mt-1">We offer corporate membership discounts and customized private event rentals for teams larger than 10.</p>
        </div>
        <Link 
          to="/contact" 
          className="w-full lg:w-auto text-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
        >
          Consult Corporate Plans
        </Link>
      </section>

    </div>
  );
};

export default Services;
