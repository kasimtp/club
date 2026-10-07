// Contact Page — the club's real public channels
import React from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiInstagram, FiFacebook, FiArrowUpRight } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';

function ChannelCard({ href, icon: Icon, label, value, note }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass rounded-[30px] p-6 sm:p-7 flex items-center gap-4 group"
    >
      <span className="w-14 h-14 rounded-full bg-white text-ember flex items-center justify-center text-2xl shrink-0">
        <Icon />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">{label}</p>
        <p className="font-display text-lg font-semibold text-ink truncate">{value}</p>
        {note && <p className="text-xs text-ink-muted">{note}</p>}
      </div>
      <span className="w-11 h-11 rounded-full bg-white text-ember flex items-center justify-center shrink-0 group-hover:bg-ember group-hover:text-white transition-all">
        <FiArrowUpRight />
      </span>
    </a>
  );
}

export default function Contact() {
  const { clubInfo } = useClubData();
  const { socials } = clubInfo;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fade-in">

      {/* Header */}
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">Contact</p>
        <h1 className="font-display text-4xl sm:text-5xl font-medium text-ink tracking-tight mt-2">
          Say <span className="font-bold">hello</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
          Questions about membership, events or joining a team? The quickest way to reach the club is a message on
          Instagram or Facebook.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ChannelCard
          href={socials.instagram}
          icon={FiInstagram}
          label="Instagram"
          value={socials.instagramHandle}
          note={`${clubInfo.instagramFollowers} followers · send a DM`}
        />
        <ChannelCard
          href={socials.facebook}
          icon={FiFacebook}
          label="Facebook"
          value="Universal Arts & Sports Club Vellur"
          note="Message the page"
        />
      </div>

      <div className="glass rounded-[30px] p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
        <div className="flex items-start gap-3">
          <FiMapPin className="text-ember text-lg mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-ink">Clubhouse</p>
            <p className="text-ink-muted">{clubInfo.address}</p>
          </div>
        </div>
        {clubInfo.phone && (
          <div className="flex items-start gap-3">
            <FiPhone className="text-ember text-lg mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-ink">Phone</p>
              <a href={`tel:${clubInfo.phone}`} className="text-ink-muted hover:text-ink">{clubInfo.phone}</a>
            </div>
          </div>
        )}
        {clubInfo.email && (
          <div className="flex items-start gap-3">
            <FiMail className="text-ember text-lg mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-ink">Email</p>
              <a href={`mailto:${clubInfo.email}`} className="text-ink-muted hover:text-ink">{clubInfo.email}</a>
            </div>
          </div>
        )}
        {clubInfo.openingHours && (
          <div className="flex items-start gap-3">
            <FiClock className="text-ember text-lg mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-ink">Hours</p>
              <p className="text-ink-muted">{clubInfo.openingHours}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
