import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { Calculator, Leaf, Globe, TrendingUp } from 'lucide-react';

const HANDS = 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/47649e2b1_generated_b778c529.png';

const STREAMS = [
  {
    code: 'A1',
    name: 'Mathematics & Physical Sciences',
    icon: Calculator,
    image: '/images/Mathematics & Physical Sciences.webp',
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences', 'Geography'],
  },
  {
    code: 'A2',
    name: 'Agricultural Sciences',
    icon: Leaf,
    image: '/images/Agricultural Sciences.jpg',
    subjects: ['Mathematics', 'Agricultural Sciences', 'Life Sciences', 'Physical Sciences'],
  },
  {
    code: 'A3',
    name: 'Humanities & Geography',
    icon: Globe,
    image: '/images/Humanities & Geography.jpg',
    subjects: ['Maths Literacy', 'Geography', 'Agricultural Sciences', 'History'],
  },
  {
    code: 'A4',
    name: 'Commerce',
    icon: TrendingUp,
    image: '/images/Commerce.jpg',
    subjects: ['Accounting', 'Business Studies', 'Economics', 'Mathematics'],
  },
];

export default function Curriculum() {
  return (
    <section id="curriculum" className="relative py-24 sm:py-32 bg-[#F4F4F4] text-[#121416]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-7 reveal">
            <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Curriculum</p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
              FOUR STREAMS.<br />ONE HORIZON.
            </h2>
          </div>
          <p className="lg:col-span-5 reveal text-[#121416]/70 leading-relaxed">
            Mhlanga SS offers four focused academic streams from Grade 10 onward, each designed
            to give learners a clear, disciplined pathway toward tertiary study and meaningful careers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STREAMS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.code} className="reveal">
                <div className="h-40 sm:h-48 overflow-hidden mb-6 relative">
                  <Image
                    src={s.image}
                    alt={`${s.name} at Mhlanga SS`}
                    fittingType="fill"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center bg-[#121416] text-[#F4F4F4]">
                    <Icon size={16} />
                  </span>
                </div>
                <div className="border-l-2 border-[#121416] pl-6 py-2">
                  <div className="flex items-baseline justify-between mb-4 gap-2">
                    <h3 className="font-display text-xl sm:text-2xl leading-tight">{s.name}</h3>
                    <span className="text-xs tracking-[0.2em] uppercase text-[#00A3AD] shrink-0">{s.code}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.subjects.map((sub) => (
                      <span key={sub} className="text-xs px-2.5 py-1 border border-[#121416]/15 text-[#121416]/75">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center reveal">
          <div className="lg:col-span-7 h-72 sm:h-96 overflow-hidden">
            <Image
              src={HANDS}
              alt="A student's hands writing in a notebook"
              fittingType="fill"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-5">
            <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-4">Academic Support</p>
            <h3 className="font-display text-2xl sm:text-3xl mb-5">DISCIPLINE. MENTORSHIP. RISE.</h3>
            <p className="text-[#121416]/70 leading-relaxed mb-6">
              Study skills and guidance, academic coaching and mentoring, personalised
              learning strategies, progress tracking, and extra classes to bridge the gap.
              Our skilled teachers meet every learner where they are.
            </p>
            <Link
              to="/admissions"
              className="inline-block font-display text-sm tracking-wide px-7 py-4 bg-[#121416] text-[#F4F4F4] hover:bg-[#00A3AD] hover:text-[#121416] transition-colors"
            >
              APPLY FOR 2027 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}