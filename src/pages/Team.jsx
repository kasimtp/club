// Team/Leadership Page Component
import React from 'react';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Spinner from '../components/Spinner';

const Team = () => {
  const { team, loading } = useClubData();

  // Group team members
  const president = team.find(t => t.position === 'President');
  const secretary = team.find(t => t.position === 'Secretary');
  const otherMembers = team.filter(t => t.position !== 'President' && t.position !== 'Secretary');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Universal Leaders</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Our Leadership & Committee
        </h1>
        <p className="text-gray-400 text-lg">
          Meet the dedicated professionals and committee members managing facility schedules, club compliance, and athletic programs.
        </p>
      </div>

      {loading.team ? (
        <Spinner text="Loading team profiles..." />
      ) : (
        <div className="space-y-24">
          
          {/* Executive Leadership (President & Secretary) */}
          <section className="space-y-10">
            <h2 className="text-xl font-bold uppercase tracking-wider text-center text-primary">Executive Committee</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              
              {/* President */}
              {president && (
                <div className="bg-gray-900/30 border border-gray-850 rounded-2xl overflow-hidden hover-lift flex flex-col sm:flex-row h-full">
                  <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden shrink-0">
                    <img
                      src={president.image}
                      alt={president.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-extrabold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        {president.position}
                      </span>
                      <h3 className="text-lg font-bold text-white pt-1">{president.name}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-light line-clamp-5">
                        {president.bio}
                      </p>
                    </div>
                    <a
                      href={`mailto:${president.email}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-primary transition-colors"
                    >
                      <FiMail /> {president.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Secretary */}
              {secretary && (
                <div className="bg-gray-900/30 border border-gray-850 rounded-2xl overflow-hidden hover-lift flex flex-col sm:flex-row h-full">
                  <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden shrink-0">
                    <img
                      src={secretary.image}
                      alt={secretary.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-extrabold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        {secretary.position}
                      </span>
                      <h3 className="text-lg font-bold text-white pt-1">{secretary.name}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-light line-clamp-5">
                        {secretary.bio}
                      </p>
                    </div>
                    <a
                      href={`mailto:${secretary.email}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-primary transition-colors"
                    >
                      <FiMail /> {secretary.email}
                    </a>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Committee Members & Advisors */}
          {otherMembers.length > 0 && (
            <section className="space-y-10 border-t border-gray-900 pt-16">
              <h2 className="text-xl font-bold uppercase tracking-wider text-center text-indigo-400">Coaches & Advisory Panel</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-gray-900/20 border border-gray-850/80 rounded-2xl p-6 hover-lift flex flex-col justify-between h-full space-y-6"
                  >
                    <div className="space-y-4">
                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-14 h-14 rounded-full object-cover border border-gray-700 shrink-0"
                        />
                        <div>
                          <h4 className="text-base font-bold text-white">{member.name}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{member.position}</span>
                        </div>
                      </div>
                      
                      {/* Bio */}
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {member.bio}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-850/40 text-xs">
                      <a 
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors"
                      >
                        <FiMail /> {member.email}
                      </a>
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-500">
                        <FiCheckCircle /> Certified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

    </div>
  );
};

export default Team;
