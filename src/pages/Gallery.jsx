import React, { useState } from 'react';
import { Image } from '@/components/ui/image';
import { X } from 'lucide-react';
import SubPageHeader from '@/components/mhlanga/SubPageHeader';
import useReveal from '@/components/mhlanga/useReveal';

const IMAGES = [
  { src: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/65d47057d_generated_62a08246.png', caption: 'The hills of Mtontsasa at golden hour' },
  { src: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/2d605f5db_generated_7814401f.png', caption: 'Our school at sunrise' },
  { src: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/83dd16a7f_generated_c138818f.png', caption: 'A learner against the Eastern Cape' },
  { src: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/47649e2b1_generated_b778c529.png', caption: 'Hands building the future' },
  { src: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/dcde8e15a_generated_image.png', caption: 'Learning in the classroom' },
  { src: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/548fdf733_generated_image.png', caption: 'Athletics on the field' },
  { src: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/3b5af1a3e_generated_image.png', caption: 'Collaboration on the grounds' },
  { src: 'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/d2f5b3481_generated_image.png', caption: 'School assembly' },
];

export default function Gallery() {
  useReveal();
  const [active, setActive] = useState(null);

  return (
    <div className="basalt-bg min-h-screen text-[#F4F4F4] font-body">
      <SubPageHeader />

      <section className="py-16 sm:py-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-12 reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Gallery</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
            LIFE AT <span className="ochre">MHLANGA SS</span>
          </h1>
          <p className="text-[#F4F4F4]/60 mt-5 max-w-xl">
            A window into the everyday — the learners, the grounds, and the spirit of the
            Mtontsasa Circuit.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {IMAGES.map((im, idx) => (
            <button
              key={idx}
              onClick={() => setActive(im)}
              className="reveal group relative overflow-hidden h-44 sm:h-60 lg:h-72 text-left"
            >
              <Image src={im.src} alt={im.caption} fittingType="fill" className="w-full h-full object-cover reveal-img transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121416] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex items-end p-4">
                <span className="text-sm text-[#F4F4F4]/90">{im.caption}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] basalt-bg/95 flex items-center justify-center p-5"
          style={{ backgroundColor: 'rgba(18,20,22,0.96)' }}
          onClick={() => setActive(null)}
        >
          <button className="absolute top-5 right-5 text-[#F4F4F4] hover:text-[#00A3AD]" onClick={() => setActive(null)} aria-label="Close">
            <X size={28} />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <Image src={active.src} alt={active.caption} fittingType="fit" className="w-full max-h-[75vh] object-contain" />
            <figcaption className="text-center text-sm text-[#F4F4F4]/70 mt-4">{active.caption}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}