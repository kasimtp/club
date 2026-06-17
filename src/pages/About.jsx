// About Us Page Component
import React from 'react';
import { FiCompass, FiShield, FiHeart, FiTrendingUp } from 'react-icons/fi';

const About = () => {
  const objectives = [
    { title: 'Athletic Advancement', desc: 'Providing state-of-the-art facilities and elite training modules for members to achieve peak fitness.', icon: FiTrendingUp },
    { title: 'Community Synergy', desc: 'Fostering a supportive ecosystem through structured team activities, workshops, and family gatherings.', icon: FiHeart },
    { title: 'Structured Leadership', desc: 'Encouraging athletic integrity, personal discipline, and sportsmanship across all levels of play.', icon: FiShield },
    { title: 'Global Standards', desc: 'Adapting up-to-date methodologies, health insights, and wellness tech inside our local routines.', icon: FiCompass }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 animate-fade-in">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Who We Are</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          About Universal Club
        </h1>
        <p className="text-gray-400 text-lg">
          Dedicated to physical training excellence, wellness balance, and high-value social community since 2015.
        </p>
      </div>

      {/* History Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Our Club History</h2>
          <div className="border-l-2 border-primary/30 pl-6 space-y-8">
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-dark-bg"></div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">2015 - Foundation</p>
              <h4 className="text-base font-semibold text-white mt-0.5">The Spark</h4>
              <p className="text-sm text-gray-400 mt-1">Universal Club was founded by decathlete Nicholas Vance as a small private sports group looking for structural workouts. The vision was clear: bridge local talent with premium coaching resources.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-dark-bg"></div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">2019 - Facility Expansion</p>
              <h4 className="text-base font-semibold text-white mt-0.5">Universal Central Gym</h4>
              <p className="text-sm text-gray-400 mt-1">Acquired our main indoor facility featuring standard weights, yoga patios, and medical consultation clinics. Coach Sophia Martinez joined full-time, establishing youth academies.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-400 border-4 border-dark-bg"></div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">2024 - Modernization</p>
              <h4 className="text-base font-semibold text-white mt-0.5">The Digital Portal</h4>
              <p className="text-sm text-gray-400 mt-1">Released our initial digital portal and member management services. Expanding community support to over 500 active members and offering virtual coaching services.</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80" 
            alt="Universal training facilities" 
            className="w-full h-[450px] object-cover scale-100 hover:scale-102 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Mission & Vision cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-gray-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
            M
          </div>
          <h3 className="text-xl font-bold text-white">Our Mission</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            To provide a premier facility that integrates athletic training, nutritional awareness, and physical recovery. We empower our members to set ambitious fitness goals and supply the coaching excellence, tools, and social support necessary to exceed them safely.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/10 border border-gray-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl font-bold">
            V
          </div>
          <h3 className="text-xl font-bold text-white">Our Vision</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            To be recognized as the leading regional hub for community-centric fitness development. We envision a space where athletic achievements and mental wellness sit side-by-side, creating an inclusive family that inspires positive health changes for generations.
          </p>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Core Objectives</h2>
          <p className="text-sm text-gray-400">Tactical points that drive our daily operations and facility setups.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {objectives.map((obj) => (
            <div key={obj.title} className="p-6 bg-gray-900/30 border border-gray-850 hover:border-gray-800 rounded-2xl flex flex-col justify-between space-y-6 hover-lift">
              <div className="w-10 h-10 rounded-lg bg-gray-800/80 flex items-center justify-center text-lg text-primary">
                <obj.icon />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">{obj.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{obj.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
