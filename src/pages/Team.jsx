// Leadership & Committee Directory Page
import React from 'react';
import { FiMail, FiAward, FiShield } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Avatar from '../components/ui/Avatar';

export default function Team() {
  const { team } = useClubData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
          <FiShield /> Governance & Staff
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Club Leadership & Coaches
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Meet the dedicated committee members, state athletes, and certified coaches driving the Universal Sports & Arts Club mission forward.
        </p>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all text-center flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3 flex flex-col items-center">
              <Avatar
                src={member.image}
                name={member.name}
                size="2xl"
                className="border-2 border-amber-400 shadow-md"
              />

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">{member.name}</h3>
                <span className="inline-block px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase tracking-wider">
                  {member.position}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">
                {member.bio}
              </p>
            </div>

            {member.email && (
              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors"
                >
                  <FiMail className="text-sm" /> Contact
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
