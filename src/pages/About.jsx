// About Club Page: Heritage, History, Vision, Mission, Objectives
import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiCompass, FiCheckCircle, FiMapPin, FiShield } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import clubLogo from '../assets/club-logo.webp';

export default function About() {
  const { clubInfo } = useClubData();

  const objectives = [
    'Establish regional standard athletic and strength facilities accessible to all community members.',
    'Scout, sponsor, and coach promising youth track, football, and racquet sports athletes in Malappuram.',
    'Host state-recognized badminton, volleyball, and 7-a-side football tournaments annually.',
    'Promote holistic lifestyle wellness through yoga, physical literacy, and restorative workshops.',
    'Maintain a transparent, member-centric sports association affiliated with state sports councils.'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
          <FiShield /> Established {clubInfo.establishedYear}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Heritage & Mission
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {clubInfo.tagline}
        </p>
      </div>

      {/* Heritage & Origin Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-md">
            <img src={clubLogo} alt="Universal Club Emblem" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">A Decade of Grassroots Athletics</h2>
            <p className="text-xs text-slate-400">{clubInfo.registrationNumber}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Universal Sports & Arts Club was founded in 2015 by a passionate collective of former state athletes and community elders in Malappuram, Kerala. Recognizing the scarcity of structured physical training infrastructure, the club set out to build an all-inclusive complex bridging grassroots youth talent and elite athletic coaching.
          </p>
          <p>
            Over the past decade, our facilities have expanded from a single outdoor sprint track to a full-fledged athletic complex housing four BWF-standard synthetic badminton courts, an Eleiko-equipped Olympic weightlifting gym, and an all-weather floodlit 7-a-side football turf.
          </p>
        </div>
      </div>

      {/* Vision & Mission Dual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vision */}
        <div className="p-8 rounded-3xl bg-slate-950 text-white space-y-4 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black">
            <FiCompass />
          </div>
          <h3 className="text-xl font-black text-white">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To become Kerala's benchmark community athletics hub, inspiring every child and adult to embrace lifelong physical fitness, competitive sportsmanship, and mental resilience.
          </p>
        </div>

        {/* Mission */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-slate-900 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl font-black">
            <FiTarget />
          </div>
          <h3 className="text-xl font-black text-slate-900">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Provide state-of-the-art training infrastructure at a democratic fee of just ₹200/year, ensuring that economic background never restricts an aspiring athlete from greatness.
          </p>
        </div>

      </div>

      {/* Core Objectives Checklist */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
          Core Institutional Objectives
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <FiCheckCircle className="text-emerald-500 text-lg shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 font-medium leading-relaxed">{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Location Coordinates & Contact CTA */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FiMapPin /> Universal Sports Complex
          </div>
          <h4 className="text-lg font-black text-white">{clubInfo.address}</h4>
          <p className="text-xs text-slate-400">Weekdays: {clubInfo.openingHours.weekdays} • Weekends: {clubInfo.openingHours.weekends}</p>
        </div>

        <Link
          to="/contact"
          className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-all shrink-0"
        >
          Contact & Directions →
        </Link>
      </div>

    </div>
  );
}
