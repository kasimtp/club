// Leadership & Committee Page
import React from 'react';
import { FiMail, FiInstagram } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Avatar from '../components/ui/Avatar';

export default function Team() {
  const { team, clubInfo } = useClubData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fade-in">

      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">Committee</p>
        <h1 className="font-display text-4xl sm:text-5xl font-medium text-ink tracking-tight mt-2">
          The people behind <span className="font-bold">Universal</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
          The office-bearers and volunteers who run the club.
        </p>
      </div>

      {team.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member) => (
            <div key={member.id} className="glass rounded-[30px] p-6 text-center flex flex-col items-center gap-3">
              <Avatar src={member.image} name={member.name} size="2xl" className="border-4 border-white shadow-md" />
              <h3 className="font-display text-lg font-semibold text-ink">{member.name}</h3>
              <span className="pill !h-7 !text-[11px]">{member.position}</span>
              {member.bio && <p className="text-xs text-ink-muted leading-relaxed">{member.bio}</p>}
              {member.email && (
                <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-ember transition-colors">
                  <FiMail /> Contact
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-[30px] p-10 text-center space-y-3">
          <div className="orb w-12 h-12 mx-auto" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-ink">Committee details coming soon</h3>
          <p className="text-sm text-ink-muted">Until then, reach the club directly on Instagram.</p>
          <a
            href={clubInfo.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-ember transition-colors"
          >
            <FiInstagram /> {clubInfo.socials.instagramHandle}
          </a>
        </div>
      )}

    </div>
  );
}
