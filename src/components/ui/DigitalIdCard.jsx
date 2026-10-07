import React from 'react';
import { FiShield, FiCalendar, FiDroplet, FiPrinter, FiCheckCircle } from 'react-icons/fi';
import clubLogo from '../../assets/club-logo.webp';

export default function DigitalIdCard({ member }) {
  if (!member) return null;

  const membershipId = member.membershipId || member.membershipNumber || 'CLUB-000001';
  const name = member.fullName || member.name || 'Club Member';
  const photo = member.photoURL || member.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const bloodGroup = member.bloodGroup || 'O+';
  const dob = member.dateOfBirth || member.dob || '—';
  const gender = member.gender || '—';
  
  const joiningDate = member.joiningDate 
    ? new Date(member.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Active';

  const expiryDate = member.expiryDate
    ? new Date(member.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '1 Year Valid';

  const isExpired = member.expiryDate && new Date(member.expiryDate) < new Date();

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* The Physical Card Container */}
      <div 
        id="digital-id-card-print"
        className="relative overflow-hidden rounded-3xl bg-[#0F172A] border border-[#1E293B] text-white p-6 shadow-2xl select-none"
      >
        {/* Background Ambient Glow & Watermark */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 text-9xl font-black pointer-events-none">
          UASC
        </div>

        {/* Card Header: Brand & Crest */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center text-slate-950 shadow-md">
              <img src={clubLogo} alt="Club Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wider uppercase text-amber-400">Universal Club</h4>
              <p className="text-[10px] text-slate-400 font-medium">Arts & Sports Club • Vellur</p>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              isExpired ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              <FiCheckCircle className="text-xs" />
              {isExpired ? 'Expired' : 'Verified Member'}
            </span>
          </div>
        </div>

        {/* Member Identity Main Body */}
        <div className="flex items-start gap-4 mb-5 relative z-10">
          {/* Member Photo */}
          <div className="relative shrink-0">
            <img
              src={photo}
              alt={name}
              className="w-20 h-24 rounded-2xl object-cover border-2 border-amber-400/80 shadow-lg"
            />
            {bloodGroup && (
              <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-md bg-rose-500 text-white font-extrabold text-[10px] shadow-sm flex items-center gap-0.5">
                <FiDroplet className="text-[9px]" /> {bloodGroup}
              </div>
            )}
          </div>

          {/* Member Information */}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-lg font-extrabold text-white tracking-tight truncate">
              {name}
            </h3>
            
            {/* Membership ID Number Banner */}
            <div className="inline-block px-3 py-1 rounded-lg bg-white/10 border border-white/15">
              <span className="text-xs font-mono font-black text-amber-400 tracking-wider">
                {membershipId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px] text-slate-300">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">DOB</span>
                <span className="font-semibold">{dob}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Gender</span>
                <span className="font-semibold">{gender}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer: Dates & Barcode */}
        <div className="pt-3 border-t border-white/10 flex items-end justify-between relative z-10">
          <div className="space-y-0.5 text-[10px]">
            <div className="flex items-center gap-1 text-slate-400">
              <FiCalendar className="text-xs text-amber-400" />
              <span>Joined: <strong className="text-white font-semibold">{joiningDate}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <FiShield className="text-xs text-amber-400" />
              <span>Valid Thru: <strong className="text-white font-semibold">{expiryDate}</strong></span>
            </div>
          </div>

          {/* Simulated Digital Security Code */}
          <div className="text-right">
            <div className="h-6 flex items-center gap-0.5 justify-end opacity-75">
              {[4, 2, 6, 3, 5, 2, 7, 4, 3, 6, 2, 5, 4, 2, 5, 3].map((h, i) => (
                <div key={i} className="w-0.5 bg-slate-300" style={{ height: `${h * 3}px` }} />
              ))}
            </div>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
              SECURE DIGITAL PASS
            </span>
          </div>
        </div>
      </div>

      {/* Print / Action Button */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
        >
          <FiPrinter className="text-sm" /> Print / Save ID Card
        </button>
      </div>
    </div>
  );
}
