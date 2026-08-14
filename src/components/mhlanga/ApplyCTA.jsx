import React from 'react';
import { Link } from 'react-router-dom';

export default function ApplyCTA() {
  return (
    <section className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="reveal border border-white/10 p-10 sm:p-16 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Admissions 2026</p>
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight mb-6">
          YOUR HORIZON AWAITS.
        </h2>
        <p className="text-[#F4F4F4]/65 max-w-xl mx-auto mb-9">
          Join thousands of learners shaping their future at Mhlanga SS. A simple four-step
          online application — open to the whole Mtontsasa Circuit.
        </p>
        <Link
          to="/admissions"
          className="portal-btn inline-block font-display text-sm tracking-wide px-9 py-5 bg-[#D27D2D] text-[#121416] hover:bg-[#00A3AD]"
        >
          BEGIN YOUR APPLICATION →
        </Link>
      </div>
    </section>
  );
}