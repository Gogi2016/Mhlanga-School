import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    img: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/65d47057d_generated_62a08246.png',
    eyebrow: 'Lusikisiki District · Mtontsasa Circuit · Eastern Cape',
    title: ['THE PATHWAY', 'TO EXCELLENCE.'],
    sub: 'Empowering the youth of the Eastern Cape through disciplined education, visionary leadership, and a heritage rooted in the soil of Mtontsasa.',
  },
  {
    img: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/2d605f5db_generated_7814401f.png',
    eyebrow: 'A beacon of learning in the Eastern Cape',
    title: ['UNLOCKING POTENTIAL,', 'UNLEASHING DREAMS.'],
    sub: 'A disciplined, no-fee public school where every learner is met where they are and guided toward their horizon.',
  },
  {
    img: '/images/Zingy.jpeg',
    eyebrow: 'Learn · Grow · Achieve Success',
    title: ['WHERE RISING', 'BECOMES ROUTINE.'],
    sub: 'Skilled teachers, personalised support, and extra classes that bridge the gap — building futures from the hills of Mtontsasa.',
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const go = (d) => setI((p) => (p + d + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" className="relative h-screen min-h-[640px] w-full overflow-hidden">
      {SLIDES.map((s, idx) => (
        <div key={idx} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: idx === i ? 1 : 0, zIndex: idx === i ? 10 : 0 }}>
          <Image src={s.img} alt="" fittingType="fill" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
      ))}

      <div className="relative z-20 h-full flex flex-col justify-center px-5 sm:px-8 pb-32 sm:pb-28 max-w-7xl mx-auto">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className="absolute left-5 right-5 sm:left-8 sm:right-8 max-w-3xl transition-all duration-700"
            style={{ opacity: idx === i ? 1 : 0, transform: idx === i ? 'translateY(0)' : 'translateY(24px)', pointerEvents: idx === i ? 'auto' : 'none' }}
          >
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#00A3AD] mb-4">{s.eyebrow}</p>
            <h1 className="font-display leading-[0.95] tracking-tighter text-[clamp(2.2rem,7vw,5.5rem)]">
              {s.title[0]}<br />
              <span className="ochre">{s.title[1]}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-[#F4F4F4]/80 leading-relaxed">{s.sub}</p>
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link to="/admissions" className="portal-btn font-display text-sm tracking-wide px-8 py-5 bg-[#D27D2D] text-[#121416] hover:bg-[#00A3AD]">
                BEGIN YOUR APPLICATION →
              </Link>
            </div>
          </div>
        ))}

        <div className="absolute bottom-12 left-5 sm:left-8 right-5 sm:right-8 max-w-7xl flex items-end justify-between">
          <div className="flex items-center gap-5">
            <button onClick={() => go(-1)} className="w-11 h-11 border border-white/25 flex items-center justify-center text-[#F4F4F4] hover:bg-[#00A3AD] hover:border-[#00A3AD] hover:text-[#121416] transition-colors" aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => go(1)} className="w-11 h-11 border border-white/25 flex items-center justify-center text-[#F4F4F4] hover:bg-[#00A3AD] hover:border-[#00A3AD] hover:text-[#121416] transition-colors" aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1 transition-all duration-500 ${idx === i ? 'w-10 bg-[#00A3AD]' : 'w-5 bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}