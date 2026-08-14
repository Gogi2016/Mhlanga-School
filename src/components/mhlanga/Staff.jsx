import React from 'react';
import { Mail, Phone, User } from 'lucide-react';

const TEAM = [
  {
    name: 'Mr Principal',
    role: 'Principal',
    photo: null,
    email: 'principal@mhlangass.co.za',
    phone: '+27000000000',
  },
  {
    name: 'Mr Deputy Principal',
    role: 'Deputy Principal',
    photo: null,
    email: 'deputy@mhlangass.co.za',
    phone: '+27000000000',
  },
  {
    name: 'Mrs HOD 1',
    role: 'HOD',
    photo: null,
    email: 'HOD1@mhlangass.co.za',
    phone: '+27000000000',
  },
  {
    name: 'Mrs HOD 2',
    role: 'HOD 2',
    photo: null,
    email: 'HOD2@mhlangass.co.za',
    phone: '+27000000000',
  },
];

export default function Staff() {
  return (
    <section className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-14 reveal">
        <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Instructors</p>
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
          PRINCIPAL &amp; TEAM
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM.map((m) => (
          <div key={m.name} className="reveal group relative">
            <div className="h-56 sm:h-64 bg-[#E3E3E3] overflow-hidden">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-24 h-24 text-white" fill="white" strokeWidth={0} />
                </div>
              )}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex gap-2 z-10" style={{ top: 'calc(14rem - 20px)' }}>
              <a href={`mailto:${m.email}`} aria-label={`Email ${m.name}`} className="w-10 h-10 rounded-md bg-[#00A3AD] hover:bg-[#121416] text-white flex items-center justify-center transition-colors shadow-md">
                <Mail size={16} />
              </a>
              <a href={`tel:${m.phone}`} aria-label={`Call ${m.name}`} className="w-10 h-10 rounded-md bg-[#00A3AD] hover:bg-[#121416] text-white flex items-center justify-center transition-colors shadow-md">
                <Phone size={16} />
              </a>
            </div>

            <div className="bg-[#EAF9FA] pt-6 pb-4 text-center">
              <h3 className="font-display text-base sm:text-lg tracking-tight text-[#121416]">{m.name}</h3>
              <p className="text-xs tracking-widest uppercase text-[#00A3AD] mt-1">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}