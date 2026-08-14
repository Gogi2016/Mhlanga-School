import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';

const QUOTES = [
  {
    text: 'I am proud to be a product of this school. The education was more than academic — it was a holistic experience that shaped the person I am today.',
    name: 'Zingisa Gogi',
    role: 'Class of 2025',
    photo: '/images/Zingy.jpeg',
  },
  {
    text: 'I am glad I chose Mhlanga for my high school journey. It was the best decision I ever made — it helped me achieve my goals.',
    name: 'Zisanda Gogi',
    role: 'Class of 2024',
    photo: '/images/Mphenqe.jpeg',
  },
  {
    text: 'The teachers genuinely care about their students and want to see them succeed. I have learned so much here.',
    name: 'Andisiwe Nkayitshana',
    role: 'Class of 2023',
    photo: '/images/matric.jpg',
  },
  {
    text: 'I have never felt so supported and empowered as an educator. The administration truly values its teachers.',
    name: 'Miss Ndengezi',
    role: 'Educator',
    photo: '/images/herii.jpg',
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const n = QUOTES.length;
  const go = (d) => setI((p) => (p + d + n) % n);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-24 sm:py-32 bg-[#F4F4F4] text-[#121416]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center reveal">
        <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Testimonials</p>
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight mb-12">
          OUR LEARNERS SAY.
        </h2>

        <div className="relative min-h-[17rem]">
          {QUOTES.map((q, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-all duration-700"
              style={{
                opacity: idx === i ? 1 : 0,
                transform: idx === i ? 'translateY(0)' : 'translateY(20px)',
                pointerEvents: idx === i ? 'auto' : 'none',
              }}
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full overflow-hidden bg-[#E3E3E3] flex items-center justify-center">
                {q.photo ? (
                  <img src={q.photo} alt={q.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-white" fill="white" strokeWidth={0} />
                )}
              </div>
              <Quote className="mx-auto ochre mb-6" size={28} />
              <p className="font-display text-lg sm:text-2xl leading-snug tracking-tight max-w-3xl mx-auto mb-8">
                "{q.text}"
              </p>
              <div className="font-display text-base">{q.name}</div>
              <div className="text-xs tracking-widest uppercase text-[#00A3AD] mt-1">{q.role}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-14">
          <button onClick={() => go(-1)} className="w-11 h-11 border border-[#121416]/25 flex items-center justify-center hover:bg-[#121416] hover:text-[#F4F4F4] transition-colors" aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                className={`h-1.5 transition-all duration-500 ${idx === i ? 'w-8 bg-[#00A3AD]' : 'w-4 bg-[#121416]/20'}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} className="w-11 h-11 border border-[#121416]/25 flex items-center justify-center hover:bg-[#121416] hover:text-[#F4F4F4] transition-colors" aria-label="Next">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}