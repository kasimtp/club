// Program Detail Page
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiCheck, FiShare2 } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';

export default function ProgramDetail() {
  const { id } = useParams();
  const { programs } = useClubData();
  const navigate = useNavigate();

  const program = programs.find((p) => p.id === id || p.documentId === id);

  if (!program) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Program Not Found</h2>
        <p className="text-sm text-slate-500">The requested program or tournament could not be found.</p>
        <Button variant="outline" onClick={() => navigate('/programs')}>
          Back to Programs
        </Button>
      </div>
    );
  }

  const handleRegister = () => {
    alert('Registration interest recorded! Our sports coordinator will contact you with full schedule guidelines.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      {/* Main Poster Banner */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-950 shadow-xl">
        <img
          src={program.posterUrl}
          alt={program.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-violet-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
            Coming Soon
          </span>
          <Chip label={program.category} />
        </div>
      </div>

      {/* Program Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {program.title}
        </h1>

        {/* Info Grid */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-lg shrink-0">
              <FiCalendar />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
              <span className="font-bold text-slate-900">{program.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-lg shrink-0">
              <FiClock />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Timing</span>
              <span className="font-bold text-slate-900">{program.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg shrink-0">
              <FiMapPin />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
              <span className="font-bold text-slate-900 truncate max-w-[160px]">{program.location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">About This Program</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleRegister}
            className="w-full sm:w-auto"
          >
            Register Interest Now
          </Button>

          <Link
            to="/membership"
            className="text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
          >
            Members receive priority tournament slots →
          </Link>
        </div>
      </div>

    </div>
  );
}
