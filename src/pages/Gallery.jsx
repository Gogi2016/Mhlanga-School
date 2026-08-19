import React, { useState } from 'react';
import { Image } from '@/components/ui/image';
import { X, Play } from 'lucide-react';
import SubPageHeader from '@/components/mhlanga/SubPageHeader';
import useReveal from '@/components/mhlanga/useReveal';

const CATEGORIES = ['All', 'School Activities', 'Matric Farewell', 'Achievements'];

const MEDIA = [
  // School Activities
  { type: 'image', src: `${import.meta.env.BASE_URL}images/herii.jpg`, category: 'School Activities' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/heritage.jpg`, category: 'School Activities' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/heritage 1.jpg`, category: 'School Activities' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/dun her.jpg`, category: 'School Activities' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/career.jpg`, category: 'School Activities' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/career 2.jpg`, category: 'School Activities' },
  {
    type: 'video',
    src: `${import.meta.env.BASE_URL}videos/school-activities-1.mp4`,
    poster: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/3b5af1a3e_generated_image.png',
    caption: 'Collaboration on the grounds',
    category: 'School Activities',
  },

  // Matric Farewell
  { type: 'image', src: `${import.meta.env.BASE_URL}images/matric.jpg`, category: 'Matric Farewell' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/Tie ceremony.webp`, category: 'Matric Farewell' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/grade 12.jpg`, category: 'Matric Farewell' },
  {
    type: 'video',
    src: `${import.meta.env.BASE_URL}videos/matric-farewell-1.mp4`,
    poster: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/47649e2b1_generated_b778c529.png',
    caption: 'Matric Farewell 2025 highlights',
    category: 'Matric Farewell',
  },

  // Achievements
  { type: 'image', src: `${import.meta.env.BASE_URL}images/achivements.jpg`, category: 'Achievements' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/achiveeee.jpg`, category: 'Achievements' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/achivement 2.jpg`, category: 'Achievements' },
  { type: 'image', src: `${import.meta.env.BASE_URL}images/achive.jpg`, category: 'Achievements' },
  {
    type: 'video',
    src: `${import.meta.env.BASE_URL}videos/achievements-1.mp4`,
    poster: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/65d47057d_generated_62a08246.png',
    caption: 'Celebrating our top achievers',
    category: 'Achievements',
  },
];

export default function Gallery() {
  useReveal();
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? MEDIA : MEDIA.filter((m) => m.category === filter);

  return (
    <div className="basalt-bg min-h-screen text-[#F4F4F4] font-body">
      <SubPageHeader />

      <section className="py-16 sm:py-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-10 reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Gallery</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
            LIFE AT <span className="ochre">MHLANGA SS</span>
          </h1>
          <p className="text-[#F4F4F4]/60 mt-5 max-w-xl">
            A window into the everyday — the learners, the grounds, and the spirit of the
            Mtontsasa Circuit.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-3 mb-10 reveal">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs tracking-widest uppercase px-5 py-3 border transition-colors ${
                filter === cat
                  ? 'bg-[#00A3AD] border-[#00A3AD] text-[#121416]'
                  : 'border-white/20 text-[#F4F4F4]/70 hover:border-[#00A3AD] hover:text-[#00A3AD]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((m, idx) => (
            <button
              key={`${filter}-${idx}`}
              onClick={() => setActive(m)}
              className="group relative overflow-hidden h-44 sm:h-60 lg:h-72 text-left"
            >
              <Image
                src={m.type === 'video' ? m.poster : m.src}
                alt={m.caption}
                fittingType="fill"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {m.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#121416]/25 group-hover:bg-[#121416]/40 transition-colors">
                  <span className="w-14 h-14 rounded-full bg-[#00A3AD] flex items-center justify-center shadow-lg">
                    <Play size={22} className="text-[#121416] ml-1" fill="currentColor" />
                  </span>
                </div>
              )}

              <span className="absolute top-3 left-3 text-[10px] tracking-widest uppercase px-2 py-1 bg-[#121416]/70 text-[#F4F4F4]/90">
                {m.category}
              </span>

              <div className="absolute inset-0 bg-gradient-to-t from-[#121416] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex items-end p-4">
                <span className="text-sm text-[#F4F4F4]/90">{m.caption}</span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#F4F4F4]/50 mt-16">No media in this category yet.</p>
        )}
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          style={{ backgroundColor: 'rgba(18,20,22,0.96)' }}
          onClick={() => setActive(null)}
        >
          <button className="absolute top-5 right-5 text-[#F4F4F4] hover:text-[#00A3AD]" onClick={() => setActive(null)} aria-label="Close">
            <X size={28} />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {active.type === 'video' ? (
              <video
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                className="w-full max-h-[75vh] bg-black"
              />
            ) : (
              <Image src={active.src} alt={active.caption} fittingType="fit" className="w-full max-h-[75vh] object-contain" />
            )}
            <figcaption className="text-center text-sm text-[#F4F4F4]/70 mt-4">{active.caption}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}