import React from 'react';
import { Image } from '@/components/ui/image';

const PORTRAIT = 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/83dd16a7f_generated_c138818f.png';
const ARCH = 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/2d605f5db_generated_7814401f.png';

const STATS = [
  { value: '2018', label: 'Grade 12 pass rate legacy' },
  { value: '3', label: 'Academic streams' },
  { value: '80+', label: 'Learners supported annually' },
  { value: 'No-Fee', label: 'Public school institution' },
];

const PILLARS = [
  'Intellectual growth and holistic development for every learner',
  'Dedicated, skilled educators guiding and mentoring students',
  'Operating under the Lusikisiki District — promoting educational excellence',
  'A conducive, safe learning environment for all students',
];

export default function Heritage() {
  return (
    <section id="about" className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">About</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight mb-7">
            WELCOME TO MHLANGA SECONDARY SCHOOL
          </h2>
          <p className="text-[#F4F4F4]/75 leading-relaxed text-base sm:text-lg mb-5">
            Mhlanga Senior Secondary stands amid the rural landscape of the Eastern Cape,
            a public secondary school offering ordinary education within the Lusikisiki
            District and the Mtontsasa Circuit.
          </p>
          <p className="text-[#F4F4F4]/60 leading-relaxed mb-8">
            We follow the South African public school structure — there are no fees or
            monthly payments required. Our doors are open to every learner with the will
            to rise.
          </p>
          <ul className="space-y-3">
            {PILLARS.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-[#F4F4F4]/75">
                <span className="mt-2 w-6 h-px bg-[#00A3AD] shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 gap-4 reveal">
          <div className="col-span-2 h-64 sm:h-80 overflow-hidden">
            <Image
              src={PORTRAIT}
              alt="A Mhlanga SS student in uniform against the Eastern Cape hills"
              fittingType="fill"
              className="w-full h-full object-cover reveal-img"
            />
          </div>
          <div className="h-48 overflow-hidden">
            <Image
              src={ARCH}
              alt="Mhlanga SS school architecture at sunrise"
              fittingType="fill"
              className="w-full h-full object-cover reveal-img"
            />
          </div>
          <div className="h-48 basalt-bg border border-white/5 flex flex-col items-center justify-center text-center px-3">
            <span className="font-display text-3xl ochre">∞</span>
            <span className="text-xs text-[#F4F4F4]/60 mt-2">Endless horizons for every learner</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-20 bg-white/5 reveal">
        {STATS.map((s) => (
          <div key={s.label} className="basalt-bg p-7">
            <div className="font-display text-2xl sm:text-4xl cyan-acc">{s.value}</div>
            <div className="text-xs sm:text-sm text-[#F4F4F4]/55 mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}